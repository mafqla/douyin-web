import type { IAuthor } from './author'
import type { IMusic } from './music'
import type { ISuggestWords } from './suggest_words'
import type { IVideo } from './video'
import type { IVideoControl } from './video-control'

export interface IAwemeImage {
  uri: string
  url_list: string[]
  download_url_list: string[]
  width: number
  height: number
  image_type?: number
  live_photo_type?: number
  interaction_stickers?: null
  mask_url_list?: null
  watermark_free_download_url_list?: null
  // 图片类型：2=静态图片, 5=Live Photo（实况照片）
  clip_type?: number
  // Live Photo 视频信息
  video?: {
    play_addr?: {
      url_list: string[]
      data_size?: number
      height?: number
      width?: number
    }
    // 视频时长（毫秒），用于确定该图片的展示时长
    duration?: number
    cover?: {
      url_list: string[]
    }
  }
}

// 图集音乐信息
export interface IImageAlbumMusicInfo {
  // 音乐开始时间（毫秒）
  begin_time: number
  // 音乐结束时间（毫秒）
  end_time: number
  // 音量 (0-100)
  volume: number
}

export interface IAwemeInfo {
  aweme_id: string // 视频ID
  desc: string // 视频描述
  create_time: number | string // 视频创建时间
  author: IAuthor // 作者信息
  music: IMusic // 音乐信息
  cha_list: null // 挑战赛列表，具体含义未知
  video: IVideo // 视频信息
  user_digged: number
  statistics: IVideoStatistics // 视频数据
  status: IVideoStatus // 视频状态
  text_extra: ITextExtra[] & ISegment[]
  // 是否置顶，这里为0可能表示未置顶
  is_top: 0 | 1 // 使用联合类型，表示它可以是0或1
  share_info: IShareInfo // 分享信息
  // 直播
  cell_room: {
    rawdata: string // 原始 JSON 字符串，解析后为 ILiveStreamInfo
  }
  // 视频标签，用于分类或标记视频内容，当前为null表示没有标签或数据未提供
  video_labels: null
  // 视频类型，当前为0，具体含义需根据平台文档解释，可能表示视频的某种特定类型
  aweme_type: number
  // 图片信息数组，包含视频封面或其他相关图片的信息，当前为null表示没有图片或数据未提供
  image_infos: null
  // 视频拍摄的地理位置信息，当前为null表示位置信息未提供
  position: null
  // 唯一位置标识符，用于追踪视频的地理位置，当前为null表示位置信息未提供
  uniqid_position: null
  // 评论列表，包含用户对视频的评论，当前为null表示没有评论或数据未提供
  comment_list: null
  // 发布视频的作者的用户ID，唯一标识发布视频的用户
  author_user_id: number
  // 地理围栏信息，用于限制视频在特定地区的可见性，当前为null表示没有地理围栏或数据未提供
  geofencing: null
  // 视频的文字描述或字幕，当前为null表示没有文本或数据未提供
  video_text: null
  // 视频被收藏的次数，当前为0表示没有被收藏
  collect_stat: number
  // 顶部标签文本，用于展示视频的特定标签或分类，当前为null表示没有标签或数据未提供
  label_top_text: null
  // 与视频相关的广告或推广内容，当前为null表示没有推广或数据未提供
  promotions: null
  // 视频的唯一标识符，用于追踪和引用视频
  group_id: string
  // 布尔值，表示是否禁止下载视频内容，当前为false表示允许下载
  prevent_download: boolean
  // 作者昵称在视频中的位置信息，当前为null表示没有昵称位置信息或数据未提供
  nickname_position: null
  // 视频中的特定挑战或活动的位置信息，当前为null表示没有挑战位置信息或数据未提供
  challenge_position: null
  // 长视频信息，用于区分长视频和短视频，当前为null表示没有长视频信息或数据未提供
  long_video: null
  // 用户在视频中使用的互动贴纸信息，当前为null表示没有互动贴纸或数据未提供
  interaction_stickers: null
  // 视频最初的评论ID列表，当前为null表示没有原始评论或数据未提供
  origin_comment_ids: null
  // 与视频相关的商业合作信息，当前为null表示没有商业配置数据或数据未提供
  commerce_config_data: null
  video_control: IVideoControl // 视频控制选项

