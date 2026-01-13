/**
 * @description: 获取关注列表请求参数
 * @param {string} user_id 用户id
 * @param {string} sec_user_id 用户id
 * @param {number} count 获取数量 20
 * @param {number} source_type 获取类型 1最近关注 3最早关注 4 综合排序
 * @param {number} offset 偏移量
 * @param {number} min_time 最小时间
 * @param {number} max_time 最大时间 当前的时间戳
 * @param {number} is_top 是否置顶 1
 */

export interface IFollowingParams {
  user_id: string
  sec_user_id: string
  count: number
  source_type?: number
  offset: number
  min_time: number
  max_time: number
  is_top?: number
}

/**
 * @description: 获取粉丝列表请求参数
 * @param {string} user_id 用户id
 * @param {string} sec_user_id 用户id
 * @param {number} count 获取数量 20
 * @param {number} offset 偏移量
 * @param {number} min_time 最小时间
 * @param {number} max_time 最大时间 当前的时间戳
 */

export interface IFollowerParams {
  user_id: string
  sec_user_id: string
  count: number
  source_type?: number
  offset: number
  min_time: number
  max_time: number
}
