import type { IAwemeInfo } from '../common/aweme'

/**
 * 私密作品列表响应
 */
export interface IPrivateAwemeRes {
    // 是否聚合分享故事
    aggr_shared_story: boolean
    // 作品列表
    aweme_list: IAwemeInfo[]
    // 额外信息
    extra: {
        fatal_item_ids: string[]
        logid: string
        now: number
    }
    // 是否有更多
    has_more: number
    // 日志信息
    log_pb: {
        impr_id: string
    }
    // 向下分页游标
    max_cursor: number
    // 向上分页游标
    min_cursor: number
    // 状态码
    status_code: number
}
