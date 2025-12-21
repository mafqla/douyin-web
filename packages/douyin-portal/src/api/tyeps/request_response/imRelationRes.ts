/**
 * IM关系列表（分享好友列表）响应类型
 * 接口: /aweme/v1/web/im/spotlight/relation/
 */

/**
 * 头像信息
 */
export interface IImAvatarInfo {
    /** 头像URI */
    uri: string
    /** 头像URL列表 */
    url_list: string[]
}

/**
 * IM关系用户信息（分享好友）
 */
export interface IImRelationUser {
    /** 账号认证信息 JSON字符串 */
    account_cert_info: string
    /** 头像签名 */
    avatar_signature: string
    /** 小头像 168x168 */
    avatar_small: IImAvatarInfo
    /** 缩略头像 100x100 */
    avatar_thumb: IImAvatarInfo
    /** 生日隐藏级别 0-显示 1-隐藏 */
    birthday_hide_level: number
    /** 祝福结束时间戳 */
    bless_end_time?: number
    /** 商业用户等级 */
    commerce_user_level: number
    /** 自定义认证 */
    custom_verify: string
    /** 企业认证原因 */
    enterprise_verify_reason: string
    /** 关注状态 0-未关注 1-已关注 */
    follow_status: number
    /** 粉丝状态 0-不是粉丝 1-是粉丝 */
    follower_status: number
    /** 是否有企业账号角色 */
    has_e_account_role: boolean
    /** IM活跃度 0-不活跃 1-低 2-中 3-高 */
    im_activeness: number
    /** IM气泡过期时间 */
    im_bubble_exp?: number
    /** IM气泡ID */
    im_bubble_id?: number
    /** IM角色ID列表 */
    im_role_ids: number[]
    /** 是否是海外IM用户 */
    is_im_oversea_user: number
    /** 用户昵称 */
    nickname: string
    /** 用户sec_uid */
    sec_uid: string
    /** 短ID */
    short_id: string
    /** 用户签名 */
    signature: string
    /** 社交关系子类型 */
    social_relation_sub_type: number
    /** 社交关系类型 */
    social_relation_type: number
    /** 存储区域 */
    store_region: string
    /** 用户ID */
    uid: string
    /** 唯一ID（抖音号） */
    unique_id: string
    /** 认证类型 0-未认证 1-已认证 */
    verification_type: number
    /** 直播特殊信息 */
    webcast_sp_info: Record<string, unknown>
    /** AI分身sec_uid */
    ai_double_sec_uid?: string
}

/**
 * 额外信息
 */
export interface IImRelationExtra {
    /** 致命项ID列表 */
    fatal_item_ids: string[]
    /** 日志ID */
    logid: string
    /** 当前时间戳 */
    now: number
}

/**
 * IM关系列表响应
 */
export interface IImRelationRes {
    /** 异常排序标识 */
    abnormal_sorted: number
    /** 额外信息 */
    extra: IImRelationExtra
    /** 关注列表（好友列表） */
    followings: IImRelationUser[]
    /** 是否还有更多 */
    has_more?: boolean
    /** 最小时间戳（用于分页） */
    min_time?: number
    /** 最大时间戳（用于分页） */
    max_time?: number
    /** 状态码 0-成功 */
    status_code?: number
}
