// 图片资源接口
export interface IImageResource {
  uri: string
  url_list: string[]
  width?: number
  height?: number
}

// 商业信息接口
export interface ICommerceInfo {
  challenge_list: any[] | null
  head_image_list: any[] | null
  offline_info_list: any[]
  smart_phone_list: any[] | null
  task_list: any[] | null
}

// 商业用户信息接口
export interface ICommerceUserInfo {
  ad_revenue_rits: any | null
  has_ads_entry: boolean
  show_star_atlas_cooperation: boolean
  star_atlas: number
}

// 封面和头图信息接口
export interface ICoverAndHeadImageInfo {
  cover_list: any[] | null
  profile_cover_list: Array<{
    cover_url: IImageResource
    dark_cover_color: string
    light_cover_color: string
  }> | null
}

// 官方合作信息接口
export interface IOfficialCooperation {
  schema: string
  text: string
  track_type: string
}

// 原创音乐人信息接口
export interface IOriginalMusician {
  digg_count: number
  music_count: number
  music_used_count: number
}

// 分享信息接口
export interface IShareInfo {
  bool_persist: number
  life_share_ext: string
  share_desc: string
  share_image_url: IImageResource
  share_qrcode_url: IImageResource
  share_title: string
  share_url: string
  share_weibo_desc: string
}

// 催更详情接口
export interface IUrgeDetail {
  ctl_map: string
  user_urged: number
}

// 伴侣关系接口
export interface IMateRelation {
  mate_apply_forward: number
  mate_apply_reverse: number
  mate_status: number
}

// 生活故事屏蔽接口
export interface ILifeStoryBlock {
  life_story_block: boolean
}

// 标签设置接口
export interface ITabSettings {
  private_tab: {
    private_tab_style: number
    show_private_tab: boolean
  }
}

// 个人主页标签信息接口
export interface IProfileTabInfo {
  profile_landing_tab: number
  profile_tab_list: any[] | null
  profile_tab_list_v2: any[] | null
}

// 个人主页展示接口
export interface IProfileShow {
  identify_auth_infos: any[] | null
}

export interface IUser {
  // 用户的唯一标识符
  uid: string
  // 短ID
  short_id: string
  // 用户昵称
  nickname: string
  // 用户性别
  gender: number | null
  // 用户签名
  signature: string
  // 168x168尺寸头像信息
  avatar_168x168: {
    uri: string
    url_list: string[]
    width: number
    height: number
  }
  // 300x300尺寸头像信息
  avatar_300x300: {
    uri: string
    url_list: string[]
    width: number
    height: number
  }
  // 大头像信息
  avatar_larger: {
    uri: string
    url_list: string[]
    width: number
    height: number
  }
  // 中等尺寸头像信息
  avatar_medium: {
    uri: string
    url_list: string[]
    width: number
    height: number
  }
  // 缩略头像信息
  avatar_thumb: {
    uri: string
    url_list: string[]
    width: number
    height: number
  }
  user_age?: number | null
  // 作品数量
  aweme_count: number
  aweme_count_correction_threshold: string
  birthday: string
  birthday_hide_level: number
  can_set_item_cover: boolean
  can_show_group_card: number
  city: string
  district: string
  school_name: string
  // 密友类型
  close_friend_type: number
  country: string
  ip_location: string
  // 是否已验证
  is_verified: boolean
  // 关注状态
  follow_status: number

  // 关注的数量
  following_count: number
  // 粉丝数量
  follower_count: number

