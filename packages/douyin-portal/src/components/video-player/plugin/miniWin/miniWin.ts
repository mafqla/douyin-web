import { playerSettingStore } from '@/stores/player-setting'
import { Events, Plugin, Util, type IPluginOptions } from 'xgplayer'
import './index.scss'

const { POSITIONS } = Plugin

const setting = toRef(playerSettingStore(), 'isMini')
class miniWin extends Plugin {
  tipText: string
  pos: {
    left: number
    top: number
    height: number
    width: number
    scrollY: number
    [key: string]: number
  }
  isClose: boolean
  lastStyle: {}
  static get pluginName() {
    return 'miniWin'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 5,
      className: 'xgplayer-playback-setting',
      width: 350,
      height: 180,
      left: -1, // Default bottom left corner
      top: -1, // Default bottom left corner
      scrollTop: 0 // Height to trigger scroll
    }
  }
  constructor(args: IPluginOptions) {
    super(args)
    this.pos = {
      left:
        this.config.left < 0
          ? window.innerWidth - this.config.width - 20
          : this.config.left,
      top:
        this.config.top < 0
          ? window.innerHeight - this.config.height - 20
          : this.config.top,
      height: this.config.height,
      width: this.config.width,
      scrollY: window.scrollY || 0
    }
    this.isClose = false
    this.lastStyle = {}
    this.tipText = setting.value ? '点击关闭悬浮小窗口' : '点击开启悬浮小窗口'
  }

  afterCreate() {
    this.updateTipText()
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.toggleMiniWin)
  }
  onCancelClick = (e: Event) => {
    console.log('miniWin onCancelClick')
    this.exitMini()
    this.isClose = true
  }

  updateUIBasedOnSetting() {
    const iconElement = this.find('.xgplayer-mini-win .xgplayer-icon')
    if (setting.value) {
      iconElement?.classList.add('select')
    } else {
      iconElement?.classList.remove('select')
    }
    console.log('miniWin afterCreate', setting.value)
  }

  toggleMiniWin = () => {
    setting.value = !setting.value
    const iconElement = this.find('.xgplayer-mini-win .xgplayer-icon')
    if (setting.value) {
      iconElement?.classList.add('select')
      this.tipText = '点击关闭悬浮小窗口'
      // console.log('start-mini', this.config)
    } else {
      iconElement?.classList.remove('select')
      this.tipText = '点击开启悬浮小窗口'
      // console.log('mini-exit', this.config)
    }
    this.updateTipText()
    this.updateUIBasedOnSetting()
    this.onPluginsReady()
  }

  updateTipText() {
    const tipElement = this.find('.xgplayer-mini-win xg-slider')
    if (tipElement) {
      tipElement.innerHTML = this.tipText
    }
  }
  onPluginsReady(): void {
    if (setting.value) {
      window.addEventListener('scroll', this.onScroll)
    }
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    const closeBtn = document.querySelector('.mini-cancel-btn')
    closeBtn?.addEventListener(eventName, this.onCancelClick)
  }

  onScroll = (e: Event) => {
    if (
      (!window.scrollY && window.scrollY !== 0) ||
      Math.abs(window.scrollY - this.pos.scrollY) < 50
    ) {
      return
    }
    let scrollHeight = 0
    const playerRoot = this.player.root
    if (playerRoot) {
      scrollHeight = parseInt(Util.getCss(playerRoot, 'height'))
    }
    scrollHeight += 0
    this.pos.scrollY = window.scrollY
    if (window.scrollY > scrollHeight + 5) {
      !this.isClose && this.getMini()
    } else if (window.scrollY <= scrollHeight) {
      this.exitMini()
      this.isClose = false
    }
  }
  getMini() {
    const { player, playerConfig } = this
    const target = this.config.target || player.root
    this.lastStyle = {}
    const playerRoot = player.root
    if (playerRoot) {
      Util.addClass(playerRoot, 'xgplayer-mini')
    }
    ;['width', 'height', 'top', 'left'].map((key) => {
      //@ts-ignore
      this.lastStyle[key] = target.style[key]
      target.style[key] = `${this.pos[key]}px`
    })
    if (playerConfig.fluid) {
      target.style['padding-top'] = ''
    }
    this.emit(Events.MINI_STATE_CHANGE, true)
  }

  exitMini() {
    const { player, playerConfig } = this
    const target = this.config.target || player.root
    const playerRoot = player.root
    if (playerRoot) {
      Util.removeClass(playerRoot, 'xgplayer-mini')
    }
    if (this.lastStyle && target.style) {
      Object.keys(this.lastStyle).map((key) => {
        if (target.style[key]) {
          //@ts-ignore
          target.style[key] = this.lastStyle[key]
        }
      })
    }
    //@ts-ignore
    this.lastStyle = null
    if (playerRoot) {
      playerRoot.style.width = '100%'
      playerRoot.style.height = '100%'
      playerRoot.style.top = '0'
      playerRoot.style.left = '0'
      //@ts-ignore
      playerRoot.style['padding-top'] = `${
        //@ts-ignore
        (playerConfig.height * 100) / playerConfig.width
      }%`
    }
    this.emit(Events.MINI_STATE_CHANGE, false)
  }

  destroy() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.unbind(['click', 'touchend'], this.toggleMiniWin)
    this.unbind('.mini-cancel-btn', eventName, this.onCancelClick)
    window.removeEventListener('scroll', this.onScroll)
  }

  render() {
    return `
    <xg-icon class="xgplayer-mini-win" data-state="normal">
      <div class="xgplayer-icon">
      <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 32 32"><path d="M7.5 10.5a2 2 0 012-2h8a2 2 0 012 2v7a2 2 0 01-2 2h-8a2 2 0 01-2-2v-7z" fill="#fff" fill-opacity="0.9"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M14 21.5V23a1 1 0 001 1h7a2 2 0 002-2v-7.5a1 1 0 00-1-1h-1.37v7a1 1 0 01-1 1H14z" fill="#fff" fill-opacity="0.9"></path></svg>
      </div>
       <xg-slider class="xgplayer-slider xgplayer-box-douyin">
       ${this.tipText}
      </xg-slider>
    </xg-icon>`
  }
}

export default miniWin
