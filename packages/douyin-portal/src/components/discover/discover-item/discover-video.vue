<script setup lang="ts">
import { computed, ref } from 'vue'
import miniPlayer from '@/components/video-player/mini-player.vue'
import { useElementSize } from '@vueuse/core'
import { useCount } from '@/hooks'

const props = defineProps({
  img: String,
  videoTime: String,
  like: Number,
  videoUrl: String,
  itemWidth: Number,
  itemHeight: Number
})

const isVideoVisible = ref(false)
let timer: any = null
let volume = ref(0)
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
const heightImg = ref(0)
const widthImg = ref(0)
let img = new Image()
img.onload = function () {
  let width = img.width
  let height = img.height
  widthImg.value = width
  heightImg.value = height
  // console.log(width, height)
}
img.src = props.img as string

const paddingTop = computed(() => {
  return (heightImg.value / widthImg.value) * 100
})

const newWidth = Math.round(props.itemWidth as any)
</script>
<template>
  <div
    class="item-video videoImage"
    :style="{ paddingTop: `${paddingTop}%` }"
    @mouseenter="showVideo"
    @mouseleave="hideVideo"
  >
    <div class="item-video-content" ref="renderedImg">
      <div class="item-video-content-img item-video-content-img-hover">
        <div class="item-video-content-img-item-defalut"></div>
        <div class="item-video-content-img-item-block"></div>
        <img
          :src="props.img"
          alt="null"
          fetchpriority="high"
          decoding="async"
          :width="newWidth"
          :height="Math.round(props.itemHeight as any)"
        />
        <miniPlayer
          v-if="isVideoVisible"
          class="video-player"
          :url="videoUrl"
          :volume="volume"
        />
        <div
          class="overlay"
          v-if="isVideoVisible"
          @click="$emit('openModal')"
        ></div>
      </div>

      <div class="item-video-info" v-if="!isVideoVisible">
        <div class="item-video-block"></div>
        <div class="item-video-info-content">
          <div class="info-content-blank"></div>
          <div class="info-content-blank2"></div>
          <div class="video-time">{{ props.videoTime }}</div>
          <div class="likes">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="BnHuaqS7"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.224 4.667C6.326 4.667 4 7.151 4 10.043l.002.169a1.078 1.078 0 00-.002.094c.009.387.097.855.195 1.245.096.382.23.806.38 1.113.605 1.301 1.664 2.563 2.683 3.6a30.679 30.679 0 003.425 3.008l.02.017.015.012c.226.226.703.7 1.554.7h.025c.241 0 .816-.001 1.331-.502.009-.008.022-.02.042-.035l.182-.151.004-.004c.565-.465 1.886-1.554 3.188-2.867.834-.836 1.698-1.807 2.359-2.81.09-.136.176-.273.258-.41.033-.055.06-.112.082-.17.03-.077.044-.108.055-.13.013-.025.034-.063.088-.146.038-.06.07-.122.096-.188.037-.093.064-.156.085-.199l.004-.009c.087-.11.152-.238.19-.374.162-.576.273-1.082.284-1.705 0-.03 0-.058-.002-.087a7.123 7.123 0 00.001-.206c-.019-2.876-2.338-5.341-5.224-5.341-1.094 0-2.159.339-2.999 1.021-.909-.658-1.957-1.021-3.097-1.021zm9.162 5.377v.134a2.388 2.388 0 000 .14c-.01.294-.057.559-.156.935-.043.07-.076.135-.1.186a4.313 4.313 0 00-.116.26c-.108.173-.178.31-.251.492-.05.082-.104.167-.16.252h-.001c-.55.834-1.304 1.69-2.087 2.476l-.003.002c-1.223 1.234-2.474 2.266-3.033 2.727l-.041.034c-.05.04-.105.086-.157.13l-.06-.061c-.065-.064-.154-.135-.197-.17l-.008-.006a28.517 28.517 0 01-3.214-2.817l-.003-.004c-.968-.985-1.824-2.042-2.27-3.009a4.077 4.077 0 01-.24-.719 4.491 4.491 0 01-.129-.715l.001-.036v-.098l-.001-.005-.002-.129c0-1.778 1.436-3.218 3.066-3.218.857 0 1.667.348 2.393 1.102a1.079 1.079 0 001.66-.129c.428-.61 1.155-.973 2.043-.973 1.63 0 3.066 1.441 3.066 3.218v.001z"
                fill="#fff"
              ></path>
            </svg>
            <span>{{ useCount(props.like ?? 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-video {
  height: 0px;
  padding-top: 75%;
  position: relative;
  width: 100%;
  .item-video-content {
    align-items: center;
    background-image: initial;
    background-position-x: initial;
    background-position-y: initial;
    background-size: initial;
    // background-repeat-x: initial;
    // background-repeat-y: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    // background-color: rgba(37, 38, 50, 1);
    background-color: rgba(249, 249, 249, 1);
    cursor: pointer;
    display: flex;
    justify-content: center;
    left: 0px;
    position: absolute;
    top: 0px;
    overflow: hidden;

    width: 100%;
    height: 100%;
    .item-video-content-img {
      align-items: center;
      display: flex;
      height: 100%;
      justify-content: center;
      position: relative;
      width: 100%;

      .item-video-content-img-item-block,
      .item-video-content-img-item-defalut {
        bottom: 0px;
        left: 0px;
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .item-video-content-img-item-defalut {
        background-size: cover;
        filter: blur(20px);
        background-repeat: no-repeat;
      }
      .item-video-content-img-item-block {
        background-color: rgba(0, 0, 0, 0.3);
      }

      img {
        width: 100%;
        object-fit: contain;

        color: rgb(22, 23, 34);
        max-height: 100%;
        max-width: 100%;
        position: relative;
        // transition: all 0.3s linear 0s;
      }
    }
    .item-video-content-img-hover {
      animation-timeline: unset !important;
      // animation-range-start: unset !important;
      // animation-range-end: unset !important;
      animation: unset !important;
    }

    .item-video-info {
      height: 100%;
      left: 0px;
      position: absolute;
      top: 0px;
      width: 100%;

      .item-video-block {
        bottom: 0px;
        height: 64px;
        position: absolute;
        width: 100%;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.3));
      }
      .item-video-info-content {
        height: 100%;
        position: relative;
        width: 100%;
        .info-content-blank2 {
          display: flex;
          left: 12px;
          position: absolute;
          top: 12px;
        }
        .info-content-blank {
          display: flex;
          left: 8px;
          position: absolute;
          top: 8px;
        }
        .video-time {
          background-color: rgba(0, 0, 0, 0.7);
          bottom: 10px;
          color: rgb(255, 255, 255);
          font-size: 12px;
          line-height: 20px;
          min-width: 43px;
          position: absolute;
          right: 8px;
          text-align: center;
          border-radius: 4px;
          padding: 0px 5px;
        }
        .likes {
          align-items: center;
          bottom: 8px;
          color: rgb(255, 255, 255);
          display: inline-flex;
          font-size: 13px;
          height: 24px;
          left: 8px;
          line-height: 21px;
          opacity: 0.9;
          position: absolute;
          text-shadow: rgba(0, 0, 0, 0.15) 0px 0.712644px 0.712644px;
        }
      }
    }

    .video-player {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      z-index: 1;
    }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      // z-index: 1;
    }
  }
}

// .item-content:hover {
//   .item-video-content-img-hover {
//     transform: scale(1.05);
//   }
// }
</style>