  mplatform_followers_count: number
  // 收藏数量
  favoriting_count: number
  // 总被收藏次数
  total_favorited: number
  // 是否被屏蔽
  is_block: boolean
  // 是否隐藏搜索
  hide_search: boolean
  // 星座
  constellation: number
  // 是否禁用图片评论保存
  disable_image_comment_saved: number
  // 是否隐藏位置
  hide_location: boolean
  // 微博认证信息
  weibo_verify: string
  // 自定义认证信息
  custom_verify: string
  // 唯一ID
  unique_id: string
  // 认证权限ID列表
  verification_permission_ids: any[] | null
  // 特殊锁定状态
  special_lock: number
  // 是否需要推荐
  need_recommend: number
  // 是否绑定微博
  is_binded_weibo: boolean
  // 微博用户名
  weibo_name: string
  // 微博链接
  weibo_schema: string
  // 微博链接地址
  weibo_url: string
  // 故事开启状态
  story_open: boolean
  // 故事数量
  story_count: number
  // 是否拥有Facebook令牌
  has_facebook_token: boolean
  // Facebook令牌过期时间
  fb_expire_time: number
  // 是否拥有Twitter令牌
  has_twitter_token: boolean
  // Twitter令牌过期时间
  tw_expire_time: number
  // 是否拥有YouTube令牌
  has_youtube_token: boolean
  // YouTube令牌过期时间
  youtube_expire_time: number
  // 直播间ID
  room_id: number
  // 直播验证状态
  live_verify: number
  // 权限状态
  authority_status: number
  // 验证信息
  verify_info: string
  // 屏蔽关注通知
  shield_follow_notice: number
  // 屏蔽点赞通知
  shield_digg_notice: number
  // 屏蔽评论通知
  shield_comment_notice: number
  // 个人主页底部提示信息
  profile_mob_params: any
  //显示喜欢列表
  show_favorite_list: boolean
  show_subscription: boolean
  // 头像链接列表
  avatar_schema_list: any
  // 问候信息
  awemehts_greet_info: string
  // 是否有电商入口
  with_commerce_entry: boolean
  // 验证类型
  verification_type: number
  // 企业认证原因
  enterprise_verify_reason: string
  // 是否是广告假账号
  is_ad_fake: boolean
  // 高价值直播状态
  live_high_value: number
  // 地区
  region: string
  // 账号地区
  account_region: string
  // 是否同步到头条
  sync_to_toutiao: number
  // 电商用户等级
  commerce_user_level: number
  // 直播协议状态
  live_agreement: number
  // 平台同步信息
  platform_sync_info: any
  // 是否有店铺入口
  with_shop_entry: boolean
  // 是否是纪律成员
  is_discipline_member: boolean
  // 私密状态
  secret: number
  // 是否有订单
  has_orders: boolean
  // 是否禁止下载
  prevent_download: boolean
  // 是否显示图片气泡
  show_image_bubble: boolean
  // 地理围栏列表
  geofencing: any[]
  // 唯一ID修改时间
  unique_id_modify_time: number
  // 视频图标信息
  video_icon: {
    uri: string
    url_list: string[]
    width: number
    height: number
  }
  // Instagram ID
  ins_id: string
  // Google账户
  google_account: string
  // YouTube频道ID
  youtube_channel_id: string
  // YouTube频道标题
  youtube_channel_title: string
  // Apple账户
  apple_account: number
  // 是否有抖音入口
  with_dou_entry: boolean
  // 是否有融合店铺入口
  with_fusion_shop_entry: boolean
  // 是否绑定手机
  is_phone_binded: boolean
  // 是否接受隐私政策
  accept_private_policy: boolean
  // Twitter ID
  twitter_id: string
  // Twitter用户名
  twitter_name: string
  // 是否取消账号
  user_canceled: boolean
  // 是否有邮箱
  has_email: boolean
  // 是否是政府媒体VIP
  is_gov_media_vip: boolean
  // 直播协议时间
  live_agreement_time: number
  // 状态
  status: number
  // 头像URI
  avatar_uri: string
  // 粉丝状态
  follower_status: number
  // 内光屏蔽
  neiguang_shield: number
  // 评论设置
  comment_setting: number
  // 合拍设置
  duet_setting: number
  // 回流页面GID
  reflow_page_gid: number
  // 回流页面UID
  reflow_page_uid: number
  // 用户评分
  user_rate: number
  // 下载设置
  download_setting: number
  // 下载提示时间戳
  download_prompt_ts: number
  // 反应设置
  react_setting: number
  // 是否开启直播电商
  live_commerce: boolean
  // 封面URL列表
  cover_url: Array<{
    uri: string
    url_list: string[]
    width: number
    height: number
  }>
  // 显示性别策略
  show_gender_strategy: number
  // 语言
  language: string
  // 是否有洞察力
  has_insights: boolean
  // 项目列表
  item_list: any
  // 用户模式
  user_mode: number
  // 用户周期
  user_period: number
  // 是否有未读故事
  has_unread_story: boolean
  // 新故事封面
  new_story_cover: any
  // 是否是明星
  is_star: boolean
  // CV等级
  cv_level: string
  // 类型标签
  type_label: any
  // 广告封面URL
  ad_cover_url: string
  // 评论过滤状态
  comment_filter_status: number

