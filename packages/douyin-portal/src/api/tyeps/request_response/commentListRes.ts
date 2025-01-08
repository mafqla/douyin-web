import type { IUser } from '../common/user'

export interface IComments {
  cid: string // 评论ID
  text: string // 评论文本
  aweme_id: string // 相关视频或内容的ID
  create_time: number // 评论创建时间的时间戳
  digg_count: number // 点赞数
  status?: number // 评论状态
  user: IUser // 发表评论的用户信息
  reply_id?: string // 回复的评论ID，如果是直接评论则为'0'
  user_digged?: number // 用户是否点赞，1表示点赞，0表示未点赞
  reply_comment?: any // 回复的评论内容，如果为空则为null
  text_extra: TextExtraItem[] // 文本额外信息，具体结构根据实际数据确定
  label_text?: string // 标签文本
  label_type?: number // 标签类型
  reply_comment_total?: number // 该评论下的回复总数
  reply_to_reply_id?: string // 回复的回复ID，如果是直接评论的回复则为'0'
  reply_to_username?: string // 回复的用户名
  reply_to_userid?: string // 回复的用户ID
  reply_to_user_sec_id?: string // 回复的用户sec_id
  is_author_digged?: boolean // 作者是否点赞了这条评论
  stick_position?: number // 置顶位置
  user_buried?: boolean // 用户是否屏蔽了这条评论
  label_list?: any[] // 标签列表，具体结构根据实际数据确定
  is_hot?: boolean // 是否是热门评论
  text_music_info?: any // 与文本相关的音乐信息，如果为空则为null
  image_list?: ImageItem[] // 图片列表，具体结构根据实际数据确定
  sticker?: Sticker // 动图列表
  is_note_comment?: number // 是否是笔记评论
  ip_label: string // IP标签，表示评论者的位置信息
  can_share?: boolean // 是否可以分享
  item_comment_total?: number // 该项目下的总评论数
  level?: number // 评论等级
  video_list?: any[] // 视频列表，具体结构根据实际数据确定
  sort_tags?: string // 排序标签，JSON字符串
  is_user_tend_to_reply?: boolean // 用户是否倾向于回复这条评论
  content_type?: number // 内容类型
  is_folded: boolean // 是否折叠
}

export interface ICommentListRes {
  status_code: number
  comments: IComments[]
  cursor: number
  has_more: number
  reply_style: number
  total: number
  extra: {
    now: number
    fatal_item_ids: null
  }
  log_pb: {
    impr_id: string
  }
  hotsoon_filtered_count: number
  user_commented: number
  fast_response_comment: {
    constant_response_words: string[]
    timed_response_words: string[]
  }
  comment_config: object
  general_comment_config: object
  show_management_entry_point: number
  hotsoon_text: string
  folded_comment_count: number
}

export interface ICommentReplyRes {
  status_code: number
  comments: IComments[]
  cursor: number
  has_more: number
  total: number
  extra: {
    now: number
    fatal_item_ids: null
  }
  log_pb: {
    impr_id: string
  }
}

export interface ImageURLs {
  uri: string
  url_list: string[]
  width: number
  height: number
}

export interface ImageItem {
  origin_url: ImageURLs
  crop_url: ImageURLs
  thumb_url: ImageURLs
  medium_url: ImageURLs
  download_url: ImageURLs
}

export interface TextExtraItem {
  start: number // 起始索引，表示在文本中特殊的部分开始的位置
  end: number // 结束索引，表示在文本中特殊的部分结束的位置
  user_id: string // 用户ID，标识生成特殊文本的用户
  type: number // 类型，表示文本额外信息的类型（例如，链接、用户提及等）
  hashtag_name?: string // 话题名称，如果有的话（此属性可能是可选的，取决于type）
  hashtag_id?: string // 话题ID，如果有的话（此属性可能是可选的，取决于type）
  sec_uid: string // 安全用户ID，可能用于内容安全或权限管理
}


export interface Sticker {
  animate_url: ImageURLs
  author_sec_uid: string
  height: number
  id: number
  id_str: string
  origin_package_id: number
  static_url: ImageURLs
  sticker_type: number
  width: number
}