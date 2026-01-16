import { Plugin, Sniffer, Util, type IPluginOptions } from 'xgplayer'
import type { BitRate, ClarityOption } from '@/api/tyeps/common/video'
import { parseClarityList } from '@/api/tyeps/common/video'
import { playerSettingStore } from '@/stores/player-setting'
import './index.scss'

const { POSITIONS } = Plugin

const TOGGLE_MODES = {
  CLICK: 'click',
  HOVER: 'hover'
}

let IS_MOBILE = Sniffer.device === 'mobile'

export interface ClaritySwitchConfig {
  position?: string
  index?: number
  className?: string
  defaultClarity?: string
  clarityList?: ClarityOption[]
  bitRates?: BitRate[]
  toggleMode?: string
}

// 清晰度值到显示文本的映射
const CLARITY_LABELS: Record<string, string> = {
  auto: '智能',
  '1080p': '高清 1080P',
  '720p': '高清 720P',
  '540p': '标清 540P'
}

// 网络速度阈值（Mbps）
const NETWORK_THRESHOLDS = {
  HIGH: 5, // >= 5Mbps 使用 1080p
  MEDIUM: 2, // >= 2Mbps 使用 720p
  LOW: 0.5 // >= 0.5Mbps 使用 540p，否则使用最低清晰度
}

// 清晰度优先级（从高到低）
const CLARITY_PRIORITY = ['1080p', '720p', '540p']

/**
 * 清晰度切换插件
 * 用于切换视频清晰度
 * - 使用 store 保存清晰度选择，切换视频时保持设置
 * - 支持多个备用链接，自动切换防止播放失败
 * - 智能模式：根据网络状况自动选择最佳清晰度
 */
class ClaritySwitch extends Plugin {
  isActive: boolean
  activeEvent: string
  private currentClarity: string
  private currentValue: string
  private clarityList: ClarityOption[]
  private store: ReturnType<typeof playerSettingStore> | null = null
  private currentUrlIndex: number = 0
  private maxRetries: number = 3
  private networkSpeed: number = 0 // 网络速度 (Mbps)
  private lastSpeedTestTime: number = 0
  private speedTestInterval: number = 30000 // 30秒测试一次

  static get pluginName() {
    return 'claritySwitch'
  }

