/**
 * 短剧列表响应
 */
export interface ISeriesListRes {
    // 短剧列表
    series_infos: ISeriesInfo[] | null
    // 是否有更多
    has_more: number
    // 游标
    cursor: number
    // 总数
    total: number
    // 状态码
    status_code: number
    // 状态消息
    status_msg: string
    // 额外信息
    extra: {
        fatal_item_ids: string[]
        logid: string
        now: number
    }
    log_pb: {
        impr_id: string
    }
}

/**
 * 短剧信息
 */
export interface ISeriesInfo {
    // 短剧ID
    series_id: string
    // 短剧名称
    series_name: string
    // 短剧封面
    cover_url: {
        uri: string
        url_list: string[]
        width: number
        height: number
    }
    // 短剧描述
    description: string
    // 总集数
    total_episode_count: number
    // 已更新集数
    updated_episode_count: number
    // 播放量
    play_count: number
    // 创建时间
    create_time: number
    // 更新时间
    update_time: number
    // 作者信息
    author: {
        uid: string
        sec_uid: string
        nickname: string
        avatar_thumb: {
            uri: string
            url_list: string[]
        }
    }
    // 短剧状态：0-连载中，1-已完结
    series_status: number
    // 是否付费
    is_paid: boolean
    // 付费信息
    paid_info?: {
        // 价格（分）
        price: number
        // 免费集数
        free_episode_count: number
    }
}
