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
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" focusable="false" style="font-size:32px"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.373 9.83142C16.2869 9.83142 17.6218 9.83355 18.6289 9.96895C19.6073 10.1005 20.1254 10.3411 20.4944 10.7101C20.8634 11.0791 21.104 11.5972 21.2355 12.5756C21.3129 13.1512 21.3468 13.8337 21.3616 14.6703H21.8778C22.4697 14.6703 22.9541 14.6703 23.3622 14.6815C23.3467 13.7768 23.3091 12.9887 23.2177 12.3091C23.0563 11.1089 22.7111 10.0984 21.9086 9.29589C21.106 8.49334 20.0955 8.14814 18.8954 7.98679C17.7394 7.83138 16.2697 7.8314 14.4463 7.83142H14.4463H14.4462L14.373 7.83142H13.123L13.0738 7.83142C11.8299 7.83141 10.8268 7.8314 10.0186 7.9069C9.18538 7.98473 8.45861 8.14955 7.80253 8.54278C7.09726 8.96551 6.50713 9.55564 6.08441 10.2609C5.69117 10.917 5.52636 11.6438 5.44852 12.477C5.37303 13.2852 5.37303 14.2883 5.37305 15.5321V15.5321V15.5322V15.5814V15.6307V15.6307V15.6307C5.37303 16.8745 5.37303 17.8777 5.44852 18.6858C5.52636 19.5191 5.69117 20.2459 6.08441 20.9019C6.50713 21.6072 7.09726 22.1973 7.80253 22.6201C8.45861 23.0133 9.18539 23.1781 10.0186 23.256C10.8268 23.3314 11.8299 23.3314 13.0738 23.3314H13.1231H15.3051C15.1699 22.8486 15.1391 22.2571 15.1321 21.3314H13.1231C11.8184 21.3314 10.9089 21.3304 10.2047 21.2646C9.51491 21.2002 9.12413 21.0805 8.83074 20.9046C8.40758 20.651 8.0535 20.2969 7.79986 19.8737C7.62401 19.5803 7.50428 19.1896 7.43985 18.4998C7.37407 17.7956 7.37305 16.8861 7.37305 15.5814C7.37305 14.2768 7.37407 13.3672 7.43985 12.663C7.50428 11.9733 7.62401 11.5825 7.79986 11.2891C8.0535 10.866 8.40758 10.5119 8.83074 10.2582C9.12413 10.0824 9.51491 9.96266 10.2047 9.89823C10.9089 9.83244 11.8184 9.83142 13.123 9.83142H14.373ZM20.0756 16.6703L20.13 16.6703H22.627L22.6814 16.6703C23.1054 16.6702 23.5176 16.6701 23.8575 16.7158C24.2407 16.7673 24.678 16.8929 25.0412 17.2561C25.4044 17.6193 25.5299 18.0566 25.5814 18.4398C25.6271 18.7797 25.627 19.1918 25.627 19.6159L25.627 19.6703V21.1687L25.627 21.2231C25.627 21.6471 25.6271 22.0593 25.5814 22.3992C25.5299 22.7824 25.4044 23.2197 25.0412 23.5829C24.678 23.9461 24.2407 24.0716 23.8575 24.1231C23.5176 24.1688 23.1055 24.1688 22.6814 24.1687H22.6814L22.627 24.1687H20.13L20.0756 24.1687H20.0755C19.6515 24.1688 19.2394 24.1688 18.8995 24.1231C18.5163 24.0716 18.079 23.9461 17.7158 23.5829C17.3526 23.2197 17.2271 22.7824 17.1755 22.3992C17.1298 22.0593 17.1299 21.6472 17.13 21.2231V21.2231V21.2231L17.13 21.1687V19.6703L17.13 19.6159V19.6159V19.6159C17.1299 19.1918 17.1298 18.7797 17.1755 18.4398C17.2271 18.0566 17.3526 17.6193 17.7158 17.2561C18.079 16.8929 18.5163 16.7673 18.8995 16.7158C19.2394 16.6701 19.6515 16.6702 20.0756 16.6703H20.0756H20.0756ZM19.1587 18.699L19.1577 18.7063C19.1321 18.8965 19.13 19.1706 19.13 19.6703V21.1687C19.13 21.6683 19.1321 21.9425 19.1577 22.1327L19.1587 22.14L19.166 22.141C19.3562 22.1665 19.6303 22.1687 20.13 22.1687H22.627C23.1266 22.1687 23.4008 22.1665 23.591 22.141L23.5983 22.14L23.5993 22.1327C23.6248 21.9425 23.627 21.6683 23.627 21.1687V19.6703C23.627 19.1706 23.6248 18.8965 23.5993 18.7063L23.5983 18.699L23.591 18.698C23.4008 18.6724 23.1266 18.6703 22.627 18.6703H20.13C19.6303 18.6703 19.3562 18.6724 19.166 18.698L19.1587 18.699ZM9.67161 12.8317L10.8737 11.6296L13.5848 14.3407V13.0946V12.2446H15.2848V13.0946V14.3946L15.2848 14.4434C15.2848 14.8726 15.2849 15.2755 15.2406 15.6051C15.1913 15.9717 15.0736 16.372 14.7429 16.7027C14.4122 17.0334 14.0119 17.1511 13.6453 17.2004C13.3157 17.2447 12.9128 17.2447 12.4836 17.2446L12.4348 17.2446H11.1348H10.2848V15.5446H11.1348H12.3845L9.67161 12.8317Z" fill="currentColor"></path></svg>
      </div>
       <xg-slider class="xgplayer-slider xgplayer-box-douyin">
       ${this.tipText}
      </xg-slider>
    </xg-icon>`
  }
}

export default miniWin
