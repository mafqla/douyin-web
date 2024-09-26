import type { IAwemeInfo } from '../common/aweme'

export interface IrecommendFeedRes {
  /**
   * @description 状态码
   */
  status_code: number
  /**
   * @description 状态信息
   */
  // status_msg: string
  /**
   * @description 数据
   */
  aweme_list: IAwemeInfo[]
  /**
   * @description 是否还有更多
   */
  has_more: number
  // BaseResp: {
  //   StatusMessage: string
  //   StatusCode: number
  // }
}
