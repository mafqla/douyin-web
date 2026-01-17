/**
 * 获取二维码请求参数
 */
export interface IQrcodeParams {
  /** 应用名称 */
  app_name: string
  /** schema类型 */
  schema_type: number
  /** 对象ID（用户短ID或视频ID） */
  object_id: string
  /** 二维码类型 */
  qrcode_type: number
}