  static get defaultConfig(): ClaritySwitchConfig {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 7,
      className: 'xgplayer-clarity-switch',
      defaultClarity: '智能',
      toggleMode: TOGGLE_MODES.HOVER,
      clarityList: [
        { label: '高清 1080P', value: '1080p' },
        { label: '高清 720P', value: '720p' },
        { label: '标清 540P', value: '540p' },
        { label: '智能', value: 'auto' }
      ]
    }
  }

  constructor(args: IPluginOptions) {
    super(args)
    this.isActive = false
    this.activeEvent = ''
    this.currentClarity = this.config.defaultClarity || '智能'
    this.currentValue = 'auto'
    this.clarityList = []
    this.onItemClick = this.onItemClick.bind(this)
    this.onVideoError = this.onVideoError.bind(this)
  }

  afterCreate() {
    const { config } = this
    IS_MOBILE = IS_MOBILE || this.domEventType === 'touch'

    // 初始化 store
    this.store = playerSettingStore()

    // 从 store 恢复清晰度设置
    const savedClarity = this.store.clarity
    if (savedClarity) {
      this.currentValue = savedClarity
      this.currentClarity = CLARITY_LABELS[savedClarity] || savedClarity
    }

    // 初始化清晰度列表
    const hasBitRates = config.bitRates?.length > 0
    if (hasBitRates) {
      this.clarityList = parseClarityList(config.bitRates)
    } else {
      this.clarityList =
        config.clarityList || ClaritySwitch.defaultConfig.clarityList!
    }

    // 渲染列表
    this.renderClarityList()
    // 更新按钮文字
    this.updateBtnText(this.currentClarity)

    // 设置事件模式
    if (IS_MOBILE) {
      config.toggleMode = TOGGLE_MODES.CLICK
      this.activeEvent = 'touchend'
    } else {
      this.activeEvent =
        config.toggleMode === TOGGLE_MODES.CLICK ? 'click' : 'mouseenter'
    }

    // 绑定事件
    if (config.toggleMode === TOGGLE_MODES.CLICK) {
      this.bind(this.activeEvent, this.switchActiveState)
    } else {
      this.bind(this.activeEvent, this.onEnter)
      this.bind('mouseleave', this.onLeave)
    }

    // 绑定选项点击事件
    this.root?.addEventListener('click', this.onItemClick)

    // 监听视频错误事件，自动切换备用链接
    this.on('error', this.onVideoError)

    // 只有当有 bitRates 数据时才应用清晰度设置
    // 否则等待 setBitRates 被调用时再应用
    if (hasBitRates && savedClarity) {
      if (savedClarity === 'auto') {
        // 智能模式：检测网络并自动选择
        this.detectNetworkAndApply()
      } else {
        this.applyClarity(savedClarity)
      }
    }
  }

  /**
   * 检测网络速度
   * 使用 Network Information API 或基于下载速度估算
   */
  async detectNetworkSpeed(): Promise<number> {
    const now = Date.now()

    // 如果距离上次测试时间不够，使用缓存的速度
    if (
      this.networkSpeed > 0 &&
      now - this.lastSpeedTestTime < this.speedTestInterval
    ) {
      return this.networkSpeed
    }

    // 尝试使用 Network Information API
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection

    if (connection) {
      // downlink 是以 Mbps 为单位的有效带宽估计
      if (connection.downlink) {
        this.networkSpeed = connection.downlink
        this.lastSpeedTestTime = now
        console.log(`[ClaritySwitch] 网络速度 (API): ${this.networkSpeed} Mbps`)
        return this.networkSpeed
      }

      // 根据 effectiveType 估算
      const effectiveTypeSpeed: Record<string, number> = {
        'slow-2g': 0.1,
        '2g': 0.3,
        '3g': 1.5,
        '4g': 10
      }
      if (
        connection.effectiveType &&
        effectiveTypeSpeed[connection.effectiveType]
      ) {
        this.networkSpeed = effectiveTypeSpeed[connection.effectiveType]
        this.lastSpeedTestTime = now
        console.log(
          `[ClaritySwitch] 网络速度 (effectiveType): ${this.networkSpeed} Mbps`
        )
        return this.networkSpeed
      }
    }

    // 如果没有 API，默认返回中等速度
    this.networkSpeed = 3
    this.lastSpeedTestTime = now
    console.log(`[ClaritySwitch] 网络速度 (默认): ${this.networkSpeed} Mbps`)
    return this.networkSpeed
  }

  /**
   * 根据网络速度获取推荐的清晰度
   */
  getRecommendedClarity(speed: number): string {
    if (speed >= NETWORK_THRESHOLDS.HIGH) {
      return '1080p'
    } else if (speed >= NETWORK_THRESHOLDS.MEDIUM) {
      return '720p'
    } else if (speed >= NETWORK_THRESHOLDS.LOW) {
      return '540p'
    }
    // 网络很差，使用最低可用清晰度
    return '540p'
  }

  /**
   * 检测网络并应用最佳清晰度（智能模式）
   */
  async detectNetworkAndApply() {
    const speed = await this.detectNetworkSpeed()
    const recommendedClarity = this.getRecommendedClarity(speed)

    console.log(
      `[ClaritySwitch] 智能模式 - 网络速度: ${speed} Mbps, 推荐清晰度: ${recommendedClarity}`
    )

    // 查找推荐清晰度，如果没有则降级
    let clarityToApply = recommendedClarity
    let clarityOption = this.clarityList.find(
      (item) => item.value === clarityToApply
    )

    // 如果推荐的清晰度不可用，尝试降级
    if (!clarityOption || !clarityOption.url) {
      const priorityIndex = CLARITY_PRIORITY.indexOf(recommendedClarity)
      for (let i = priorityIndex + 1; i < CLARITY_PRIORITY.length; i++) {
        const fallbackClarity = CLARITY_PRIORITY[i]
        clarityOption = this.clarityList.find(
          (item) => item.value === fallbackClarity
        )
        if (clarityOption?.url) {
          clarityToApply = fallbackClarity
          console.log(`[ClaritySwitch] 智能模式 - 降级到: ${clarityToApply}`)
          break
        }
      }
    }

    // 应用清晰度（但不改变用户的"智能"选择）
    if (clarityOption?.url) {
      this.currentUrlIndex = 0
      this.switchClarity(clarityOption)
    }
  }

  /**
   * 处理视频播放错误，自动切换备用链接
   */
  onVideoError() {
    const clarityOption = this.clarityList.find(
      (item) => item.value === this.currentValue
    )

    // 智能模式下，从当前播放的清晰度获取
    let urls: string[] = []
    if (this.currentValue === 'auto') {
      // 智能模式下尝试所有清晰度的备用链接
      for (const clarity of CLARITY_PRIORITY) {
        const option = this.clarityList.find((item) => item.value === clarity)
        if (option?.bitRate?.play_addr.url_list) {
          urls = option.bitRate.play_addr.url_list
          break
        }
      }
    } else if (clarityOption?.bitRate) {
      urls = clarityOption.bitRate.play_addr.url_list
    }

    if (urls.length === 0) return

    if (
      this.currentUrlIndex < urls.length - 1 &&
      this.currentUrlIndex < this.maxRetries - 1
    ) {
      this.currentUrlIndex++
      console.log(
        `[ClaritySwitch] 播放失败，切换到备用链接 ${this.currentUrlIndex + 1}/${
          urls.length
        }`
      )
      this.switchToUrl(urls[this.currentUrlIndex])
    } else {
      console.log('[ClaritySwitch] 所有备用链接都已尝试，尝试降级清晰度')
      this.currentUrlIndex = 0
      // 尝试降级到更低清晰度
      this.tryLowerClarity()
    }
  }

  /**
   * 尝试降级到更低清晰度
   */
  tryLowerClarity() {
    const currentIndex = CLARITY_PRIORITY.indexOf(this.currentValue)
    if (currentIndex === -1 || currentIndex >= CLARITY_PRIORITY.length - 1) {
      console.log('[ClaritySwitch] 已是最低清晰度，无法继续降级')
      return
    }

    for (let i = currentIndex + 1; i < CLARITY_PRIORITY.length; i++) {
      const lowerClarity = CLARITY_PRIORITY[i]
      const clarityOption = this.clarityList.find(
        (item) => item.value === lowerClarity
      )
      if (clarityOption?.url) {
        console.log(`[ClaritySwitch] 降级到: ${lowerClarity}`)
        this.currentUrlIndex = 0
        this.switchClarity(clarityOption)
        return
      }
    }
  }

  /**
   * 切换到指定 URL
   */
  switchToUrl(url: string) {
    const { player } = this
    if (!player) return

    const currentTime = player.currentTime
    const wasPlaying = !player.paused

    player.src = url

    player.once('loadedmetadata', () => {
      player.currentTime = currentTime
      if (wasPlaying) {
        player.play().catch(() => {})
      }
    })
  }

  /**
   * 应用清晰度设置
   */
  applyClarity(value: string) {
    if (value === 'auto') {
      this.detectNetworkAndApply()
      return
    }

    const clarityOption = this.clarityList.find((item) => item.value === value)
    if (clarityOption?.url) {
      this.currentUrlIndex = 0
      this.switchClarity(clarityOption)
    }
  }

  showPanel() {
    if (!this.clarityList || this.clarityList.length === 0) {
      return
    }
    Util.addClass(this.root, 'slide-show')
  }

  hidePanel() {
    Util.removeClass(this.root, 'slide-show')
  }

  onEnter = (e: Event) => {
    e.stopPropagation()
    this.switchActiveState(true)
  }

  switchActiveState = (isActive: boolean) => {
    this.toggle(isActive)
  }

  onLeave = (e: Event) => {
    e.stopPropagation()
    this.toggle(false)
  }

  toggle(isActive: boolean) {
    if (isActive === this.isActive || this.config.disable) return
    const { controls } = this.player
    if (isActive) {
      controls?.focus()
      this.showPanel()
    } else {
      controls?.focusAwhile()
      this.hidePanel()
    }
    this.isActive = isActive
  }

  /**
   * 处理选项点击
   */
  onItemClick(e: Event) {
    const target = e.target as HTMLElement
    const item = target.closest('.clarity-item') as HTMLElement
    if (!item) return

    const value = item.dataset.value
    const label = item.dataset.label

    if (!value || !label || value === this.currentValue) return

    // 更新选中状态
    const curSelected = this.root?.querySelector('.clarity-item.selected')
    curSelected?.classList.remove('selected')
    item.classList.add('selected')

    this.currentClarity = label
    this.currentValue = value
    this.currentUrlIndex = 0
    this.updateBtnText(label)

    // 保存到 store
    this.store?.setClarity(value)

    // 触发清晰度切换事件
    this.emit('clarityChange', { value, label })

    // 应用清晰度
    if (value === 'auto') {
      // 智能模式：检测网络并自动选择
      this.detectNetworkAndApply()
    } else {
      const clarityOption = this.clarityList.find(
        (item) => item.value === value
      )
      if (clarityOption?.url) {
        this.switchClarity(clarityOption)
      }
    }

    console.log('[ClaritySwitch] 切换清晰度:', label, value)
  }

  /**
   * 切换清晰度
   */
  switchClarity(clarityOption: ClarityOption) {
    const { player } = this
    if (!player || !clarityOption.bitRate) return

    const urls = clarityOption.bitRate.play_addr.url_list
    if (!urls || urls.length === 0) return

    const url = urls[this.currentUrlIndex] || urls[0]

    const currentTime = player.currentTime
    const wasPlaying = !player.paused

    player.src = url

    player.once('loadedmetadata', () => {
      player.currentTime = currentTime
      if (wasPlaying) {
        player.play().catch(() => {})
      }
    })
  }

  /**
   * 更新按钮文字
   */
  updateBtnText(label: string) {
    const btnText = this.find('.clarity-btn-text')
    if (btnText) {
      btnText.textContent = label
    }
  }

  /**
   * 设置清晰度列表（通过 bitRates）
   */
  setBitRates(bitRates: BitRate[]) {
    this.clarityList = parseClarityList(bitRates)
    this.renderClarityList()

    const savedClarity = this.store?.clarity
    if (savedClarity) {
      this.currentValue = savedClarity
      this.currentClarity = CLARITY_LABELS[savedClarity] || savedClarity
      this.updateBtnText(this.currentClarity)
      this.applyClarity(savedClarity)
    }
  }

  /**
   * 设置清晰度列表
   */
  setClarityList(list: ClarityOption[]) {
    this.clarityList = list
    this.renderClarityList()
  }

  /**
   * 重新渲染清晰度列表
   */
  renderClarityList() {
    const menu = this.find('.clarity-menu')
    if (!menu) return

    const itemsHtml = this.clarityList
      .map(
        (item) =>
          `<div class="clarity-item${
            item.value === this.currentValue ? ' selected' : ''
          }" 
               data-value="${item.value}" 
               data-label="${item.label}">
            ${item.label}
          </div>`
      )
      .join('')

    menu.innerHTML = itemsHtml
  }

  destroy() {
    if (this.config.toggleMode === TOGGLE_MODES.CLICK) {
      this.unbind(this.activeEvent, this.switchActiveState)
    } else {
      this.unbind(this.activeEvent, this.onEnter)
      this.unbind('mouseleave', this.onLeave)
    }
    this.root?.removeEventListener('click', this.onItemClick)
    this.off('error', this.onVideoError)
  }

  render() {
    // 直接从 store 读取保存的清晰度设置，因为 render() 在 afterCreate() 之前执行
    const store = playerSettingStore()
    const savedClarity = store.clarity
    const displayText = savedClarity
      ? CLARITY_LABELS[savedClarity] || savedClarity
      : this.config.defaultClarity || '智能'

    return `<xg-icon class="xgplayer-clarity-switch" data-state="normal">
      <div class="clarity-btn-text">${displayText}</div>
      <div class="xgplayer-slider clarity-slider">
        <div class="clarity-menu"></div>
      </div>
    </xg-icon>`
  }
}

export default ClaritySwitch
