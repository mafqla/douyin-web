import { Plugin, Util, type IPluginOptions } from 'xgplayer'
import './index.scss'

const { POSITIONS } = Plugin

class immersiveSwitch extends Plugin {
  immersiveState: boolean
  //是否添加

  static get pluginName() {
    return 'immersiveSwitch'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 8,
      className: 'xgplayer-immersive-switch-setting',
      immersiveState: false // 初始状态
    }
  }

  constructor(args: IPluginOptions) {
    super(args)
    this.immersiveState = this.playerConfig?.immersiveState
  }

  afterCreate() {
    this.updateButtonClass()
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.toggleImmersive)
  }

  // 切换清屏状态
  toggleImmersive = () => {
    this.immersiveState = !this.immersiveState
    this.updateButtonClass()
    console.log(this.immersiveState)
    this.emit('immersiveSwitchChange', this.immersiveState)
  }

  // 更新按钮的类来控制样式
  updateButtonClass() {
    const switchButton = this.find(
      '.xgplayer-immersive-switch-setting .xg-switch'
    )
    if (this.immersiveState) {
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
    return `<xg-icon class="xgplayer-immersive-switch-setting immersive-switch" data-state="normal">
    <div class="xgplayer-icon">
      <div class="xgplayer-setting-label">
        <button  aria-checked="true" class="xg-switch${
          this.immersiveState ? ' xg-switch-checked' : ''
        }"  
        aria-labelledby="xg-switch-pip" type="button">
          <span class="xg-switch-inner"></span>
        </button>
        <span class="xgplayer-setting-title">清屏</span>
      </div>
    </div>
    <div class="xgTips">
      <span>清屏</span>
      <span class="shortcutKey">J</span>
    </div>
    </xg-icon>`
  }
}

export default immersiveSwitch
