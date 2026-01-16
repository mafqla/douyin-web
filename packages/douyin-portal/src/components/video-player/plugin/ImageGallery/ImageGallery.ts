import { Plugin } from 'xgplayer'
import type { IPluginOptions } from 'xgplayer/es/plugin/plugin'
import { playerSettingStore } from '@/stores/player-setting'
import './index.scss'

const { POSITIONS } = Plugin

export interface ImageItem {
  uri: string
  width: number
  height: number
  url_list: string[]
  download_url_list: string[]
  clip_type?: number
  live_photo_type?: number
  video?: {
    play_addr?: {
      url_list: string[]
    }
    // 视频时长（毫秒），用于确定该图片的展示时长
    duration?: number
  }
}

// 图集音乐信息
export interface ImageAlbumMusicInfo {
  // 音乐开始时间（毫秒）
  begin_time: number
  // 音乐结束时间（毫秒）
  end_time: number
  // 音量 (0-100)
  volume: number
}

export type ArrowStyle = 'side' | 'bottom'

export interface ImageGalleryConfig {
  images: ImageItem[]
  autoplay?: number
  preloadCount?: number
  loop?: boolean
  showArrows?: boolean
  arrowStyle?: ArrowStyle
  // 图集音乐信息，用于控制音乐播放时间
  musicInfo?: ImageAlbumMusicInfo
  // 默认每张图片展示时长（毫秒），当图片没有 video.duration 时使用
  defaultDuration?: number
}

