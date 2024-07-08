import type { IAwemeInfo } from '../common/aweme'

export interface IUserPostRes {
  //状态码
  status_code: number
  // 最小游标
  min_cursor: number
  // 最大游标
  max_cursor: number
  // 是否还有更多
  has_more: boolean
  // 视频列表
  aweme_list: IAwemeInfo[]
  // 时间列表
  time_list: []
  request_item_cursor: number
  post_serial: number
  replace_series_cover: boolean
}
