<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import SwiperControl from '@/components/swiper/swiper-control.vue'
import SwiperVideo from '@/components/swiper/swiper-video.vue'
import { videosCtrolStore } from '@/stores/videos-control'
import { useRouter } from 'vue-router'
import apis from '@/api/apis'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

const loading = ref(true)
const list = ref<IAwemeInfo[]>([])
const control = videosCtrolStore()
const message = ref('')
const getData = async (count: number, refresh_index: number) => {
  try {
    const { aweme_list, has_more } = await apis.getRecommendFeed(
      count,
      refresh_index
    )
    // console.log(aweme_list)

    loading.value = false

    list.value.push(...aweme_list)
    control.videosNum = list.value.length
    if (!has_more) {
    }
  } catch (err) {}
}

onMounted(() => {
  //设置body为possition:fixed
  document.body.style.position = 'fixed'
  control.reset()
})
//组件销毁时，去除body的possition:fixed
onBeforeUnmount(() => {
  document.body.style.position = ''
})
//获取路由地址
const router = useRouter()
watchEffect(() => {
  getData(control.count, control.refresh_index)
})
</script>
<template>
  <div class="recommend">
    <Loading :show="loading" :isShowText="true" :center="true">
      <div class="xgplayer-playswitch">
        <swiper-control />
      </div>
      <div class="slide-list" id="slidelist">
        <swiper-video :videoList="list" />
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
    display: flex;
    flex: 1 1;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    position: relative;
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
