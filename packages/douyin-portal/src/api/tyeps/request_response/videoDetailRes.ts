import type { IAwemeInfo } from '../common/aweme'

export interface IVideoDetailRes {
  /**
   * @description 状态码
   */
  status_code: number

  /**
   * @description 视频信息
   */
  aweme_detail: IAwemeInfo
}

export interface IComentPermission {
  can_comment: boolean
  comment_permission_status: number
  item_detail_entry: boolean
  press_entry: boolean
  toast_guide: boolean
}

export interface IVideoDetailStatistics {
  admire_count: number
  aweme_id: string
  collect_count: number
  comment_count: number
  digg_count: number
  play_count: number
  share_count: number
}

interface VisualSearchInfo {
  // 这里没有具体的属性，可以留空或者根据实际需要添加属性
}

interface IXiguaBaseInfo {
  item_id: number
  star_altar_order_id: number
  star_altar_type: number
  status: number
}
