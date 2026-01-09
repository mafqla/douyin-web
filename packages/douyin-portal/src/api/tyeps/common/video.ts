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
  download_suffix_logo_addr?: DownloadSuffixLogoAddr // 下载时视频后缀的logo地址信息（可选）
  has_download_suffix_logo_addr?: boolean // 是否有下载后缀logo地址（可选）
  play_addr_265?: PlayAddrTwoFiftyFive // H.265编码的视频播放地址信息（可选）
  play_addr_h264?: PlayAddr // H.264编码的视频播放地址信息（可选）
  video_model: string // 视频模型，具体含义未知
  tags: any[] | null // 标签信息，具体含义未知
  big_thumbs: IBigThumbs[] // 视频每帧缩略图
  meta: string // 视频元数据，包含亮度、对比度等信息
  gaussian_cover: GaussianCover // 高斯模糊封面信息
  bit_rate_audio: any // 音频比特率信息，具体含义未知
  user_digged?: number // 用户点赞数（可选）
  // 新增字段
  animated_cover?: AnimatedCover // 动画封面（可选）
  audio?: Record<string, unknown> // 音频信息（可选）
  cdn_url_expired?: number // CDN URL 过期时间（可选）
  format?: string // 视频格式，如 "mp4"（可选）
  has_watermark?: boolean // 是否有水印（可选）
  horizontal_type?: number // 水平类型（可选）
  is_bytevc1?: number // 是否 ByteVC1 编码（可选）
  is_callback?: boolean // 是否回调（可选）
  is_h265?: number // 是否 H265 编码（可选）
  is_source_HDR?: number // 是否源 HDR（可选）
  need_set_token?: boolean // 是否需要设置 token（可选）
  use_static_cover?: boolean // 是否使用静态封面（可选）
}

// 动画封面
interface AnimatedCover {
  uri: string
  url_list: string[]
}

interface IBigThumbs {
  duration: number
  fext: string
  img_num: number
  img_url: string
  img_urls: string[]
  img_x_len: number
  img_x_size: number
  img_y_len: number
  img_y_size: number
  interval: number
  uri: string
  uris: string[]
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

/**
 * 视频比特率信息
 * gear_name 命名规则: {quality}_{definition}_{codec}
 * - quality: normal(标准) / low(低) / adapt_low(自适应低) / adapt_lowest(自适应最低) / adapt(自适应)
 * - definition: 1080 / 720 / 540
 * - codec: 0(h264) / 1(h265/bytevc1)
 */
export interface BitRate {
  gear_name: string // 视频质量档位名称，如 "normal_1080_0", "adapt_lowest_720_1"
  quality_type: number // 视频质量类型标识，1=1080p, 10=720p标准, 211=720p低, 292=540p低, 291=540p自适应低, 2=1080p h265, 15=720p h265, 28=540p h265
  bit_rate: number // 视频比特率 (bps)
  play_addr: PlayAddr // 视频播放地址信息
  is_h265: number // 是否为H.265编码，0=否，1=是
  is_bytevc1?: number // 是否为Byte VC-1编码
  HDR_type: string // HDR类型
  HDR_bit: string // HDR比特信息
  FPS: number // 视频帧率
  video_extra: string // 视频额外信息JSON字符串，包含 definition, quality, file_id 等
  format: string // 视频格式，"mp4" 或 "dash"
}

/**
 * video_extra 解析后的结构
 */
export interface VideoExtra {
  PktOffsetMap?: string // 数据包偏移映射
  format: string // 格式
  definition: string // 清晰度: "1080p" | "720p" | "540p"
  quality: string // 质量: "normal" | "low" | "adapt_low" | "adapt_lowest" | "adapt"
  file_id: string // 文件ID
  applog_map?: { feature_id: string } // 日志映射
  audio_channels?: string // 音频声道
  audio_sample_rate?: string // 音频采样率
  sr_sharpness_strength?: number // 超分锐化强度
  mvmaf?: string // 视频质量评估指标
  ufq?: string // 用户体验质量
}

/**
 * 清晰度选项（用于清晰度切换插件）
 */
export interface ClarityOption {
  label: string // 显示文本，如 "高清 1080P"
  value: string // 清晰度值，如 "1080p"
  bitRate?: BitRate // 对应的比特率信息
  url?: string // 播放地址
}

/**
 * 从 bit_rate 数组解析清晰度列表
 */
export function parseClarityList(bitRates: BitRate[]): ClarityOption[] {
  const clarityMap: Record<string, ClarityOption> = {}
  const labelMap: Record<string, string> = {
    '1080p': '高清 1080P',
    '720p': '高清 720P',
    '540p': '标清 540P'
  }

  // 优先选择 mp4 格式、h264 编码的视频
  for (const br of bitRates) {
    if (br.format !== 'mp4') continue

    try {
      const extra: VideoExtra = JSON.parse(br.video_extra)
      const definition = extra.definition // "1080p", "720p", "540p"

      // 如果该清晰度还没有，或者当前是 h264 编码（优先）
      if (!clarityMap[definition] || br.is_h265 === 0) {
        clarityMap[definition] = {
          label: labelMap[definition] || definition,
          value: definition,
          bitRate: br,
          url: br.play_addr.url_list[0]
        }
      }
    } catch {
      // 解析失败，跳过
    }
  }

  // 按清晰度排序：1080p > 720p > 540p
  const order = ['1080p', '720p', '540p']
  const result: ClarityOption[] = []

  for (const def of order) {
    if (clarityMap[def]) {
      result.push(clarityMap[def])
    }
  }

  // 添加智能选项
  result.push({ label: '智能', value: 'auto' })

  return result
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
