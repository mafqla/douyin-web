import type { IAwemeInfo } from '../common/aweme'

/**
 * @description 关注视频流响应
 */
export interface IFollowFeedRes {
  /**
   * @description 游标，用于下一次请求
   */
  cursor: number
  /**
   * @description 视频数据列表
   */
  data: IFollowFeedData[]
  /**
   * @description 是否还有更多
   */
  has_more?: number
  /**
   * @description 状态码
   */
  status_code?: number
}

/**
 * @description 关注视频流数据项
 */
export interface IFollowFeedData {
  /**
   * @description 视频信息
   */
  aweme: IFollowFeedAweme
}

/**
 * @description 关注视频流中的视频信息
 */
export interface IFollowFeedAweme
  extends Omit<IAwemeInfo, 'statistics' | 'image_album_music_info'> {
  /**
   * @description 活动视频类型
   */
  activity_video_type?: number
  /**
   * @description 认证令牌
   */
  authentication_token?: string
  /**
   * @description 作者遮罩标签
   */
  author_mask_tag?: number
  /**
   * @description 避免信息流挂件
   */
  avoid_feed_pendant?: boolean
  /**
   * @description 视频控制
   */
  aweme_control?: IAwemeControl
  /**
   * @description 视频监听结构
   */
  aweme_listen_struct?: IAwemeListenStruct
  /**
   * @description 视频类型标签
   */
  aweme_type_tags?: string
  /**
   * @description 推广状态
   */
  boost_status?: number
  /**
   * @description 是否可以缓存到本地
   */
  can_cache_to_local?: boolean
  /**
   * @description 标题
   */
  caption?: string
  /**
   * @description CF资源类型
   */
  cf_assets_type?: number
  /**
   * @description CF重新检查时间戳
   */
  cf_recheck_ts?: number
  /**
   * @description 评论组ID
   */
  comment_gid?: number
  /**
   * @description 组件控制
   */
  component_control?: IComponentControl
  /**
   * @description 组件信息V2
   */
  component_info_v2?: string
  /**
   * @description 禁用关系栏
   */
  disable_relation_bar?: number
  /**
   * @description 分发圈子
   */
  distribute_circle?: IDistributeCircle
  /**
   * @description 抖加用户类型
   */
  douplus_user_type?: number
  /**
   * @description 视频时长（毫秒）
   */
  duration?: number
  /**
   * @description 生态系统调查信息
   */
  eco_system_survey_info?: IEcoSystemSurveyInfo
  /**
   * @description 电商评论氛围类型
   */
  ecom_comment_atmosphere_type?: number
  /**
   * @description 启用评论贴纸推荐
   */
  enable_comment_sticker_rec?: boolean
  /**
   * @description 启用装饰表情
   */
  enable_decorated_emoji?: boolean
  /**
   * @description 娱乐日志额外信息
   */
  ent_log_extra?: IEntLogExtra
  /**
   * @description 娱乐产品信息
   */
  entertainment_product_info?: IEntertainmentProductInfo
  /**
   * @description 娱乐视频付费方式
   */
  entertainment_video_paid_way?: IEntertainmentVideoPaidWay
  /**
   * @description 娱乐视频类型
   */
  entertainment_video_type?: number
  /**
   * @description 瀑布流卡片结构
   */
  fall_card_struct?: IFallCardStruct
  /**
   * @description 信息流评论配置
   */
  feed_comment_config?: IFeedCommentConfig
  /**
   * @description 闪光趋势
   */
  flash_mob_trends?: number
  /**
   * @description 关注拍摄剪辑信息
   */
  follow_shoot_clip_info?: IFollowShootClipInfo
  /**
   * @description 好友推荐信息
   */
  friend_recommend_info?: IFriendRecommendInfo
  /**
   * @description 游戏标签信息
   */
  game_tag_info?: IGameTagInfo
  /**
   * @description 引导场景信息
   */
  guide_scene_info?: Record<string, unknown>
  /**
   * @description 图集音乐信息
   */
  image_album_music_info?: IImageAlbumMusicInfo
  /**
   * @description 图片评论
   */
  image_comment?: Record<string, unknown>
  /**
   * @description 图片裁剪控制
   */
  image_crop_ctrl?: number
  /**
   * @description 激励项目类型
   */
  incentive_item_type?: number
  /**
   * @description 是否24小时故事
   */
  is_24_story?: number
  /**
   * @description 是否25小时故事
   */
  is_25_story?: number
  /**
   * @description 是否广告
   */
  is_ads?: boolean
  /**
   * @description 是否收藏已选
   */
  is_collects_selected?: number
  /**
   * @description 是否来自广告授权
   */
  is_from_ad_auth?: boolean
  /**
   * @description 是否图片节拍
   */
  is_image_beat?: boolean
  /**
   * @description 是否生活项目
   */
  is_life_item?: boolean
  /**
   * @description 是否时刻历史
   */
  is_moment_history?: number
  /**
   * @description 是否时刻故事
   */
  is_moment_story?: number
  /**
   * @description 是否新文本模式
   */
  is_new_text_mode?: number
  /**
   * @description 是否分享帖子
   */
  is_share_post?: boolean
  /**
   * @description 是否故事
   */
  is_story?: number
  /**
   * @description 是否使用音乐
   */
  is_use_music?: boolean
  /**
   * @description 项目AIGC关注拍摄
   */
  item_aigc_follow_shot?: number
  /**
   * @description 项目标题
   */
  item_title?: string
  /**
   * @description 项目警告通知
   */
  item_warn_notification?: IItemWarnNotification
  /**
   * @description 标记大量关注
   */
  mark_largely_following?: boolean
  /**
   * @description 原始二重奏资源URI
   */
  origin_duet_resource_uri?: string
  /**
   * @description 原始
   */
  original?: number
  /**
   * @description PC需要登录
   */
  pc_need_login?: boolean
  /**
   * @description 个人页面底部诊断样式
   */
  personal_page_botton_diagnose_style?: number
  /**
   * @description 图片搜索入口
   */
  photo_search_entrance?: IPhotoSearchEntrance
  /**
   * @description 播放进度
   */
  play_progress?: IPlayProgress
  /**
   * @description 预览标题
   */
  preview_title?: string
  /**
   * @description 预览视频状态
   */
  preview_video_status?: number
  /**
   * @description 产品类型信息
   */
  product_genre_info?: IProductGenreInfo
  /**
   * @description 发布加异化
   */
  publish_plus_alienation?: IPublishPlusAlienation
  /**
   * @description 评级
   */
  rate?: number
  /**
   * @description 地区
   */
  region?: string
  /**
   * @description 风险信息
   */
  risk_infos?: IRiskInfos
  /**
   * @description 安全项目ID
   */
  sec_item_id?: string
  /**
   * @description 选择锚点扩展内容
   */
  select_anchor_expanded_content?: number
  /**
   * @description 系列基本信息
   */
  series_basic_info?: Record<string, unknown>
  /**
   * @description 系列付费信息
   */
  series_paid_info?: ISeriesPaidInfo
  /**
   * @description 分享推荐额外信息
   */
  share_rec_extra?: string
  /**
   * @description 分享URL
   */
  share_url?: string
  /**
   * @description 拍摄方式
   */
  shoot_way?: string
  /**
   * @description 是否打开广告举报
   */
  should_open_ad_report?: boolean
  /**
   * @description 统计数据
   */
  statistics?: IFollowFeedStatistics
  /**
   * @description 趋势事件追踪
   */
  trends_event_track?: string
  /**
   * @description 用户推荐状态
   */
  user_recommend_status?: number
}

