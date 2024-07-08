import type { IAuthor } from '../common/author'
import type { IShareInfo, ITextExtra } from '../common/aweme'
import type { IMusic } from '../common/music'
import type { ISuggestWords } from '../common/suggest_words'
import type { IVideo } from '../common/video'
import type {
  IAwemeControl,
  IVideoControl,
  IVideoTag
} from '../common/video-control'

export interface IVideoDetailRes {
  /**
   * @description 状态码
   */
  status_code: number

  /**
   * @description 视频信息
   */
  aweme_detail: IawemeDetail
}

export interface IawemeDetail {
  activity_video_type: number
  anchors: string
  authentication_token: string
  author: IAuthor
  author_mask_tag: number
  author_user_id: number
  aweme_control: IAwemeControl
  aweme_id: string
  aweme_type: number
  // 说明文字
  caption: string
  cf_recheck_ts: number
  challenge_position: number
  chapter_list: null
  collect_stat: number
  collection_corner_mark: number
  comment_gid: number
  comment_list: string
  comment_permission_info: IComentPermission
  commerce_config_data: null
  common_bar_info: string
  component_info_v2: string
  cover_labels: null
  create_time: number
  desc: string
  disable_relation_bar: number
  dislike_dimension_list: null
  dislike_dimension_list_v2: null
  distribute_circle: {
    campus_block_interaction: boolean
    distribute_type: number
    is_campus: boolean
  }
  duet_aggregate_in_music_tab: boolean
  duration: number
  enable_comment_sticker_rec: boolean
  entertainment_product_info: {
    market_info: {
      limit_free: {
        in_free: boolean
      }
    }
  }
  fall_card_struct: {
    recommend_reason_v2: string
  }
  feed_comment_config: object
  friend_recommend_info: object
  geofencing: Array<null>
  geofencing_regions: null
  group_id: string
  guide_scene_info: object
  hybrid_label: null
  image_album_music_info: {
    begin_time: number
    end_time: number
    volume: number
  }
  image_comment: object
  image_crop_ctrl: number
  image_infos: null
  image_list: null
  images: null
  img_bitrate: null
  impression_data: {
    group_id_list_a: Array<null>
    group_id_list_b: Array<null>
    group_id_list_c: Array<null>
    similar_id_list_a: Array<number>
    similar_id_list_b: Array<number>
  }
  incentive_item_type: number
  interaction_stickers: null
  is_24_story: number
  is_ads: boolean
  is_collects_selected: number
  is_duet_sing: boolean
  is_image_beat: boolean
  is_life_item: boolean
  is_share_post: boolean
  is_story: number
  is_top: number
  is_use_music: true
  item_title: ''
  item_warn_notification: {
    content: ''
    show: boolean
    type: number
  }
  label_top_text: null
  libfinsert_task_id: string
  long_video: null
  mark_largely_following: boolean
  media_type: number
  music: IMusic
  nickname_position: null
  origin_comment_ids: null
  origin_text_extra: Array<null>
  original: number
  original_images: null
  packed_clips: null
  photo_search_entrance: {
    ecom_type: number
  }
  position: null
  preview_title: string
  preview_video_status: number
  promotions: Array<null>
  rate: number
  region: string
  relation_labels: null
  risk_infos: {
    content: String
    risk_sink: boolean
    type: number
    vote: boolean
    warn: boolean
  }
  seo_info: {
    ocr_content: string
  }
  series_paid_info: {
    item_price: number
    series_paid_status: number
  }
  share_info: IShareInfo
  share_rec_extra: string
  share_url: string
  should_open_ad_report: boolean
  show_follow_button: object
  social_tag_list: null
  statistics: IVideoDetailStatistics
  status: {
    allow_share: boolean
    aweme_id: string
    in_reviewing: boolean
    is_delete: boolean
    is_prohibited: boolean
    listen_video_status: number
    part_see: number
    private_status: number
    review_result: {
      review_status: number
    }
  }
  suggest_words: ISuggestWords
  text_extra: ITextExtra
  uniqid_position: null // 表示这个属性的值可以是null
  user_digged: number // 表示用户点赞的数量，这里假设为数字类型
  user_recommend_status: number // 表示用户推荐状态，这里假设为数字类型
  video: IVideo
  video_control: IVideoControl
  video_game_data_channel_config: object
  video_labels: null
  video_share_edit_status: number
  video_tag: IVideoTag[]
  video_text: string[]
  visual_search_info: VisualSearchInfo
  xigua_base_info: IXiguaBaseInfo
}

export interface IComentPermission {
  can_comment: boolean
  comment_permission_status: number
  item_detail_entry: boolean
  press_entry: boolean
  toast_guide: boolean
}

export interface IVideoDetailStatistics {
  admire_count: number
  aweme_id: string
  collect_count: number
  comment_count: number
  digg_count: number
  play_count: number
  share_count: number
}

interface VisualSearchInfo {
  // 这里没有具体的属性，可以留空或者根据实际需要添加属性
}

interface IXiguaBaseInfo {
  item_id: number
  star_altar_order_id: number
  star_altar_type: number
  status: number
}
