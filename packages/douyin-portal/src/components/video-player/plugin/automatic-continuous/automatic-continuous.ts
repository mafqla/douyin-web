import { Plugin, Util, type IPluginOptions } from 'xgplayer'
import './index.scss'

const { POSITIONS } = Plugin

class automaticContinuous extends Plugin {
  automatic: boolean

  static get pluginName() {
    return 'automaticContinuous'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 9,
      className: 'xgplayer-autoplay-setting',
      automatic: true
    }
  }

  constructor(args: IPluginOptions) {
    super(args)
    this.automatic = this.playerConfig?.automatic
  }

  afterCreate() {
    this.updateBtn()
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.toggleAuto)
  }

  toggleAuto = () => {
    this.automatic = !this.automatic
    this.updateBtn()
    console.log(this.automatic)
    this.emit('atuoPlayChange', this.automatic)
  }
  updateBtn() {
    const switchButton = this.find('.xgplayer-autoplay-setting .xg-switch')
    if (this.automatic) {
      switchButton?.classList.add('xg-switch-checked')
    } else {
      switchButton?.classList.remove('xg-switch-checked')
    }
  }
  destroy() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.unbind(eventName, this.toggleAuto)
  }

  render() {
    return `<xg-icon class="xgplayer-autoplay-setting automatic-continuous" data-state="normal">
    <div class="xgplayer-icon" data-e2e="video-player-auto-play" data-e2e-state="video-player-auto-playing">
        <div class="xgplayer-setting-label">
            <button aria-checked="true" class="xg-switch${
              this.automatic ? ' xg-switch-checked' : ''
            }"  aria-labelledby="xg-switch-pip" type="button">
               <span class="xg-switch-inner"></span>
            </button>
        <span class="xgplayer-setting-title">连播</span>
        </div>
    </div>
    <div class="xgTips">
      <span>关闭自动连播</span>
      <span class="shortcutKey">K</span>
    </div>
    </xg-icon>`
  }
}

export default automaticContinuous
