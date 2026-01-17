/**
 * 二维码URL信息
 */
export interface IQrcodeUrl {
  /** 二维码URI */
  uri: string
  /** 二维码URL列表（多个CDN地址） */
  url_list: string[]
}

/**
 * 额外信息
 */
export interface IQrcodeExtra {
  /** 致命项ID列表 */
  fatal_item_ids: any[]
  /** 日志ID */
  logid: string
  /** 当前时间戳 */
  now: number
}

/**
 * 日志PB信息
 */
export interface IQrcodeLogPb {
  /** 曝光ID */
  impr_id: string
}

/**
 * 获取二维码响应
 */
export interface IQrcodeRes {
  /** 事件额外信息（JSON字符串） */
  event_extra: string
  /** 额外信息 */
  extra: IQrcodeExtra
  /** 日志PB */
  log_pb: IQrcodeLogPb
  /** 二维码URL信息 */
  qrcode_url: IQrcodeUrl
  /** 状态码 0表示成功 */
  status_code: number
}
