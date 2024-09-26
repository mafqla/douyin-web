import { Plugin, Util } from 'xgplayer'
import './index.scss'
import type { IPluginOptions } from 'xgplayer/es/plugin/plugin'

const { POSITIONS } = Plugin

class watchLater extends Plugin {
  hasShownMessage: boolean
  static get pluginName() {
    return 'watchLater'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_RIGHT,
      index: 5.6,
      className: 'xgplayer-watch-later',
      text: '稍后再看'
    }
  }

  constructor(args: IPluginOptions | undefined) {
    super(args)
    this.hasShownMessage = false
  }

  afterCreate() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.onClick)
  }
  onClick = () => {
    if (!this.hasShownMessage) {
      this.hasShownMessage = true
      const text = '添加成功，可在-我的- 稍后再看中查看'
      this.emit('watch-later', text)
    } else {
      const textEd = '已添加过该视频'
      this.emit('watch-later', textEd)
    }
  }

  destroy() {
    // this.unbind('click', this.onClick)
    // 播放器销毁的时候一些逻辑
  }

  render() {
    return `<xg-icon class="xgplayer-watch-later" data-state="normal">
    <div class="xgplayer-watch-later-item xgplayer-icon" > 
      <svg width="32" height = "32" fill = "none" xmlns = "http://www.w3.org/2000/svg" class="" viewBox = "0 0 32 32" > 
      <path fill-rule="evenodd" clip-rule="evenodd" d = "M8.97 8.73C7.882 8.73 7 9.72 7 10.94v10.58c0 1.22.882 2.21 1.97 2.21h8.254A5.5 5.5 0 0 1 23 15.59v-4.65c0-1.22-.882-2.21-1.97-2.21H8.97zm4.723 10.464l3.822-2.451a1.025 1.025 0 0 0 0-1.743l-3.822-2.451c-.724-.464-1.693.035-1.693.871v4.902c0 .837.97 1.336 1.693.872z" fill = "#fff" fill-opacity=".9" > </path>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M22 25a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm.4-6a.9.9 0 1 0-1.8 0v2.5a.9.9 0 0 0 .9.9H24a.9.9 0 1 0 0-1.8h-1.6V19z" fill="#fff" fill-opacity=".9"></path >
      </svg>
    </div>
      <div class="xgTips"> 
        <span>${this.config.text}</span>
        <span class="shortcutKey">L</span>
      </div>
     </xg-icon>`
  }
}

export default watchLater
