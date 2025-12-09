// 图片信息
export interface ICollectsCover {
  // 图片资源标识
  uri: string
  // 图片URL列表
  url_list: string[]
}

// 头像信息
export interface ICollectsAvatar {
  // 头像高度
  height: number
  // 头像资源标识
  uri: string
  // 头像URL列表
  url_list: string[]
  // 头像宽度
  width: number
}

// 收藏夹用户信息
export interface ICollectsUserInfo {
  // 大尺寸头像
  avatar_larger: ICollectsAvatar
  // 中等尺寸头像
  avatar_medium: ICollectsAvatar
  // 缩略头像
  avatar_thumb: ICollectsAvatar
  // 用户昵称
  nickname: string
  // 用户ID
  uid: string
}

// 收藏夹项目
export interface ICollectsItem {
  // 应用ID
  app_id: number
  // 收藏夹封面
  collects_cover: ICollectsCover
  // 收藏夹ID（数字类型，可能存在精度问题）
  collects_id: number
  // 收藏夹ID（字符串类型，推荐使用）
  collects_id_str: string
  // 收藏夹名称
  collects_name: string
  // 创建时间（时间戳，秒）
  create_time: number
  // 关注状态
  follow_status: number
  // 被关注数量
  followed_count: number
  // 是否正常状态
  is_normal_status: boolean
  // 项目类型
  item_type: number
  // 最后收藏时间（时间戳，秒）
  last_collect_time: number
  // 播放次数
  play_count: number
  // 西西里收藏夹封面列表
  sicily_collects_cover_list: string[] | null
  // 状态标识
  states: number
  // 状态
  status: number
  // 系统类型
  system_type: number
  // 收藏夹内视频总数
  total_number: number
  // 用户ID（数字类型）
  user_id: number
  // 用户ID（字符串类型）
  user_id_str: string
  // 用户信息
  user_info: ICollectsUserInfo
}

// 用户收藏夹列表响应
export interface IUserCollectsListRes {
  // 收藏夹列表
  collects_list: ICollectsItem[]
  // 状态码
  status_code: number
  // 收藏夹总数
  total_number: number
  // 分页游标
  cursor: string
  // 是否还有更多
  has_more: boolean
}
