import type { IImageResource } from '../common/image'

/** @用户列表响应 */
export interface IAtListRes {
  /** 游标，用于分页 */
  cursor: number
  /** 额外信息 */
  extra: {
    fatal_item_ids: string[]
    logid: string
    now: number
  }
  /** 是否还有更多 */
  has_more: boolean
  /** 日志信息 */
  log_pb: {
    impr_id: string
  }
  /** 最近@的用户列表 */
  recently_at_user_list: IAtUser[]
  /** 状态码 */
  status_code: number
  /** 用户列表 */
  user_list: IAtUser[]
}

/** @用户信息 */
export interface IAtUser {
  /** 接受隐私政策 */
  accept_private_policy: boolean
  /** 账号认证信息 */
  account_cert_info?: string
  /** 账号地区 */
  account_region: string
  /** 广告封面URL */
  ad_cover_url: IImageResource | null
  /** 苹果账号 */
  apple_account: number
  /** 权限状态 */
  authority_status: number
  /** 头像 168x168 */
  avatar_168x168: IImageResource
  /** 头像 300x300 */
  avatar_300x300: IImageResource
  /** 头像 1080x1080 */
  avatar_larger: IImageResource
  /** 头像 720x720 */
  avatar_medium: IImageResource
  /** 头像schema列表 */
  avatar_schema_list: any[] | null
  /** 头像 100x100 */
  avatar_thumb: IImageResource
  /** 头像URI */
  avatar_uri: string
  /** 视频控制 */
  aweme_control: {
    can_comment: boolean
    can_forward: boolean
    can_share: boolean
    can_show_comment: boolean
  }
  /** 视频数量 */
  aweme_count: number
  /** 火山授权 */
  aweme_hotsoon_auth: number
  /** 火山授权关系 */
  aweme_hotsoon_auth_relation?: number
  /** 火山问候信息 */
  awemehts_greet_info: string
  /** 禁用用户功能 */
  ban_user_functions: any[]
  /** 批量取关包含标签 */
  batch_unfollow_contain_tabs: any | null
  /** 批量取关关系描述 */
  batch_unfollow_relation_desc: any | null
  /** 可设置地理围栏 */
  can_set_geofencing: any | null
  /** 卡片入口 */
  card_entries: any | null
  /** 卡片入口不显示 */
  card_entries_not_display: any | null
  /** 卡片排序优先级 */
  card_sort_priority: any | null
  /** cf列表 */
  cf_list: any | null
  /** 挑战列表 */
  cha_list: any | null
  /** 亲密好友类型 */
  close_friend_type: number
  /** 评论过滤状态 */
  comment_filter_status: number
  /** 评论设置 */
  comment_setting: number
  /** 商业用户等级 */
  commerce_user_level: number
  /** 星座 */
  constellation: number
  /** 通讯录状态 */
  contacts_status: number
  /** 轨迹列表 */
  contrail_list: any | null
  /** 封面URL */
  cover_url: IImageResource[]
  /** 创建时间 */
  create_time: number
  /** 创作者标签列表 */
  creator_tag_list: any | null
  /** 自定义认证 */
  custom_verify: string
  /** cv等级 */
  cv_level: string
  /** 数据标签列表 */
  data_label_list: any | null
  /** 禁用图片评论保存 */
  disable_image_comment_saved: number
  /** 显示信息 */
  display_info: any | null
  /** 下载提示时间戳 */
  download_prompt_ts: number
  /** 下载设置 */
  download_setting: number
  /** 合拍设置 */
  duet_setting: number
  /** 启用附近可见 */
  enable_nearby_visible: boolean
  /** 背书信息列表 */
  endorsement_info_list: any | null
  /** 企业认证原因 */
  enterprise_verify_reason: string
  /** 熟悉度置信度 */
  familiar_confidence: number
  /** 熟悉访客用户 */
  familiar_visitor_user: any | null
  /** 收藏数量 */
  favoriting_count: number
  /** fb过期时间 */
  fb_expire_time: number
  /** 关注状态 0-未关注 1-已关注 */
  follow_status: number
  /** 粉丝数量 */
  follower_count: number
  /** 粉丝数量字符串 */
  follower_count_str: string
  /** 粉丝列表二级信息结构 */
  follower_list_secondary_information_struct: any | null
  /** 粉丝请求状态 */
  follower_request_status: number
  /** 粉丝状态 0-不是粉丝 1-是粉丝（互相关注） */
  follower_status: number
  /** 粉丝详情 */
  followers_detail: any | null
  /** 关注数量 */
  following_count: number
  /** 地理围栏 */
  geofencing: any[]
  /** 谷歌账号 */
  google_account: string
  /** 是否有邮箱 */
  has_email: boolean
  /** 是否有Facebook令牌 */
  has_facebook_token: boolean
  /** 是否有洞察 */
  has_insights: boolean
  /** 是否有订单 */
  has_orders: boolean
  /** 是否有Twitter令牌 */
  has_twitter_token: boolean
  /** 是否有未读故事 */
  has_unread_story: boolean
  /** 是否有YouTube令牌 */
  has_youtube_token: boolean
  /** 隐藏位置 */
  hide_location: boolean
  /** 隐藏回流 */
  hide_reflow?: number
  /** 隐藏搜索 */
  hide_search: boolean
  /** 主页底部提示 */
  homepage_bottom_toast: any | null
  /** 身份标签 */
  identity_labels: any | null
  /** IM角色ID */
  im_role_ids: any | null
  /** ins ID */
  ins_id: string
  /** 兴趣标签 */
  interest_tags: any | null
  /** 是否广告假用户 */
  is_ad_fake: boolean
  /** 是否被封禁 */
  is_ban: boolean
  /** 是否绑定微博 */
  is_binded_weibo: boolean
  /** 是否被拉黑 */
  is_block: boolean
  /** 是否被拉黑v2 */
  is_blocked_v2: boolean
  /** 是否拉黑v2 */
  is_blocking_v2: boolean
  /** 是否cf */
  is_cf: number
  /** 是否纪律成员 */
  is_discipline_member: boolean
  /** 是否政府媒体VIP */
  is_gov_media_vip: boolean
  /** 是否混合用户 */
  is_mix_user: boolean
  /** 是否不显示 */
  is_not_show: boolean
  /** 是否绑定手机 */
  is_phone_binded: boolean
  /** 是否明星 */
  is_star: boolean
  /** 是否认证 */
  is_verified: boolean
  /** 作品列表 */
  item_list: any | null
  /** ky仅预测 */
  ky_only_predict: number
  /** 语言 */
  language: string
  /** 链接作品列表 */
  link_item_list: any | null
  /** 直播协议 */
  live_agreement: number
  /** 直播协议时间 */
  live_agreement_time: number
  /** 直播商业 */
  live_commerce: boolean
  /** 直播高价值 */
  live_high_value: number
  /** 直播状态 */
  live_status: number
  /** 直播认证 */
  live_verify: number
  /** 好友添加权限 */
  mate_add_permission: number
  /** 好友数量 */
  mate_count: number
  /** 好友关系 */
  mate_relation: {
    mate_apply_forward: number
    mate_apply_reverse: number
    mate_status: number
  }
  /** 最大粉丝数量 */
  max_follower_count: number
  /** 需要积分 */
  need_points: any | null
  /** 需要推荐 */
  need_recommend: number
  /** 内光屏蔽 */
  neiguang_shield: number
  /** 新朋友类型 */
  new_friend_type: number
  /** 新故事封面 */
  new_story_cover: any | null
  /** 昵称 */
  nickname: string
  /** 未看作品ID列表 */
  not_seen_item_id_list: any | null
  /** 未看作品ID列表v2 */
  not_seen_item_id_list_v2: any | null
  /** 离线信息列表 */
  offline_info_list: any | null
  /** 个人标签列表 */
  personal_tag_list: any | null
  /** 平台同步信息 */
  platform_sync_info: any | null
  /** 阻止下载 */
  prevent_download: boolean
  /** 私密关系列表 */
  private_relation_list: any | null
  /** 个人资料组件禁用 */
  profile_component_disabled: any | null
  /** 个人资料mob参数 */
  profile_mob_params: any | null
  /** 反应设置 */
  react_setting: number
  /** 回流页面gid */
  reflow_page_gid: number
  /** 回流页面uid */
  reflow_page_uid: number
  /** 地区 */
  region: string
  /** 相关用户 */
  relative_users: any | null
  /** 风险提示文本 */
  risk_notice_text: string
  /** 房间ID */
  room_id: number
  /** 房间ID字符串 */
  room_id_str: string
  /** 搜索印象 */
  search_impr: {
    entity_id: string
  }
  /** sec_uid */
  sec_uid: string
  /** 私密 */
  secret: number
  /** 分享信息 */
  share_info: {
    share_desc: string
    share_desc_info: string
    share_qrcode_url: IImageResource
    share_title: string
    share_title_myself: string
    share_title_other: string
    share_url: string
    share_weibo_desc: string
  }
  /** 分享二维码URI */
  share_qrcode_uri: string
  /** 屏蔽评论通知 */
  shield_comment_notice: number
  /** 屏蔽点赞通知 */
  shield_digg_notice: number
  /** 屏蔽关注通知 */
  shield_follow_notice: number
  /** 短ID */
  short_id: string
  /** 显示性别策略 */
  show_gender_strategy: number
  /** 显示图片气泡 */
  show_image_bubble: boolean
  /** 显示附近活跃 */
  show_nearby_active: boolean
  /** 签名 */
  signature: string
  /** 签名显示行数 */
  signature_display_lines: number
  /** 签名额外信息 */
  signature_extra: any | null
  /** 社交真实关系类型 */
  social_real_relation_type: number
  /** 特别关注状态 */
  special_follow_status: number
  /** 特殊锁定 */
  special_lock: number
  /** 特殊人物标签 */
  special_people_labels: any | null
  /** 状态 */
  status: number
  /** 拼接设置 */
  stitch_setting: number
  /** 故事数量 */
  story_count: number
  /** 故事互动 */
  story_interactive: number
  /** 故事开启 */
  story_open: boolean
  /** 故事TTL */
  story_ttl: number
  /** 同步到头条 */
  sync_to_toutiao: number
  /** 文本额外信息 */
  text_extra: any | null
  /** 总收藏数 */
  total_favorited: number
  /** tw过期时间 */
  tw_expire_time: number
  /** Twitter ID */
  twitter_id: string
  /** Twitter名称 */
  twitter_name: string
  /** 类型标签 */
  type_label: any | null
  /** 用户ID */
  uid: string
  /** 唯一ID */
  unique_id: string
  /** 唯一ID修改时间 */
  unique_id_modify_time: number
  /** 催更详情 */
  urge_detail: {
    user_urged: number
  }
  /** 用户已注销 */
  user_canceled: boolean
  /** 用户模式 */
  user_mode: number
  /** 用户不看 */
  user_not_see: number
  /** 用户不显示 */
  user_not_show: number
  /** 用户周期 */
  user_period: number
  /** 用户权限 */
  user_permissions: any | null
  /** 用户评级 */
  user_rate: number
  /** 用户标签 */
  user_tags: any | null
  /** 认证权限ID */
  verification_permission_ids: any | null
  /** 认证类型 */
  verification_type: number
  /** 认证信息 */
  verify_info: string
  /** 视频图标 */
  video_icon: IImageResource
  /** 微博名称 */
  weibo_name: string
  /** 微博schema */
  weibo_schema: string
  /** 微博URL */
  weibo_url: string
  /** 微博认证 */
  weibo_verify: string
  /** 白色封面URL */
  white_cover_url: any | null
  /** 有商业入口 */
  with_commerce_entry: boolean
  /** 有抖币入口 */
  with_dou_entry: boolean
  /** 有融合商店入口 */
  with_fusion_shop_entry: boolean
  /** 有商店入口 */
  with_shop_entry: boolean
  /** YouTube频道ID */
  youtube_channel_id: string
  /** YouTube频道标题 */
  youtube_channel_title: string
  /** YouTube过期时间 */
  youtube_expire_time: number
}

/** @用户列表请求参数 */
export interface IAtListParams {
  /** 游标 */
  cursor?: number
  /** 场景 */
  scene?: number
  /** 视频ID */
  group_id?: string
  /** 每页数量 */
  count?: number
}
