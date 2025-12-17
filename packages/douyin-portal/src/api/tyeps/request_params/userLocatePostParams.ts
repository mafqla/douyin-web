/**
 * @description 获取用户视频列表
 * @param {String} sec_user_id 用户id
 * @param {String} max_cursor 游标
 * @param {Number} count 每页数量
 * @param {Number} locate_item_id 视频id
 * @param {Boolean} locate_query 是否定位 默认 true
 */
export interface IuserLocatePostParams {
  // 用户ID
  sec_user_id: string
  // 游标
  max_cursor: string
  // 数量
  count: number
  locate_query: boolean
  locate_item_id?: string
  // 定位项游标（第二次调用时使用）
  locate_item_cursor?: number
}
