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
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
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
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
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
