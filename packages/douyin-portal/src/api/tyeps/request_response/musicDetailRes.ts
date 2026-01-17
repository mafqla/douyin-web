/**
 * 图片/封面信息
 */
export interface IImageInfo {
  /** 图片高度 */
  height: number
  /** 图片URI */
  uri: string
  /** 图片URL列表（多个CDN地址） */
  url_list: string[]
  /** 图片宽度 */
  width: number
}

/**
 * 匹配的PGC音乐信息
 */
export interface IMatchedPgcSound {
  /** 作者名称 */
  author: string
  /** 中等尺寸封面 */
  cover_medium: IImageInfo
  /** 音乐ID */
  id: number
  /** 混合作者（多个作者时使用） */
  mixed_author: string
  /** 混合标题 */
  mixed_title: string
  /** 音乐标题 */
  title: string
}

/**
 * 音乐分流信息
 */
export interface IMusicDiversion {
  /** 作者名称 */
  author: string
  /** 中等尺寸封面 */
  cover_medium: Omit<IImageInfo, 'height' | 'width'>
  /** 命中策略 */
  hit_strategy: number
  /** 命中策略版本2 */
  hit_strategy_v2: number
  /** Luna歌曲ID */
  luna_song_id: string
  /** 中间页颜色 */
  middle_page_color: string | null
  /** 音乐标题 */
  title: string
}

/**
 * 歌曲信息
 */
export interface ISongInfo {
  /** 艺术家列表 */
  artists: any[] | null
  /** 副歌v3信息 */
  chorus_v3_infos: any | null
  /** 歌曲ID */
  id: number
  /** 歌曲ID字符串 */
  id_str: string
}

/**
 * Luna版权信息
 */
export interface ILunaInfo {
  /** 是否有版权 */
  has_copyright: boolean
  /** 是否Luna用户 */
  is_luna_user: boolean
}

/**
 * 分享信息
 */
export interface IShareInfo {
  /** 是否持久化 */
  bool_persist: number
  /** 分享描述 */
  share_desc: string
  /** 分享描述信息 */
  share_desc_info: string
  /** 分享引用 */
  share_quote: string
  /** 分享签名描述 */
  share_signature_desc: string
  /** 分享签名URL */
  share_signature_url: string
  /** 分享标题 */
  share_title: string
  /** 分享标题（自己） */
  share_title_myself: string
  /** 分享标题（其他人） */
  share_title_other: string
  /** 分享URL */
  share_url: string
  /** 微博分享描述 */
  share_weibo_desc: string
}

/**
 * 播放URL信息
 */
export interface IPlayUrl {
  /** 高度 */
  height: number
  /** URI地址 */
  uri: string
  /** URL密钥 */
  url_key: string
  /** URL列表（多个CDN地址） */
  url_list: string[]
  /** 宽度 */
  width: number
}

/**
 * 强节拍URL信息
 */
export interface IStrongBeatUrl {
  /** 高度 */
  height: number
  /** URI地址 */
  uri: string
  /** URL列表 */
  url_list: string[]
  /** 宽度 */
  width: number
}

/**
 * 音乐信息
 */
