import { Plugin, Util, Events, type IPluginOptions } from 'xgplayer'
import { videosCtrolStore } from '@/stores/videos-control'
import './index.scss'

const { POSITIONS } = Plugin

class automaticContinuous extends Plugin {
  private store: ReturnType<typeof videosCtrolStore> | null = null

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
  }

  afterCreate() {
    this.store = videosCtrolStore()
    this.updateBtn()
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.toggleAuto)
    this.on(Events.ENDED, this.handleVideoEnded)
  }

  private handleVideoEnded = () => {
    if (this.store?.isAutoContinuous) {
      this.store.handleNext()
    }
  }

  toggleAuto = () => {
    if (this.store) {
      this.store.isAutoContinuous = !this.store.isAutoContinuous
      this.updateBtn()
      this.emit('autoPlayChange', this.store.isAutoContinuous)
    }
  }

  updateBtn() {
    const switchButton = this.find('.xgplayer-autoplay-setting .xg-switch')
    if (this.store?.isAutoContinuous) {
      switchButton?.classList.add('xg-switch-checked')
    } else {
      switchButton?.classList.remove('xg-switch-checked')
    }
  }

  destroy() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.unbind(eventName, this.toggleAuto)
    this.off(Events.ENDED, this.handleVideoEnded)
  }

  render() {
    const isChecked = this.store?.isAutoContinuous ?? true
    return `<xg-icon class="xgplayer-autoplay-setting automatic-continuous" data-state="normal">
    <div class="xgplayer-icon" data-e2e="video-player-auto-play" data-e2e-state="video-player-auto-playing">
        <div class="xgplayer-setting-label">
            <button aria-checked="true" class="xg-switch${
              isChecked ? ' xg-switch-checked' : ''
            }"  aria-labelledby="xg-switch-pip" type="button">
               <span class="xg-switch-inner"></span>
            </button>
        <span class="xgplayer-setting-title">连播</span>
        </div>
    </div>
    <div class="xgTips">
      <span>${isChecked ? '关闭' : '开启'}自动连播</span>
      <span class="shortcutKey">K</span>
    </div>
    </xg-icon>`
  }
}

export default automaticContinuous
