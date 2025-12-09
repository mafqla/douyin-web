import type { IAwemeInfo } from '../common/aweme'

export interface IUserCollectFloderDetail {
  //状态码
  status_code: number
  // 游标
  cursor: string
  // 是否还有更多
  has_more: number
  // 视频列表
  aweme_list: IAwemeInfo[]
  //用户id
  uid: string
  sec_uid: string
}