  anchors: null // 主播信息，具体含义未知
  rawdata: string // 原始数据，可能包含视频的原始信息
  hybrid_label: null // 混合标签，具体含义未知
  geofencing_regions: null // 地理围栏区域信息，具体含义未知
  cover_labels: null // 封面标签，具体含义未知
  images: IAwemeImage[] | null
  // 图集音乐信息，控制每张图片的播放时间
  image_album_music_info?: IImageAlbumMusicInfo
  relation_labels: null // 关系标签，具体含义未知
  is_live_photo: number // 是否动图
  impression_data: ImpressionData // 印象数据
  social_tag_list: null // 社交标签列表，具体含义未知
  suggest_words: ISuggestWords // 搜索推荐词
  hot_list: IHotSpotItem // 热搜列表
  original_images: null // 原始图片信息，具体含义未知
  img_bitrate: null // 图片比特率，具体含义未知
  video_tag: null // 视频标签，具体含义未知
  chapter_list: null // 章节列表，具体含义未知
  dislike_dimension_list: null // 不喜欢维度列表，具体含义未知
  standard_bar_info_list: null // 标准条信息列表，具体含义未知
  image_list: null // 图片列表，具体含义未知
  origin_text_extra: null // 原始文本额外信息，具体含义未知
  packed_clips: null // 打包剪辑，具体含义未知
  tts_id_list: null // TTS ID列表，具体含义未知
  ref_tts_id_list: null // 引用TTS ID列表，具体含义未知
  voice_modify_id_list: null // 语音修改ID列表，具体含义未知
  ref_voice_modify_id_list: null // 引用语音修改ID列表，具体含义未知
  dislike_dimension_list_v2: null // 不喜欢维度列表，版本2，具体含义未知
  yumme_recreason: null // Yumme推荐原因，具体含义未知
  slides_music_beats: null // 幻灯片音乐节拍，具体含义未知
  jump_tab_info_list: null // 跳转标签信息列表，具体含义未知
  reply_smart_emojis: null // 回复智能表情，具体含义未知
  create_scale_type: null // 创建比例类型，具体含义未知
  media_type: number // 媒体类型
  seo_info: {
    ocr_content: string
  }
}

interface IVideoStatistics {
  comment_count: number // 评论数量
  digg_count: number // 点赞数量
  download_count: number // 下载数量
  play_count: number // 播放数量
  share_count: number // 分享数量
  forward_count: number // 转发数量
  live_watch_count: number // 直播观看数量
  collect_count: number // 收藏数量
}

interface IVideoStatus {
  is_delete: boolean // 是否已删除
  allow_share: boolean // 是否允许分享
  is_private: boolean // 是否是私密视频
  private_status: number // 私密状态，具体含义未知
  in_reviewing: boolean // 是否正在审核中
  is_prohibited: boolean // 是否被禁止
  review_result: ReviewResult // 审核结果
  part_see: number // 部分可见状态，具体含义未知
}

interface ReviewResult {
  review_status: number // 审核状态
}

// 定义一个表示额外文本信息的接口
export interface ITextExtra {
  // 起始位置
  start: number
  // 结束位置
  end: number
  // 类型，这里为1可能表示这是一个话题标签
  type: number
  // 话题标签名称
  hashtag_name: string
  // 话题标签的唯一标识符
  hashtag_id: string
  // 是否与商业相关
  is_commerce: boolean
}

export interface ISegment {
  caption_start: number
  caption_end: number
  start: number
  end: number
  hashtag_id: string
  hashtag_name: string
  is_commerce: boolean
  type: number
  sec_uid: string
  user_id: string
}