export class ImageGalleryPlugin extends Plugin {
  static get pluginName() {
    return 'imageGallery'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.ROOT,
      index: 1,
      preloadCount: 2,
      showArrows: true,
      arrowStyle: 'side' as ArrowStyle
    }
  }

  private readonly PLACEHOLDER_IMAGE = '/src/assets/icons/logo.svg'

  private _currentIndex = 0
  private _isUserInitiatedChange = false
  private _isSyncingProgress = false
  private _userChangeUntil = 0
  private _destroyed = false

  private get currentIndex(): number {
    return this._currentIndex
  }

  private set currentIndex(value: number) {
    const oldValue = this._currentIndex
    this._currentIndex = value
    this.updateArrowStates()
    this.updateCounter()
    if (oldValue !== value) {
      this.updateBlurBackground(value)
    }
  }
  private autoplayTimer: number | null = null
  private touchStartX = 0
  private touchStartY = 0
  private isDragging = false
  private preloadedImages: Map<number, HTMLImageElement> = new Map()
  private livePhotoVideos: Map<number, HTMLVideoElement> = new Map()
  private swiperContainer: HTMLElement | null = null
  private slidesContainer: HTMLElement | null = null
  private slides: HTMLElement[] = []
  private resizeObserver: ResizeObserver | null = null
  private cfg: Omit<Required<ImageGalleryConfig>, 'musicInfo'> & {
    musicInfo?: ImageAlbumMusicInfo
  }
  // 每张图片的展示时长（毫秒）
  private imageDurations: number[] = []
  // 每张图片的开始时间点（毫秒）
  private imageStartTimes: number[] = []
  // 图集总时长（毫秒）
  private totalDuration = 0
  // 图集播放开始时间戳（毫秒）
  private _playStartTime = 0
  // 图集已播放的时间（毫秒），用于暂停恢复
  private _playedTime = 0
  // 首个媒体是否已加载完成（防止动图还没加载好就切换）
  private _firstMediaReady = false

  constructor(args: IPluginOptions) {
    super(args)

    // 注意：在构造函数中可能还获取不到完整的配置
    // 完整的配置会在 afterCreate 方法中通过 this.playerConfig 获取
    this.cfg = {
      images: [],
      autoplay: 0,
      preloadCount: 2,
      loop: false,
      showArrows: true,
      arrowStyle: 'side',
      musicInfo: undefined,
      defaultDuration: 5000 // 默认每张图片展示 5 秒
    }

    // 初始化触摸起始位置
    this.touchStartX = 0
    this.touchStartY = 0
  }

  afterCreate() {
    // 在 afterCreate 中更新配置，此时配置应该已经准备好了
    const imageGalleryConfig = this.playerConfig?.imageGallery || {}

    this.cfg = {
      images: [],
      autoplay: 0,
      preloadCount: 2,
      loop:
        imageGalleryConfig.loop !== undefined ? imageGalleryConfig.loop : true,
      showArrows:
        imageGalleryConfig.showArrows !== undefined
          ? imageGalleryConfig.showArrows
          : true,
      arrowStyle:
        imageGalleryConfig.arrowStyle !== undefined
          ? imageGalleryConfig.arrowStyle
          : 'side',
      musicInfo: imageGalleryConfig.musicInfo,
      defaultDuration: imageGalleryConfig.defaultDuration || 5000,
      ...imageGalleryConfig
    }

    // console.log('配置已加载:', this.cfg)

    const { images } = this.cfg
    if (!images || images.length === 0) return

    // 计算每张图片的展示时长
    this.calculateImageDurations()

    // 获取DOM元素
    this.swiperContainer = this.root.querySelector('.image-gallery-plugin')
    this.slidesContainer = this.root.querySelector('.image-gallery-slides')
    this.slides = Array.from(
      this.root.querySelectorAll('.image-gallery-slide')
    ) as HTMLElement[]

    // 绑定事件
    this.bindEvents()

    // 监听播放器进度变化
    this.on('timeupdate', this.handleTimeUpdate)

    // 监听播放器播放/暂停事件
    this.on('play', this.handlePlayerPlay)
    this.on('pause', this.handlePlayerPause)

    // 拦截进度条事件，只切换图片不改变音频进度
    this.interceptProgressEvents()

    // 初始显示第一张
    this.updateSlidePosition()
    this.updateArrowStates()
    this.updateBlurBackground(0)
    this.startAutoplay()

    // 预加载图片
    setTimeout(() => {
      if (this._destroyed || !this.root) return
      this.preloadImages()
      // 确保第一张图片正确显示
      this.preloadImage(0)
      // 初始化实况照片视频
      this.initLivePhotoVideos()
      // 处理当前图片的实况视频
      this.handleLivePhotoPlayback(0)
    }, 0)
  }

  private isLivePhoto(index: number): boolean {
    const image = this.cfg.images[index]
    return (
      image?.clip_type === 4 ||
      (image?.clip_type === 5 &&
        image?.live_photo_type === 1 &&
        (image?.video?.play_addr?.url_list?.length ?? 0) > 0)
    )
  }
  /**
   * 计算每张图片的展示时长
   * 优先使用 video.duration，否则使用默认时长
   * 图集总时长 = 所有图片展示时长之和
   */
  private calculateImageDurations() {
    const { images, defaultDuration } = this.cfg

    this.imageDurations = []
    this.imageStartTimes = []
    let currentTime = 0

    // 计算每张图片的时长
    for (const image of images) {
      // 优先使用图片自带的 video.duration（Live Photo 的视频时长）
      // 否则使用默认时长
      const duration = image.video?.duration || defaultDuration
      this.imageDurations.push(duration)
      this.imageStartTimes.push(currentTime)
      currentTime += duration
    }

    // 图集总时长 = 所有图片展示时长之和
    // 添加一点缓冲时间（100ms），确保最后一张图片能完整播放
    // 避免因为浮点数精度或计时器误差导致提前结束
    this.totalDuration = currentTime + 100

    console.log('图片时长计算完成:', {
      durations: this.imageDurations,
      startTimes: this.imageStartTimes,
      totalDuration: this.totalDuration
    })
  }

  /**
   * 根据当前播放时间获取应该显示的图片索引
   */
  private getImageIndexByTime(currentTimeMs: number): number {
    for (let i = this.imageStartTimes.length - 1; i >= 0; i--) {
      if (currentTimeMs >= this.imageStartTimes[i]) {
        return i
      }
    }
    return 0
  }

  private initLivePhotoVideos() {
    if (this._destroyed || !this.root) return
    const videos = this.root.querySelectorAll(
      '.live-photo-video'
    ) as NodeListOf<HTMLVideoElement>
    console.log('初始化实况视频数量:', videos.length)
    videos.forEach((video) => {
      const index = parseInt(video.dataset.index || '0', 10)
      this.livePhotoVideos.set(index, video)

      // 监听第一张图片的视频加载完成事件
      if (index === 0) {
        const onCanPlay = () => {
          if (!this._firstMediaReady) {
            this._firstMediaReady = true
            console.log('首个 Live Photo 视频已加载完成，开始计时')
            // 如果播放器正在播放，重置播放开始时间
            if (!this.player.paused && this._playStartTime > 0) {
              this._playStartTime = Date.now() - this._playedTime
            }
          }
          video.removeEventListener('canplay', onCanPlay)
        }
        // 如果视频已经可以播放，直接标记为就绪
        if (video.readyState >= 3) {
          this._firstMediaReady = true
          console.log('首个 Live Photo 视频已就绪')
        } else {
          video.addEventListener('canplay', onCanPlay)
        }
      }
    })

    // 如果没有 Live Photo 视频，直接标记为就绪
    if (videos.length === 0 || !this.isLivePhoto(0)) {
      this._firstMediaReady = true
    }
  }

  private handleLivePhotoPlayback(
    currentIndex: number,
    resetTime: boolean = true
  ) {
    if (this._destroyed) return
    this.livePhotoVideos.forEach((video, index) => {
      if (index === currentIndex) {
        // 当切换到当前 Live Photo 时，根据参数决定是否重置时间
        if (resetTime) {
          video.currentTime = 0
        }
        if (!this.player.paused) {
          video.play().catch(() => {})
        }
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }

  private handlePlayerPlay = () => {
    // 重置图集结束标志，允许重新播放
    if (this._galleryEnded) {
      this._galleryEnded = false
      // 重新开始播放时，重置播放时间和媒体就绪状态
      this._playedTime = 0
      this._firstMediaReady = false
      this.currentIndex = 0
      this.updateSlidePosition()
      // 重新检查首个媒体是否已就绪
      this.checkFirstMediaReady()
    }
    // 记录播放开始时间（考虑之前已播放的时间）
    this._playStartTime = Date.now() - this._playedTime
    // 恢复播放当前 Live Photo 视频（不重置时间）
    this.handleLivePhotoPlayback(this.currentIndex, false)
  }

  private checkFirstMediaReady() {
    // 检查首个媒体是否已就绪
    if (this.isLivePhoto(0)) {
      const video = this.livePhotoVideos.get(0)
      if (video && video.readyState >= 3) {
        this._firstMediaReady = true
      }
    } else {
      // 普通图片，直接标记为就绪
      this._firstMediaReady = true
    }
  }

  private handlePlayerPause = () => {
    // 记录已播放的时间
    if (this._playStartTime > 0) {
      this._playedTime = Date.now() - this._playStartTime
    }
    this.livePhotoVideos.forEach((video) => {
      video.pause()
    })
  }

  private updateBlurBackground(index: number) {
    if (this._destroyed || !this.root) return
    const blurImg = this.root.querySelector(
      '.image-gallery-blur-img'
    ) as HTMLImageElement
    if (blurImg) {
      const imageUrl = this.getBestImageUrl(index)
      if (imageUrl) {
        blurImg.src = imageUrl
      }
    }
  }

  render() {
    const imageGalleryConfig = this.playerConfig?.imageGallery || {}
    const images = imageGalleryConfig.images || []
    const showArrows =
      imageGalleryConfig.showArrows !== undefined
        ? imageGalleryConfig.showArrows
        : true
    const loop =
      imageGalleryConfig.loop !== undefined ? imageGalleryConfig.loop : true
    const arrowStyle =
      imageGalleryConfig.arrowStyle !== undefined
        ? imageGalleryConfig.arrowStyle
        : 'side'

    if (!images || images.length === 0) {
      return ''
    }

    const sideArrowHtml = `
        <div class="image-gallery-arrow image-gallery-arrow-left ${
          this.currentIndex === 0 && !loop ? 'disabled' : ''
        }">
          <svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg" class="arrow-left-icon" viewBox="0 0 56 56">
            <g clip-path="url(#arrowLeft_svg__clip0_1670_162489)">
              <path d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z" fill="#000"></path>
              <g filter="url(#arrowLeft_svg__filter0_d_1670_162489)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M31.402 18.573a2 2 0 0 1 .024 2.829l-6.598 6.713 6.574 6.458a2 2 0 1 1-2.804 2.854l-8-7.86a2 2 0 0 1-.024-2.829l8-8.14a2 2 0 0 1 2.828-.024z" fill="#fff"></path>
              </g>
            </g>
            <defs>
              <filter id="arrowLeft_svg__filter0_d_1670_162489" x="19" y="18" width="14" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dy="1"></feOffset>
                <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1670_162489"></feBlend>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1670_162489" result="shape"></feBlend>
              </filter>
              <clipPath id="arrowLeft_svg__clip0_1670_162489"><path fill="currentColor" d="M0 0h56v56H0z"></path></clipPath>
            </defs>
          </svg>
        </div>
        <div class="image-gallery-arrow image-gallery-arrow-right ${
          this.currentIndex === images.length - 1 && !loop ? 'disabled' : ''
        }">
          <svg width="56" height="56" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" class="arrow-right-icon">
            <g clip-path="url(#arrowRight_svg__clip0_1683_162494)">
              <path d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z" fill="#000"></path>
              <g filter="url(#arrowRight_svg__filter0_d_1683_162494)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.598 37.426a2 2 0 0 1-.024-2.828l6.598-6.713-6.574-6.458a2 2 0 1 1 2.804-2.854l8 7.86a2 2 0 0 1 .024 2.829l-8 8.14a2 2 0 0 1-2.828.024z" fill="#fff"></path>
              </g>
            </g>
            <defs>
              <filter id="arrowRight_svg__filter0_d_1683_162494" x="23" y="18" width="14" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dy="1"></feOffset>
                <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"></feColorMatrix>
                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_1683_162494"></feBlend>
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1683_162494" result="shape"></feBlend>
              </filter>
              <clipPath id="arrowRight_svg__clip0_1683_162494"><path fill="#fff" d="M0 0h56v56H0z"></path></clipPath>
            </defs>
          </svg>
        </div>
      `

    const bottomArrowHtml = `
        <div class="image-gallery-bottom-nav">
          <div class="image-gallery-bottom-arrow image-gallery-bottom-left ${
            this.currentIndex === 0 && !loop ? 'disabled' : ''
          }">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="none"
      class=""
      viewBox="0 0 26 26"
    >
      <g filter="url(#arrowLeft_svg__filter_arrow_left)">
        <path
          d="M16.71 7.269a1.393 1.393 0 0 0-1.97 0l-5.056 5.056a1.393 1.393 0 0 0 0 1.97l.011.011 5.045 5.045a1.393 1.393 0 1 0 1.97-1.97l-4.072-4.071 4.071-4.071a1.393 1.393 0 0 0 0-1.97z"
          fill="#fff"
        ></path>
      </g>
      <defs>
        <filter
          id="arrowLeft_svg__filter_arrow_left"
          x="-1"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset dy="1"></feOffset>
          <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          ></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_6302_471173"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_6302_471173"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
          </div>
          <span class="image-gallery-counter">${
            images.length > 0 ? `1/${images.length}` : ''
          }</span>
          <div class="image-gallery-bottom-arrow image-gallery-bottom-right ${
            this.currentIndex === images.length - 1 && !loop ? 'disabled' : ''
          }">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="none"
      class=""
      viewBox="0 0 26 26"
    >
      <g filter="url(#arrowRight_svg__filter_arrow_right)">
        <path
          d="M9.684 7.269a1.393 1.393 0 0 1 1.97 0l5.055 5.056a1.393 1.393 0 0 1 0 1.97l-.011.011-5.045 5.045a1.393 1.393 0 1 1-1.97-1.97l4.072-4.071-4.071-4.071a1.393 1.393 0 0 1 0-1.97z"
          fill="#fff"
        ></path>
      </g>
      <defs>
        <filter
          id="arrowRight_svg__filter_arrow_right"
          x="-1"
          y="0"
          width="28"
          height="28"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          ></feColorMatrix>
          <feOffset dy="1"></feOffset>
          <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
          <feComposite in2="hardAlpha" operator="out"></feComposite>
          <feColorMatrix
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          ></feColorMatrix>
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_6302_471172"
          ></feBlend>
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_6302_471172"
            result="shape"
          ></feBlend>
        </filter>
      </defs>
    </svg>
          </div>
        </div>
      `

    let arrowHtml = ''
    // 只有一张图片时不显示切换按钮
    if (showArrows && images.length > 1) {
      arrowHtml = arrowStyle === 'bottom' ? bottomArrowHtml : sideArrowHtml
    }

    return `
      <div class="image-gallery-plugin" data-arrow-style="${arrowStyle}">
        ${arrowHtml}
        
        <div class="image-gallery-blur">
          <img class="image-gallery-blur-img" src="" alt="blur background">
        </div>
        <div class="image-gallery-slides">
          ${images
            .map((image: any, index: number) => {
              const isLivePhoto =
                image?.clip_type === 4 ||
                (image?.clip_type === 5 &&
                  image?.live_photo_type === 1 &&
                  image.video?.play_addr?.url_list?.length > 0)
              console.log(
                `图片${index}: clip_type=${image.clip_type}, live_photo_type=${image.live_photo_type}, isLivePhoto=${isLivePhoto}`
              )
              const webpUrl =
                image.url_list && image.url_list.find
                  ? image.url_list.find(
                      (url: string) =>
                        url && url.includes && url.includes('.webp')
                    )
                  : undefined
              const imageUrl =
                webpUrl ||
                (image.url_list && image.url_list[0]) ||
                (image.download_url_list && image.download_url_list[0]) ||
                this.PLACEHOLDER_IMAGE

              if (isLivePhoto) {
                const videoUrls = image.video.play_addr.url_list
                console.log('实况视频URL列表:', videoUrls)
                return `
            <div class="image-gallery-slide image-gallery-slide-live" data-index="${index}" data-live="true">
              <div class="image-gallery-container">
                <video 
                  class="live-photo-video" 
                  data-index="${index}" 
                  poster="${imageUrl}"
                  loop
                  muted
                  playsinline
                  preload="auto"
                >
                  ${videoUrls
                    .map(
                      (url: string) => `<source src="${url}" type="video/mp4">`
                    )
                    .join('')}
                </video>
                <div class="live-photo-badge">实况</div>
              </div>
            </div>
          `
              }
              return `
            <div class="image-gallery-slide" data-index="${index}">
              <div class="image-gallery-container">
                <img src="${imageUrl}" alt="Image ${
                index + 1
              }" data-index="${index}" style="display: block;">
              </div>
            </div>
          `
            })
            .join('')}
        </div>
      </div>
    `
  }

  private async preloadImages() {
    const { images } = this.cfg
    if (!images || images.length === 0) return

    // 预加载当前图片和前后几张图片
    const startIndex = Math.max(0, this.currentIndex - this.cfg.preloadCount)
    const endIndex = Math.min(
      images.length - 1,
      this.currentIndex + this.cfg.preloadCount
    )

    for (let i = startIndex; i <= endIndex; i++) {
      // 跳过已加载的图片
      if (this.preloadedImages.has(i)) continue

      // 预加载单张图片
      this.preloadImage(i)
    }
  }

  private getBestImageUrl(index: number): string {
    const image = this.cfg.images[index]
    if (!image) return this.PLACEHOLDER_IMAGE

    // 优先使用 webp 格式
    const webpUrl =
      image.url_list && image.url_list.find
        ? image.url_list.find(
            (url) => url && url.includes && url.includes('.webp')
          )
        : undefined
    return (
      webpUrl ||
      (image.url_list && image.url_list[0]) ||
      (image.download_url_list && image.download_url_list[0]) ||
      this.PLACEHOLDER_IMAGE
    )
  }

  private lastUpdateTime = 0

  private updateSlidePosition() {
    if (this._destroyed || !this.slidesContainer || !this.root) return

    // 移除节流控制以确保按钮切换时图片能正确更新
    this.lastUpdateTime = Date.now()

    const slideWidth = this.slidesContainer.clientWidth
    const translateX = -this.currentIndex * slideWidth

    // 只在必要的时候添加过渡效果
    this.slidesContainer.style.transform = `translate3d(${translateX}px, 0, 0)`

    // 确保当前图片已加载并显示
    this.ensureImageLoaded(this.currentIndex)

    // 处理实况照片视频播放
    this.handleLivePhotoPlayback(this.currentIndex)

    // 预加载相邻图片
    setTimeout(() => {
      if (this._destroyed) return
      this.preloadImages()
    }, 0)
  }

  private bindEvents() {
    // 滑动事件
    this.bind('touchstart', this.onTouchStart)
    this.bind('touchmove', this.onTouchMove)
    this.bind('touchend', this.onTouchEnd)

    // 鼠标拖动事件
    this.bind('mousedown', this.onMouseDown)

    // 点击图片事件 - 切换播放/暂停
    this.bind('click', this.onClick)

    // 键盘导航 - 使用捕获阶段并在 document 上监听
    document.addEventListener('keydown', this.onKeydown, true)

    // 监听窗口大小变化
    window.addEventListener('resize', this.onResize)

    // 使用 ResizeObserver 监听容器尺寸变化
    if (this.swiperContainer) {
      this.resizeObserver = new ResizeObserver(this.onResize)
      this.resizeObserver.observe(this.swiperContainer)
    }

    setTimeout(() => {
      if (this._destroyed || !this.root) return
      const leftArrow =
        this.root.querySelector('.image-gallery-arrow-left') ||
        this.root.querySelector('.image-gallery-bottom-left')
      const rightArrow =
        this.root.querySelector('.image-gallery-arrow-right') ||
        this.root.querySelector('.image-gallery-bottom-right')

      if (leftArrow) {
        leftArrow.addEventListener('click', (e) => {
          e.stopPropagation()
          if (leftArrow.classList.contains('disabled')) {
            return
          }
          this.prev()
        })
      }

      if (rightArrow) {
        rightArrow.addEventListener('click', (e) => {
          e.stopPropagation()
          if (rightArrow.classList.contains('disabled')) {
            return
          }
          this.next()
        })
      }
    }, 0)
  }

  private interceptProgressEvents() {
    setTimeout(() => {
      if (this._destroyed || !this.player?.root) return
      const progressEl = this.player.root?.querySelector('.xgplayer-progress')
      if (!progressEl) return

      const handleProgressClick = (e: Event) => {
        e.stopPropagation()
        e.preventDefault()

        const mouseEvent = e as MouseEvent
        const rect = (progressEl as HTMLElement).getBoundingClientRect()
        const percent = Math.max(
          0,
          Math.min(1, (mouseEvent.clientX - rect.left) / rect.width)
        )
        const targetIndex = Math.min(
          Math.floor(percent * this.cfg.images.length),
          this.cfg.images.length - 1
        )

        if (targetIndex !== this.currentIndex) {
          this._isUserInitiatedChange = true
          this._userChangeUntil = Date.now() + 1000
          this.currentIndex = targetIndex
          this.updateSlidePosition()
          this.syncPlayerProgress()
          // 同步更新播放时间到目标图片的开始时间
          if (this.imageStartTimes.length > 0) {
            this._playedTime = this.imageStartTimes[targetIndex]
            if (!this.player.paused) {
              this._playStartTime = Date.now() - this._playedTime
            }
          }
          setTimeout(() => {
            this._isUserInitiatedChange = false
          }, 300)
        }
      }

      progressEl.addEventListener('mousedown', handleProgressClick, true)
      progressEl.addEventListener('click', handleProgressClick, true)
    }, 100)
  }

  private onTouchStart = (e: TouchEvent) => {
    if (!this.slidesContainer || !e.touches || e.touches.length === 0) return

    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
    this.isDragging = true
    // 立即移除过渡效果，实现平滑拖动
    this.slidesContainer.style.transition = 'none'
  }

  private onTouchMove = (e: TouchEvent) => {
    if (
      !this.isDragging ||
      !this.slidesContainer ||
      !this.player.root ||
      !e.touches ||
      e.touches.length === 0
    )
      return

    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    const deltaX = touchX - this.touchStartX
    const deltaY = touchY - this.touchStartY

    // 垂直滑动超过阈值则忽略水平滑动
    if (Math.abs(deltaY) > 30) return

    e.preventDefault()

    const slideWidth = this.slidesContainer.clientWidth || 1
    const translateX = -this.currentIndex * slideWidth + deltaX
    this.slidesContainer.style.transform = `translate3d(${translateX}px, 0, 0)`
  }

  private onTouchEnd = (e: TouchEvent) => {
    if (
      !this.isDragging ||
      !this.slidesContainer ||
      !e.changedTouches ||
      e.changedTouches.length === 0
    )
      return

    this.isDragging = false
    // 恢复CSS中定义的过渡效果
    this.slidesContainer.style.transition = ''

    const touchX = e.changedTouches[0].clientX
    const deltaX = touchX - this.touchStartX

    if (Math.abs(deltaX) > 50) {
      // 计算目标索引
      let targetIndex = this.currentIndex
      if (deltaX > 0) {
        // 向右拖动，显示前一张图片
        targetIndex = this.currentIndex - 1
      } else {
        // 向左拖动，显示后一张图片
        targetIndex = this.currentIndex + 1
      }

      // console.log('拖动结束，计算目标索引:', {
      //   currentIndex: this.currentIndex,
      //   deltaX: deltaX,
      //   direction: deltaX > 0 ? 'right' : 'left',
      //   targetIndexBeforeBoundary: targetIndex,
      //   loop: this.cfg.loop
      // })

      // 边界检查 - 禁止在第一张图片时向左拖动，禁止在最后一张图片时向右拖动
      if (targetIndex < 0) {
        // 如果不循环播放且在第一张图片，不允许向左拖动
        if (!this.cfg.loop) {
          this.updateSlidePosition()
          return
        }
        targetIndex = this.cfg.images.length - 1
      } else if (targetIndex >= this.cfg.images.length) {
        // 如果不循环播放且在最后一张图片，不允许向右拖动
        if (!this.cfg.loop) {
          this.updateSlidePosition()
          return
        }
        targetIndex = 0
      }

      // console.log('拖动结束，最终目标索引:', {
      //   targetIndex: targetIndex,
      //   loop: this.cfg.loop
      // })

      this.goto(targetIndex)
    } else {
      // 拖动距离不够，回到当前位置
      this.updateSlidePosition()
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    if (!this.slidesContainer) return

    this.touchStartX = e.clientX
    this.touchStartY = e.clientY
    this.isDragging = true

    // 防止图片被选中
    e.preventDefault()

    // 立即移除过渡效果，实现平滑拖动
    this.slidesContainer.style.transition = 'none'

    // 添加鼠标移动和释放事件监听器
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging || !this.slidesContainer || !this.player.root) return

    const mouseX = e.clientX
    const mouseY = e.clientY
    const deltaX = mouseX - this.touchStartX
    const deltaY = mouseY - this.touchStartY

    // 垂直滑动超过阈值则忽略水平滑动
    if (Math.abs(deltaY) > 30) return

    e.preventDefault()

    const slideWidth = this.slidesContainer.clientWidth || 1
    const translateX = -this.currentIndex * slideWidth + deltaX
    this.slidesContainer.style.transform = `translate3d(${translateX}px, 0, 0)`
  }

  private onMouseUp = (e: MouseEvent) => {
    if (!this.isDragging || !this.slidesContainer) return

    this.isDragging = false
    // 恢复CSS中定义的过渡效果
    this.slidesContainer.style.transition = ''

    // 移除事件监听器
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    const mouseX = e.clientX
    const deltaX = mouseX - this.touchStartX

    if (Math.abs(deltaX) > 10) {
      // 计算目标索引
      let targetIndex = this.currentIndex
      if (deltaX > 0) {
        // 向右拖动，显示前一张图片
        targetIndex = this.currentIndex - 1
      } else {
        // 向左拖动，显示后一张图片
        targetIndex = this.currentIndex + 1
      }

      // console.log('拖动结束，计算目标索引:', {
      //   currentIndex: this.currentIndex,
      //   deltaX: deltaX,
      //   direction: deltaX > 0 ? 'right' : 'left',
      //   targetIndexBeforeBoundary: targetIndex,
      //   loop: this.cfg.loop
      // })

      // 边界检查 - 禁止在第一张图片时向左拖动，禁止在最后一张图片时向右拖动
      if (targetIndex < 0) {
        // 如果不循环播放且在第一张图片，不允许向左拖动
        if (!this.cfg.loop) {
          this.updateSlidePosition()
          return
        }
        targetIndex = this.cfg.images.length - 1
      } else if (targetIndex >= this.cfg.images.length) {
        // 如果不循环播放且在最后一张图片，不允许向右拖动
        if (!this.cfg.loop) {
          this.updateSlidePosition()
          return
        }
        targetIndex = 0
      }

      // console.log('拖动结束，最终目标索引:', {
      //   targetIndex: targetIndex,
      //   loop: this.cfg.loop
      // })

      this.goto(targetIndex)
    } else {
      // 拖动距离不够，回到当前位置
      this.updateSlidePosition()
    }
  }

  private onClick = (e: MouseEvent) => {
    // 防止在拖动时触发点击事件
    if (
      Math.abs(e.clientX - this.touchStartX) > 5 ||
      Math.abs(e.clientY - this.touchStartY) > 5
    ) {
      return
    }

    const target = e.target as HTMLElement
    if (
      target.closest('.image-gallery-arrow') ||
      target.closest('.image-gallery-bottom-nav')
    ) {
      return
    }

    // 切换播放器的播放/暂停状态
    if (this.player) {
      if (this.player.paused) {
        this.player.play()
      } else {
        this.player.pause()
      }
    }
  }

  private keydownCooldown = false

  private onResize = () => {
    if (this._destroyed || !this.slidesContainer) return
    // 尺寸变化时，禁用过渡效果并立即更新位置
    this.slidesContainer.style.transition = 'none'
    this.updateSlidePosition()
    // 下一帧恢复过渡效果
    requestAnimationFrame(() => {
      if (this._destroyed || !this.slidesContainer) return
      this.slidesContainer.style.transition = ''
    })
  }

  private onKeydown = (e: KeyboardEvent) => {
    // console.log('键盘事件:', e.key)
    // 添加防抖，防止快速按键导致的问题
    if (this.keydownCooldown) return

    // 只处理左右箭头键，并阻止事件冒泡到播放器
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      e.stopPropagation()
    }

    this.keydownCooldown = true
    setTimeout(() => {
      this.keydownCooldown = false
    }, 200) // 200ms 防抖间隔

    if (e.key === 'ArrowLeft') {
      // console.log('向左箭头被按下')
      this.prev()
    }
    if (e.key === 'ArrowRight') {
      // console.log('向右箭头被按下')
      this.next()
    }
  }

  private next() {
    // console.log('next 被调用:', {
    //   currentIndex: this.currentIndex,
    //   imagesLength: this.cfg.images.length,
    //   loop: this.cfg.loop
    // })
    let targetIndex = this.currentIndex + 1
    // 边界检查 - 禁止在最后一张图片时继续向右
    if (targetIndex >= this.cfg.images.length) {
      if (!this.cfg.loop) {
        return
      }
      targetIndex = 0
    }
    // console.log('next 计算的目标索引:', targetIndex)
    this.goto(targetIndex)
  }

  private prev() {
    // console.log('prev 被调用:', {
    //   currentIndex: this.currentIndex,
    //   imagesLength: this.cfg.images.length,
    //   loop: this.cfg.loop
    // })
    let targetIndex = this.currentIndex - 1
    // 边界检查 - 禁止在第一张图片时继续向左
    if (targetIndex < 0) {
      if (!this.cfg.loop) {
        return
      }
      targetIndex = this.cfg.images.length - 1
    }
    // console.log('prev 计算的目标索引:', targetIndex)
    this.goto(targetIndex)
  }

  private goto(index: number, isAutoplay: boolean = false) {
    if (
      index === this.currentIndex ||
      index < 0 ||
      index >= this.cfg.images.length
    ) {
      return
    }

    if (!isAutoplay) {
      this._isUserInitiatedChange = true
      this._userChangeUntil = Date.now() + 1000
      // 用户手动切换图片时，如果不是最后一张，重置图集结束标志
      if (index < this.cfg.images.length - 1) {
        this._galleryEnded = false
      }
      // 同步更新播放时间到目标图片的开始时间
      if (this.imageStartTimes.length > 0) {
        this._playedTime = this.imageStartTimes[index]
        if (!this.player.paused) {
          this._playStartTime = Date.now() - this._playedTime
        }
      }
    }

    this.currentIndex = index
    this.updateSlidePosition()

    if (!isAutoplay && this.player && !this.player.paused) {
      this.restartAutoplay()
    }

    this.syncPlayerProgress()

    if (!isAutoplay) {
      setTimeout(() => {
        this._isUserInitiatedChange = false
      }, 300)
    }
  }

  private syncPlayerProgress() {
    if (this.player && this.cfg.images.length > 0) {
      this._isSyncingProgress = true

      // 进度条基于图片索引等分显示
      // 每张图片占 1/n 的进度条长度，切换时显示到该图片末尾
      const imageCount = this.cfg.images.length
      const progress = (this.currentIndex + 1) / imageCount

      const progressPlugin = this.player.plugins?.progress
      if (progressPlugin) {
        progressPlugin.updatePercent(progress, true)
      }

      setTimeout(() => {
        this._isSyncingProgress = false
      }, 100)
    }
  }

  // 标记图集是否已播放完成
  private _galleryEnded = false

  private handleTimeUpdate = () => {
    if (!this.player || !this.cfg.images || this.cfg.images.length === 0) return

    if (this._isSyncingProgress) return
    if (this.player.paused) return
    if (this._isUserInitiatedChange || Date.now() < this._userChangeUntil)
      return

    // 使用真实时间来控制图片切换，而不是音乐进度
    let newIndex: number
    let currentTimeMs: number

    if (
      this.imageStartTimes.length > 0 &&
      this.totalDuration > 0 &&
      this._playStartTime > 0
    ) {
      // 计算从播放开始到现在的真实时间（毫秒）
      currentTimeMs = Date.now() - this._playStartTime
      newIndex = this.getImageIndexByTime(currentTimeMs)

      // 先处理图片切换，确保最后一张图片能正确显示和播放
      const clampedIndex = Math.max(
        0,
        Math.min(newIndex, this.cfg.images.length - 1)
      )

      if (clampedIndex !== this.currentIndex) {
        this.currentIndex = clampedIndex
        this.updateSlidePosition()
        this.ensureImageLoaded(clampedIndex)
      }

      // 进度条显示基于图片索引（等分），而不是时间比例
      // 计算当前图片内的播放进度
      const currentImageStartTime = this.imageStartTimes[clampedIndex]
      const currentImageDuration = this.imageDurations[clampedIndex]
      const timeInCurrentImage = currentTimeMs - currentImageStartTime
      const imageInternalProgress = Math.min(
        timeInCurrentImage / currentImageDuration,
        1
      )

      // 每张图片占 1/n 的进度条长度
      const imageCount = this.cfg.images.length
      const baseProgress = clampedIndex / imageCount
      const imageProgressWidth = 1 / imageCount
      const progress = Math.min(
        baseProgress + imageInternalProgress * imageProgressWidth,
        1
      )

      const progressPlugin = this.player.plugins?.progress
      if (progressPlugin) {
        progressPlugin.updatePercent(progress, true)
      }

      // 检查图集是否播放完成（真实时间超过图集总时长）
      // 只有当首个媒体已加载完成时才进行结束判断，防止动图还没加载好就切换
      if (
        currentTimeMs >= this.totalDuration &&
        !this._galleryEnded &&
        this._firstMediaReady
      ) {
        this._galleryEnded = true

        // 检查是否开启了自动连播
        const store = playerSettingStore()
        if (store.isAutoContinuous) {
          // 开启自动连播：暂停播放器并触发 ended 事件，切换到下一个视频
          this.player.pause()
          this.player.emit('ended')
        } else {
          // 关闭自动连播：循环播放当前图集
          // 使用 setTimeout 延迟重置，避免在同一帧内多次更新导致跳动
          setTimeout(() => {
            if (this._destroyed || this.player.paused) return
            this._galleryEnded = false
            this._playedTime = 0
            this._playStartTime = Date.now()
            this._currentIndex = 0
            // 直接设置位置，不触发 handleLivePhotoPlayback 中的重置
            if (this.slidesContainer) {
              this.slidesContainer.style.transform = `translate3d(0px, 0, 0)`
            }
            this.updateArrowStates()
            this.updateCounter()
            this.updateBlurBackground(0)
            // 重置第一张图片的 Live Photo 视频
            this.handleLivePhotoPlayback(0, true)
          }, 50)
        }
        return
      }
      // 已在上面处理过图片切换，直接返回
      return
    } else {
      // 回退到基于音乐进度的计算
      const duration = this.player.duration || 1
      const currentTime = this.player.currentTime || 0
      const progress = duration > 0 ? currentTime / duration : 0
      newIndex = Math.floor(progress * this.cfg.images.length)
    }

    const clampedIndex = Math.max(
      0,
      Math.min(newIndex, this.cfg.images.length - 1)
    )

    if (clampedIndex !== this.currentIndex) {
      this.currentIndex = clampedIndex
      this.updateSlidePosition()
      this.ensureImageLoaded(clampedIndex)
    }
  }

  private ensureImageLoaded(index: number) {
    // 如果图片还没有加载，则加载它
    if (!this.preloadedImages.has(index)) {
      setTimeout(() => {
        if (this._destroyed) return
        this.preloadImage(index)
      }, 0)
    }
  }

  private updateArrowStates() {
    if (!this.cfg.showArrows || this._destroyed || !this.root) return

    const leftArrow =
      this.root.querySelector('.image-gallery-arrow-left') ||
      this.root.querySelector('.image-gallery-bottom-left')
    const rightArrow =
      this.root.querySelector('.image-gallery-arrow-right') ||
      this.root.querySelector('.image-gallery-bottom-right')

    if (leftArrow) {
      if (this.currentIndex === 0 && !this.cfg.loop) {
        leftArrow.classList.add('disabled')
      } else {
        leftArrow.classList.remove('disabled')
      }
    }

    if (rightArrow) {
      if (this.currentIndex === this.cfg.images.length - 1 && !this.cfg.loop) {
        rightArrow.classList.add('disabled')
      } else {
        rightArrow.classList.remove('disabled')
      }
    }
  }

  private updateCounter() {
    if (this._destroyed || !this.root) return
    const counter = this.root.querySelector('.image-gallery-counter')
    if (counter) {
      counter.textContent = `${this.currentIndex + 1}/${this.cfg.images.length}`
    }
  }

  private async preloadImage(index: number) {
    const { images } = this.cfg
    if (!images || index >= images.length || index < 0) return

    // 检查元素是否还存在
    if (this._destroyed || !this.root) return

    const imageUrl = this.getBestImageUrl(index)
    if (!imageUrl) return

    try {
      // 如果图片已经预加载过，直接更新显示
      if (this.preloadedImages.has(index)) {
        const slideImg = this.root.querySelector(
          `img[data-index="${index}"]`
        ) as HTMLImageElement
        if (slideImg) {
          slideImg.src = imageUrl
          slideImg.style.display = 'block'
        }
        return
      }

      const img = new Image()
      img.src = imageUrl

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${imageUrl}`))
      })

      this.preloadedImages.set(index, img)

      // 更新对应的图片元素
      const slideImg = this.root.querySelector(
        `img[data-index="${index}"]`
      ) as HTMLImageElement
      if (slideImg) {
        slideImg.src = imageUrl
        slideImg.style.display = 'block'
      }
    } catch (err) {
      console.warn(err)
      // 图片加载失败，使用占位图
      const slideImg = this.root.querySelector(
        `img[data-index="${index}"]`
      ) as HTMLImageElement
      if (slideImg) {
        slideImg.src = this.PLACEHOLDER_IMAGE
        slideImg.style.display = 'block'
      }
    }
  }

  private startAutoplay() {
    // 注意：图片切换现在由 handleTimeUpdate 使用真实时间控制
    // 这里的 autoplay 功能已不再需要，因为 timeupdate 事件会持续触发
    // 保留此方法是为了兼容性，但不再执行图片切换逻辑
  }

  private restartAutoplay() {
    // 不再需要，由 handleTimeUpdate 控制
  }

  destroy() {
    this._destroyed = true
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
    // 暂停并清理所有实况视频
    this.livePhotoVideos.forEach((video) => {
      video.pause()
      video.src = ''
    })
    this.livePhotoVideos.clear()
    // 移除键盘事件监听器
    document.removeEventListener('keydown', this.onKeydown, true)
    // 移除 resize 事件监听器
    window.removeEventListener('resize', this.onResize)
    // 断开 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    this.preloadedImages.clear()
    super.destroy()
  }
}

export default ImageGalleryPlugin
