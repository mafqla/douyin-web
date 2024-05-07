export interface IVideo {
  play_addr: PlayAddr // 视频播放地址信息
  cover: Cover // 视频封面信息
  height: number // 视频高度
  width: number // 视频宽度
  dynamic_cover: DynamicCover // 视频动态封面信息
  origin_cover: OriginCover // 视频原始封面信息
  ratio: string // 视频的宽高比
  download_addr: DownloadAddr // 视频下载地址信息
  play_addr_lowbr: PlayAddrLowbr // 低比特率视频播放地址信息
  bit_rate: BitRate[] // 视频的比特率信息
  duration: number // 视频时长
  download_suffix_logo_addr: DownloadSuffixLogoAddr // 下载时视频后缀的logo地址信息
  has_download_suffix_logo_addr: boolean // 是否有下载后缀logo地址
  play_addr_265: PlayAddrTwoFiftyFive // H.265编码的视频播放地址信息
  video_model: string // 视频模型，具体含义未知
  tags: any[] // 标签信息，具体含义未知
  big_thumbs: any // 大拇指信息，具体含义未知
  meta: string // 视频元数据，包含亮度、对比度等信息
  gaussian_cover: GaussianCover // 高斯模糊封面信息
  bit_rate_audio: any // 音频比特率信息，具体含义未知
  user_digged: number // 用户点赞数
}

interface PlayAddr {
  uri: string // 播放地址的URI
  url_list: string[] // 播放地址的URL列表
  width: number // 视频宽度
  height: number // 视频高度
  url_key: string // 播放地址的key
  data_size: number // 视频数据大小
  file_hash: string // 视频文件的哈希值
  file_cs: string // 视频文件的校验码
}

interface Cover {
  uri: string // 封面图片的URI
  url_list: string[] // 封面图片的URL列表
  width: number // 封面图片的宽度
  height: number // 封面图片的高度
}

interface DynamicCover {
  uri: string // 动态封面图片的URI
  url_list: string[] // 动态封面图片的URL列表
  width: number // 动态封面图片的宽度
  height: number // 动态封面图片的高度
}

interface OriginCover {
  uri: string // 原始封面图片的URI
  url_list: string[] // 原始封面图片的URL列表
  width: number // 原始封面图片的宽度
  height: number // 原始封面图片的高度
}

interface DownloadAddr {
  uri: string // 下载地址的URI
  url_list: string[] // 下载地址的URL列表
  width: number // 视频宽度
  height: number // 视频高度
  data_size: number // 视频数据大小
  file_cs: string // 视频文件的校验码
}

interface PlayAddrLowbr {
  uri: string // 低比特率播放地址的URI
  url_list: string[] // 低比特率播放地址的URL列表
  width: number // 视频宽度
  height: number // 视频高度
  url_key: string // 低比特率播放地址的key
  data_size: number // 视频数据大小
  file_hash: string // 视频文件的哈希值
  file_cs: string // 视频文件的校验码
}

interface BitRate {
  gear_name: string // 视频质量的名称
  quality_type: number // 视频质量的类型
  bit_rate: number // 视频的比特率
  play_addr: PlayAddr // 视频播放地址信息
  is_h265: number // 是否为H.265编码
  is_bytevc1: number // 是否为Byte VC-1编码
  HDR_type: string // HDR类型
  HDR_bit: string // HDR比特信息
  FPS: number // 视频的帧率
  video_extra: string // 视频的额外信息
  format: string // 视频格式
}

interface DownloadSuffixLogoAddr {
  uri: string // 下载后缀logo地址的URI
  url_list: string[] // 下载后缀logo地址的URL列表
  width: number // 视频宽度
  height: number // 视频高度
  data_size: number // 视频数据大小
  file_cs: string // 视频文件的校验码
}

interface PlayAddrTwoFiftyFive {
  uri: string // H.265编码的播放地址URI
  url_list: string[] // H.265编码的播放地址URL列表
  width: number // 视频宽度
  height: number // 视频高度
  url_key: string // H.265编码的播放地址的key
  data_size: number // 视频数据大小
  file_hash: string // 视频文件的哈希值
  file_cs: string // 视频文件的校验码
}

interface GaussianCover {
  uri: string // 高斯模糊封面的URI
  url_list: string[] // 高斯模糊封面的URL列表
  width: number // 高斯模糊封面的宽度
  height: number // 高斯模糊封面的高度
}