export interface IMusicInfo {
  /** 专辑名称 */
  album?: string
  /** 艺术家用户信息 */
  artist_user_infos?: any | null
  /** 艺术家列表 */
  artists?: any[]
  /** 试听时长（秒） */
  audition_duration?: number
  /** 作者名称 */
  author?: string
  /** 作者是否已删除 */
  author_deleted?: boolean
  /** 作者位置信息 */
  author_position?: any | null
  /** 作者状态 */
  author_status?: number
  /** 大尺寸头像 */
  avatar_large?: IImageInfo
  /** 中等尺寸头像 */
  avatar_medium?: IImageInfo
  /** 缩略图头像 */
  avatar_thumb?: IImageInfo
  /** 绑定的挑战ID */
  binded_challenge_id?: number
  /** 是否可以后台播放 */
  can_background_play?: boolean
  /** 收藏统计 */
  collect_stat?: number
  /** 封面颜色HSV */
  cover_color_hsv?: {
    h: number
    s: number
    v: number
  }
  /** 高清封面 */
  cover_hd?: IImageInfo
  /** 大尺寸封面 */
  cover_large?: IImageInfo
  /** 中等尺寸封面 */
  cover_medium?: IImageInfo
  /** 缩略图封面 */
  cover_thumb?: IImageInfo
  /** 分流代码 */
  diversion_code?: number
  /** DMV自动显示 */
  dmv_auto_show?: boolean
  /** DSP状态 */
  dsp_status?: number
  /** 音乐时长（秒） */
  duration?: number
  /** 结束时间 */
  end_time?: number
  /** 外部歌曲信息 */
  external_song_info?: any[]
  /** 额外信息（JSON字符串） */
  extra?: string
  /** 音乐ID */
  id?: number
  /** 音乐ID字符串 */
  id_str?: string
  /** 音频URL是否带Cookie */
  is_audio_url_with_cookie?: boolean
  /** 是否商业音乐 */
  is_commerce_music?: boolean
  /** 视频是否已删除 */
  is_del_video?: boolean
  /** 是否匹配元数据 */
  is_matched_metadata?: boolean
  /** 是否原创 */
  is_original?: boolean
  /** 是否原声 */
  is_original_sound?: boolean
  /** 是否PGC（专业生成内容） */
  is_pgc?: boolean
  /** 是否受限 */
  is_restricted?: boolean
  /** 视频是否仅自己可见 */
  is_video_self_see?: boolean
  /** Luna版权信息 */
  luna_info?: ILunaInfo
  /** 歌词短位置 */
  lyric_short_position?: any | null
  /** 匹配的PGC音乐 */
  matched_pgc_sound?: IMatchedPgcSound
  /** 素材使用次数 */
  material_use_count?: number
  /** 音乐中间ID */
  mid?: string
  /** 音乐字幕URL */
  music_caption_url?: string
  /** 音乐榜单排名 */
  music_chart_ranks?: any | null
  /** 音乐收藏数 */
  music_collect_count?: number
  /** 音乐封面氛围颜色值 */
  music_cover_atmosphere_color_value?: string
  /** 音乐分流信息 */
  music_diversion?: IMusicDiversion
  /** 音乐状态 */
  music_status?: number
  /** 音乐人用户信息 */
  musician_user_infos?: any | null
  /** 是否静音分享 */
  mute_share?: boolean
  /** 下架描述 */
  offline_desc?: string
  /** 原创音乐人显示名称 */
  original_musician_display_name?: string
  /** 所有者句柄 */
  owner_handle?: string
  /** 所有者ID */
  owner_id?: string
  /** 所有者昵称 */
  owner_nickname?: string
  /** PGC音乐类型 */
  pgc_music_type?: number
  /** 播放URL信息 */
  play_url?: IPlayUrl
  /** 位置信息 */
  position?: any | null
  /** 是否禁止下载 */
  prevent_download?: boolean
  /** 禁止项目下载状态 */
  prevent_item_download_status?: number
  /** 预览结束时间 */
  preview_end_time?: number
  /** 预览开始时间 */
  preview_start_time?: number
  /** 原因类型 */
  reason_type?: number
  /** 是否重定向 */
  redirect?: boolean
  /** Schema URL */
  schema_url?: string
  /** 搜索曝光信息 */
  search_impr?: {
    /** 实体ID */
    entity_id: string
  }
  /** 安全用户ID */
  sec_uid?: string
  /** 分享信息 */
  share_info?: IShareInfo
  /** 拍摄时长（秒） */
  shoot_duration?: number
  /** 是否显示原始片段 */
  show_origin_clip?: boolean
  /** 歌曲信息 */
  song?: ISongInfo
  /** 来源平台 */
  source_platform?: number
  /** 开始时间 */
  start_time?: number
  /** 状态 */
  status?: number
  /** 强节拍URL */
  strong_beat_url?: IStrongBeatUrl
  /** 标签列表 */
  tag_list?: any | null
  /** 才艺话题标签名称列表 */
  talent_hashtag_name_list?: any | null
  /** 音乐标题 */
  title?: string
  /** 趋势音乐开始时间 */
  trend_music_start_time?: number
  /** 未上架国家列表 */
  unshelve_countries?: any | null
  /** 使用人数 */
  user_count?: number
  /** 视频时长（秒） */
  video_duration?: number
}

/**
 * 额外信息
 */
export interface IExtra {
  /** 致命项目ID列表 */
  fatal_item_ids: any[]
  /** 日志ID */
  logid: string
  /** 当前时间戳（毫秒） */
  now: number
}

/**
 * 日志PB信息
 */
export interface ILogPb {
  /** 曝光ID */
  impr_id: string
}

/**
 * 音乐详情响应
 */
export interface IMusicDetailRes {
  /** 是否禁用音乐活动设置 */
  disable_music_activity_setting: boolean
  /** 额外信息 */
  extra: IExtra
  /** 特征数据 */
  feature_data: Record<string, any>
  /** 关注拍摄按钮 */
  follow_shoot_buttons: any | null
  /** 高上传比率 */
  high_upload_ratio: number
  /** 日志PB信息 */
  log_pb: ILogPb
  /** Lora模型ID列表 */
  lora_model_ids: any | null
  /** 响应消息 */
  msg: string
  /** 音乐活动资源信息 */
  music_activity_resource_infos: any | null
  /** 音乐信息（主要数据） */
  music_info: IMusicInfo
  /** 推荐列表 */
  rec_list: any[]
  /** 相关特效 */
  related_effects: any | null
  /** 相关音乐 */
  related_musics: any | null
  /** 小横幅 */
  small_banner: any[]
  /** 状态码（0表示成功） */
  status_code: number
  /** 趋势信息 */
  trends_infos: any | null
}
