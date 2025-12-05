import { Plugin, Util, type IPluginOptions } from 'xgplayer'
import { videosCtrolStore } from '@/stores/videos-control'
import './index.scss'

const { POSITIONS } = Plugin

class immersiveSwitch extends Plugin {
  private store: ReturnType<typeof videosCtrolStore> | null = null

  static get pluginName() {
    return 'immersiveSwitch'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 8,
      className: 'xgplayer-immersive-switch-setting',
      immersiveState: false
    }
  }

  constructor(args: IPluginOptions) {
    super(args)
  }

  afterCreate() {
    this.store = videosCtrolStore()
    this.updateButtonClass()
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.toggleImmersive)
  }

  toggleImmersive = () => {
    if (this.store) {
      this.store.isImmersive = !this.store.isImmersive
      this.updateButtonClass()
      this.emit('immersiveStateChange', this.store.isImmersive)
    }
  }

  updateButtonClass() {
    const switchButton = this.find(
      '.xgplayer-immersive-switch-setting .xg-switch'
    )
    if (this.store?.isImmersive) {
      switchButton?.classList.add('xg-switch-checked')
    } else {
      switchButton?.classList.remove('xg-switch-checked')
    }
  }

  destroy() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.unbind(eventName, this.toggleImmersive)
  }

  render() {
    const isChecked = this.store?.isImmersive ?? false
    return `<xg-icon class="xgplayer-immersive-switch-setting immersive-switch" data-state="normal">
    <div class="xgplayer-icon">
      <div class="xgplayer-setting-label">
        <button aria-checked="true" class="xg-switch${
          isChecked ? ' xg-switch-checked' : ''
        }"  
        aria-labelledby="xg-switch-pip" type="button">
          <span class="xg-switch-inner"></span>
        </button>
        <span class="xgplayer-setting-title">清屏</span>
      </div>
    </div>
    <div class="xgTips">
      <span>${isChecked ? '退出清屏' : '清屏'}</span>
      <span class="shortcutKey">J</span>
    </div>
    </xg-icon>`
  }
}

export default immersiveSwitch
