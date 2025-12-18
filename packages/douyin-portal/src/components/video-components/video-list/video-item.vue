<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import miniPlayer from '@/components/video-player/mini-player.vue'
import { useRouter } from 'vue-router'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

const props = defineProps<{
  aweme: IAwemeInfo
  // 是否显示选择框
  selectable?: boolean
  // 是否选中
  selected?: boolean
  // 是否禁用点击时切换视频播放（用于外部控制点击行为）
  disableClickToggle?: boolean
  // 是否显示观看进度角标
  showProgress?: boolean
  // 观看进度（毫秒）
  playProgress?: number
}>()

// 计算观看进度百分比
const progressPercent = computed(() => {
  if (!props.showProgress || !props.playProgress) return null
  const duration = props.aweme.video?.duration
  if (!duration || duration <= 0) return null
  const percent = Math.round((props.playProgress / duration) * 100)
  if (percent >= 100) return '已看完'
  if (percent <= 0) return null
  return `已看${percent}%`
})

// 点赞数转换
const dianzan = computed(() => {
  if (props.aweme.statistics.digg_count > 10000) {
    return (props.aweme.statistics.digg_count / 10000).toFixed(1) + '万'
  } else {
    return props.aweme.statistics.digg_count
  }
})
const isVideoVisible = ref(false)
let hoverTimer: ReturnType<typeof setTimeout> | null = null
let leaveTimer: ReturnType<typeof setTimeout> | null = null

const showVideo = () => {
  // 选择模式下禁用 hover 播放
  if (props.selectable) return
  // 清除离开定时器
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  // 设置进入定时器
  hoverTimer = setTimeout(() => {
    isVideoVisible.value = true
  }, 1000)
}

const hideVideo = () => {
  if (props.selectable) return
  // 清除进入定时器
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  // 设置离开定时器
  leaveTimer = setTimeout(() => {
    isVideoVisible.value = false
  }, 200)
}

// 立即停止视频播放（用于点击跳转时）
const stopVideo = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  if (leaveTimer) {
    clearTimeout(leaveTimer)
    leaveTimer = null
  }
  isVideoVisible.value = false
}

const router = useRouter()

// 点击设置modal的显示与隐藏
const toggleModal = (event: MouseEvent) => {
  // 选择模式下禁用点击跳转
  if (props.selectable) {
    event.preventDefault()
    return
  }
  event.preventDefault()

  // 如果禁用点击切换视频，停止播放并返回（由外部处理点击事件）
  if (props.disableClickToggle) {
    stopVideo()
    return
  }

  isVideoVisible.value = !isVideoVisible.value

  // 添加路由参数
  router.push({
    query: {
      ...router.currentRoute.value.query
    }
  })
}

