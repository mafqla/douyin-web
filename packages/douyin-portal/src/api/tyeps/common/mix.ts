import type { IShareInfo } from './aweme'
import type { IUser } from './user'

/**
 * @description 合集信息
 */
export interface IMixInfo {
  /**
   * @description 合集作者信息
   */
  author: IUser
  /**
   * @description 创建时间（时间戳或字符串）
   */
  create_time: number | string
  /**
   * @description 更新时间（时间戳或字符串）
   */
  update_time: number | string
  /**
   * @description 合集描述
   */
  desc: string
  /**
   * @description 合集封面图
   */
  cover_url: {
    /**
     * @description 封面高度
     */
    height: number
    /**
     * @description 封面URI
     */
    uri: string
    /**
     * @description 封面URL列表
     */
    url_list: string[]
    /**
     * @description 封面宽度
     */
    width: number
  }
  /**
   * @description 分享信息
   */
  share_info: IShareInfo
  /**
   * @description 合集统计数据
   */
  statis: {
    /**
     * @description 收藏播放量
     */
    collect_vv: number
    /**
     * @description 当前观看到的集数（上次看到第几集，0表示未看过）
     */
    current_episode: number
    /**
     * @description 有更新的集数（未看的新集数）
     */
    has_updated_episode?: number
    /**
     * @description 总播放量
     */
    play_vv: number
    /**
     * @description 已更新到的集数
     */
    updated_to_episode: number
  }
  /**
   * @description 合集状态
   */
  status: {
    /**
     * @description 是否已收藏 0未收藏 1已收藏
     */
    is_collected: number
    /**
     * @description 合集状态
     */
    status: number
  }
  /**
   * @description 合集ID
   */
  mix_id: string
  /**
   * @description 合集名称
   */
  mix_name: string
  /**
   * @description 合集类型
   */
  mix_type: number
}
