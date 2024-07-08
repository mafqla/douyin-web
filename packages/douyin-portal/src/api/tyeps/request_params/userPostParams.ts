

export interface IuserPostParams {
  // 用户ID
  sec_user_id: string
  // 游标
  max_cursor: number
  // 数量
  count: number
  need_time_list?: []
  time_list_query?: []
}