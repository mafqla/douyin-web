import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

/**
 * 根据视频类型生成正确的链接
 * 图集类型（aweme_type === 68 且不是实况照片）跳转到 /note/:id
 * 其他类型跳转到 /video/:id
 */
export function getAwemeLink(aweme: IAwemeInfo): string {
    const isImageGallery = aweme.aweme_type === 68 && aweme.is_live_photo !== 1
    return isImageGallery ? `/note/${aweme.aweme_id}` : `/video/${aweme.aweme_id}`
}

/**
 * 根据视频信息判断是否为图集类型
 */
export function isImageGalleryType(aweme: IAwemeInfo): boolean {
    return aweme.aweme_type === 68 && aweme.is_live_photo !== 1
}
