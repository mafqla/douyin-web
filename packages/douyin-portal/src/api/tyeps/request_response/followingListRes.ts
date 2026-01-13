/**
 * @description 关注列表响应
 */
export interface IFollowingListRes {
  /**
   * @description 额外信息
   */
  extra?: IFollowingExtra
  /**
   * @description 关注用户列表
   */
  followings: IFollowingUser[]
  /**
   * @description 是否还有更多
   */
  has_more?: boolean
  /**
   * @description 最小时间
   */
  min_time?: number
  /**
   * @description 最大时间
   */
  max_time?: number
  /**
   * @description 总数
   */
  total?: number
  /**
   * @description 状态码
   */
  status_code?: number
}

/**
 * @description 额外信息
 */
export interface IFollowingExtra {
  /**
   * @description 致命项目ID列表
   */
  fatal_item_ids?: string[]
  /**
   * @description 日志ID
   */
  logid?: string
  /**
   * @description 当前时间戳
   */
  now?: number
}

/**
 * @description 关注用户信息
 */
export interface IFollowingUser {
  /**
   * @description 用户ID
   */
  uid: string
  /**
   * @description 安全用户ID
   */
  sec_uid: string
  /**
   * @description 短ID
   */
  short_id?: string
  /**
   * @description 唯一ID
   */
  unique_id?: string
  /**
   * @description 昵称
   */
  nickname: string
  /**
   * @description 签名
   */
  signature?: string
  /**
   * @description 头像URI
   */
  avatar_uri?: string
  /**
   * @description 头像缩略图
   */
  avatar_thumb?: IFollowingAvatar
  /**
   * @description 头像中等尺寸
   */
  avatar_medium?: IFollowingAvatar
  /**
   * @description 头像大尺寸
   */
  avatar_larger?: IFollowingAvatar
  /**
   * @description 头像168x168
   */
  avatar_168x168?: IFollowingAvatar
  /**
   * @description 头像300x300
   */
  avatar_300x300?: IFollowingAvatar
  /**
   * @description 封面图片
   */
  cover_url?: IFollowingAvatar[]
  /**
   * @description 关注状态 0未关注 1已关注 2互相关注
   */
  follow_status?: number
  /**
   * @description 粉丝状态
   */
  follower_status?: number
  /**
   * @description 粉丝数
   */
  follower_count?: number
  /**
   * @description 关注数
   */
  following_count?: number
  /**
   * @description 作品数
   */
  aweme_count?: number
  /**
   * @description 喜欢数
   */
  favoriting_count?: number
  /**
   * @description 获赞总数
   */
  total_favorited?: number
  /**
   * @description 是否已认证
   */
  is_verified?: boolean
  /**
   * @description 认证类型
   */
  verification_type?: number
  /**
   * @description 自定义认证
   */
  custom_verify?: string
  /**
   * @description 企业认证原因
   */
  enterprise_verify_reason?: string
  /**
   * @description 账号认证信息
   */
  account_cert_info?: string
  /**
   * @description 直播状态 0未直播 1直播中
   */
  live_status?: number
  /**
   * @description 直播间ID
   */
  room_id?: number
  /**
   * @description 直播间ID字符串
   */
  room_id_str?: string
  /**
   * @description 是否有未读故事
   */
  has_unread_story?: boolean
  /**
   * @description 故事数量
   */
  story_count?: number
  /**
   * @description 是否是合集用户
   */
  is_mix_user?: boolean
  /**
   * @description 是否是短剧用户
   */
  is_series_user?: boolean | null
  /**
   * @description 是否是明星
   */
  is_star?: boolean
  /**
   * @description 是否是政府媒体VIP
   */
  is_gov_media_vip?: boolean
  /**
   * @description 创建时间
   */
  create_time?: number
  /**
   * @description 星座
   */
  constellation?: number
  /**
   * @description 语言
   */
  language?: string
  /**
   * @description 账号地区
   */
  account_region?: string
  /**
   * @description 是否私密账号
   */
  secret?: number
  /**
   * @description 状态
   */
  status?: number
  /**
   * @description 视频控制
   */
  aweme_control?: IFollowingAwemeControl
  /**
   * @description 分享信息
   */
  share_info?: IFollowingShareInfo
  /**
   * @description 分享二维码URI
   */
  share_qrcode_uri?: string
  /**
   * @description 搜索印象
   */
  search_impr?: {
    entity_id?: string
  }
  /**
   * @description 关注列表次要信息
   */
  following_list_secondary_information_struct?: IFollowingSecondaryInfo
  /**
   * @description 原创音乐人信息
   */
  original_musician?: IOriginalMusician
  /**
   * @description 催更详情
   */
  urge_detail?: {
    user_urged?: number
  }
  /**
   * @description 推荐原因
   */
  recommend_reason?: string
  /**
   * @description 新朋友类型
   */
  new_friend_type?: number
  /**
   * @description 是否被屏蔽
   */
  is_block?: boolean
  /**
   * @description 是否广告假用户
   */
  is_ad_fake?: boolean
  /**
   * @description 是否绑定微博
   */
  is_binded_weibo?: boolean
  /**
   * @description 是否不显示
   */
  is_not_show?: boolean
  /**
   * @description 是否手机已绑定
   */
  is_phone_binded?: boolean
  /**
   * @description 是否有邮箱
   */
  has_email?: boolean
  /**
   * @description 是否有Facebook令牌
   */
  has_facebook_token?: boolean
  /**
   * @description 是否有Twitter令牌
   */
  has_twitter_token?: boolean
  /**
   * @description 是否有YouTube令牌
   */
  has_youtube_token?: boolean
  /**
   * @description 是否有洞察
   */
  has_insights?: boolean
  /**
   * @description 是否有订单
   */
  has_orders?: boolean
  /**
   * @description 是否隐藏搜索
   */
  hide_search?: boolean
  /**
   * @description 是否隐藏位置
   */
  hide_location?: boolean
  /**
   * @description 是否显示附近活跃
   */
  show_nearby_active?: boolean
  /**
   * @description 是否显示图片气泡
   */
  show_image_bubble?: boolean
  /**
   * @description 是否启用附近可见
   */
  enable_nearby_visible?: boolean
  /**
   * @description 是否阻止下载
   */
  prevent_download?: boolean
  /**
   * @description 是否用户已取消
   */
  user_canceled?: boolean
  /**
   * @description 用户模式
   */
  user_mode?: number
  /**
   * @description 用户不看
   */
  user_not_see?: number
  /**
   * @description 用户不显示
   */
  user_not_show?: number
  /**
   * @description 用户周期
   */
  user_period?: number
  /**
   * @description 用户评级
   */
  user_rate?: number
  /**
   * @description 评论设置
   */
  comment_setting?: number
  /**
   * @description 评论过滤状态
   */
  comment_filter_status?: number
  /**
   * @description 合拍设置
   */
  duet_setting?: number
  /**
   * @description 拼接设置
   */
  stitch_setting?: number
  /**
   * @description 反应设置
   */
  react_setting?: number
  /**
   * @description 下载设置
   */
  download_setting?: number
  /**
   * @description 下载提示时间戳
   */
  download_prompt_ts?: number
  /**
   * @description 特殊锁定
   */
  special_lock?: number
  /**
   * @description 需要推荐
   */
  need_recommend?: number
  /**
   * @description 内光屏蔽
   */
  neiguang_shield?: number
  /**
   * @description 屏蔽评论通知
   */
  shield_comment_notice?: number
  /**
   * @description 屏蔽点赞通知
   */
  shield_digg_notice?: number
  /**
   * @description 屏蔽关注通知
   */
  shield_follow_notice?: number
  /**
   * @description 显示性别策略
   */
  show_gender_strategy?: number
  /**
   * @description 签名显示行数
   */
  signature_display_lines?: number
  /**
   * @description 同步到头条
   */
  sync_to_toutiao?: number
  /**
   * @description 商业用户等级
   */
  commerce_user_level?: number
  /**
   * @description 直播协议
   */
  live_agreement?: number
  /**
   * @description 直播协议时间
   */
  live_agreement_time?: number
  /**
   * @description 直播商业
   */
  live_commerce?: boolean
  /**
   * @description 直播验证
   */
  live_verify?: number
  /**
   * @description 权限状态
   */
  authority_status?: number
  /**
   * @description 粉丝请求状态
   */
  follower_request_status?: number
  /**
   * @description 回流页面GID
   */
  reflow_page_gid?: number
  /**
   * @description 回流页面UID
   */
  reflow_page_uid?: number
  /**
   * @description 唯一ID修改时间
   */
  unique_id_modify_time?: number
  /**
   * @description 简历等级
   */
  cv_level?: string
  /**
   * @description 只预测
   */
  ky_only_predict?: number
  /**
   * @description 苹果账号
   */
  apple_account?: number
  /**
   * @description 抖音火山认证
   */
  aweme_hotsoon_auth?: number
  /**
   * @description 抖音火山认证关系
   */
  aweme_hotsoon_auth_relation?: number
  /**
   * @description Facebook过期时间
   */
  fb_expire_time?: number
  /**
   * @description Twitter过期时间
   */
  tw_expire_time?: number
  /**
   * @description YouTube过期时间
   */
  youtube_expire_time?: number
  /**
   * @description Google账号
   */
  google_account?: string
  /**
   * @description Instagram ID
   */
  ins_id?: string
  /**
   * @description Twitter ID
   */
  twitter_id?: string
  /**
   * @description Twitter名称
   */
  twitter_name?: string
  /**
   * @description YouTube频道ID
   */
  youtube_channel_id?: string
  /**
   * @description YouTube频道标题
   */
  youtube_channel_title?: string
  /**
   * @description 微博名称
   */
  weibo_name?: string
  /**
   * @description 微博Schema
   */
  weibo_schema?: string
  /**
   * @description 微博URL
   */
  weibo_url?: string
  /**
   * @description 微博认证
   */
  weibo_verify?: string
  /**
   * @description 学校分类
   */
  school_category?: number
  /**
   * @description 学校ID
   */
  school_id?: string
  /**
   * @description 是否有抖音入口
   */
  with_dou_entry?: boolean
  /**
   * @description 是否有商业入口
   */
  with_commerce_entry?: boolean
  /**
   * @description 是否有店铺入口
   */
  with_shop_entry?: boolean
  /**
   * @description 是否有融合店铺入口
   */
  with_fusion_shop_entry?: boolean
  /**
   * @description 未看作品ID列表
   */
  not_seen_item_id_list_v2?: string[] | null
  /**
   * @description 禁用用户功能列表
   */
  ban_user_functions?: unknown[]
  /**
   * @description 地理围栏
   */
  geofencing?: unknown[]
  /**
   * @description 视频图标
   */
  video_icon?: IFollowingAvatar
}


