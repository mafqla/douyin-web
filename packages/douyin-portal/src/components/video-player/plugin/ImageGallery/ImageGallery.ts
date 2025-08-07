import { Plugin } from 'xgplayer'
import type { IPluginOptions } from 'xgplayer/es/plugin/plugin'
import './index.scss'

const { POSITIONS } = Plugin

export interface ImageItem {
  uri: string
  width: number
  height: number
  url_list: string[]
  download_url_list: string[]
}

export interface ImageGalleryConfig {
  images: ImageItem[]
  autoplay?: number
  preloadCount?: number
  loop?: boolean // 是否循环播放
  showArrows?: boolean // 是否显示箭头图标
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
      showArrows: true // 默认显示箭头图标
    }
  }

  private readonly PLACEHOLDER_IMAGE = '/src/assets/icons/logo.svg'

  private _currentIndex = 0
  private _isUserInitiatedChange = false
  private _isAutoplayChange = false
  private _isSyncingProgress = false

  private get currentIndex(): number {
    return this._currentIndex
  }

  private set currentIndex(value: number) {
    console.log('currentIndex 变化:', {
      from: this._currentIndex,
      to: value,
      stack: new Error().stack
    })
    this._currentIndex = value
    // 更新箭头图标的禁用状态
    this.updateArrowStates()
  }
  private autoplayTimer: number | null = null
  private touchStartX = 0
  private touchStartY = 0
  private isDragging = false
  private preloadedImages: Map<number, HTMLImageElement> = new Map()
  private swiperContainer: HTMLElement | null = null
  private slidesContainer: HTMLElement | null = null
  private slides: HTMLElement[] = []
  private cfg: Required<ImageGalleryConfig>

  constructor(args: IPluginOptions) {
    super(args)

    // 注意：在构造函数中可能还获取不到完整的配置
    // 完整的配置会在 afterCreate 方法中通过 this.playerConfig 获取
    this.cfg = {
      images: [],
      autoplay: 0,
      preloadCount: 2,
      loop: true, // 默认开启循环播放
      showArrows: true // 默认显示箭头图标
    }
  }

  afterCreate() {
    // 在 afterCreate 中更新配置，此时配置应该已经准备好了
    const imageGalleryConfig = this.playerConfig?.imageGallery || {}

    this.cfg = {
      images: [],
      autoplay: 0,
      preloadCount: 2,
      loop:
        imageGalleryConfig.loop !== undefined ? imageGalleryConfig.loop : true, // 默认开启循环播放
      showArrows:
        imageGalleryConfig.showArrows !== undefined ? imageGalleryConfig.showArrows : true, // 默认显示箭头图标
      ...imageGalleryConfig
    }

    console.log('配置已加载:', this.cfg)

    const { images } = this.cfg
    if (!images || images.length === 0) return

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

    // 初始显示第一张
    this.updateSlidePosition()
    this.updateArrowStates()
    this.startAutoplay()

    // 预加载图片
    setTimeout(() => {
      this.preloadImages()
      // 确保第一张图片正确显示
      this.preloadImage(0)
    }, 0)
  }

  render() {
    // 在render方法中不能访问this.cfg，因为此时插件还未完全初始化
    // 我们需要从playerConfig中获取配置
    const imageGalleryConfig = this.playerConfig?.imageGallery || {}
    const images = imageGalleryConfig.images || []
    const showArrows = imageGalleryConfig.showArrows !== undefined ? imageGalleryConfig.showArrows : true
    const loop = imageGalleryConfig.loop !== undefined ? imageGalleryConfig.loop : true

    if (!images || images.length === 0) {
      return ''
    }

    // 始终显示箭头图标，但根据边界条件添加禁用状态
    const arrowHtml = showArrows ? `
        <!-- 左箭头图标 -->
        <div class="image-gallery-arrow image-gallery-arrow-left ${this.currentIndex === 0 && !loop ? 'disabled' : ''}">
          <svg
            width="56"
            height="56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="arrow-left-icon"
            viewBox="0 0 56 56"
          >
            <g clip-path="url(#arrowLeft_svg__clip0_1670_162489)">
              <path
                d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z"
                fill="#000"
              ></path>
              <g filter="url(#arrowLeft_svg__filter0_d_1670_162489)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M31.402 18.573a2 2 0 0 1 .024 2.829l-6.598 6.713 6.574 6.458a2 2 0 1 1-2.804 2.854l-8-7.86a2 2 0 0 1-.024-2.829l8-8.14a2 2 0 0 1 2.828-.024z"
                  fill="#fff"
                ></path>
              </g>
            </g>
            <defs>
              <filter
                id="arrowLeft_svg__filter0_d_1670_162489"
                x="19"
                y="18"
                width="14"
                height="22"
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
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                ></feColorMatrix>
                <feBlend
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1670_162489"
                ></feBlend>
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1670_162489"
                  result="shape"
                ></feBlend>
              </filter>
              <clipPath id="arrowLeft_svg__clip0_1670_162489">
                <path fill="currentColor" d="M0 0h56v56H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </div>
        
        <!-- 右箭头图标 -->
        <div class="image-gallery-arrow image-gallery-arrow-right ${this.currentIndex === images.length - 1 && !loop ? 'disabled' : ''}">
          <svg
            width="56"
            height="56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56 56"
            class="arrow-right-icon"
          >
            <g clip-path="url(#arrowRight_svg__clip0_1683_162494)">
              <path
                d="M0 28c0 15.464 12.536 28 28 28s28-12.536 28-28S43.464 0 28 0 0 12.536 0 28z"
                fill="#000"
              ></path>
              <g filter="url(#arrowRight_svg__filter0_d_1683_162494)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M24.598 37.426a2 2 0 0 1-.024-2.828l6.598-6.713-6.574-6.458a2 2 0 1 1 2.804-2.854l8 7.86a2 2 0 0 1 .024 2.829l-8 8.14a2 2 0 0 1-2.828.024z"
                  fill="#fff"
                ></path>
              </g>
            </g>
            <defs>
              <filter
                id="arrowRight_svg__filter0_d_1683_162494"
                x="23"
                y="18"
                width="14"
                height="22"
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
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
                ></feColorMatrix>
                <feBlend
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_1683_162494"
                ></feBlend>
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1683_162494"
                  result="shape"
                ></feBlend>
              </filter>
              <clipPath id="arrowRight_svg__clip0_1683_162494">
                <path fill="#fff" d="M0 0h56v56H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </div>
      ` : '';

    return `
      <div class="image-gallery-plugin">
        ${arrowHtml}
        
        <div class="image-gallery-slides">
          ${images
            .map((image: any, index: number) => {
              // 优先使用 webp 格式
              const webpUrl =
                image.url_list && image.url_list.find
                  ? image.url_list.find(
                      (url: string) =>
                        url && url.includes && url.includes('.webp')
                    )
                  : undefined
              // 获取第一张图片的URL
              const imageUrl =
                webpUrl ||
                (image.url_list && image.url_list[0]) ||
                (image.download_url_list && image.download_url_list[0]) ||
                this.PLACEHOLDER_IMAGE
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
    if (!this.slidesContainer || !this.root) return

    // 移除节流控制以确保按钮切换时图片能正确更新
    this.lastUpdateTime = Date.now()

    const slideWidth = this.slidesContainer.clientWidth
    const translateX = -this.currentIndex * slideWidth

    // 只在必要的时候添加过渡效果
    this.slidesContainer.style.transform = `translate3d(${translateX}px, 0, 0)`

    // 确保当前图片已加载并显示
    this.ensureImageLoaded(this.currentIndex)

    // 预加载相邻图片
    setTimeout(() => {
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

    // 键盘导航 - 使用捕获阶段并在 document 上监听
    document.addEventListener('keydown', this.onKeydown, true);

    // 等待 DOM 更新后绑定箭头图标事件
    setTimeout(() => {
      const leftArrow = this.root.querySelector('.image-gallery-arrow-left')
      const rightArrow = this.root.querySelector('.image-gallery-arrow-right')
      
      if (leftArrow) {
        leftArrow.addEventListener('click', (e) => {
          // 检查是否禁用
          if (leftArrow.classList.contains('disabled')) {
            return;
          }
          this.prev()
        })
      }
      
      if (rightArrow) {
        rightArrow.addEventListener('click', (e) => {
          // 检查是否禁用
          if (rightArrow.classList.contains('disabled')) {
            return;
          }
          this.next()
        })
      }
    }, 0)
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

      console.log('拖动结束，计算目标索引:', {
        currentIndex: this.currentIndex,
        deltaX: deltaX,
        direction: deltaX > 0 ? 'right' : 'left',
        targetIndexBeforeBoundary: targetIndex,
        loop: this.cfg.loop
      })

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

      console.log('拖动结束，最终目标索引:', {
        targetIndex: targetIndex,
        loop: this.cfg.loop
      })

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

      console.log('拖动结束，计算目标索引:', {
        currentIndex: this.currentIndex,
        deltaX: deltaX,
        direction: deltaX > 0 ? 'right' : 'left',
        targetIndexBeforeBoundary: targetIndex,
        loop: this.cfg.loop
      })

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

      console.log('拖动结束，最终目标索引:', {
        targetIndex: targetIndex,
        loop: this.cfg.loop
      })

      this.goto(targetIndex)
    } else {
      // 拖动距离不够，回到当前位置
      this.updateSlidePosition()
    }
  }

  private keydownCooldown = false

  private onKeydown = (e: KeyboardEvent) => {
    console.log('键盘事件:', e.key)
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
      console.log('向左箭头被按下')
      this.prev()
    }
    if (e.key === 'ArrowRight') {
      console.log('向右箭头被按下')
      this.next()
    }
  }

  private next() {
    console.log('next 被调用:', {
      currentIndex: this.currentIndex,
      imagesLength: this.cfg.images.length,
      loop: this.cfg.loop
    })
    let targetIndex = this.currentIndex + 1
    // 边界检查 - 禁止在最后一张图片时继续向右
    if (targetIndex >= this.cfg.images.length) {
      if (!this.cfg.loop) {
        return
      }
      targetIndex = 0
    }
    console.log('next 计算的目标索引:', targetIndex)
    this.goto(targetIndex)
  }

  private prev() {
    console.log('prev 被调用:', {
      currentIndex: this.currentIndex,
      imagesLength: this.cfg.images.length,
      loop: this.cfg.loop
    })
    let targetIndex = this.currentIndex - 1
    // 边界检查 - 禁止在第一张图片时继续向左
    if (targetIndex < 0) {
      if (!this.cfg.loop) {
        return
      }
      targetIndex = this.cfg.images.length - 1
    }
    console.log('prev 计算的目标索引:', targetIndex)
    this.goto(targetIndex)
  }

  private goto(index: number, isAutoplay: boolean = false) {
    console.log('goto 被调用:', {
      fromIndex: this.currentIndex,
      toIndex: index,
      imagesLength: this.cfg.images.length,
      condition:
        index === this.currentIndex ||
        index < 0 ||
        index >= this.cfg.images.length,
      isAutoplay: isAutoplay
    })

    if (
      index === this.currentIndex ||
      index < 0 ||
      index >= this.cfg.images.length
    ) {
      console.log('goto 返回，条件不满足')
      return
    }

    // 标记这是用户发起的更改（仅当不是自动播放时）
    if (!isAutoplay) {
      this._isUserInitiatedChange = true
      console.log('_isUserInitiatedChange 设置为 true')
    } else {
      // 标记这是自动播放发起的更改
      this._isAutoplayChange = true
      console.log('_isAutoplayChange 设置为 true')
    }

    this.currentIndex = index
    console.log('currentIndex 更新为:', this.currentIndex)
    this.updateSlidePosition()

    // 只有当播放器正在播放且不是自动播放调用时才重启自动播放
    if (!isAutoplay && this.player && !this.player.paused) {
      this.restartAutoplay()
    }

    // 同步更新播放器进度
    this.syncPlayerProgress()

    // 重置用户发起更改的标志（仅当不是自动播放时）
    if (!isAutoplay) {
      setTimeout(() => {
        console.log('_isUserInitiatedChange 重置为 false')
        this._isUserInitiatedChange = false
      }, 300)
    } else {
      // 重置自动播放更改的标志
      setTimeout(() => {
        console.log('_isAutoplayChange 重置为 false')
        this._isAutoplayChange = false
      }, 300)
    }
  }

  private syncPlayerProgress() {
    // 同步播放器进度条与当前图片索引
    if (this.player && this.cfg.images.length > 0) {
      // 设置同步标志，防止在同步进度条时触发图片切换
      this._isSyncingProgress = true;
      
      // 计算当前图片对应的进度范围
      const imageDuration = 1 / this.cfg.images.length;
      const progress = (this.currentIndex + 1) * imageDuration;
      const duration = this.player.duration || 1;
      const currentTime = progress * duration;
      
      // 更新播放器的当前时间，这会自动更新进度条
      if (this.player.currentTime !== currentTime) {
        this.player.currentTime = currentTime;
      }
      
      // 在下一帧重置同步标志
      requestAnimationFrame(() => {
        this._isSyncingProgress = false;
      });
    }
  }

  private handleTimeUpdate = () => {
    // 根据播放器当前时间计算应该显示的图片索引
    if (!this.player || !this.cfg.images || this.cfg.images.length === 0) return

    // 如果正在同步进度条，不进行图片切换
    if (this._isSyncingProgress) {
      console.log('正在同步进度条，不进行图片切换')
      return
    }

    // 如果播放器已暂停，不进行图片切换
    if (this.player.paused) {
      console.log('播放器已暂停，不进行图片切换')
      return
    }

    // 如果是用户发起的更改，不进行自动切换
    if (this._isUserInitiatedChange) {
      console.log('用户发起的更改，不进行自动切换', {
        isUserInitiatedChange: this._isUserInitiatedChange
      })
      return
    }

    const duration = this.player.duration || 1
    const currentTime = this.player.currentTime || 0
    const progress = duration > 0 ? currentTime / duration : 0

    console.log('handleTimeUpdate 被调用:', {
      currentTime,
      duration,
      progress,
      currentIndex: this.currentIndex,
      imagesLength: this.cfg.images.length,
      isUserInitiatedChange: this._isUserInitiatedChange,
      isSyncingProgress: this._isSyncingProgress
    })

    // 防止在播放结束后继续切换图片
    if (duration > 0 && currentTime >= duration) {
      console.log('播放已结束')
      // 如果不循环播放，停止在最后一张图片
      if (!this.cfg.loop) {
        const lastIndex = this.cfg.images.length - 1
        console.log('不循环播放，停止在最后一张图片:', {
          lastIndex,
          currentIndex: this.currentIndex
        })
        if (this.currentIndex !== lastIndex) {
          // 检查是否是用户发起的更改
          if (!this._isUserInitiatedChange) {
            this.currentIndex = lastIndex
            this.updateSlidePosition()
            this.ensureImageLoaded(lastIndex)
          } else {
            console.log('用户发起的更改，不更新到最后一张图片')
          }
        }
      }
      return
    }

    // 计算应该显示的图片索引
    const newIndex = Math.floor(progress * this.cfg.images.length)

    // 确保索引在有效范围内
    const clampedIndex = Math.max(
      0,
      Math.min(newIndex, this.cfg.images.length - 1)
    )

    console.log('计算得到的索引:', {
      newIndex,
      clampedIndex,
      currentIndex: this.currentIndex
    })

    // 只有当索引发生变化时才更新
    if (clampedIndex !== this.currentIndex) {
      console.log('索引发生变化，更新图片:', {
        from: this.currentIndex,
        to: clampedIndex
      })
      this.currentIndex = clampedIndex
      this.updateSlidePosition()

      // 确保当前图片已加载
      this.ensureImageLoaded(clampedIndex)
    }
  }

  private ensureImageLoaded(index: number) {
    // 如果图片还没有加载，则加载它
    if (!this.preloadedImages.has(index)) {
      setTimeout(() => {
        this.preloadImage(index)
      }, 0)
    }
  }

  private updateArrowStates() {
    // 只有当显示箭头图标时才更新状态
    if (!this.cfg.showArrows) return;

    const leftArrow = this.root.querySelector('.image-gallery-arrow-left');
    const rightArrow = this.root.querySelector('.image-gallery-arrow-right');

    if (leftArrow) {
      if (this.currentIndex === 0 && !this.cfg.loop) {
        leftArrow.classList.add('disabled');
      } else {
        leftArrow.classList.remove('disabled');
      }
    }

    if (rightArrow) {
      if (this.currentIndex === this.cfg.images.length - 1 && !this.cfg.loop) {
        rightArrow.classList.add('disabled');
      } else {
        rightArrow.classList.remove('disabled');
      }
    }
  }

  private async preloadImage(index: number) {
    const { images } = this.cfg
    if (!images || index >= images.length || index < 0) return

    // 检查元素是否还存在
    if (!this.root) return

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
    if (!this.cfg.autoplay || this.cfg.autoplay <= 0) return
    this.autoplayTimer = window.setInterval(() => {
      // 只有当播放器正在播放时才自动切换图片
      if (this.player && !this.player.paused) {
        // 根据播放器当前时间计算应该显示的图片索引
        const duration = this.player.duration || 1
        const currentTime = this.player.currentTime || 0
        const progress = duration > 0 ? currentTime / duration : 0
        
        // 计算目标索引
        const targetIndex = Math.max(
          0,
          Math.min(
            Math.floor(progress * this.cfg.images.length),
            this.cfg.images.length - 1
          )
        )
        
        // 只有当目标索引与当前索引不同时才切换
        if (targetIndex !== this.currentIndex) {
          this.goto(targetIndex, true)
        }
      }
    }, this.cfg.autoplay) as unknown as number
  }

  private restartAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
    }
    this.startAutoplay()
  }

  destroy() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
      this.autoplayTimer = null
    }
    // 移除键盘事件监听器
    document.removeEventListener('keydown', this.onKeydown, true);
    this.preloadedImages.clear()
    super.destroy()
  }
}

export default ImageGalleryPlugin
