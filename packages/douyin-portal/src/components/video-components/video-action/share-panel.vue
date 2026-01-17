<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import apis from '@/api/apis'
import type { IImAvatarInfo } from '@/api/tyeps/request_response/imRelationRes'
import type { BitRate } from '@/api/tyeps/common/video'
import { Toast } from '@/components/ui/toast'
import { Loading } from '@/components/common'

// 分享面板中使用的简化用户类型
interface IShareUser {
  user_id: string
  uid: string
  sec_uid: string
  nickname: string
  signature: string
  unique_id: string
  avatar_thumb: IImAvatarInfo
  avatar_medium: IImAvatarInfo
}

const props = defineProps({
  // 是否显示底部操作栏（复制链接、下载、二维码、抖音）
  showBottomActions: {
    type: Boolean,
    default: false
  },
  // 分享链接
  shareUrl: {
    type: String,
    default: ''
  },
  // 分享标题
  shareTitle: {
    type: String,
    default: ''
  },
  // 视频ID
  awemeId: {
    type: String,
    default: ''
  },
  // 视频比特率信息（用于下载最高画质）
  bitRates: {
    type: Array as () => BitRate[],
    default: () => []
  },
  // 视频描述（用于下载文件名）
  videoDesc: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  (e: 'share', userId: string): void
  (e: 'copyLink'): void
  (e: 'download'): void
  (e: 'searchFocus'): void
  (e: 'searchBlur'): void
}>()

// 生成的二维码 URL
const generatedQrcode = ref('')
// 是否正在加载二维码
const isLoadingQrcode = ref(false)

// 根据 awemeId 获取二维码
const fetchQrcode = async () => {
  if (!props.awemeId) {
    generatedQrcode.value = ''
    return
  }
  
  // 如果已经有二维码，不重复请求
  if (generatedQrcode.value) {
    return
  }

  isLoadingQrcode.value = true
  try {
    const res = await apis.getQrcodeInfo({
      app_name: 'aweme',
      schema_type: 1, // 1=视频类型
      object_id: props.awemeId,
      qrcode_type: 1
    })
    
    if (res.status_code === 0 && res.qrcode_url?.url_list?.length > 0) {
      // 使用返回的第一个二维码URL
      generatedQrcode.value = res.qrcode_url.url_list[0]
    } else {
      console.error('获取二维码失败:', res)
      generatedQrcode.value = ''
    }
  } catch (error) {
    console.error('获取二维码失败:', error)
    generatedQrcode.value = ''
  } finally {
    isLoadingQrcode.value = false
  }
}

// 监听 awemeId 变化，重新获取二维码
watch(() => props.awemeId, () => {
  generatedQrcode.value = '' // 清空旧的二维码
  fetchQrcode()
}, { immediate: true })

// 搜索关键词
const searchQuery = ref('')
// 好友列表
const friendList = ref<IShareUser[]>([])
// 是否正在加载
const isLoading = ref(false)
// 是否正在加载更多
const isLoadingMore = ref(false)
// 是否还有更多数据
const hasMore = ref(true)
// 分页时间戳
const maxTime = ref(Date.now())
// 是否显示搜索结果
const isSearching = computed(() => searchQuery.value.trim() !== '')
// 滚动容器引用
const scrollRef = ref<HTMLElement | null>(null)
// 是否正在下载
const isDownloading = ref(false)

// 过滤后的好友列表（根据搜索关键词）
const filteredFriendList = computed(() => {
  if (!isSearching.value) {
    return friendList.value
  }
  const query = searchQuery.value.trim()
  if (!query) return friendList.value

  return friendList.value.filter((user) => {
    const nickname = user.nickname || ''
    const regex = new RegExp(query, 'i')
    return regex.test(nickname)
  })
})

// 高亮搜索关键词
const highlightText = (text: string) => {
  if (!isSearching.value || !text) return text
  const query = searchQuery.value
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 获取IM关系列表（分享好友列表）
const fetchImRelationList = async (isLoadMore = false) => {
  if (isLoadMore) {
    if (!hasMore.value || isLoadingMore.value) return
    isLoadingMore.value = true
  } else {
    isLoading.value = true
  }

  try {
    const res = await apis.getImRelationList({
      count: 50,
      max_time: isLoadMore ? maxTime.value : Date.now(),
      min_time: 1550248238
    })
    if (res.status_code === 0) {
      // 按 follower_status 排序，互关朋友（follower_status === 1）排在前面
      const sortedFollowings = [...(res.followings || [])].sort((a, b) => {
        return (b.follower_status || 0) - (a.follower_status || 0)
      })

      const users = sortedFollowings.map((user) => ({
        user_id: user.uid,
        uid: user.uid,
        sec_uid: user.sec_uid,
        nickname: user.nickname,
        signature: user.signature,
        unique_id: user.unique_id,
        avatar_thumb: user.avatar_thumb,
        avatar_medium: user.avatar_small
      }))

      if (isLoadMore) {
        friendList.value = [...friendList.value, ...users]
      } else {
        friendList.value = users
      }

      // 更新分页信息
      hasMore.value = res.has_more ?? false
      if (res.max_time) {
        maxTime.value = res.max_time
      }
    }
  } catch (error) {
    console.error('获取IM关系列表失败:', error)
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

// 滚动加载更多
const handleScroll = (e: Event) => {
  if (isSearching.value) return
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  // 距离底部 50px 时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    fetchImRelationList(true)
  }
}

// 分享给用户
const handleShare = async (userId: string) => {
  if (!props.shareUrl) {
    Toast.warning('暂无分享链接')
    return
  }
  try {
    await navigator.clipboard.writeText(props.shareUrl)
    Toast.success('链接已复制')
    emit('share', userId)
  } catch (error) {
    Toast.error('复制失败')
  }
}

// 复制链接
const handleCopyLink = async () => {
  if (!props.shareUrl) {
    Toast.warning('暂无分享链接')
    return
  }
  try {
    await navigator.clipboard.writeText(props.shareUrl)
    Toast.success('链接已复制')
    emit('copyLink')
  } catch (error) {
    Toast.error('复制失败')
  }
}

// 获取所有可用的下载地址（按画质排序）
const getDownloadUrls = (): string[] => {
  if (!props.bitRates || props.bitRates.length === 0) return []

  const urls: string[] = []
  const order = ['1080p', '720p', '540p']

  // 按清晰度排序收集所有 mp4 格式的地址
  for (const def of order) {
    for (const br of props.bitRates) {
      if (br.format !== 'mp4') continue
      try {
        const extra = JSON.parse(br.video_extra)
        if (extra.definition === def) {
          // 添加该清晰度的所有可用地址
          br.play_addr.url_list.forEach((url) => {
            if (url && !urls.includes(url)) {
              urls.push(url)
            }
          })
        }
      } catch {}
    }
  }

  // 兜底：添加所有 mp4 格式的地址
  for (const br of props.bitRates) {
    if (br.format === 'mp4') {
      br.play_addr.url_list.forEach((url) => {
        if (url && !urls.includes(url)) {
          urls.push(url)
        }
      })
    }
  }

  return urls
}

// 生成下载文件名
const getDownloadFileName = (): string => {
  // 使用视频描述，去除特殊字符
  let name = props.videoDesc || ''
  // 去除特殊字符，只保留中文、英文、数字、空格
  name = name.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '').trim()
  // 截取前50个字符
  name = name.slice(0, 50)
  // 如果为空，使用视频ID
  if (!name) {
    name = `video_${props.awemeId || Date.now()}`
  }
  return `${name}.mp4`
}

// 下载视频
const handleDownload = async () => {
  const urls = getDownloadUrls()
  if (urls.length === 0) {
    Toast.warning('暂无可下载的视频')
    return
  }

  if (isDownloading.value) {
    Toast.info('正在下载中...')
    return
  }

  isDownloading.value = true
  const fileName = getDownloadFileName()

  Toast.info('正在下载视频...')

  // 遍历所有下载地址，直到成功
  for (let i = 0; i < urls.length; i++) {
    let url = urls[i]
    console.log(`尝试下载地址 ${i + 1}/${urls.length}:`, url)

    // 将抖音相关域名转换为代理地址
    if (url.includes('douyin.com')) {
      url = url.replace(/https?:\/\/[^/]*douyin\.com/, '/douyin')
    }

    try {
      const response = await fetch(url)
      console.log('响应状态:', response.status, response.statusText)

      if (!response.ok) {
        console.warn(`地址 ${i + 1} 失败: ${response.status}`)
        continue
      }

      const blob = await response.blob()
      console.log('Blob 大小:', blob.size, 'bytes')

      // 检查是否是有效的视频文件
      if (blob.size < 1000) {
        console.warn(`地址 ${i + 1} 返回数据太小，跳过`)
        continue
      }

      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)

      Toast.success('下载成功')
      emit('download')
      isDownloading.value = false
      return
    } catch (error) {
      console.warn(`地址 ${i + 1} 下载失败:`, error)
      continue
    }
  }

  // 所有地址都失败
  Toast.error('下载失败，请重试')
  isDownloading.value = false
}

onMounted(() => {
  fetchImRelationList()
})
</script>

<template>
  <div class="share-panel" @wheel.stop @touchmove.stop>
    <!-- 搜索框 -->
    <div class="search-wrapper">
      <div class="search-input-box">
        <div class="search-icon">
          <svg
            width="14"
            height="14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 .333a5.667 5.667 0 1 0 3.237 10.318l2.722 2.723a1 1 0 0 0 1.414-1.415l-2.722-2.722A5.667 5.667 0 0 0 6 .333zM2.333 6a3.667 3.667 0 1 1 7.333 0 3.667 3.667 0 0 1-7.333 0z"
              fill="#fff"
              fill-opacity=".5"
            ></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="搜索"
          @focus="emit('searchFocus')"
          @blur="emit('searchBlur')"
        />
        <div class="clear-btn" v-if="searchQuery" @click="searchQuery = ''">
          清除
        </div>
      </div>
    </div>

    <!-- 好友列表 -->
    <div
      ref="scrollRef"
      class="friend-list-wrapper"
      @wheel.stop
      @touchmove.stop
      @scroll="handleScroll"
    >
      <Loading :show="isLoading">
        <!-- 搜索结果（仅搜索时显示匹配的用户） -->
        <template v-if="isSearching && filteredFriendList.length > 0">
          <div
            v-for="user in filteredFriendList"
            :key="'search-' + (user.user_id || user.uid)"
            class="friend-item"
          >
            <div class="friend-avatar">
              <img
                class="avatar-img"
                :src="
                  user.avatar_thumb?.url_list?.[0] ||
                  user.avatar_medium?.url_list?.[0]
                "
                alt=""
              />
            </div>
            <div class="friend-info">
              <div class="friend-name">
                <span v-html="highlightText(user.nickname || '')"></span>
              </div>
            </div>
            <button
              class="share-btn"
              @click="handleShare(user.user_id || user.uid || '')"
            >
              分享
            </button>
          </div>
        </template>

        <!-- 搜索无结果 -->
        <div
          v-if="isSearching && filteredFriendList.length === 0"
          class="empty-search"
        >
          没有搜索到朋友
        </div>

        <!-- 分享给朋友标题 -->
        <div class="section-title">分享给朋友</div>

        <!-- 好友列表 -->
        <div
          v-for="user in friendList"
          :key="'friend-' + (user.user_id || user.uid)"
          class="friend-item"
        >
          <div class="friend-avatar">
            <img
              class="avatar-img"
              :src="
                user.avatar_thumb?.url_list?.[0] ||
                user.avatar_medium?.url_list?.[0]
              "
              alt=""
            />
          </div>
          <div class="friend-info">
            <div class="friend-name">{{ user.nickname }}</div>
          </div>
          <button
            class="share-btn"
            @click="handleShare(user.user_id || user.uid || '')"
          >
            分享
          </button>
        </div>

        <!-- 加载更多 -->
        <Loading :show="isLoadingMore" />

        <!-- 没有更多 -->
        <div v-if="!hasMore && friendList.length > 0" class="no-more">
          没有更多了
        </div>

        <!-- 空状态 -->
        <div v-if="friendList.length === 0 && !isLoading" class="empty-state">
          暂无好友
        </div>
      </Loading>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-actions" v-if="showBottomActions">
      <!-- 复制链接 -->
      <div class="action-item-wrapper">
        <button class="action-btn copy-link-btn" @click="handleCopyLink">
          <svg
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path
              d="M6.6 9.428a3.35 3.35 0 0 1-.423-.516l.976-.976a2 2 0 0 0 3.218.549L12.257 6.6A2 2 0 1 0 9.428 3.77L8.32 4.881a4.281 4.281 0 0 0-1.726-.16l.007-.007 1.885-1.886A3.333 3.333 0 1 1 13.2 7.542l-1.885 1.886a3.333 3.333 0 0 1-4.714 0z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
            <path
              d="M9.857 7.125l-.977.977a2 2 0 0 0-3.223-.56L3.77 9.428A2 2 0 0 0 6.6 12.257l1.14-1.141c.565.17 1.158.218 1.739.146a3.26 3.26 0 0 1-.051.052l-1.886 1.885a3.333 3.333 0 0 1-4.714-4.714L4.714 6.6a3.333 3.333 0 0 1 5.143.525z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
          </svg>
          <span>复制链接</span>
        </button>
        <div class="action-tooltip">复制链接</div>
      </div>

      <div class="action-divider"></div>

      <!-- 下载 -->
      <div class="action-item-wrapper">
        <button
          class="action-btn icon-only"
          @click="handleDownload"
          :disabled="isDownloading"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path
              d="M7.998 12a.665.665 0 0 1-.474-.198L3.755 8.033a.667.667 0 1 1 .943-.942l2.633 2.633V2a.667.667 0 0 1 1.334 0v7.726L11.3 7.09a.667.667 0 1 1 .943.942L8.47 11.805c-.13.13-.3.195-.47.195h-.003zM12 14.667a.667.667 0 1 0 0-1.334H4a.667.667 0 0 0 0 1.334h8z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
          </svg>
        </button>
        <div class="action-tooltip">下载</div>
      </div>

      <!-- 二维码 -->
      <div class="action-item-wrapper qrcode-wrapper">
        <button class="action-btn icon-only">
          <svg
            width="16"
            height="16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 3.333C2 2.597 2.597 2 3.333 2H6c.736 0 1.333.597 1.333 1.333V6c0 .736-.597 1.333-1.333 1.333H3.333A1.333 1.333 0 0 1 2 6V3.333zm4 0H3.333V6H6V3.333zM2 10c0-.736.597-1.333 1.333-1.333H6c.736 0 1.333.597 1.333 1.333v2.667C7.333 13.403 6.736 14 6 14H3.333A1.333 1.333 0 0 1 2 12.667V10zm4 0H3.333v2.667H6V10z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
            <path
              d="M10 9.333a.667.667 0 0 0-1.333 0v4a.667.667 0 1 0 1.333 0v-4zM13.333 8.667c.368 0 .667.298.667.666v4a.667.667 0 0 1-1.333 0v-4c0-.368.298-.666.666-.666zM12 9.333a.667.667 0 0 0-1.333 0v1a.667.667 0 1 0 1.333 0v-1zM11.333 11.667c.368 0 .667.298.667.666v1a.667.667 0 0 1-1.333 0v-1c0-.368.298-.666.666-.666z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 2c-.736 0-1.333.597-1.333 1.333V6c0 .736.597 1.333 1.333 1.333h2.667C13.403 7.333 14 6.736 14 6V3.333C14 2.597 13.403 2 12.667 2H10zm0 1.333h2.667V6H10V3.333z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
          </svg>
        </button>
        <div class="action-tooltip qrcode-tooltip" v-if="generatedQrcode">
          <div class="qrcode-tooltip-wrapper">
            <div class="qrcode-img-wrapper">
              <img
                :src="generatedQrcode"
                :alt="shareTitle"
                class="qrcode-img"
              />
            </div>
            <div class="qrcode-tip">抖音 app 扫码观看</div>
          </div>
        </div>
        <div class="action-tooltip" v-else>二维码</div>
      </div>

      <!-- 抖音 DOU+ -->
      <div class="action-item-wrapper">
        <button class="action-btn icon-only">
          <svg
            width="25"
            height="24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 24"
          >
            <path
              d="M20.214 14.273l.088-.823h.807a.412.412 0 0 0 .408-.41c0-.121-.06-.224-.138-.294a.448.448 0 0 0-.295-.116h-.702l.082-.707c.039-.245-.164-.419-.36-.452-.247-.041-.42.165-.453.362l-.088.822h-.807a.412.412 0 0 0-.409.41c0 .224.184.41.409.41h.727l-.083.707c-.036.233.154.417.371.454.219 0 .406-.14.443-.363z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
            <path
              d="M24.013 13.037c.115-.963.102-2.04-.189-2.977a.435.435 0 0 0-.385-.301c-.048-.007-.096.01-.143.017l-.592.192c-.218-1.384-.804-2.14-1.547-2.567a.485.485 0 0 0-.232-.068.385.385 0 0 0-.221.078.468.468 0 0 0-.154.19l-.004.008-.002.01c-.126.452-.47 1.113-1.459 1.655-.64.355-1.195.691-1.649 1.063l.179-1.706a.655.655 0 1 0-1.303-.137l-.576 5.489c-.081.704-.77 1.33-1.552 1.33-.744 0-1.217-.555-1.146-1.186v-.005l.577-5.491a.655.655 0 0 0-1.303-.137l-.576 5.49c-.165 1.47.989 2.64 2.448 2.64 1.042 0 2.006-.592 2.508-1.458.686.947 1.863 1.545 3.206 1.545 1.964 0 3.834-1.517 4.115-3.672v-.002zm-2.239-1.693l1.076-.33c.062.485.123 1.149.03 1.872-.186 1.542-1.491 2.722-3.013 2.722-.808 0-1.554-.304-2.051-.818-.31-.332-.713-.906-.651-1.75v-.004c.031-.665.225-1.148.62-1.582.397-.435.995-.82 1.836-1.29l.002-.002c.65-.332 1.177-.754 1.52-1.296.214.33.337.722.43 1.233v.001l.186 1.234a.012.012 0 0 0 .015.01zM.864 8.442a.655.655 0 0 1 .651-.586h1.136c1.885 0 3.267 1.544 3.076 3.433v.003l-.205 1.938c-.206 1.813-1.817 3.293-3.65 3.293H.735a.655.655 0 0 1-.652-.725l.78-7.356zm1.241.725l-.64 6.045h.406c1.15 0 2.215-.96 2.349-2.128l.203-1.927c.113-1.128-.674-1.99-1.772-1.99h-.546zM9.142 7.522c-1.444 0-2.702 1.158-2.855 2.585l-.373 3.561-.001.008c-.136 1.474.95 2.716 2.449 2.716 1.444 0 2.701-1.158 2.855-2.585v-.002l.373-3.56v-.007c.137-1.474-.949-2.716-2.448-2.716zM7.218 13.8l.372-3.553c.084-.775.792-1.414 1.552-1.414.702 0 1.21.552 1.144 1.28l-.372 3.554c-.084.776-.793 1.414-1.552 1.414-.703 0-1.21-.553-1.144-1.28z"
              fill="#fff"
              fill-opacity=".9"
            ></path>
          </svg>
        </button>
        <div class="action-tooltip">助力视频快速上热门</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.share-panel {
  background: var(--color-bg-b1-white);
  box-shadow: var(--shadow-2);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  width: 300px;
  min-width: 300px;
  min-height: 300px;

  // 搜索框
  .search-wrapper {
    padding: 12px 12px 8px;
    flex-shrink: 0;

    .search-input-box {
      display: flex;
      align-items: center;
      background-color: var(--color-secondary-default);
      border-radius: 8px;
      padding: 0 12px;
      height: 36px;

      .search-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        flex-shrink: 0;

        path {
          fill: var(--color-text-t4);
        }
      }

      .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--color-text-t1);
        font-size: 14px;
        line-height: 20px;

        &::placeholder {
          color: var(--color-text-t1);
        }
      }

      .clear-btn {
        flex-shrink: 0;
        color: var(--color-text-t1);
        font-size: 14px;
        cursor: pointer;
        padding-left: 12px;
        border-left: 1px solid var(--color-line-l3);
        margin-left: 12px;

        &:hover {
          color: var(--color-text-t2);
        }
      }
    }
  }

  // 好友列表
  .friend-list-wrapper {
    flex: 1;
    overflow-y: auto;
    padding: 0 12px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }

    .section-title {
      color: var(--color-text-t1);
      font-size: 12px;
      line-height: 18px;
      padding: 8px 0;
    }

    .friend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 58px;
      border-radius: 5px;
      flex-direction: row;
      align-items: center;
      display: flex;
      position: relative;
      // padding: 0 10px;

      &:hover {
        background-color: var(--color-bg-b2);
      }

      .friend-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        flex-shrink: 0;
        border: 1px solid var(--color-line-l3);

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .friend-info {
        flex: 1;
        min-width: 0;

        .friend-name {
          color: var(--color-text-t1);
          text-overflow: ellipsis;
          white-space: nowrap;
          flex-direction: row;
          align-items: center;
          font-size: 14px;
          line-height: 24px;
          display: flex;
          overflow: hidden;

          :deep(.highlight) {
            color: #fe2c55;
          }
        }
      }

      .share-btn {
        color: var(--color-const-text-white);
        text-align: center;
        cursor: pointer;
        background-color: #ff2c55;
        border-radius: 8px;
        flex-shrink: 0;
        font-size: 14px;
        line-height: 32px;
        width: 68px;
        height: 32px;
        border: none;
        outline: none;

        &:hover {
          background: #e91e4d;
        }
      }
    }

    .empty-state {
      color: var(--color-text-t1);
      font-size: 14px;
      text-align: center;
      padding: 24px 0;
    }

    .empty-search {
      color: var(--color-text-t1);
      font-size: 14px;
      text-align: center;
      padding: 40px 0;
    }

    .no-more {
      color: var(--color-text-t1);
      font-size: 12px;
      text-align: center;
      padding: 12px 0;
    }
  }

  // 底部操作栏
  .bottom-actions {
    width: 100%;
    background-color: var(--color-bg-b1);
    border-top: 1px solid var(--color-line-l3);
    border-radius: 0 0 16px 16px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    display: flex;
    position: relative;
    padding: 14px 16px !important;

    .action-item-wrapper {
      position: relative;

      &:hover .action-tooltip {
        display: block;
      }
    }

    .action-tooltip {
      display: none;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: var(--color-bg-b1);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 13px;
      color: var(--color-text-t1);
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      z-index: 100;

      // 小三角
      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: var(--color-bg-b1);
      }
    }

    // 二维码特殊样式
    .qrcode-wrapper {
      &:hover .action-tooltip,
      &:hover .qrcode-tooltip {
        display: block !important;
      }

      .qrcode-tooltip {
        padding: 16px;
        left: auto;
        right: -40px;
        transform: none;
        white-space: normal;

        &::after {
          left: auto;
          right: 52px;
          transform: none;
        }

        .qrcode-tip {
          color: var(--share-qrcode-text-color);
          margin-top: 8px;
          font-size: 14px;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }

        .qrcode-tooltip-wrapper {
          display: flex;
          align-items: center;
          flex-direction: column;
          border-radius: 50%;
        }
        .qrcode-img-wrapper {
          background-color: var(--qr-bg);
          width: 160px;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          .qrcode-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }

    .action-btn {
      background-color: var(--share-btn-bg-color);
      color: var(--share-btn-text-color);
      cursor: pointer;
      margin-right: 8px;
      font-size: 14px;
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      margin-right: 8px;
      transition: all 0.3s;
      display: flex;
      position: relative;

      &:first-child {
        width: auto;
      }

      &:hover {
        background: var(--share-btn-bg-color-hover);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.copy-link-btn {
        flex: 1;
        height: 36px;
        padding: 0 16px;

        path {
          fill: var(--share-btn-text-color);
        }
      }

      &.icon-only {
        width: 36px;
        height: 36px;
        padding: 0;
        flex-shrink: 0;

        path {
          fill: var(--share-btn-text-color);
        }
      }
    }

    .action-divider {
      width: 1px;
      height: 16px;
      background: var(--color-line-l3);
    }
  }
}
</style>
