<script setup lang="ts">
import {} from 'vue'
import newItemRight from './new-item-right.vue'

interface Item {
  id: number
  title: string
  describe: string
  img: string
  playNumber: string
  playTime: string
  author: string
  rank: number
}

const props = defineProps<{
  item: any
}>()
</script>
<template>
  <div class="new-item">
    <a href="#" class="new-item-link" target="_blank" rel="noopener noreferrer">
      <div class="new-video-content">
        <div class="new-video-img">
          <div class="blank"></div>
          <img
            :src="props.item.img"
            alt="test"
            class="img"
          />
        </div>
        <div class="video-time">
          <span>{{ props.item.playTime }}</span>
        </div>
        <template v-if="props.item.rank !== 0">
          <div
            class="video-seniority"
            :class="{ one: props.item.rank === 1, two: props.item.rank === 2 }"
          >
            <svg
              width="26"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 26 16"
            >
              <path
                d="M3.753 12.608c-.093 0-.139-.046-.139-.139V5.058c0-.056-.028-.083-.083-.083H1.139c-.093 0-.139-.047-.139-.14V3.292c0-.093.046-.139.139-.139h6.994c.093 0 .14.046.14.139v1.543c0 .093-.047.14-.14.14H5.742c-.056 0-.084.027-.084.083v7.411c0 .093-.046.14-.139.14H3.753zM12.626 10.954c.389 0 .709-.093.959-.278.25-.186.426-.44.528-.765a2.04 2.04 0 00.07-.278c.018-.112.032-.241.042-.39.018-.157.027-.347.027-.57.01-.222.014-.486.014-.792 0-.306-.004-.57-.014-.793 0-.222-.009-.408-.027-.556a3.357 3.357 0 00-.042-.39 1.946 1.946 0 00-.07-.291 1.469 1.469 0 00-.528-.765c-.25-.186-.57-.278-.96-.278-.389 0-.709.092-.959.278a1.47 1.47 0 00-.528.765c-.028.083-.051.18-.07.292a6.486 6.486 0 00-.056.389c-.009.148-.018.334-.027.556v1.585c.009.223.018.413.027.57.019.149.038.278.056.39.019.102.042.194.07.278.102.324.278.58.528.765.25.185.57.278.96.278zm0 1.807c-.825 0-1.549-.19-2.17-.57-.612-.38-1.038-.955-1.279-1.724a5.595 5.595 0 01-.139-.487 6.735 6.735 0 01-.07-.528 11.676 11.676 0 01-.041-.668c-.01-.25-.014-.551-.014-.903 0-.353.004-.654.014-.904.009-.25.023-.473.041-.668.019-.194.042-.37.07-.528a5.59 5.59 0 01.139-.487c.241-.76.667-1.33 1.28-1.71.62-.39 1.343-.584 2.168-.584.825 0 1.544.195 2.156.584.62.38 1.052.95 1.293 1.71.056.167.097.33.125.487.037.158.065.334.083.528.02.195.033.418.042.668.01.25.014.551.014.904 0 .352-.005.653-.014.903-.009.25-.023.473-.042.668-.018.195-.046.37-.083.528-.028.158-.07.32-.125.487-.241.77-.672 1.344-1.293 1.724-.612.38-1.33.57-2.155.57zM21.58 7.464c.435 0 .773-.112 1.014-.334.241-.232.362-.542.362-.932s-.12-.7-.362-.931c-.24-.232-.579-.348-1.015-.348h-1.557c-.056 0-.083.028-.083.083V7.38c0 .056.027.084.083.084h1.557zm-3.546 5.144c-.093 0-.14-.046-.14-.139V3.292c0-.093.047-.139.14-.139h3.67c.51 0 .97.074 1.377.222.408.149.756.357 1.043.626.287.269.505.589.654.96.148.37.222.783.222 1.237 0 .445-.079.853-.236 1.224a2.64 2.64 0 01-.654.96 2.867 2.867 0 01-1.029.625 4.008 4.008 0 01-1.377.222h-1.682c-.056 0-.083.028-.083.084v3.156c0 .093-.047.14-.14.14h-1.765z"
                fill="#fff"
              ></path>
            </svg>
            <svg
              width="8"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 8 16"
            >
              <text x="0" y="13" fill="#fff" font-size="13">
                {{ props.item.rank }}
              </text>
            </svg>
          </div>
        </template>
      </div>
      <new-item-right
        :title="props.item.title"
        :describe="props.item.describe"
        :playNumber="props.item.playNumber"
        :author="props.item.author"
        :rank="props.item.rank"
      />
    </a>
  </div>
</template>

<style lang="scss" scoped>
.new-item {
  padding: 0 8px 16px;
  width: 50%;
  display: inline-block;
  .new-item-link {
    // background: #fff;
    background: rgba(249, 249, 249, 1);
    background-clip: content-box;
    border: 0.5px solid rgba(22, 24, 35, 0.06);
    border-radius: 6px;
    display: flex;
    height: 182px;
    .new-video-content {
      position: relative;
      width: 238px;
      .new-video-img {
        border-radius: 6px 0 0 6px;
        height: 180px;
        overflow: hidden;
        width: 238px;

        align-items: center;
        display: flex;
        // height: 100%;
        justify-content: center;
        position: relative;
        // width: 100%;
        .blank {
          background-color: rgba(0, 0, 0, 0.3);
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }
        .img {
          height: 100%;
          -o-object-fit: contain;
          object-fit: contain;
          width: 100%;

          color: #161722;
          max-height: 100%;
          max-width: 100%;
          position: relative;
          transition: all 0.3s linear;
        }
      }

      .video-time {
        background: rgba(0, 0, 0, 0.7);
        border-radius: 4px;
        bottom: 8px;
        color: #fff;
        font-size: 12px;
        height: 26px;
        letter-spacing: 0.6px;
        line-height: 26px;
        min-width: 43px;
        padding: 0 5px;
        position: absolute;
        right: 8px;
        text-align: center;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        z-index: 1;
        span {
          opacity: 0.8;
        }
      }
      .video-seniority {
        align-items: center;
        background: linear-gradient(
          106.69deg,
          #d0d5e6,
          #9ea3b7 44.27%,
          #949dbc
        );
        border-radius: 4px;
        color: #fff;
        display: flex;
        font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
        font-size: 13px;
        font-weight: 500;
        height: 23px;
        justify-content: center;
        left: 8px;
        line-height: 23px;
        position: absolute;
        text-align: center;
        top: 8px;
        width: 47px;
        z-index: 1;
      }

      .video-seniority.one {
        background: linear-gradient(
          106.69deg,
          #ffedbd,
          #ffc83a 44.27%,
          #ff7a00
        );
      }
      .video-seniority.two {
        background: linear-gradient(
          106.69deg,
          #ffcdbd,
          #f48a7b 44.27%,
          #e2755c
        );
      }
    }
  }
}

@media (max-width: 1140px) {
  .new-item {
    width: 100%;
  }
}

@media (min-width: 1872px) {
  .new-item {
    width: 33.33%;
  }
}
</style>