  // 相关用户列表
  relative_users: any
  // 插入列表
  cha_list: any
  // 秒拍用户ID
  sec_uid: string
  // 用户催促详情
  urge_detail?: IUrgeDetail
  // 需要积分
  need_points: any
  // 首页底部提示
  homepage_bottom_toast: any
  // 即将热门认证
  aweme_hotsoon_auth: number
  // 即将热门认证关系
  aweme_hotsoon_auth_relation: number
  // 是否可以设置地理围栏
  can_set_geofencing: any
  // 直播间ID字符串
  room_id_str: string
  // 白色封面URL列表
  white_cover_url?: Array<IImageResource>
  // 用户标签列表
  user_tags: any
  // 拼接设置
  stitch_setting: number
  // 是否是混合用户
  is_mix_user: boolean
  // 是否启用附近可见
  enable_nearby_visible: boolean
  // 用户功能禁用列表
  ban_user_functions: any[]
  // 作品控制
  aweme_control: {
    can_forward: boolean
    can_share: boolean
    can_comment: boolean
    can_show_comment: boolean
  }
  // 用户不显示
  user_not_show: number
  // 仅预测
  ky_only_predict: number
  // 用户不可见
  user_not_see: number
  // 卡片入口列表
  card_entries: any
  // 签名显示行数
  signature_display_lines: number
  // 显示信息
  display_info: any
  // 粉丝请求状态
  follower_request_status: number
  // 直播状态
  live_status: number
  // 新朋友类型
  new_friend_type: number
  // 是否不显示
  is_not_show: boolean
  // 卡片入口不显示列表
  card_entries_not_display: any
  // 卡片排序优先级
  card_sort_priority: any
  // 是否显示附近活跃
  show_nearby_active: boolean
  // 兴趣标签列表
  interest_tags: any
  // 学校类别
  school_category: number
  // 搜索印象
  search_impr: {
    entity_id: string
  }
  // 链接项目列表
  link_item_list: any
  // 用户权限列表
  user_permissions: any
  // 离线信息列表
  offline_info_list: any
  // 是否是CF
  is_cf: number
  // 是否屏蔽V2
  is_blocking_v2: boolean
  // 是否被屏蔽V2
  is_blocked_v2: boolean
  // 关注粉丝列表提示
  general_permission?: {
    fans_page_toast?: number
    following_follower_list_toast: number
    is_hit_active_fans_grayed?: boolean
  }
  // 签名额外信息
  signature_extra: any
  // 最大粉丝数量
  max_follower_count: number
  // 个人标签列表
  personal_tag_list: any
  // CF列表
  cf_list: any
  // IM角色ID列表
  im_role_ids: any
  // 未查看项目ID列表
  not_seen_item_id_list: any
  // 熟悉的访客用户
  familiar_visitor_user: any
  // 联系人状态
  contacts_status: number
  // 风险提示文本
  risk_notice_text: string
  // 粉丝列表二级信息结构
  follower_list_secondary_information_struct: any
  // 背书信息列表
  endorsement_info_list: any
  // 文本额外信息
  text_extra: any
  // 轨迹列表
  contrail_list: any
  // 数据标签列表
  data_label_list: any
  // 未查看项目ID列表V2
  not_seen_item_id_list_v2: any
  // 是否被禁止
  is_ban: boolean
  // 特殊人群标签
  special_people_labels: any
  // 特殊关注状态
  special_follow_status: number
  // 账号认证信息（JSON字符串）
  account_cert_info?: string
  // 商业信息
  commerce_info?: ICommerceInfo
  // 商业用户信息
  commerce_user_info?: ICommerceUserInfo
  // 封面和头图信息
  cover_and_head_image_info?: ICoverAndHeadImageInfo
  // 封面颜色
  cover_colour?: string
  // 动态数量
  dongtai_count?: number
  // 动态封面
  dynamic_cover?: Record<string, any>
  // 表情状态
  elfemoji_status?: number
  // 是否启用AI分身
  enable_ai_double?: number
  // 是否启用心愿
  enable_wish?: boolean
  // 企业用户信息（JSON字符串）
  enterprise_user_info?: string
  // 熟悉度置信度
  familiar_confidence?: number
  // 收藏权限
  favorite_permission?: number
  // 转发数量
  forward_count?: number
  // 是否有电商角色
  has_e_account_role?: boolean
  // 是否有订阅
  has_subscription?: boolean
  // 隐藏请求更新
  hide_request_update?: number
  // IM主要角色ID
  im_primary_role_id?: number
  // 图片发送豁免
  image_send_exempt?: boolean
  // 是否是活跃用户
  is_activity_user?: boolean
  // 是否被屏蔽
  is_blocked?: boolean
  // 是否是特效艺术家
  is_effect_artist?: boolean
  // 是否是IM海外用户
  is_im_oversea_user?: number
  // 是否是系列用户
  is_series_user?: boolean
  // 是否是分享个人资料用户
  is_sharing_profile_user?: number
  // 是否置顶
  is_top?: number
  // 生活故事屏蔽
  life_story_block?: ILifeStoryBlock
  // 伴侣添加权限
  mate_add_permission?: number
  // 伴侣关系
  mate_relation?: IMateRelation
  // 消息聊天入口
  message_chat_entry?: boolean
  // 合集数量
  mix_count?: number
  // 官方合作
  official_cooperation?: IOfficialCooperation
  // 原创音乐人
  original_musician?: IOriginalMusician
  // 鸽子达人状态
  pigeon_daren_status?: string
  // 鸽子达人警告标签
  pigeon_daren_warn_tag?: string
  // 个人主页组件禁用列表
  profile_component_disabled?: string[]
  // 个人主页记录参数（JSON字符串）
  profile_record_params?: string
  // 个人主页展示
  profile_show?: IProfileShow
  // 个人主页标签信息
  profile_tab_info?: IProfileTabInfo
  // 个人主页标签类型
  profile_tab_type?: number
  // 公开收藏数量
  public_collects_count?: number
  // 发布落地标签
  publish_landing_tab?: number
  // 粉丝群信息
  r_fans_group_info?: Record<string, any>
  // 推荐原因关系
  recommend_reason_relation?: string
  // 推荐用户原因来源
  recommend_user_reason_source?: number
  // 角色ID
  role_id?: string
  // 系列数量
  series_count?: number
  // 分享信息
  share_info?: IShareInfo
  // 签名语言
  signature_language?: string
  // 社交真实关系类型
  social_real_relation_type?: number
  // 故事标签是否为空
  story_tab_empty?: boolean
  // 标签设置
  tab_settings?: ITabSettings
  // 总被收藏次数修正阈值
  total_favorited_correction_threshold?: number
  // 观看状态
  watch_status?: boolean
  // 是否有商业企业标签入口
  with_commerce_enterprise_tab_entry?: boolean
  // 是否有新商品
  with_new_goods?: boolean
}
