<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import SwiperControl from '@/components/swiper/swiper-control.vue'
import { useRouter } from 'vue-router'
import apis from '@/api/apis'
import { parseJsonStrings } from '@/utils/parseJsonStrings'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'
import swiper from '@/components/common/swiper/index.vue'

const loading = ref(true)
const list = ref<IAwemeInfo[]>([])
const count = ref(10)
const refresh_index = ref(0)
const getData = async (count: number, refresh_index: number) => {
  try {
    const { aweme_list, has_more } = await apis.getRecommendFeed(
      count,
      refresh_index
    )
    // console.log(aweme_list)

    loading.value = false

    list.value.push(...aweme_list)
    if (!has_more) {
    }
  } catch (err) {}
}

onMounted(() => {
  //设置body为possition:fixed
  document.body.style.position = 'fixed'
})
//组件销毁时，去除body的possition:fixed
onBeforeUnmount(() => {
  document.body.style.position = ''
})
//获取路由地址
const router = useRouter()
watchEffect(() => {
  getData(count.value, refresh_index.value)
})

const strToJSON = (str: string) => {
  // str = str.replace(/\\\\/g, '\\')
  // 然后，处理Unicode转义字符
  str = str.replace(/\\\u0026/g, '&')
  let parseStr = JSON.parse(str)

  console.log(parseStr)
  return parseStr
}
</script>
<template>
  <div class="recommend">
    <Loading :show="loading" :isShowText="true" :center="true">
      <div class="xgplayer-playswitch">
        <swiper-control />
      </div>
      <div class="slide-list" id="slidelist">
        <swiper :slides="list" direction="vertical">
          <template #default="{ item }">
            <swiper-player
              ref="swiperPlayerRef"
              :aweme-info="item"
              :is-play="false"
              v-if="item?.media_type === 4"
            />

            <template v-if="item?.aweme_type === 101">
              {{ strToJSON(item.cell_room.rawdata).id }}
              {{ strToJSON(item.cell_room.rawdata).title }}
              {{ strToJSON(item.cell_room.rawdata).stream_url }}
            </template>
          </template>
        </swiper>
      </div>
    </Loading>
  </div>
</template>

<style lang="scss" scoped>
.recommend {
  width: 100%;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 878px;
  overflow: hidden;
  position: relative;

  .xgplayer-playswitch {
    flex-shrink: 0;
  }
  @media only screen and (min-width: 580px) {
    .xgplayer-playswitch {
      position: absolute;
      right: 13px;
      top: calc(50% + 25px);
      transform: translateY(calc(-50% - 30px));
      z-index: 2;
    }
  }

  @media only screen and (max-width: 580px) {
    .xgplayer-playswitch {
      display: none;
    }
  }

  @media only screen and (min-width: 878px) {
    .IvL3R0Q4 {
      position: absolute;
      right: 13px;
      top: calc(50% + 60px);
      transform: translateY(calc(-50% - 30px));
      z-index: 2;
    }
  }

  .slide-list {
    position: absolute;
    left: 0;
    top: calc(0% + 0px);
    width: 100%;
    height: calc(100% - 12px);
    overflow: visible;
    padding-left: 0px;
    padding-right: 68px;
  }

  .isCssFullscreen {
    height: 100%;
    left: 0px;
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 2000;
    // background-color: var(--color-bg-b0);
  }
}
</style>
