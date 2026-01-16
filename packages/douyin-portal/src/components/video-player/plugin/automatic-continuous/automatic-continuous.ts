import { Plugin, Util, Events, type IPluginOptions } from 'xgplayer'
import { playerSettingStore } from '@/stores/player-setting'
import { videosCtrolStore } from '@/stores/videos-control'
import './index.scss'

const { POSITIONS } = Plugin

class automaticContinuous extends Plugin {
  private store: ReturnType<typeof playerSettingStore> | null = null
  private videoControl: ReturnType<typeof videosCtrolStore> | null = null

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
    this.store = playerSettingStore()
    this.videoControl = videosCtrolStore()
    this.updateBtn()
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.toggleAuto)
    this.on(Events.ENDED, this.handleVideoEnded)
  }

  private handleVideoEnded = () => {
    if (this.store?.isAutoContinuous) {
      this.videoControl?.handleNext()
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
    // 直接从 store 获取最新值，确保状态同步
    const isChecked = playerSettingStore().isAutoContinuous
    if (isChecked) {
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
    // 直接调用 store 获取最新状态，因为 render() 在 afterCreate() 之前执行
    const isChecked = playerSettingStore().isAutoContinuous
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
