/**
 * 直播流工具函数
 * 用于处理直播流 URL 的获取和解析
 */

import type { ILiveStreamUrl } from '@/api/tyeps/request_response/followLiveFeedRes'

/**
 * 从直播流数据中获取所有可用的流 URL
 * @param streamUrl 直播流数据对象
 * @returns 包含所有可用流 URL 的数组（HLS 和 FLV）
 */
export function getLiveStreamUrls(streamUrl?: ILiveStreamUrl): string[] {
    if (!streamUrl) return []

    const urls: string[] = []
    const hlsMap = streamUrl.hls_pull_url_map
    const flvMap = streamUrl.flv_pull_url

    // 添加所有 HLS 流（按清晰度从高到低）
    if (hlsMap?.FULL_HD1) urls.push(hlsMap.FULL_HD1)
    if (hlsMap?.HD1) urls.push(hlsMap.HD1)
    if (hlsMap?.SD1) urls.push(hlsMap.SD1)
    if (hlsMap?.SD2) urls.push(hlsMap.SD2)

    // 如果 map 中没有，使用默认的 hls_pull_url
    if (urls.length === 0 && streamUrl.hls_pull_url) {
        urls.push(streamUrl.hls_pull_url)
    }

    // 添加所有 FLV 流作为备用（按清晰度从高到低）
    if (flvMap?.FULL_HD1) urls.push(flvMap.FULL_HD1)
    if (flvMap?.HD1) urls.push(flvMap.HD1)
    if (flvMap?.SD1) urls.push(flvMap.SD1)
    if (flvMap?.SD2) urls.push(flvMap.SD2)

    // 去重并返回
    return [...new Set(urls)]
}

/**
 * 仅获取 HLS 流 URL
 * @param streamUrl 直播流数据对象
 * @returns 包含所有 HLS 流 URL 的数组
 */
export function getHlsStreamUrls(streamUrl?: ILiveStreamUrl): string[] {
    if (!streamUrl) return []

    const urls: string[] = []
    const hlsMap = streamUrl.hls_pull_url_map

    if (hlsMap?.FULL_HD1) urls.push(hlsMap.FULL_HD1)
    if (hlsMap?.HD1) urls.push(hlsMap.HD1)
    if (hlsMap?.SD1) urls.push(hlsMap.SD1)
    if (hlsMap?.SD2) urls.push(hlsMap.SD2)

    // 如果 map 中没有，使用默认的 hls_pull_url
    if (urls.length === 0 && streamUrl.hls_pull_url) {
        urls.push(streamUrl.hls_pull_url)
    }

    return [...new Set(urls)]
}

/**
 * 仅获取 FLV 流 URL
 * @param streamUrl 直播流数据对象
 * @returns 包含所有 FLV 流 URL 的数组
 */
export function getFlvStreamUrls(streamUrl?: ILiveStreamUrl): string[] {
    if (!streamUrl) return []

    const urls: string[] = []
    const flvMap = streamUrl.flv_pull_url

    if (flvMap?.FULL_HD1) urls.push(flvMap.FULL_HD1)
    if (flvMap?.HD1) urls.push(flvMap.HD1)
    if (flvMap?.SD1) urls.push(flvMap.SD1)
    if (flvMap?.SD2) urls.push(flvMap.SD2)

    return [...new Set(urls)]
}

/**
 * 获取最佳质量的流 URL（优先 HLS）
 * @param streamUrl 直播流数据对象
 * @returns 最佳质量的流 URL，如果没有则返回空字符串
 */
export function getBestQualityStreamUrl(streamUrl?: ILiveStreamUrl): string {
    if (!streamUrl) return ''

    const hlsMap = streamUrl.hls_pull_url_map
    const flvMap = streamUrl.flv_pull_url

    // 优先返回 HLS 最高清晰度
    if (hlsMap?.FULL_HD1) return hlsMap.FULL_HD1
    if (hlsMap?.HD1) return hlsMap.HD1
    if (streamUrl.hls_pull_url) return streamUrl.hls_pull_url

    // 如果没有 HLS，返回 FLV 最高清晰度
    if (flvMap?.FULL_HD1) return flvMap.FULL_HD1
    if (flvMap?.HD1) return flvMap.HD1

    return ''
}

/**
 * 检测流类型
 * @param url 流 URL
 * @returns 流类型字符串
 */
export function detectStreamType(url: string): 'HLS' | 'FLV' | 'HTTP-FLV' | 'RTMP' | 'WebRTC' | 'MP4' | 'HTTP' | 'Unknown' {
    const urlLower = url.toLowerCase()

    if (urlLower.includes('.m3u8')) return 'HLS'
    if (urlLower.includes('.flv')) return 'FLV'
    if (urlLower.startsWith('rtmp://') || urlLower.startsWith('rtmps://')) return 'RTMP'
    if (urlLower.startsWith('webrtc://') || urlLower.includes('webrtc')) return 'WebRTC'
    if (urlLower.includes('http') && urlLower.includes('flv')) return 'HTTP-FLV'
    if (urlLower.includes('.mp4')) return 'MP4'
    if (urlLower.startsWith('http://') || urlLower.startsWith('https://')) return 'HTTP'

    return 'Unknown'
}

/**
 * 从 URL 推断清晰度
 * @param url 流 URL
 * @returns 清晰度描述字符串
 */
export function detectStreamQuality(url: string): string {
    const urlLower = url.toLowerCase()

    // 从 URL 中检测清晰度标识
    if (urlLower.includes('_or4') || urlLower.includes('origin')) return '原画'
    if (urlLower.includes('4k') || urlLower.includes('2160p') || urlLower.includes('uhd')) return '超清 4K'
    if (urlLower.includes('1080p') || urlLower.includes('fhd') || urlLower.includes('fullhd') || urlLower.includes('full_hd')) return '高清 1080P'
    if (urlLower.includes('720p') || urlLower.includes('hd') || urlLower.includes('_hd')) return '高清 720P'
    if (urlLower.includes('540p')) return '标清 540P'
    if (urlLower.includes('480p') || urlLower.includes('sd') || urlLower.includes('_sd')) return '标清 480P'
    if (urlLower.includes('360p')) return '流畅 360P'
    if (urlLower.includes('240p') || urlLower.includes('_ld')) return '流畅 240P'

    // 尝试从 URL 参数中提取清晰度
    const qualityMatch = url.match(/quality[=_](\w+)/i)
    if (qualityMatch) {
        const quality = qualityMatch[1].toLowerCase()
        if (quality.includes('origin') || quality.includes('source')) return '原画'
        if (quality.includes('high') || quality.includes('hd')) return '高清'
        if (quality.includes('medium') || quality.includes('md')) return '标清'
        if (quality.includes('low') || quality.includes('ld')) return '流畅'
    }

    return '高清'
}