/**
 * @description 视频控制
 */
export interface IAwemeControl {
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
 * @description 视频监听结构
 */
export interface IAwemeListenStruct {
  /**
   * @description 追踪信息
   */
  trace_info?: string
}

/**
 * @description 组件控制
 */
export interface IComponentControl {
  /**
   * @description 数据源URL
   */
  data_source_url?: string
}

/**
 * @description 分发圈子
 */
export interface IDistributeCircle {
  /**
   * @description 校园阻止互动
   */
  campus_block_interaction?: boolean
  /**
   * @description 分发类型
   */
  distribute_type?: number
  /**
   * @description 是否校园
   */
  is_campus?: boolean
}

/**
 * @description 生态系统调查信息
 */
export interface IEcoSystemSurveyInfo {
  /**
   * @description 插入标签列表
   */
  insert_tag_list?: string
}

/**
 * @description 娱乐日志额外信息
 */
export interface IEntLogExtra {
  /**
   * @description 日志额外信息
   */
  log_extra?: string
}

/**
 * @description 娱乐产品信息
 */
export interface IEntertainmentProductInfo {
  /**
   * @description 市场信息
   */
  market_info?: {
    /**
     * @description 限时免费
     */
    limit_free?: {
      /**
       * @description 是否免费中
       */
      in_free?: boolean
    }
  }
}

/**
 * @description 娱乐视频付费方式
 */
export interface IEntertainmentVideoPaidWay {
  /**
   * @description 启用使用新娱乐数据
   */
  enable_use_new_ent_data?: boolean
  /**
   * @description 付费类型
   */
  paid_type?: number
  /**
   * @description 付费方式列表
   */
  paid_ways?: unknown[]
}

/**
 * @description 瀑布流卡片结构
 */
export interface IFallCardStruct {
  /**
   * @description 推荐原因
   */
  recommend_reason?: string
  /**
   * @description 推荐原因V2
   */
  recommend_reason_v2?: string
}

/**
 * @description 信息流评论配置
 */
export interface IFeedCommentConfig {
  /**
   * @description 音频评论权限
   */
  audio_comment_permission?: number
  /**
   * @description 作者审核状态
   */
  author_audit_status?: number
  /**
   * @description 通用标志
   */
  common_flags?: string
  /**
   * @description 输入配置文本
   */
  input_config_text?: string
}

/**
 * @description 关注拍摄剪辑信息
 */
export interface IFollowShootClipInfo {
  /**
   * @description 剪辑来源平台
   */
  clip_from_platform?: number
  /**
   * @description 剪辑视频全部
   */
  clip_video_all?: number
  /**
   * @description 原始剪辑ID
   */
  origin_clip_id?: number
}

/**
 * @description 好友推荐信息
 */
export interface IFriendRecommendInfo {
  /**
   * @description 禁用好友推荐引导标签
   */
  disable_friend_recommend_guide_label?: boolean
  /**
   * @description 好友推荐来源
   */
  friend_recommend_source?: number
  /**
   * @description 推荐预测率
   */
  recommend_predict_rate?: number
  /**
   * @description 推荐预测分数
   */
  recommend_predict_score?: number
}

/**
 * @description 游戏标签信息
 */
export interface IGameTagInfo {
  /**
   * @description 是否游戏
   */
  is_game?: boolean
}

/**
 * @description 图集音乐信息
 */
export interface IImageAlbumMusicInfo {
  /**
   * @description 开始时间
   */
  begin_time?: number
  /**
   * @description 结束时间
   */
  end_time?: number
  /**
   * @description 音量
   */
  volume?: number
}

/**
 * @description 项目警告通知
 */
export interface IItemWarnNotification {
  /**
   * @description 内容
   */
  content?: string
  /**
   * @description 是否显示
   */
  show?: boolean
  /**
   * @description 类型
   */
  type?: number
}

/**
 * @description 图片搜索入口
 */
export interface IPhotoSearchEntrance {
  /**
   * @description 电商类型
   */
  ecom_type?: number
}

/**
 * @description 播放进度
 */
export interface IPlayProgress {
  /**
   * @description 最后修改时间
   */
  last_modified_time?: number
  /**
   * @description 播放进度
   */
  play_progress?: number
}

/**
 * @description 产品类型信息
 */
export interface IProductGenreInfo {
  /**
   * @description 素材类型子类型集合
   */
  material_genre_sub_type_set?: number[]
  /**
   * @description 产品类型
   */
  product_genre_type?: number
  /**
   * @description 特殊信息
   */
  special_info?: {
    /**
     * @description 推荐组名称
     */
    recommend_group_name?: number
  }
}

/**
 * @description 发布加异化
 */
export interface IPublishPlusAlienation {
  /**
   * @description 异化类型
   */
  alienation_type?: number
}

/**
 * @description 风险信息
 */
export interface IRiskInfos {
  /**
   * @description 内容
   */
  content?: string
  /**
   * @description 风险下沉
   */
  risk_sink?: boolean
  /**
   * @description 类型
   */
  type?: number
  /**
   * @description 投票
   */
  vote?: boolean
  /**
   * @description 警告
   */
  warn?: boolean
}

/**
 * @description 系列付费信息
 */
export interface ISeriesPaidInfo {
  /**
   * @description 项目价格
   */
  item_price?: number
  /**
   * @description 系列付费状态
   */
  series_paid_status?: number
}

/**
 * @description 关注视频流统计数据
 */
export interface IFollowFeedStatistics {
  /**
   * @description 赞赏数
   */
  admire_count?: number
  /**
   * @description 视频ID
   */
  aweme_id?: string
  /**
   * @description 收藏数
   */
  collect_count?: number
  /**
   * @description 评论数
   */
  comment_count?: number
  /**
   * @description 摘要
   */
  digest?: string
  /**
   * @description 点赞数
   */
  digg_count?: number
  /**
   * @description 下载数
   */
  download_count?: number
  /**
   * @description 曝光数
   */
  exposure_count?: number
  /**
   * @description 转发数
   */
  forward_count?: number
  /**
   * @description 直播观看数
   */
  live_watch_count?: number
  /**
   * @description 丢失评论数
   */
  lose_comment_count?: number
  /**
   * @description 丢失数
   */
  lose_count?: number
  /**
   * @description 播放数
   */
  play_count?: number
  /**
   * @description 推荐数
   */
  recommend_count?: number
  /**
   * @description 分享数
   */
  share_count?: number
  /**
   * @description WhatsApp分享数
   */
  whatsapp_share_count?: number
}