// 定义一个表示分享信息的接口
export interface IShareInfo {
  // 分享链接
  share_url: string
  // 分享描述
  share_desc: string
  // 分享标题
  share_title: string
  // 分享链接描述
  share_link_desc: string
  // 分享引用
  share_quote?: string // 可选属性，如果存在引用的话
  // 分享描述信息，可能包含话题标签
  share_desc_info: string
  // 分享二维码
  share_qrcode_url?: {
    height: number
    width: number
    uri: string
    url_list: string[]
  }
  // 分享标题（自己）
  share_title_myself?: string
  // 分享标题（他人）
  share_title_other?: string
  // 微博分享描述
  share_weibo_desc?: string
}

interface ImpressionData {
  // 视频组标识符列表A，包含一系列视频的group_id
  group_id_list_a: number[]
  // 视频组标识符列表B，可能用于相似视频的推荐，当前为null表示没有数据或数据未提供
  group_id_list_b: null
  // 相似视频标识符列表A，可能用于推荐相似视频，包含单个视频的group_id
  similar_id_list_a: number[]
  // 相似视频标识符列表B，可能用于推荐相似视频，包含视频的group_id
  similar_id_list_b: number[]
  // 视频组标识符列表C，可能用于其他推荐逻辑，当前为null表示没有数据或数据未提供
  group_id_list_c: null
}

interface IHotSpotItem {
  schema: string
  type: number
  header: string
  footer: string
  title: string
  hot_score: number
  pattern_type: number
  rank: number
  view_count: number
  group_id: string
  sentence: string
  extra: string
  image_url: string
  sentence_id: number
  i18n_title: string
}

export interface SubCardList {
  type: number
  card_info: {
    style: string
    hotspot_info: {
      type: number
      schema: string
      board_icon_gray: {
        dark: string
        light: string
      }
      board_icon: {
        dark: string
        light: string
      }
      doc_id: number
      rank: number
      is_commerce: boolean
      sentence: string
      card_style: number
      is_yiqing_hotspot: boolean
      desc: string
      video_count: number
      sentence_id: string
      hot_value: number
      header: string
      update_time: number
      extra_info: {
        HotspotBottomBarInfo: {
          schema: null
          title: null
        }
        hotspot_feed_bottom_bar_type: string
      }
    }
    attached_info: {
      aweme_list: IAwemeInfo[]
    }
    baikes: Baike[] // 百科条目数组
    parent_id: string // 父级ID
    parent_word: string // 父级词条
    doc_id: number // 文档ID
    ala_src: string // 来源
  }
}

// 定义Baike对象类型，代表百科条目信息
interface Baike {
  grouped_infobox_list: null // 分组信息框列表，通常为null
  text_extra: null // 额外文本信息，通常为null
  head_image_thin: string // 百科条目的瘦长图片URL
  is_filter_gray: boolean // 是否过滤成灰色，false表示不过滤
  abstract: string // 百科条目的摘要信息
  recall_alias: string // 别名召回，通常为空字符串
  title: string // 百科条目的标题
  display_type: string // 显示类型，具体含义需要根据上下文确定
  catalog_list: null // 目录列表，通常为null
  head_image: string // 百科条目的图片URL
  pc_site_url: string // PC站点的URL，通常为空字符串
  hotspot_mount_rule: number // 热点挂载规则，具体含义需要根据上下文确定
  is_kg_card_degrade: boolean // 是否降级知识卡片，false表示不降级
  baike_type: string // 百科类型，具体含义需要根据上下文确定
  wiki_doc_id: string // 百科文档的ID
  content_src: string // 内容来源，通常为空字符串
  quick_facts_list: null // 快速事实列表，通常为null
  schema_h5: string // 移动端的schema URL
  dcm_info: null // DCM信息，通常为null
  subtitle: string // 百科条目的副标题
  schema: string // schema信息，通常为空字符串
  head_image_base64: string // 图片的Base64编码，通常为空字符串
  is_media_wiki: boolean // 是否为媒体Wiki，true表示是
}

