<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'

import hot_boom from '@/assets/hot/hot_boom.png'
import hot_first from '@/assets/hot/hot_first.png'
import hot_hot from '@/assets/hot/hot_hot.png'
import hot_exclusive from '@/assets/hot/hot_exclusive.png'
import hot_new from '@/assets/hot/hot_new.png'

import hotup from '@/assets/hot/up.png'
import hot_top1 from '@/assets/hot/hot_top1.png'
import hot_top2 from '@/assets/hot/hot_top2.png'
import hot_top3 from '@/assets/hot/hot_top3.png'
import { useElementSize } from '@vueuse/core'
import { discoverStore } from '@/stores/discover'

import { hot, entertainment, society, challenge } from '@/service/test/hot'

const listData = ref([]) as any
const imgTypeToSrc: { [key: number]: string } = {
  4: hot_boom,
  5: hot_first,
  3: hot_hot,
  8: hot_exclusive,
  1: hot_new
}
const getTagSrc = (id: number) => {
  return imgTypeToSrc[id]
}

//处理1-3名的图片路径
const getImgSrc = (id: number) => {
  if (id === 1) {
    return hot_top1
  } else if (id === 2) {
    return hot_top2
  } else if (id === 3) {
    return hot_top3
  }
}

const titleItems = ['抖音热榜', '娱乐榜', '社会榜', '挑战榜']
const selectedIndex = ref(0)

const selectItem = (index: number) => {
  selectedIndex.value = index
}

watchEffect(async () => {
  if (selectedIndex.value === 0) {
    listData.value = (await hot()).data.word_list
  } else if (selectedIndex.value === 1) {
    listData.value = (await entertainment()).data.word_list
  } else if (selectedIndex.value === 2) {
    listData.value = (await society()).data.word_list
  } else if (selectedIndex.value === 3) {
    listData.value = (await challenge()).data.word_list
  }

  // console.log(listData.value)
})

const el = ref(null)
const { height } = useElementSize(el)

