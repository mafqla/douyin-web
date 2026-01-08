import type { IAwemeInfo } from '../common/aweme'

export interface IUserPostRes {
  //状态码
  status_code: number
  // 最小游标（向上加载用）
  min_cursor: string
  // 最大游标（向下加载用）
  max_cursor: string
  // 是否还有更多（向下）
  has_more: boolean
  // 是否还有更多（向上）
  forward_has_more?: number
  // 视频列表
  aweme_list: IAwemeInfo[]
  // 时间列表（用于日期筛选，格式如 "2025·12"）
  time_list: string[]
  // 请求项游标
  request_item_cursor: number
  post_serial: number
  replace_series_cover: boolean
  // 是否有定位项
  has_locate_item?: boolean
  // 定位项是否可用
  locate_item_available?: boolean
  // 定位项游标
  locate_item_cursor?: number
  // 定位来源
  locate_from?: number
}