/**
 * @description 头像信息
 */
export interface IFollowingAvatar {
  /**
   * @description 高度
   */
  height?: number
  /**
   * @description 宽度
   */
  width?: number
  /**
   * @description URI
   */
  uri?: string
  /**
   * @description URL列表
   */
  url_list?: string[]
}

/**
 * @description 视频控制
 */
export interface IFollowingAwemeControl {
  /**
   * @description 是否可以评论
   */
  can_comment?: boolean
  /**
   * @description 是否可以转发
   */
  can_forward?: boolean
  /**
   * @description 是否可以分享
   */
  can_share?: boolean
  /**
   * @description 是否可以显示评论
   */
  can_show_comment?: boolean
}

/**
 * @description 分享信息
 */
export interface IFollowingShareInfo {
  /**
   * @description 分享描述
   */
  share_desc?: string
  /**
   * @description 分享描述信息
   */
  share_desc_info?: string
  /**
   * @description 分享二维码URL
   */
  share_qrcode_url?: IFollowingAvatar
  /**
   * @description 分享标题
   */
  share_title?: string
  /**
   * @description 分享标题（自己）
   */
  share_title_myself?: string
  /**
   * @description 分享标题（他人）
   */
  share_title_other?: string
  /**
   * @description 分享URL
   */
  share_url?: string
  /**
   * @description 微博分享描述
   */
  share_weibo_desc?: string
}

/**
 * @description 关注列表次要信息
 */
export interface IFollowingSecondaryInfo {
  /**
   * @description 次要信息优先级
   */
  secondary_information_priority?: number
  /**
   * @description 次要信息文本
   */
  secondary_information_text?: string
  /**
   * @description 次要信息文本类型
   */
  secondary_information_text_type?: number
}

/**
 * @description 原创音乐人信息
 */
export interface IOriginalMusician {
  /**
   * @description 点赞数
   */
  digg_count?: number
  /**
   * @description 音乐数
   */
  music_count?: number
  /**
   * @description 音乐使用数
   */
  music_used_count?: number
}
