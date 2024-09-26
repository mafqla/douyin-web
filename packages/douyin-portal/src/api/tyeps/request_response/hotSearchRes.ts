export interface HotSearchRes {
  banner_dark: string
  banner_light: string
  board_tabs: any
  data: HotSearchItem
  status_code: number
}

export interface HotSearchItem {
  active_time: string
  recommend_list: any
  share_info: {
    share_link_desc: string
    share_title: string
    share_url: string
  }
  trending_desc: string
  trending_list: IListItem[]
  word_list: IListItem[]
}

export interface IListItem {
  article_detail_count: number
  aweme_infos: any[]
  can_extend_detail: boolean
  discuss_video_count: number
  display_style: number
  drift_info: any
  event_time: number
  group_id: string
  hot_value: number
  hotlist_param: string
  label: number
  position: number
  related_words: any
  sentence_id: string
  sentence_tag: number
  video_count: number
  view_count: number
  word: string
  word_cover: {
    uri: string
    url_list: string[]
  }
  word_sub_board: any
  word_type: number
}
