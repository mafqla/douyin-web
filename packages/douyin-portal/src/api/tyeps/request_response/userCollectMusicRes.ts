// 图片信息
interface IImage {
  uri: string
  url_list: string[]
  width: number
  height: number
}

// 播放地址信息
interface IPlayUrl {
  uri: string
  url_list: string[]
  width: number
  height: number
  url_key: string
}

// HSV 颜色信息
interface ICoverColorHsv {
  h: number
  s: number
  v: number
}

// 搜索展示信息
interface ISearchImpr {
  entity_id: string
}

// 副歌信息
interface IChorus {
  start_ms: number
  duration_ms: number
}

// 歌曲信息
interface ISong {
  id: number
  id_str: string
  title?: string
  artists: any
  chorus?: IChorus
  chorus_v3_infos: any
}

// 匹配的 PGC 音乐信息
interface IMatchedPgcSound {
  author: string
  title: string
  mixed_title: string
  mixed_author: string
  cover_medium: IImage
}

// Luna 信息
interface ILunaInfo {
  is_luna_user: boolean
  has_copyright?: boolean
}

// 统一音乐组信息
interface IUnifiedMusicGroup {
  song_id: number
  title: string
  author: string
  medium_cover_url: IImage
}

// 收藏的音乐项
export interface ICollectMusicItem {
  id: number
  id_str: string
  title: string
  author: string
  album: string
  cover_hd: IImage
  cover_large: IImage
  cover_medium: IImage
  cover_thumb: IImage
  play_url: IPlayUrl
  schema_url: string
  source_platform: number
  start_time: number
  end_time: number
  duration: number
  extra: string
  user_count: number
  position: any
  collect_stat: number
  status: number
  offline_desc: string
  owner_id?: string
  owner_nickname: string
  is_original: boolean
  mid: string
  binded_challenge_id: number
  redirect: boolean
  is_restricted: boolean
  author_deleted: boolean
  is_del_video: boolean
  is_video_self_see: boolean
  owner_handle: string
  author_position: any
  prevent_download: boolean
  strong_beat_url?: IPlayUrl
  unshelve_countries: any
  prevent_item_download_status: number
  external_song_info: any[]
  sec_uid?: string
  avatar_thumb?: IImage
  avatar_medium?: IImage
  avatar_large?: IImage
  lyric_type?: number
  lyric_url?: string
  preview_start_time: number
  preview_end_time: number
  is_commerce_music: boolean
  is_original_sound: boolean
  audition_duration: number
  shoot_duration: number
  reason_type: number
  artists: any[]
  lyric_short_position: any
  mute_share: boolean
  tag_list: any
  dmv_auto_show: boolean
  is_pgc: boolean
  is_matched_metadata: boolean
  is_audio_url_with_cookie: boolean
  matched_pgc_sound?: IMatchedPgcSound
  music_chart_ranks: any
  can_background_play: boolean
  music_status: number
  video_duration: number
  pgc_music_type: number
  cover_color_hsv?: ICoverColorHsv
  author_status?: number
  search_impr: ISearchImpr
  song?: ISong
  artist_user_infos: any
  dsp_status: number
  musician_user_infos: any
  luna_info: ILunaInfo
  music_collect_count: number
  music_cover_atmosphere_color_value: string
  unified_music_group?: IUnifiedMusicGroup
  show_origin_clip: boolean
}

// 用户收藏音乐列表响应
export interface IUserCollectMusicRes {
  has_more: number
  cursor: number
  msg: string
  status_code: number
  mc_list: ICollectMusicItem[]
}
