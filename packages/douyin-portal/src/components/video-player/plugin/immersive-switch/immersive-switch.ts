import { Plugin, Util, type IPluginOptions } from 'xgplayer'
import { playerSettingStore } from '@/stores/player-setting'
import './index.scss'

const { POSITIONS } = Plugin

class immersiveSwitch extends Plugin {
  private store: ReturnType<typeof playerSettingStore> | null = null

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
    this.store = playerSettingStore()
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
    // 直接从 store 获取最新值，确保状态同步
    const isChecked = playerSettingStore().isImmersive
    if (isChecked) {
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
    // 直接调用 store 获取最新状态，因为 render() 在 afterCreate() 之前执行
    const isChecked = playerSettingStore().isImmersive
    return `<xg-icon class="xgplayer-immersive-switch-setting immersive-switch" data-state="normal">
    <div class="xgplayer-icon">
      <div class="xgplayer-setting-label">
        <button aria-checked="true" class="xg-switch${isChecked ? ' xg-switch-checked' : ''
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
