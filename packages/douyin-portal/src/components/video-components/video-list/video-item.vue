<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import miniPlayer from '@/components/video-player/mini-player.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  imgSrc: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  dianzan: {
    type: Number,
    default: 0
  }
})

const isLoading = ref(true)
onMounted(() => {
  //判断图片是否加载完成
  const img = new Image()
  img.src = props.imgSrc
  img.onload = () => {
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  }
})
// 点赞数转换
const dianzan = computed(() => {
  if (props.dianzan > 10000) {
    return (props.dianzan / 10000).toFixed(1) + '万'
  } else {
    return props.dianzan
  }
})
const isVideoVisible = ref(false)
const volume = ref(0)
let timer: any = null
const showVideo = () => {
  timer = setTimeout(() => {
    isVideoVisible.value = true
    volume.value = 0.6
  }, 1000)
}
const hideVideo = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    isVideoVisible.value = false
  }, 200)
}
const router = useRouter()
//点击设置modal的显示与隐藏
const toggleModal = (event: any) => {
  event.preventDefault()

  isVideoVisible.value = !isVideoVisible.value

  // 添加路由参数
  router.push({
    query: {
      modal_id: 142,
      ...router.currentRoute.value.query
    }
  })
}
</script>
<template>
  <div class="video-item">
    <a :href="videoUrl" class="video-item-link" @click="toggleModal($event)">
      <div
        class="video-item-content"
        @mouseenter="showVideo"
        @mouseleave="hideVideo"
      >
        <div class="video-item-img">
          <el-skeleton animated :loading="isLoading" class="item-skeleton">
            <template #template>
              <div class="skeleton-content">
                <div class="skeleton-logo">
                  <svg-icon class="icon" icon="loading-logo" />
                </div>
              </div>
            </template>
            <template #default>
              <img v-lazy="imgSrc" :alt="title" class="" />
              <miniPlayer
                v-if="isVideoVisible"
                class="video-player"
                :url="videoUrl"
                @click="$emit('openModal')"
              />
            </template>
          </el-skeleton>

          <!-- <div class="overlay" v-if="!isVideoVisible"></div> -->
        </div>
        <div class="video-item-block"></div>
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
      <p class="video-title">{{ title }}</p>
    </a>
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
    cursor: pointer;
    display: inline-block;
    width: 100%;
    color: inherit;
    text-decoration: none;
    .video-item-content {
      // border-radius: 4px;
      border-radius: 12px;
      overflow: hidden;
      position: relative;
      transition-duration: 0.35s;

      box-shadow: 0 0 0.5px 0 #f2f2f4;
      box-shadow: 0 0 0.5px 0 rgba(242, 242, 243, 1);
      padding-bottom: 133%;
      transition-delay: 0.5s;
      transition-property: border-radius;

      .video-item-img {
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;

        .item-skeleton {
          // background: #fff;
          background: var(--color-bg-b1);
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;

          .skeleton-content {
            padding: 16px;

            .skeleton-logo {
              display: flex;
              justify-content: center;
              align-items: center;
              padding-bottom: 16px;
              .icon {
                width: 105px;
                height: 120px;
                // color: var(--color-bg-b2);
              }
            }
          }
        }
        img {
          height: 100%;
          -o-object-fit: cover;
          object-fit: cover;
          width: 100%;
          color: #161722;
          max-height: 100%;
          max-width: 100%;
          position: relative;
          transform: scale(1);
          transition: all 0.3s ease-in;
        }

        .video-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }

      .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
      }

      .video-item-img {
        &:hover {
          img {
            transform: scale(1.05);
            transition: all 0.3s ease-out;
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
        font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
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
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      // color: #161823;
      // color: rgba(22, 24, 35, 1);
      color: var(--color-text-t1);
      display: -webkit-box;
      font-size: 14px;
      font-weight: 500;
      height: 44px;
      line-height: 22px;
      margin-top: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      transition-duration: 0.35s;
      transition-property: margin;
    }
  }
}

@media (max-width: 1024px) {
  .video-item {
    width: calc(33.33% - 10.8px);
    margin-right: 10px;
  }
}
</style>
