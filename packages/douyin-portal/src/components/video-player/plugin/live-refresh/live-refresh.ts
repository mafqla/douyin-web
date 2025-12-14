import { Plugin, Util, type IPluginOptions } from 'xgplayer'
import './index.scss'

const { POSITIONS } = Plugin

/**
 * 直播刷新插件
 * 用于刷新直播流，解决黑屏、卡顿等问题
 * 仅在直播模式下启用
 * 快捷键：R
 */
class LiveRefresh extends Plugin {
  private isRefreshing = false
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null

  static get pluginName() {
    return 'liveRefresh'
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_LEFT,
      index: 1, // 放在播放按钮旁边
      className: 'xgplayer-live-refresh'
    }
  }

  constructor(args: IPluginOptions) {
    super(args)
  }

  afterCreate() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.bind(eventName, this.handleRefresh)

    // 添加键盘快捷键监听
    this.keydownHandler = this.handleKeydown.bind(this)
    document.addEventListener('keydown', this.keydownHandler)
  }

  /**
   * 处理键盘事件
   */
  handleKeydown(e: KeyboardEvent) {
    // 按下 R 键刷新
    if (e.key === 'r' || e.key === 'R') {
      // 忽略输入框中的按键
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      e.preventDefault()
      this.refresh()
    }
  }

  /**
   * 处理刷新点击
   */
  handleRefresh = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    if (this.isRefreshing) return

    this.refresh()
  }

  /**
   * 执行刷新操作
   */
  refresh = () => {
    if (this.isRefreshing) return

    this.isRefreshing = true
    this.updateRefreshingState(true)

    const { player } = this
    if (!player) {
      this.isRefreshing = false
      this.updateRefreshingState(false)
      return
    }

    // 获取当前播放状态
    const wasPlaying = !player.paused

    // 保存当前 URL
    const currentUrl = player.src

    // 重新加载视频
    try {
      // 方法1：直接重新设置 src
      player.src = currentUrl

      // 如果之前在播放，则继续播放
      if (wasPlaying) {
        player.play().catch(() => {
          // 忽略自动播放失败
        })
      }

      // 触发刷新事件
      this.emit('liveRefresh')

      console.log('[LiveRefresh] 直播流已刷新')
    } catch (error) {
      console.error('[LiveRefresh] 刷新失败:', error)
    }

    // 延迟恢复按钮状态
    setTimeout(() => {
      this.isRefreshing = false
      this.updateRefreshingState(false)
    }, 1500)
  }

  /**
   * 更新刷新中状态
   */
  updateRefreshingState(isRefreshing: boolean) {
    const icon = this.find('.refresh-icon')
    if (isRefreshing) {
      icon?.classList.add('refreshing')
    } else {
      icon?.classList.remove('refreshing')
    }
  }

  destroy() {
    const eventName = Util.checkTouchSupport() ? 'touchend' : 'click'
    this.unbind(eventName, this.handleRefresh)

    // 移除键盘事件监听
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler)
      this.keydownHandler = null
    }
  }

  render() {
    return `<xg-icon class="xgplayer-live-refresh" data-state="normal">
      <div class="xgplayer-icon refresh-btn">
        <div class="refresh-icon">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.932 16.444c0-4.687-3.89-8.444-8.634-8.444a8.679 8.679 0 0 0-7.207 3.79v-1.558a.99.99 0 0 0-1.98 0v4.038c0 .547.444.99.99.99h4.038a.99.99 0 0 0 0-1.98h-1.646c1.137-1.963 3.304-3.3 5.804-3.3 3.7 0 6.655 2.918 6.655 6.464 0 3.547-2.956 6.465-6.655 6.465-2.963 0-5.459-1.88-6.326-4.453a.99.99 0 0 0-1.876.633c1.138 3.38 4.39 5.8 8.202 5.8 4.746 0 8.635-3.758 8.635-8.445z"
              fill="#fff"
            ></path>
          </svg>
        </div>
      </div>
      <div class="xgTips">
        <span>刷新直播</span>
        <span class="shortcutKey">R</span>
      </div>
    </xg-icon>`
  }
}

export default LiveRefresh