setTimeout(() => {
  // console.log('hot:', height)
  discoverStore().hotHeight = height.value
}, 2000)
</script>
<template>
  <div class="hot-item" :style="{ height: `${height}px` }">
    <div class="hot-item-main" ref="el">
      <div class="hot-item-blank"></div>
      <div class="hot-item-content">
        <div class="hot-item-content-title">
          <div
            v-for="(item, index) in titleItems"
            :key="index"
            :class="{
              'hot-item-content-title-item': true,
              selected: selectedIndex === index
            }"
            @click="selectItem(index)"
          >
            {{ item }}
          </div>
        </div>
        <div class="hot-itme-line"></div>

        <div class="hot-item-list">
          <ul class="hot-item-list-content hotChangableList">
            <template v-for="item in listData" :key="item.position">
              <li class="hot-item-list-content-item">
                <div class="hot-item-list-content-text listStyle">
                  <img :src="hotup" alt="" v-if="item.hot_value === 0" />
                  <img
                    :src="getImgSrc(item.position)"
                    alt=""
                    v-if="item.position <= 3"
                  />

                  <svg-icon
                    :icon="`icon-${parseInt(item.position.toString()[0], 10)}`"
                    class="icon"
                    v-if="item.position > 3"
                  />
                  <svg-icon
                    :icon="`icon-${parseInt(item.position.toString()[1], 10)}`"
                    class="icon"
                    v-if="item.position >= 10"
                  />
                </div>
                <div class="hot-item-list-content-item-title-content">
                  <div class="custom-link">
                    <a
                      :href="`https://www.douyin.com/hot/${item.sentence_id}`"
                      class="custom-title active"
                      target="_blank"
                    >
                      <h3>{{ item.word }}</h3>
                    </a>
                    <img :src="getTagSrc(item.label)" alt="" />
                  </div>

                  <div class="hot-du" v-show="item.hot_value !== 0">
                    <span class="hot-num">{{
                      item.hot_value >= 10000
                        ? (item.hot_value / 10000).toFixed(1) + '万'
                        : item.hot_value
                    }}</span>
                    <span>热度</span>
                  </div>
                </div>

                <div
                  class="hot-item-content-show"
                  style="text-align: center; width: 202px"
                >
                  {{ item.word }}
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot-item {
  position: absolute;
  will-change: transform;

  .hot-item-main {
    background-color: var(--color-bg-b1);
    // background-color: rgba(37, 38, 50, 1);
    border: 0.5px solid var(--color-line-l3);
    // border: 0.5px solid rgba(255, 255, 255, 0.04);
    border-radius: 12px;
    box-shadow: 0 0 0.5px 0 var(--color-secondary-default);
    // box-shadow: 0 0 0.5px 0 rgba(242, 242, 243, 0.08);
    overflow: hidden;
    position: relative;
    width: 100%;

    .hot-item-blank {
      padding-bottom: 212.5%;
      width: 100%;
    }

    .hot-item-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      position: absolute;
      top: 0;
      width: 100%;

      .hot-item-content-title {
        display: flex;
        height: 46px;
        justify-content: space-between;
        padding: 0 16px;
        width: 100%;

        .hot-item-content-title-item {
          align-items: center;
          // color: rgba(22, 24, 35, 0.75);
          color: var(--color-text-t2);
          // color: rgba(255, 255, 255, 0.75);
          cursor: pointer;
          display: flex;
          font-family: PingFang SC;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          height: 100%;
          line-height: 22px;
        }

        .hot-item-content-title-item.selected {
          border-bottom: 3px solid #fe2c55;
          border-top: 3px solid transparent;
          color: var(--color-text-t0);
          // color: rgba(255, 255, 255, 1);
          font-weight: 600;
        }
      }

      .hot-itme-line {
        background-color: rgba(22, 24, 35, 0.06);
        // background-color: rgba(255, 255, 255, 0.04);
        display: block;
        height: 1px;
        min-height: 1px;
        position: relative;
        width: 100%;
      }

      .hot-item-list {
        flex: 1 1;
        margin-right: 4px;
        overflow: scroll;
        overflow-x: hidden;

        .hot-item-list-content {
          .hot-item-list-content-item {
            display: flex;
            overflow: hidden;
            padding-bottom: 18px;
            position: relative;
            width: 100%;

            &:hover {
              h3 {
                color: #ff2c55 !important;
              }

              .hot-item-content-show {
                display: block;
              }
            }
            .hot-item-list-content-text {
              // color: rgba(22, 24, 35, 0.6);
              color: var(--color-text-t3);
              // color: rgba(255, 255, 255, 0.5);
              flex-shrink: 0;
              font-size: 21px;
              font-weight: 700;
              line-height: 24px;
              margin-right: 4px;
              text-align: center;
              width: 24px;

              img {
                height: 24px;
                width: 24px;
              }
            }
            // .hot-item-list-content-text.listStyle {
            // }

            .hot-item-list-content-item-title-content {
              overflow: hidden;
              .custom-link {
                align-items: center;
                display: flex;
                font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
                font-weight: 500;
                padding-bottom: 4px;
                .custom-title {
                  position: relative;
                  h3 {
                    color: var(--color-text-t1);
                    // color: rgba(255, 255, 255, 0.9);
                    font-size: 16px;
                    line-height: 24px;
                    margin-right: 5px;
                  }
                }
                img {
                  height: 16px;
                  width: auto;
                }
              }
              .active,
              h3 {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .hot-du {
                color: var(--color-text-t3);
                // color: rgba(255, 255, 255, 0.5);
                font-size: 14px;
                line-height: 22px;
                .hot-num {
                  font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
                  font-weight: 500;
                  padding-right: 4px;
                }
              }
            }

            .hot-item-content-show {
              background-color: var(--color-bg-b2);
              // background-color: rgba(51,52,63,1);
              border: 1px solid var(--color-line-l2);
              // border: 1px solid rgba(255, 255, 255, 0.12);
              border-radius: 4px;
              color: var(--color-text-t1);
              // color: rgba(255, 255, 255, 0.9);
              display: none;
              // filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.04));
              filter: drop-shadow(0 12px 24px var(--color-shadow1));
              font-size: 12px;
              left: 50%;
              line-height: 20px;
              max-width: 100%;
              padding: 0 10px;
              position: absolute;
              text-align: center;
              top: 24px;
              transform: translateX(-50%);
              z-index: 1;
            }
          }
        }
        .hotChangableList.hot-item-list-content {
          padding: 16px 8px 0 12px;
        }
        .hotChangableList .hot-item-list-content-item {
          overflow: visible;
          padding-bottom: 16px;

          .hot-du .hot-num {
            font-weight: 400;
          }
          .active h3 {
            font-size: 15px !important;
            font-weight: 500;
          }
        }
      }
    }
  }

  .icon {
    width: 12px;
    height: 24px;
    color: var(--color-text-t3);
    // color: rgba(255, 255, 255, 0.5);
  }
}
</style>
