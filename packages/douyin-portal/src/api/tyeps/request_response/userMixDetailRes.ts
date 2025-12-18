import type { IAwemeInfo } from '../common/aweme'
import type { IMixInfo } from '../common/mix'

export interface IUserMixDetailRes {
  // 状态码
  status_code: number
  // 是否还有更多
  has_more: boolean
  // 分页游标
  cursor: number
  // 合集下的视频列表
  aweme_list: IAwemeInfo[]
  // 合集信息
  mix_info: IMixInfo
}