export interface ILiveStreamInfo {
  // 直播流的唯一标识符（数字类型）
  id: number
  // 直播流的唯一标识符（字符串类型）
  id_str: string
  // 直播状态，具体数值对应具体状态
  status: number
  // 直播拥有者的用户ID
  owner_user_id: number
  // 直播标题
  title: string
  // 观看直播的用户数量
  user_count: number
  // 封面信息，包括封面图片的URL列表、URI和平均颜色
  cover: {
    url_list: string[]
    uri: string
    avg_color: string
  }
  // 流媒体地址信息，包括默认分辨率、额外信息（如高度和宽度）以及不同清晰度的FLV和HLS拉流地址
  stream_url: {
    id_str: string
    default_resolution: string
    extra: {
      height: number
      width: number
    }
    flv_pull_url: {
      HD1: string
      SD1: string
      SD2: string
    }
    hls_pull_url: string
    hls_pull_url_params: string
    flv_pull_url_params: {
      HD1: string
      SD1: string
      SD2: string
    }
    live_core_sdk_data: {
      pull_data: {
        stream_data: string
      }
    }
  }
  // HLS拉流地址映射，包括不同清晰度的地址
  hls_pull_url_map: {
    FULL_HD1: string
    HD1: string
    SD1: string
    SD2: string
  }
  // 统计信息，包括观看总数的描述、字符串表示和当前观看用户数的字符串表示
  stats: {
    total_user_desp: string
    total_user_str: string
    user_count_str: string
  }
  // 直播拥有者的信息，包括用户ID、昵称、头像信息以及关注信息
  owner: {
    id: number
    nickname: string
    avatar_thumb: {
      url_list: string[]
      uri: string
    }
    follow_info: {
      follower_count_str: string
      following_count_str: string
    }
  }
  // 直播间模式
  live_room_mode: number
  // 动态标签信息，包括显示类型、拼接标签的文本、文本颜色和背景图片信息
  dynamic_label: {
    display_type: number
    splice_label: {
      text: string
      text_color: string
      background_image: {
        url_list: string[]
        uri: string
        avg_color: string
      }
    }
  }
  // 付费直播数据，包括付费AB测试类型
  paid_live_data: {
    pay_ab_type: number
  }
  // 电商数据，包括购物车显示状态
  ecom_data: {
    room_cart_v2: {
      show_cart: number
    }
  }
  // 房间视图统计信息，包括是否隐藏、显示版本和显示类型
  room_view_stats: {
    is_hidden: boolean
    display_version: number
    display_type: number
  }
  // 互动信息，包括分集ID、季节ID、模式信息和主摄像头匹配信息
  interact: {
    vs_component_extra: {
      episode_id: number
      episode_id_str: string
      season_id: number
      season_id_str: string
      mod: {
        episode_stage: number
        episode_type: number
        episode_sub_type: number
        episode_record_type: number
      }
      main_camera_match_info: {
        league_info: {}
      }
    }
  }
  // 额外的流媒体地址信息，包括候选分辨率、默认分辨率、额外信息以及不同清晰度的FLV和HLS拉流地址
  additional_stream_url: {
    candidate_resolution: string[]
    default_resolution: string
    extra: {
      height: number
      width: number
    }
    flv_pull_url: {
      HD1: string
      SD1: string
      SD2: string
    }
    flv_pull_url_params: {
      HD1: string
      SD1: string
      SD2: string
    }
    hls_pull_url: string
    hls_pull_url_map: {
      FULL_HD1: string
      HD1: string
      SD1: string
      SD2: string
    }
    hls_pull_url_params: string
  }
  // 推送数据，包括推送流级别
  push_data: {
    push_stream_level: number
  }
  // 播放信息，包括水平和垂直主播放流
  play: {
    horizontal: string
    vertical: string
  }
  // 分辨率名称映射，包括不同清晰度的名称
  resolution_name: {
    FULL_HD1: string
    HD1: string
    ORIGION: string
    SD1: string
    SD2: string
  }
  // RTMP拉流地址
  rtmp_pull_url: string
  // RTMP拉流地址参数
  rtmp_pull_url_params: string
  // 流控制类型
  stream_control_type: number
  // 流方向
  stream_orientation: number
}
