<script setup lang="ts">
import type { PropType } from 'vue'
import { ref, onUnmounted } from 'vue'
import { Toast } from '@/components/ui/toast'

const props = defineProps({
  // 关注状态: 0-未关注, 1-已关注, 2-互相关注, 3-已关注(特殊)
  isAttent: {
    type: Number as PropType<number>,
    default: 0
  },
  // 音乐名称
  musicName: {
    type: String,
    default: ''
  },
  // 音乐使用人数
  musicUseCount: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  // 视频ID
  awemeId: {
    type: String,
    default: ''
  },
  // 用户ID
  userId: {
    type: String,
    default: ''
  },
  // 音乐播放地址
  musicPlayUrl: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

const emit = defineEmits<{
  (e: 'cancelFollow'): void
  (e: 'recommend'): void
  (e: 'notInterested'): void
  (e: 'phoneContinue'): void
  (e: 'report'): void
  (e: 'shortcutList'): void
  (e: 'hotTrending'): void
  (e: 'collectMusic'): void
}>()

// 音乐播放状态
const isPlaying = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

// 处理推荐
const handleRecommend = () => {
  Toast.success('已推荐该视频')
  emit('recommend')
}

// 处理不感兴趣
const handleNotInterested = () => {
  Toast.info('将减少此类内容推荐')
  emit('notInterested')
}

// 处理手机续播
const handlePhoneContinue = () => {
  Toast.info('请打开抖音APP扫码续播')
  emit('phoneContinue')
}

// 处理取消关注
const handleCancelFollow = () => {
  Toast.success('已取消关注')
  emit('cancelFollow')
}

// 处理举报
const handleReport = () => {
  Toast.warning('举报功能开发中')
  emit('report')
}

// 处理快捷键列表
const handleShortcutList = () => {
  Toast.info('空格-暂停/播放, ↑↓-切换视频, M-静音')
  emit('shortcutList')
}

// 处理上热门
const handleHotTrending = () => {
  Toast.info('DOU+推广功能开发中')
  emit('hotTrending')
}

// 处理收藏音乐
const handleCollectMusic = () => {
  Toast.success('已收藏原声')
  emit('collectMusic')
}

// 播放/暂停音乐
const togglePlayMusic = () => {
  if (!props.musicPlayUrl?.length) {
    Toast.warning('暂无音乐播放地址')
    return
  }

  if (!audioRef.value) {
    audioRef.value = new Audio(props.musicPlayUrl[0])
    audioRef.value.onended = () => {
      isPlaying.value = false
    }
  }

  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  } else {
    audioRef.value.play()
    isPlaying.value = true
  }
}

// 下载音乐
const isDownloading = ref(false)

const downloadMusic = async () => {
  if (!props.musicPlayUrl?.length) {
    Toast.warning('暂无音乐下载地址')
    return
  }

  if (isDownloading.value) {
    Toast.info('正在下载中...')
    return
  }

  isDownloading.value = true
  const fileName = `${props.musicName || '原声音乐'}.mp3`

  Toast.info('正在下载原声...')

  // 遍历所有下载地址，直到成功
  for (let i = 0; i < props.musicPlayUrl.length; i++) {
    let url = props.musicPlayUrl[i]
    console.log(`尝试下载音乐地址 ${i + 1}/${props.musicPlayUrl.length}:`, url)

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

      // 检查是否是有效的音频文件
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

// 组件卸载时停止播放
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value = null
  }
})
</script>

