export interface IhomeFeedRes {
  /**
   * @description 状态码
   */
  status_code: number
  /**
   * @description 状态信息
   */
  status_msg: string
  /**
   * @description 数据
   */
  cards: []
  /**
   * @description 是否还有更多
   */
  has_more: number
  BaseResp: {
    StatusMessage: string
    StatusCode: number
  }
}

export interface ICards {
  type: number
  aweme: string
}