// 处理播放器点击层点击事件（不阻止冒泡，让事件传递到外层）
const handlePlayerClick = () => {
  // 停止视频播放
  stopVideo()
  // 事件会冒泡到外层 a 标签，触发 toggleModal
}
</script>
<template>
  <div class="video-item">
    <a
      :href="'/video/' + aweme.aweme_id"
      class="video-item-link"
      @click="toggleModal($event)"
    >
      <div
        class="video-item-content"
        @mouseenter="showVideo"
        @mouseleave="hideVideo"
      >
        <div class="video-item-img">
          <img v-lazy="aweme.video.cover.url_list[0]" :alt="aweme.desc" />
        </div>
        <div class="overlay" v-if="!isVideoVisible"></div>
        <miniPlayer
          v-if="isVideoVisible"
          class="video-player"
          :url="aweme.video.play_addr.url_list"
        />
        <!-- 播放时的点击层，覆盖在播放器上方，点击时触发弹框 -->
        <div
          v-if="isVideoVisible"
          class="video-click-overlay"
          @click="handlePlayerClick"
        ></div>
        <div class="video-item-tag">
          <div class="tag-content">
            <div
              class="video-item-tag-icon"
              v-if="aweme.aweme_type === 68 && !isVideoVisible"
            >
              <svg
                width="12"
                height="12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class=""
                viewBox="0 0 12 12"
              >
                <path
                  d="M1.455 0C.65 0 0 .651 0 1.455V8c0 .803.651 1.455 1.455 1.455H8c.803 0 1.455-.652 1.455-1.455V1.455C9.455.65 8.803 0 8 0H1.455z"
                  fill="#fff"
                ></path>
                <path
                  d="M4 12a1.455 1.455 0 0 1-1.455-1.454h5.819a2.182 2.182 0 0 0 2.181-2.182V2.545C11.35 2.545 12 3.197 12 4v5.09A2.909 2.909 0 0 1 9.09 12H4z"
                  fill="#fff"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="video-item-block"></div>
        <!-- 观看进度角标 -->
        <div
          class="video-item-stats-tag is-top"
          v-if="progressPercent && !isVideoVisible"
        >
          <div class="user-video-tag">
            <div class="top-tag is-progress">
              <div class="top-tag-text">{{ progressPercent }}</div>
            </div>
          </div>
        </div>
        <div
          class="video-item-stats-tag is-top"
          v-else-if="aweme.is_top && !isVideoVisible"
        >
          <div class="user-video-tag">
            <div class="top-tag">
              <div class="top-tag-text">置顶</div>
            </div>
          </div>
        </div>
        <div
          class="video-item-stats-tag is-top"
          v-else-if="aweme.hot_list && !isVideoVisible"
        >
          <div class="user-video-tag">
            <div class="top-tag is-hot">
              <div class="top-tag-text">{{ aweme.hot_list.header }}</div>
            </div>
          </div>
        </div>
        <span class="author-card-user-video-like" v-if="!isVideoVisible">
          <svg
            width="18"
            height="17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class=""
            viewBox="0 0 24 24"
            id="svg_icon_digg"
          >
            <path
              d="M12.159 5.3l-.96.924a1.333 1.333 0 002.051-.159L12.16 5.3zm9.255 3.75h-1.333a1.333 1.333 0 002.54.566l-1.207-.567zm0 0l1.334-.001a1.333 1.333 0 00-2.54-.566l1.206.566zm0 .311l1.334.024c.003-.201-.039-.4-.123-.582l-1.21.558zm-.319 1.875l.998.885c.133-.15.231-.33.286-.524l-1.284-.36zm-.319.625l1.121.722c.047-.073.087-.15.12-.232l-1.24-.49zm-.319.625l1.145.682c.04-.067.074-.137.102-.21l-1.247-.472zm-3.248 3.976l-.943-.942-.003.003.946.94zm-5.216 4.207l.023-1.333h-.018l-.005 1.333zm-1.204-.654l.834-1.04a1.275 1.275 0 00-.043-.033l-.79 1.073zm-4.408-3.877l.958-.928-.005-.004-.953.932zm-3.182-4.269l1.21-.56a1.432 1.432 0 00-.017-.036l-1.193.596zm-.614-2.508l-.94-.945c-.26.258-.401.61-.393.975l1.333-.03zm13.404-7.27c-1.926 0-3.776.81-4.921 2.442l2.182 1.532c.577-.821 1.554-1.307 2.739-1.307V2.091zm6.759 6.958c0-3.743-3.014-6.958-6.76-6.958v2.667c2.18 0 4.093 1.925 4.093 4.291h2.667zm-.003.232c.001-.05.003-.13.003-.232H20.08l-.002.171 2.666.06zm-.12-.478a1.3 1.3 0 01.113.408c.006.054.006.093.006.1v-.03l-2.665-.06c0 .021-.002.075-.001.123 0 .024 0 .078.008.142.003.033.02.222.118.434l2.421-1.117zm-.246 2.794c.21-.751.354-1.406.369-2.212l-2.667-.047c-.008.48-.086.886-.27 1.538l2.568.72zm-.363.754a3.97 3.97 0 01.114-.266c.013-.028.02-.038.019-.037l-.014.02a.732.732 0 01-.043.053l-1.994-1.77a2.501 2.501 0 00-.362.56 6.522 6.522 0 00-.2.46l2.48.98zm-.312.607a1.71 1.71 0 01.075-.177c.018-.036.047-.088.118-.198l-2.242-1.444a4.08 4.08 0 00-.445.875l2.494.944zm-.319.562c.075-.117.147-.234.217-.352l-2.29-1.364c-.056.092-.113.185-.174.28l2.247 1.436zm-3.234 3.885c1.151-1.15 2.35-2.498 3.234-3.885l-2.247-1.436c-.736 1.154-1.784 2.348-2.872 3.436l1.886 1.885zm-4.134 3.716c.73-.603 2.443-2.014 4.137-3.719l-1.89-1.88c-1.595 1.604-3.218 2.943-3.943 3.54l1.696 2.059zm-.275.224c-.026.027-.042.04-.024.024l.06-.05c.057-.049.136-.113.239-.198l-1.696-2.058c-.157.13-.368.3-.464.397l1.885 1.885zM12 22.003c.286 0 1.061.023 1.742-.658l-1.885-1.885a.537.537 0 01.22-.117c.034-.01.052-.01.04-.009a2.463 2.463 0 01-.119.002L12 22.003zm-.03 0H12l-.002-2.667h.018l-.046 2.666zm-1.98-.925c.278.279.885.92 1.997.924l.011-2.666c-.019 0-.013-.002.008.004a.201.201 0 01.046.02c.006.003-.003-.002-.033-.029a3.343 3.343 0 01-.143-.138L9.99 21.078zm-.035-.022l.044.035.028.023.005.004a.448.448 0 01-.042-.04l1.886-1.885c-.085-.084-.204-.179-.253-.218l-1.668 2.08zm-4.532-3.99a39.936 39.936 0 004.576 4.023l1.58-2.147a37.31 37.31 0 01-4.24-3.732l-1.916 1.855zm-3.434-4.638c.772 1.67 2.123 3.296 3.438 4.642l1.907-1.864C6.09 13.932 4.99 12.566 4.41 11.31l-2.421 1.118zm-.737-3.037c.01.498.125 1.104.253 1.613.127.506.304 1.066.502 1.461l2.385-1.192c-.069-.138-.191-.48-.3-.918-.11-.435-.17-.817-.174-1.023l-2.666.059zm.003-.102v.022a1.298 1.298 0 01.062-.362c.026-.078.107-.313.327-.533l1.881 1.89a1.342 1.342 0 00.397-.955l-.001-.132-2.666.07zm-.004-.24c0 .106.002.188.004.24l2.666-.07a6.11 6.11 0 01-.003-.17H1.251zm6.76-6.958c-3.748 0-6.76 3.214-6.76 6.958h2.667c0-2.368 1.912-4.291 4.092-4.291V2.091zm5.108 2.283c-1.4-1.453-3.15-2.283-5.109-2.283v2.667c1.146 0 2.226.467 3.189 1.466l1.92-1.85z"
              fill="#fff"
            ></path>
          </svg>
          <span>{{ dianzan }}</span>
        </span>
      </div>
      <p class="video-title">{{ aweme.desc }}</p>
    </a>

    <!-- 选中状态遮罩 -->
    <div v-if="selectable" class="select-overlay">
      <div class="select-checkbox" :class="{ checked: selected }">
        <svg
          v-if="selected"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          focusable="false"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.4111 7.30848C18.0692 7.81171 18.1947 8.75312 17.6915 9.41119L11.1915 17.9112C10.909 18.2806 10.4711 18.4981 10.0061 18.5C9.54105 18.5019 9.10143 18.288 8.81592 17.9209L5.31592 13.4209C4.80731 12.767 4.92512 11.8246 5.57904 11.316C6.23296 10.8074 7.17537 10.9252 7.68398 11.5791L9.98988 14.5438L15.3084 7.58884C15.8116 6.93077 16.7531 6.80525 17.4111 7.30848Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.video-item {
  margin-bottom: 24px;
  margin-right: 12px;
  position: relative;
  width: calc(16.66% - 13.34px);
  display: inline-block;
  .video-item-link {
    width: 100%;
    cursor: pointer;
    border-radius: 12px 12px 0 0;
    transition-property: transform, shadow, background-color;
    transition-duration: 0.35s;
    display: block;
    position: relative;
    overflow: hidden;
    .video-item-content {
      box-shadow: 0 0 0.5px 0 var(--color-secondary-default);
      border-radius: 4px;
      padding-bottom: 133%;
      transition-property: border-radius;
      transition-duration: 0.35s;
      transition-delay: 0.5s;
      position: relative;
      overflow: hidden;

      &:hover {
        border-radius: 12px 12px 0 0;
        overflow: visible;
      }

      .video-item-img {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        &:hover {
          img {
            transform: scale(1.05);
            transition: all 0.3s ease-out;
          }
        }
        img {
          height: 100%;
          -o-object-fit: cover;
          object-fit: cover;
          width: 100%;
          // color: #161722;
          max-height: 100%;
          max-width: 100%;
          position: relative;
          transform: scale(1);
          transition: all 0.3s ease-in;
        }
      }
      .video-player {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
      }
      // 播放时的点击层，覆盖播放器上方区域
      .video-click-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 48px); // 底部留出播放器控件区域
        z-index: 10;
        cursor: pointer;
        background-color: transparent;
      }

      .video-item-stats-tag {
        position: absolute;
        display: flex;
        flex-wrap: wrap;

        &.is-top {
          top: 8px;
          left: 8px;
        }

        .user-video-tag {
          margin-right: 6px;
          line-height: 16px;

          .top-tag {
            background: rgb(250, 206, 21);
            color: rgb(22, 24, 35);
            height: 20px;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-weight: 500;
            line-height: 20px;
            display: inline-flex;
            border-radius: 4px;
            padding: 0px 4px;
            box-sizing: border-box;
            user-select: none;
            vertical-align: bottom;
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            &.is-hot {
              background: linear-gradient(
                268.09deg,
                rgb(240, 27, 91) 6.38%,
                rgb(255, 90, 68) 59.9%,
                rgb(255, 145, 19) 91.68%
              );
              color: #fff;
            }
            &.is-progress {
              background: rgba(0, 0, 0, 0.6);
              color: #fff;
            }
            .top-tag-text {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              flex: 1 1 0%;
            }
          }
        }
      }
      .video-item-tag {
        top: 8px;
        right: 8px;
        position: absolute;
        display: flex;
        flex-wrap: wrap;

        .tag-content {
          line-height: 16px;
          margin-left: 0;

          .video-item-tag-icon {
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.16);
            border-radius: 6px;
            justify-content: center;
            align-items: center;
            display: flex;
          }
        }
      }
      .video-item-block {
        background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.75));
        bottom: 0;
        height: 48px;
        opacity: 0.4;
        position: absolute;
        width: 100%;
      }
      .author-card-user-video-like {
        align-items: center;
        bottom: 4px;
        color: #fff;
        display: flex;
        flex-direction: row;
        font-size: 14px;
        font-weight: 500;
        justify-content: center;
        left: 8px;
        line-height: 22px;
        position: absolute;

        span {
          display: inline-block;
          margin-left: 5px;
        }
      }
    }
    .video-title {
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      color: var(--color-text-t1);
      display: -webkit-box;
      font-size: 14px;
      font-weight: 500;
      height: 22px;
      line-height: 22px;
      margin-top: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      transition-duration: 0.35s;
      transition-property: margin;
    }
  }
}
// 选中状态遮罩
.select-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(rgba(0, 0, 0, 0.5) 0%, transparent 100%);

  .select-checkbox {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &.checked {
      background: var(--color-primary);
      color: var(--color-const-text-white);
      box-shadow: inset 0 0 0 1px var(--color-primary);
    }
  }
}

// @media (max-width: 1024px) {
//   .video-item {
//     width: calc(33.33% - 10.8px);
//     margin-right: 10px;
//   }
// }

@media (max-width: 1088px) {
  .video-item {
    width: calc(33.33% - 10.8px);
    margin-right: 10px;
  }
}
</style>
