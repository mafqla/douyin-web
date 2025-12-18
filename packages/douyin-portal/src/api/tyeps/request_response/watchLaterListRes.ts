import type { IAwemeInfo } from '../common/aweme'

export interface IWatchLaterListRes {
  // 是否还有更多
  has_more: boolean
  // 视频列表
  items: IAwemeInfo[]
  // 无效的视频ID列表
  invalid_item_ids: string[]
  // 状态码
  status_code?: number
  //状态信息
  status_msg: string
  //游标
  offset: number
}
