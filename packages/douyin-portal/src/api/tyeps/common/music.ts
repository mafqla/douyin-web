export interface IMusic {
  id: number // 音乐的唯一标识符
  id_str: string // 音乐ID的字符串表示
  title: string // 音乐的标题
  author: string // 音乐的作者
  album: string // 音乐所属的专辑
  cover_medium: Image // 音乐封面（中等尺寸）信息
  cover_thumb: Image // 音乐封面（缩略图尺寸）信息
  play_url: PlayURL // 音乐播放地址信息
  duration: number // 音乐时长，单位秒
  extra: string // 额外的信息，通常包含音乐的元数据
  user_count: number // 使用该音乐的用户数量
  position: any // 音乐的位置信息，具体含义未知
  collect_stat: number // 收藏状态，具体含义未知
  status: number // 音乐的状态，具体含义未知
  owner_nickname: string // 音乐所有者的昵称
  is_original: boolean // 是否为原创音乐
  mid: string // 音乐的MID
  binded_challenge_id: number // 绑定的挑战ID，如果音乐与某个挑战相关联
  author_position: any // 作者的位置信息，具体含义未知
  unshelve_countries: any // 未上架的国家列表，具体含义未知
  external_song_info: any // 外部歌曲信息，具体含义未知
  artists: any // 艺术家信息，具体含义未知
  lyric_short_position: any // 歌词短位置信息，具体含义未知
  tag_list: any // 标签列表，具体含义未知
  music_chart_ranks: any // 音乐排行榜信息，具体含义未知
  artist_user_infos: any // 艺术家用户信息，具体含义未知
  musician_user_infos: any // 音乐家用户信息，具体含义未知
}

interface Image {
  uri: string // 图片的URI
  url_list: string[] // 图片的不同URL列表，可能包含不同分辨率的图片
  width: number // 图片的宽度
  height: number // 图片的高度
}

interface PlayURL {
  uri: string // 播放地址的URI
  url_list: string[] // 播放地址的不同URL列表
  width: number // 视频的宽度
  height: number // 视频的高度
  url_key: string // 播放地址的key
}
