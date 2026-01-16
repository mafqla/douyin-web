import { Plugin, Sniffer, Util } from 'xgplayer'
import { playerSettingStore } from '@/stores/player-setting'
import './index.scss'
import type { IPluginOptions } from 'xgplayer/es/plugin/plugin'

const { POSITIONS } = Plugin

const LIST_TYPES = {
  SIDE: 'side',
  MIDDLE: 'middle',
  DEFAULT: 'default'
}

const TOGGLE_MODES = {
  CLICK: 'click',
  HOVER: 'hover'
}
let IS_MOBILE = Sniffer.device === 'mobile'

export default class PlaybackPlugin extends Plugin {
  isActive: boolean
  activeEvent: string
  curValue: number | null | string
  private store: ReturnType<typeof playerSettingStore> | null = null

  static get pluginName() {
    return 'playbackPlugin'
  }
  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 6,
      list: [0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0],
      listType: 'middle',
      hidePortrait: false,
      isShowIcon: true,
      toggleMode: TOGGLE_MODES.HOVER,
      className: 'xgplayer-playback-setting'
    }
  }

  constructor(args: IPluginOptions) {
    super(args)
    this.isActive = false
    this.activeEvent = ''
    // 从 store 读取保存的倍率
    const store = playerSettingStore()
    this.curValue = store.playbackRate || 1.0
    this.onItemClick = this.onItemClick.bind(this)
    this.renderItemList()
  }

  afterCreate() {
    const { config } = this
    IS_MOBILE = IS_MOBILE || this.domEventType === 'touch'

    // 初始化 store
    this.store = playerSettingStore()

    // 从 store 恢复倍率设置并应用到播放器
    const savedRate = this.store.playbackRate
    if (savedRate && savedRate !== 1.0) {
      this.curValue = savedRate
      this.player.playbackRate = savedRate
      this.renderItemList()
      this.changeCurrentText()
    }

    if (IS_MOBILE && config.listType === LIST_TYPES.DEFAULT) {
      config.listType = LIST_TYPES.SIDE
    }

    config.hidePortrait && Util.addClass(this.root, 'portrait')

    if (IS_MOBILE) {
      config.toggleMode = TOGGLE_MODES.CLICK
      this.activeEvent = 'touchend'
    } else {
      this.activeEvent =
        config.toggleMode === TOGGLE_MODES.CLICK ? 'click' : 'mouseenter'
    }

    if (config.toggleMode === TOGGLE_MODES.CLICK) {
      this.bind(this.activeEvent, this.switchActiveState)
    } else {
      this.bind(this.activeEvent, this.onEnter)
      this.bind('mouseleave', this.onLeave)
    }

    this.root.addEventListener('click', this.onItemClick)
  }

  showPanel() {
    if (!this.config.list || this.config.list.length === 0) {
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
    if (this.config.listType !== LIST_TYPES.SIDE) {
      this.toggle(false)
    }
  }

  toggle(isActive: boolean) {
    if (isActive === this.isActive || this.config.disable) return
    const { controls } = this.player
    const { listType } = this.config
    if (isActive) {
      listType === LIST_TYPES.SIDE ? controls?.blur() : controls?.focus()
      this.showPanel()
    } else {
      listType === LIST_TYPES.SIDE ? controls?.focus() : controls?.focusAwhile()
      this.hidePanel()
    }
    this.isActive = isActive
  }

  onItemClick(e: Event) {
    const target = e.target as HTMLElement
    if (!target.classList.contains('xgplayer-playratio-item')) return

    const rate = Number(target.getAttribute('data-id'))
    if (!rate || rate === this.curValue) return

    const curSelected = this.root.querySelector('.selected') as HTMLElement
    Util.addClass(target, 'selected')
    curSelected && Util.removeClass(curSelected, 'selected')

    const props = {
      playbackRate: {
        from: this.player.playbackRate,
        to: rate
      }
    }
    this.emitUserAction(e, 'change_rate', { props })
    this.curValue = rate
    this.player.playbackRate = rate
    // 保存到 store
    this.store?.setPlaybackRate(rate)
    this.changeCurrentText()
  }

  changeCurrentText() {
    // 优先使用 curValue，如果没有则从 DOM 读取
    let rate = this.curValue as number
    if (!rate) {
      const curSelected = this.root.querySelector('.selected') as HTMLElement
      if (!curSelected) return
      rate = Number(curSelected.getAttribute('data-id'))
      this.curValue = rate
    }

    const playbackRatioElement = this.root.querySelector(
      '.xgplayer-setting-playbackRatio'
    )
    if (playbackRatioElement) {
      if (rate === 1.0) {
        playbackRatioElement.textContent = '倍速'
      } else {
        const formattedRate = rate % 1 === 0 ? rate.toFixed(1) : rate
        playbackRatioElement.textContent = `${formattedRate}x`
      }
    }
  }

  renderItemList() {
    const playbackRate = this.player.playbackRate || 1.0

    const itemList = this.config.list.map((rate: number) => {
      const selected = rate === playbackRate
      return {
        rate,
        selected,
        showText: `${rate}x`
      }
    })
    this.changeCurrentText()

    const rateListContainer = this.root.querySelector(
      '.xgplayer-playratio-wrap'
    )
    if (rateListContainer) {
      rateListContainer.innerHTML = itemList
        .map((item: any) => {
          const formattedRate =
            item.rate % 1 === 0 ? item.rate.toFixed(1) : item.rate
          return `
        <div class="xgplayer-playratio-item ${
          item.selected ? 'selected' : ''
        }" data-id="${item.rate}">
          ${formattedRate}x
        </div>
      `
        })
        .join('')
    }
    // this.changeCurrentText()
  }

  destroy() {
    if (this.config.toggleMode === TOGGLE_MODES.CLICK) {
      this.unbind(this.activeEvent, this.switchActiveState)
    } else {
      this.unbind(this.activeEvent, this.onEnter)
      this.unbind('mouseleave', this.onLeave)
    }
    this.root.removeEventListener('click', this.onItemClick)
  }

  render() {
    // 从 store 读取保存的倍率
    const store = playerSettingStore()
    const savedRate = store.playbackRate || 1.0
    const displayText =
      savedRate === 1.0
        ? '倍速'
        : `${savedRate % 1 === 0 ? savedRate.toFixed(1) : savedRate}x`

    return `
      <xg-icon class="xgplayer-playback-setting" data-state="normal">
        <div class="xgplayer-setting-playbackRatio">${displayText}</div>
        <div class="xgplayer-slider xgplayer-box-douyin">
          <div class="xgplayer-setting-content">
            <div class="xgplayer-playratio-wrap">
            </div>
          </div>
        </div>
      </xg-icon>
    `
  }
}