<template>
  <div class="more-box">
    <div class="more-box-content">
      <!-- 推荐按钮 - 绿色高亮 -->
      <div class="more-box-item active" @click="handleRecommend">
        <div class="more-box-icon recommend-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="27"
            fill="none"
            viewBox="0 0 27 27"
          >
            <path
              d="M18.544 22.86H8.42V9.697l5.821-5.821a1.79 1.79 0 0 1 2.531 0c.118.118.215.278.291.48.076.203.114.397.114.583v.354l-1.114 4.404h5.518c.54 0 1.012.203 1.417.608.405.405.608.877.608 1.417v2.025a2.059 2.059 0 0 1-.152.759l-3.037 7.137c-.152.338-.405.625-.76.861a1.978 1.978 0 0 1-1.113.354zM6.79 9.697V22.86H4.366a1.625 1.625 0 0 1-1.625-1.625v-9.91c0-.898.728-1.626 1.625-1.626h2.425z"
              fill="#13C15A"
            ></path>
          </svg>
        </div>
        <div class="more-box-title recommend-title">推荐</div>
      </div>
      <!-- 不感兴趣 -->
      <div class="more-box-item" @click="handleNotInterested">
        <div class="more-box-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22 9.17756C22 9.15578 21.9993 9.13415 21.9979 9.11271C21.9993 9.05948 22 9.0061 22 8.95259C22 5.54223 19.2353 2.77759 15.825 2.77759C14.3806 2.77759 13.0513 3.27431 12 4.10469C10.9487 3.27431 9.61938 2.77759 8.175 2.77759C4.76464 2.77759 2 5.54223 2 8.95259C2 9.0062 2.00069 9.05968 2.00205 9.11301C2.00069 9.13435 2 9.15588 2 9.17756C2 10.4709 2.51833 11.7465 3.22256 12.8983C3.93327 14.0608 4.88418 15.1797 5.86669 16.1802C7.83219 18.1817 10.0219 19.8071 10.96 20.4729C11.5867 20.9176 12.4133 20.9176 13.04 20.4729C13.9781 19.8071 16.1678 18.1817 18.1333 16.1802C19.1158 15.1797 20.0667 14.0608 20.7774 12.8983C21.4817 11.7465 22 10.4709 22 9.17756ZM4 8.95259C4 6.6468 5.86921 4.77759 8.175 4.77759C9.00569 4.77759 9.7792 5.0196 10.4297 5.43793L10.0202 7.98603C10.0073 8.066 10.0273 8.14777 10.0757 8.21274L11.7057 10.403C11.752 10.4652 11.7724 10.543 11.7626 10.6199L11.4741 12.8919C11.4355 13.1962 11.8244 13.3555 12.0103 13.1115L13.895 10.6378C13.96 10.5525 13.9746 10.4391 13.9332 10.3402L13.0428 8.21329C13.0152 8.14735 13.0121 8.07371 13.034 8.00565L13.9249 5.23374C14.4949 4.94189 15.1405 4.77759 15.825 4.77759C18.1308 4.77759 20 6.6468 20 8.95259C20 9.01371 19.9987 9.07446 19.9961 9.13482C19.9943 9.17751 19.9952 9.22003 19.9987 9.26214C19.9765 10.0181 19.6587 10.894 19.0711 11.8551C18.4679 12.8416 17.6288 13.8395 16.7063 14.7789C14.9381 16.5795 12.9537 18.075 12 18.7581C11.0463 18.075 9.06189 16.5795 7.29368 14.7789C6.37124 13.8395 5.53206 12.8416 4.92891 11.8551C4.34127 10.8939 4.0234 10.0179 4.00124 9.2619C4.0048 9.21987 4.00571 9.17743 4.00389 9.13483C4.00131 9.07447 4 9.01371 4 8.95259Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="more-box-title">不感兴趣</div>
      </div>
      <!-- 手机续播 -->
      <div class="more-box-item" @click="handlePhoneContinue">
        <div class="more-box-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M5 4C5 2.89543 5.89543 2 7 2H17C18.1046 2 19 2.89543 19 4V21C19 22.1046 18.1046 23 17 23H7C5.89543 23 5 22.1046 5 21V4ZM7 6V20C7 20.5523 7.44772 21 8 21H16C16.5523 21 17 20.5523 17 20V6C17 5.44772 16.5523 5 16 5H8C7.44772 5 7 5.44772 7 6ZM10.5 3C10.2239 3 10 3.22386 10 3.5C10 3.77614 10.2239 4 10.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H10.5Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="more-box-title">手机续播</div>
      </div>
      <!-- 取消关注 -->
      <div
        class="more-box-item"
        v-show="isAttent === 1 || isAttent === 3"
        @click="handleCancelFollow"
      >
        <div class="more-box-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.6 10.857c0-2.409 1.988-4.33 4.4-4.33 2.412 0 4.4 1.921 4.4 4.33V13c0 2.39-1.96 4.3-4.348 4.327h-.104C14.561 17.3 12.6 15.39 12.6 13v-2.143zm4.4-2.53c-1.453 0-2.6 1.15-2.6 2.53V13c0 1.366 1.128 2.508 2.564 2.527h.072C18.472 15.508 19.6 14.366 19.6 13v-2.143c0-1.38-1.148-2.53-2.6-2.53z"
              fill="currentColor"
            ></path>
            <path
              d="M21.399 23.23c-.405 0-.732.382-.732.854 0 .471.327.854.732.854h3.66c.405 0 .733-.383.733-.854 0-.472-.328-.854-.732-.854h-3.661z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="more-box-title">取消关注</div>
      </div>
      <!-- 举报 -->
      <div class="more-box-item" @click="handleReport">
        <div class="more-box-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M12 9C12.5523 9 13 9.44771 13 10V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V10C11 9.44771 11.4477 9 12 9Z"
              fill="currentColor"
            ></path>
            <path
              d="M13 17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17C11 16.4477 11.4477 16 12 16C12.5523 16 13 16.4477 13 17Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.7238 3.95825C12.9505 2.64364 11.0494 2.64364 10.2761 3.95825L2.02453 17.9859C1.24025 19.3192 2.20156 21 3.7484 21H20.2516C21.7984 21 22.7597 19.3192 21.9754 17.9859L13.7238 3.95825ZM12 4.97229L20.2516 19H3.7484L12 4.97229Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="more-box-title">举报</div>
      </div>
      <!-- 快捷键列表 -->
      <div class="more-box-item" @click="handleShortcutList">
        <div class="more-box-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
          >
            <path
              d="M6 8C5.44772 8 5 8.44772 5 9C5 9.55228 5.44772 10 6 10H8C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8H6Z"
              fill="currentColor"
            ></path>
            <path
              d="M5 12C5 11.4477 5.44772 11 6 11H8C8.55228 11 9 11.4477 9 12C9 12.5523 8.55228 13 8 13H6C5.44772 13 5 12.5523 5 12Z"
              fill="currentColor"
            ></path>
            <path
              d="M6 14C5.44772 14 5 14.4477 5 15C5 15.5523 5.44772 16 6 16H18C18.5523 16 19 15.5523 19 15C19 14.4477 18.5523 14 18 14H6Z"
              fill="currentColor"
            ></path>
            <path
              d="M10 9C10 8.44772 10.4477 8 11 8H13C13.5523 8 14 8.44772 14 9C14 9.55228 13.5523 10 13 10H11C10.4477 10 10 9.55228 10 9Z"
              fill="currentColor"
            ></path>
            <path
              d="M11 11C10.4477 11 10 11.4477 10 12C10 12.5523 10.4477 13 11 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H11Z"
              fill="currentColor"
            ></path>
            <path
              d="M15 9C15 8.44772 15.4477 8 16 8H18C18.5523 8 19 8.44772 19 9C19 9.55228 18.5523 10 18 10H16C15.4477 10 15 9.55228 15 9Z"
              fill="currentColor"
            ></path>
            <path
              d="M16 11C15.4477 11 15 11.4477 15 12C15 12.5523 15.4477 13 16 13H18C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11H16Z"
              fill="currentColor"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4ZM4 6L20 6V18H4V6Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="more-box-title">快捷键列表</div>
      </div>
      <!-- 上热门 DOU+ -->
      <div class="more-box-item" @click="handleHotTrending">
        <div class="more-box-icon">
          <svg
            width="36"
            height="36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
          >
            <path
              d="M28.528 20.913l.113-1.053h1.033a.527.527 0 0 0 .522-.524.51.51 0 0 0-.177-.377.574.574 0 0 0-.377-.148h-.898l.105-.905c.05-.313-.21-.536-.46-.578-.317-.053-.54.212-.58.463l-.114 1.052h-1.033a.527.527 0 0 0-.522.525c0 .286.235.525.522.525h.93l-.105.904c-.046.298.197.534.475.58.28 0 .519-.178.566-.464z"
              fill="#fff"
            ></path>
            <path
              d="M33.39 19.332c.147-1.232.13-2.611-.242-3.81a.557.557 0 0 0-.493-.385c-.061-.009-.122.013-.182.022l-.758.246c-.278-1.771-1.029-2.74-1.98-3.285a.62.62 0 0 0-.296-.087.493.493 0 0 0-.284.1.602.602 0 0 0-.197.242l-.004.011-.003.012c-.162.58-.601 1.425-1.867 2.119-.82.454-1.53.884-2.11 1.36l.229-2.184a.839.839 0 1 0-1.668-.175l-.737 7.024c-.104.902-.986 1.703-1.986 1.703-.952 0-1.557-.711-1.466-1.518v-.006l.738-7.028a.838.838 0 1 0-1.668-.175l-.737 7.024c-.21 1.882 1.266 3.38 3.133 3.38 1.334 0 2.567-.758 3.21-1.866.877 1.212 2.384 1.977 4.102 1.977 2.513 0 4.906-1.942 5.266-4.699v-.002zm-2.865-2.167l1.377-.421c.08.62.157 1.469.038 2.394-.238 1.974-1.908 3.483-3.856 3.483-1.034 0-1.988-.388-2.624-1.045-.397-.426-.912-1.16-.834-2.241v-.004c.04-.85.289-1.47.795-2.025.507-.556 1.273-1.05 2.348-1.651l.003-.002c.832-.425 1.507-.965 1.946-1.659.274.424.431.924.55 1.578v.002l.237 1.579c.002.01.011.015.02.012zM3.767 13.452a.839.839 0 0 1 .834-.75h1.453c2.412 0 4.18 1.976 3.936 4.393v.004l-.262 2.48c-.263 2.32-2.325 4.213-4.672 4.213H3.603a.838.838 0 0 1-.834-.927l.998-9.413zm1.588.927l-.82 7.736h.521c1.47 0 2.834-1.228 3.006-2.723l.26-2.465v-.002c.144-1.443-.864-2.546-2.268-2.546h-.699zM14.36 12.275c-1.848 0-3.457 1.481-3.654 3.308l-.477 4.557-.001.01c-.174 1.885 1.215 3.475 3.134 3.475 1.848 0 3.457-1.482 3.653-3.308v-.003l.478-4.554v-.01c.175-1.886-1.214-3.475-3.133-3.475zm-2.462 8.034l.476-4.547c.107-.993 1.014-1.81 1.986-1.81.899 0 1.548.707 1.464 1.639l-.476 4.547c-.108.993-1.014 1.81-1.986 1.81-.9 0-1.548-.707-1.464-1.64z"
              fill="#fff"
            ></path>
          </svg>
        </div>
        <div class="more-box-title">上热门</div>
      </div>
    </div>
    <!-- 音乐信息区域 -->
    <div class="more-music-detail">
      <div class="more-music-author">
        <div class="more-music-content">
          <div class="more-music-icon">
            <svg
              width="20"
              height="20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.783 8.886c.041.001.082.005.124.009V8.89l-.124-.004zm18.337 1.208a1.631 1.631 0 00-.537-1.24 1.589 1.589 0 00-1.277-.4h-.004l-10.57 1.641a1.58 1.58 0 00-1.365 1.553l-.215 11.82a3.2 3.2 0 00-2.438-1.241c-1.76-.048-3.212 1.355-3.244 3.134-.032 1.78 1.368 3.261 3.127 3.31 1.76.047 3.212-1.356 3.245-3.135l.17-9.368 12.307-2.026-.176 9.709a3.2 3.2 0 00-2.459-1.269c-1.76-.048-3.212 1.355-3.244 3.135-.033 1.779 1.368 3.26 3.127 3.309 1.76.048 3.212-1.356 3.244-3.135l.309-15.797z"
                fill="currentColor"
                fill-opacity="0.8"
              ></path>
            </svg>
            <span class="music-name">{{ musicName || '原声音乐' }}</span>
          </div>
          <div class="more-music-num">{{ musicUseCount }}人使用</div>
        </div>
      </div>
      <!-- 音乐操作按钮 -->
      <div class="music-actions">
        <!-- 播放按钮 -->
        <button
          type="button"
          class="music-action-btn"
          @click="togglePlayMusic"
          :title="isPlaying ? '暂停' : '播放'"
        >
          <svg
            v-if="!isPlaying"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
          >
            <path
              d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86a1 1 0 00-1.5.86z"
              fill="currentColor"
            ></path>
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
          >
            <path
              d="M8 5a1 1 0 011 1v12a1 1 0 11-2 0V6a1 1 0 011-1zM16 5a1 1 0 011 1v12a1 1 0 11-2 0V6a1 1 0 011-1z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        <!-- 下载按钮 -->
        <button
          type="button"
          class="music-action-btn"
          @click="downloadMusic"
          title="下载"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
          >
            <path
              d="M12 3a1 1 0 011 1v10.586l3.293-3.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L11 14.586V4a1 1 0 011-1zM5 19a1 1 0 100 2h14a1 1 0 100-2H5z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>
      <!-- 收藏按钮 -->
      <button type="button" class="favorite-button" @click="handleCollectMusic">
        <svg
          width="12"
          height="13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 13"
        >
          <path
            d="M6 2.771l.78 1.945c.164.41.546.693.986.73l2.12.176-1.648 1.466a1.167 1.167 0 00-.362 1.134l.49 2.13-1.74-1.104a1.167 1.167 0 00-1.251 0l-1.74 1.103.489-2.13a1.167 1.167 0 00-.362-1.133L2.113 5.622l2.121-.177c.441-.037.823-.319.987-.729l.78-1.945zM6.512.913a.543.543 0 00-1.024 0l-1.35 3.37-3.455.287c-.501.042-.7.719-.313 1.063L2.987 7.96l-.806 3.51c-.12.516.398.932.824.662L6 10.232l2.995 1.9c.426.27.943-.146.825-.663L9.013 7.96l2.617-2.327c.387-.344.188-1.021-.312-1.063l-3.455-.288-1.35-3.37z"
            fill="#fff"
          ></path>
        </svg>
        <span>收藏</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.more-box {
  align-items: center;
  background: var(--color-bg-b1-white);
  border-radius: 16px;
  box-shadow: var(--shadow-1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 240px;
  padding: 16px;

  & * {
    vertical-align: bottom;
  }

  .more-box-content {
    display: flex;
    justify-content: space-around;
    width: 100%;

    .more-box-item {
      align-items: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 8px;
      width: 64px;
      cursor: pointer;

      &:last-child {
        margin-right: 0;
      }

      .more-box-icon {
        align-items: center;
        background: var(--color-bg-b2);
        border-radius: 24px;
        display: flex;
        height: 48px;
        justify-content: center;
        position: relative;
        transition: 0.3s;
        width: 48px;
        color: var(--color-text-t3);

        &:hover {
          background: var(--color-bg-b3);
          transform: scale(1.05);
        }

        svg {
          width: 24px;
          height: 24px;

          path {
            fill: currentColor;
          }
        }
      }

      // 推荐按钮绿色高亮样式
      &.active .more-box-icon.recommend-icon {
        background: rgba(19, 193, 90, 0.2);

        &:hover {
          background: rgba(19, 193, 90, 0.3);
        }

        svg {
          width: 27px;
          height: 27px;

          path {
            fill: #13c15a;
          }
        }
      }

      .recommend-title {
        color: #13c15a;
      }

      .more-box-title {
        color: var(--color-text-t3);
        font-size: 11px;
        font-weight: 400;
        line-height: 16px;
        margin-top: 8px;
      }
    }
  }

  .more-music-detail {
    align-items: center;
    border-top: 1px solid var(--color-line-l3);
    display: flex;
    font-size: 12px;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    width: 100%;
    gap: 8px;

    .more-music-author {
      align-items: center;
      display: flex;
      flex: 1 1;
      height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .more-music-content {
        overflow: hidden;

        .more-music-icon {
          color: var(--color-text-t3);
          font-size: 12px;
          line-height: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          gap: 4px;

          svg {
            flex-shrink: 0;
          }

          .music-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .more-music-num {
          color: var(--color-text-t4);
          font-size: 12px;
          overflow: hidden;
          padding-left: 24px;
          text-overflow: ellipsis;
        }
      }
    }

    .music-actions {
      display: flex;
      gap: 4px;
      flex-shrink: 0;

      .music-action-btn {
        align-items: center;
        background: var(--color-bg-b2);
        border: none;
        border-radius: 50%;
        color: var(--color-text-t3);
        cursor: pointer;
        display: flex;
        height: 28px;
        justify-content: center;
        padding: 0;
        transition: all 0.2s;
        width: 28px;

        &:hover {
          background: var(--color-bg-b3);
          color: var(--color-text-t1);
        }

        svg {
          width: 16px;
          height: 16px;
        }
      }
    }

    .favorite-button {
      align-items: center;
      background: #fe2c55;
      border: none;
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      display: flex;
      font-size: 12px;
      gap: 4px;
      height: 28px;
      justify-content: center;
      padding: 0 12px;
      user-select: none;
      flex-shrink: 0;

      &:hover {
        background-color: var(--color-primary-hover);
      }
    }
  }
}
</style>
