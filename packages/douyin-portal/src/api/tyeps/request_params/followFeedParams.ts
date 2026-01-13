/**
 * @description: 获取关注视频流请求参数
 * @param {number} cursor 游标，开始为0，下一次为接口返回的cursor
 * @param {number} level 级别，默认为1
 * @param {number} count 获取数量，默认为20
 * @param {number} pull_type 拉取类型，默认为18
 * @param {number} refresh_type 刷新类型，默认为18
 * @param {string} aweme_ids 视频ID列表，默认为空
 * @param {string} room_ids 直播间ID列表，默认为空
 */
export interface IFollowFeedParams {
  /**
   * @description 游标，开始为0，下一次为接口返回的cursor
   */
  cursor: number
  /**
   * @description 级别，默认为1
   */
  level: number
  /**
   * @description 获取数量，默认为20
   */
  count: number
  /**
   * @description 拉取类型，默认为18
   */
  pull_type: number
  /**
   * @description 刷新类型，默认为18
   */
  refresh_type?: number
  /**
   * @description 视频ID列表，默认为空
   */
  aweme_ids?: string
  /**
   * @description 直播间ID列表，默认为空
   */
  room_ids?: string
}
