/**
 * @description 获取用户视频列表
 * @param {String} sec_user_id 用户id
 * @param {String} max_cursor 游标
 * @param {Number} count 每页数量
 * @param {Number} locate_item_id 视频id
 * @param {Number} need_time_list 是否需要时间列表 0 | 1
 * @param {Boolean} locate_query 是否定位 默认 false
 * @param {String} forward_end_cursor 前一个视频的游标
 */
export interface IuserPostParams {
  // 用户ID
  sec_user_id: string
  // 游标
  max_cursor: string
  // 数量
  count: number
  time_list_query?: []
  need_time_list?: number
  locate_query: boolean
  locate_item_id?: string
  forward_end_cursor?: string
}
