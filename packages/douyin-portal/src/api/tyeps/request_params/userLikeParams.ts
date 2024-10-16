/**
 * @description 获取用户视频列表
 * @param {String} sec_user_id 用户id
 * @param {Number} max_cursor 游标
 * @param {Number} count 每页数量
 * @param {Number}  min_cursor 最小游标
 */
export interface IuserLikeParams {
  // 用户ID
  sec_user_id: string
  // 游标
  max_cursor: number
  // 数量
  count: number
  // 最小游标
  min_cursor: number
}
