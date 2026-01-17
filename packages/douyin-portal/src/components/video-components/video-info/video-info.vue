<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { ISegment, ICooperationInfo } from '@/api/tyeps/common/aweme'
import formatTime from '@/utils/date-format'
import { VerifyBadge } from '@/components/common'
import CoCreators from './co-creators.vue'

const props = defineProps<{
  username: string
  uploadTime: string | number
  description: string
  textExtra: ISegment[]
  accountCertInfo?: string | null
  cooperationInfo?: ICooperationInfo
  isImageText?: boolean
  isLivePhoto?: boolean
  author?: any // 当前作者信息
}>()

const videoInfoRef = ref<HTMLElement | null>(null)
const maxWidth = ref('485px')
const minWidth = ref('285px')

// 共创者列表（包含当前作者）
const coCreators = computed(() => {
  const creators = props.cooperationInfo?.co_creators || []
  // 如果有共创信息且有作者信息，将作者添加到列表开头
  if (creators.length > 0 && props.author) {
    return [props.author, ...creators]
  }
  return creators
})

const calcMaxWidth = () => {
  if (videoInfoRef.value) {
    const container = videoInfoRef.value.closest(
      '.videos-container'
    ) as HTMLElement
    if (container) {
      const containerWidth = container.offsetWidth
      maxWidth.value = `${containerWidth * 0.45}px`
    }
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  calcMaxWidth()
  const container = videoInfoRef.value?.closest(
    '.videos-container'
  ) as HTMLElement
  if (container) {
    resizeObserver = new ResizeObserver(calcMaxWidth)
    resizeObserver.observe(container)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>
<template>
  <div class="video-info" ref="videoInfoRef" :style="{ maxWidth, minWidth }">
    <div class="video-info-top">
      <div class="video-info-author">
        <span>@{{ props.username }}</span>
        <VerifyBadge :cert-info="props.accountCertInfo" :size="16" />
      </div>
      <div class="video-info-time">
        <span> · {{ formatTime(props.uploadTime) }}</span>
      </div>
      <!-- 图文标签 -->
      <div v-if="props.isImageText" class="image-text-badge">
        <span class="image-text-icon">
          <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
            <path d="M1.455 0C.65 0 0 .651 0 1.455V8c0 .803.651 1.455 1.455 1.455H8c.803 0 1.455-.652 1.455-1.455V1.455C9.455.65 8.803 0 8 0H1.455z" fill="#fff"></path>
            <path d="M4 12a1.455 1.455 0 0 1-1.455-1.454h5.819a2.182 2.182 0 0 0 2.181-2.182V2.545C11.35 2.545 12 3.197 12 4v5.09A2.909 2.909 0 0 1 9.09 12H4z" fill="#fff"></path>
          </svg>
        </span>
        <span class="image-text-label">图文</span>
      </div>
      <!-- 动图标签 -->
      <div v-if="props.isLivePhoto" class="live-photo-badge">
        <span class="live-photo-icon">
          <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
            <path d="M6 0C2.686 0 0 2.686 0 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 10.8A4.805 4.805 0 0 1 1.2 6 4.805 4.805 0 0 1 6 1.2 4.805 4.805 0 0 1 10.8 6 4.805 4.805 0 0 1 6 10.8z" fill="#fff"></path>
            <path d="M4.8 3.6v4.8L8.4 6 4.8 3.6z" fill="#fff"></path>
          </svg>
        </span>
        <span class="live-photo-label">动图</span>
      </div>
      <!-- 共创标签 -->
      <div v-if="coCreators.length > 0" class="co-creation-tag">
        <span class="co-creation-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
            <path d="M2.19995 12C2.19995 9.23858 4.43853 7 7.19995 7C7.72426 7 8.22792 7.08036 8.7003 7.22873C9.22721 7.39422 9.78851 7.10124 9.954 6.57433C10.1195 6.04742 9.82651 5.48612 9.2996 5.32063C8.63553 5.11206 7.92988 5 7.19995 5C3.33396 5 0.199951 8.13401 0.199951 12C0.199951 15.866 3.33396 19 7.19995 19C7.92988 19 8.63553 18.8879 9.2996 18.6794C9.82651 18.5139 10.1195 17.9526 9.954 17.4257C9.78851 16.8988 9.22721 16.6058 8.7003 16.7713C8.22792 16.9196 7.72426 17 7.19995 17C4.43853 17 2.19995 14.7614 2.19995 12Z" fill="currentColor"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.8 5C12.9341 5 9.80005 8.13401 9.80005 12C9.80005 15.866 12.9341 19 16.8 19C20.666 19 23.8 15.866 23.8 12C23.8 8.13401 20.666 5 16.8 5ZM11.8 12C11.8 9.23858 14.0386 7 16.8 7C19.5615 7 21.8 9.23858 21.8 12C21.8 14.7614 19.5615 17 16.8 17C14.0386 17 11.8 14.7614 11.8 12Z" fill="currentColor"></path>
          </svg>
        </span>
        <span class="co-creation-text">{{ coCreators.length }}人共创</span>
      </div>
    </div>

    <!-- 共创用户列表 -->
    <CoCreators :creators="coCreators" />

    <ellipsis-expand
      style="--lineClamp: 2; --lineHeight: 22px; --maxHeight: 44px"
      class="video-desc-swiper"
      :description="props.description"
      :text-extra="props.textExtra"
    />
  </div>
</template>

<style lang="scss" scoped>
.video-info {
  position: absolute;
  bottom: 48px;
  left: 0;
  padding: 16px 95px 16px 16px;
  width: 100%;
  color: var(--color-const-text-white);

  user-select: none;
  z-index: 12;

  & div {
    pointer-events: all;
  }

  .video-info-top {
    display: flex;
    align-items: center;
    margin-bottom: 2px;

    .video-info-author {
      font-size: 18px;
      white-space: nowrap;
      display: flex;
      align-items: center;

      &:hover {
        text-decoration: underline;
        background-color: transparent;
      }
    }
    @media (max-width: 1440px) {
      .video-info-author span:not(.verify-badge) {
        font-size: 18px;
        line-height: 26px;
      }
    }
    @media (min-width: 1920px) {
      .video-info-author span:not(.verify-badge) {
        font-size: 24px;
        line-height: 34px;
      }
      .video-info-time {
        font-size: 16px !important;
        line-height: 22px;
      }
      .co-creation-tag .co-creation-text {
        font-size: 16px;
      }
    }
    .video-info-time {
      padding: 0 10px;
      font-size: 14px;
      white-space: nowrap;
    }

    .image-text-badge,
    .live-photo-badge {
      margin-left: 8px;
      display: flex;
      align-items: center;
      height: 20px;
      padding: 0 6px;
      white-space: nowrap;
      background: linear-gradient(270deg, rgba(255, 255, 255, .25) 0%, rgba(255, 255, 255, .12) 100%);
      border: .5px solid rgba(255, 255, 255, .16);
      border-radius: 4px;
      color: var(--color-const-text-white);
      text-shadow: 0 0 1px rgba(0, 0, 0, .6);
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
      font-size: 12px;
      font-weight: 500;
      line-height: 20px;

      .image-text-icon,
      .live-photo-icon {
        display: inline-flex;
        align-items: center;
        margin-right: 4px;

        svg {
          display: block;
        }
      }

      .image-text-label,
      .live-photo-label {
        line-height: 1;
      }
    }

    .co-creation-tag {
      color: var(--color-const-text-white);
      align-items: center;
      font-size: 12px;
      line-height: 1;
      display: inline-flex;
      cursor: pointer;
      background: linear-gradient(270deg, var(--color-const-bg-white30) 0%, var(--color-const-bg-white12, rgba(255, 255, 255, 0.12)) 100%);
      border: 0.5px solid var(--color-const-bg-white16, rgba(255, 255, 255, 0.16));
      border-radius: var(--radius-6);
      margin-left: 8px;
      padding: 2px 6px;
      box-shadow: 0 0 1px var(--color-mask-m3);

      .co-creation-icon {
        display: inline-flex;
        align-items: center;
        margin-right: 2px;

        svg {
          width: 12px;
          height: 12px;
        }
      }

      .co-creation-text {
        text-shadow: 0 0 1px var(--color-mask-m3);
      }
    }
  }
}

@media (min-width: 1440px) and (max-width: 1920px) {
  .video-info {
    .video-info-top {
      margin-bottom: calc(-4px + 0.416667vw) !important;
    }
  }
}
</style>
