/**
 * 定义一个表示视频控制选项的接口
 */
export interface IVideoControl {
  // 是否允许下载视频
  allow_download: boolean
  // 分享类型，具体含义需根据平台文档解释
  share_type: number
  // 是否显示视频进度条
  show_progress_bar: number
  // 草稿视频进度条的显示状态，具体含义需根据平台文档解释
  draft_progress_bar: number
  // 是否允许合拍（Duet）
  allow_duet: boolean
  // 是否允许用户对视频做出反应（React）
  allow_react: boolean
  // 防止下载的类型，具体含义需根据平台文档解释
  prevent_download_type: number
  // 是否允许将视频设置为动态壁纸
  allow_dynamic_wallpaper: boolean
  // 定时器状态，具体含义需根据平台文档解释
  timer_status: number
  // 是否允许使用音乐
  allow_music: boolean
  // 是否允许拼接视频（Stitch）
  allow_stitch: boolean
  // 是否允许使用Douplus功能
  allow_douplus: boolean
  // 是否允许分享视频
  allow_share: boolean
  // 分享按钮是否置灰，表示是否禁用分享
  share_grayed: boolean
  // 是否忽略视频可见性设置而允许下载
  download_ignore_visibility: boolean
  // 是否忽略视频可见性设置而允许合拍
  duet_ignore_visibility: boolean
  // 是否忽略视频可见性设置而允许分享
  share_ignore_visibility: boolean
  // 下载信息，包含下载权限级别和失败信息
  download_info: {
    level: number
    fail_info: {
      code: number
      reason: string
      msg: string
    }
  }
  // 合拍信息，包含合拍权限级别和失败信息
  duet_info: {
    level: number
    fail_info: {
      code: number
      reason: string
    }
  }
  // 是否允许录制视频
  allow_record: boolean
  // 禁用录制的原因，如果为空字符串表示没有禁用原因
  disable_record_reason: string
}
