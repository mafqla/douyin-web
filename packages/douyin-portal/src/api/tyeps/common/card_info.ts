/**
 * 表示 CardInfoDisplayTitle 的接口
 */
interface CardInfoDisplayTitle {
  text: string // 标题文本
  pos: any[] // 相关位置信息，具体类型未明确
  b_pos: any[] // 相关位置信息，具体类型未明确
  marked: string // 标记的标题文本
}

/**
 * 表示 CardInfoDisplayEmphasized 的接口
 */
interface CardInfoDisplayEmphasized {
  title: string // 强调的标题
  summary: string // 概述或简介
}

/**
 * 表示 CardInfoDisplaySummary 的接口
 */
interface CardInfoDisplaySummary {
  pos: any[] // 相关位置信息，具体类型未明确
  b_pos: any[] // 相关位置信息，具体类型未明确
  marked: string // 标记的摘要文本
  text: string // 摘要文本
}

/**
 * 表示 CardInfoDisplayContentOrigin 的接口
 */
interface CardInfoDisplayContentOrigin {
  content_origin: string // 内容来源
  info: {
    enable_ua: boolean // 是否启用用户代理
    icon_name: string // 图标名称
    app_download: boolean // 是否允许应用下载
    domain: string // 域名
    images: string[] // 图片 URL 数组
    url: string // 页面 URL
    site_name: string // 网站名称
    image_count: number // 图片数量
    time_factor_string: string // 时间因子字符串
    time_factor: number // 时间因子
    type: string // 类型
    icon_img: string // 图标图片 URL
    preload: {
      js: string[] // 预加载的 JavaScript 文件 URL 数组
      css: string[] // 预加载的 CSS 文件 URL 数组
      html: string[] // 预加载的 HTML 资源 URL 数组
    }
    docid: string // 文档 ID
    host: string // 主机名
    is_web: boolean // 是否为网页内容
    _comment: string // 特殊注释
  }
  data_ext: {
    has_mipcdn: boolean // 是否有 MIP CDN
    display_extra_data: {
      accept_images_docid: string[] // 接受的图片文档 ID 数组
      pic_and_abstract: boolean // 是否包含图片和摘要
    }
    is_title_full_matched: boolean // 标题是否完全匹配
  }
}

/**
 * 表示卡片信息的接口
 */
export interface CardInfo {
  id: number // 卡片的唯一标识符
  id_str: string // 卡片的唯一标识符字符串形式
  now_time: string // 当前时间戳
  cell_type: number // 单元格类型
  display: {
    title: CardInfoDisplayTitle // 标题信息
    emphasized: CardInfoDisplayEmphasized // 强调的标题和概述
    summary: CardInfoDisplaySummary // 摘要信息
    content_origin: CardInfoDisplayContentOrigin // 内容来源信息
  }
  doc_id: number // 文档 ID
  ala_src: string // 来源
  keyinfo: object // 关键词信息，具体内容未明确
}
