<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef, watchEffect } from 'vue'
import { UserTab, UserFooter } from '@/components/my'
import { userStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { videoStore } from '@/stores/videos'
// import backgroundurlLightURL from '@/assets/user-background-light.png'
// import backgroundurlDarkURL from '@/assets/user-background-dark.png'
import backgroundurlLightURL from '@/assets/personal_light.png'
import backgroundurlDarkURL from '@/assets/personal_dark.png'
import { useInfiniteScroll, useScroll } from '@vueuse/core'
import { AuthUserInfo } from '@/service/auth/auth'
import { settingStore } from '@/stores/setting'

const background = ref(`url('${backgroundurlLightURL}')`)

const isDisplay = ref(false)
const router = useRouter()

const video = videoStore()

const isDataLoaded = ref(false)
const query = ref(router.currentRoute.value.query.showTab) as any
const userId = ref(Number(router.currentRoute.value.params.id))
const page = ref(1)
const size = ref(10)
const allowScroll = ref(true)
const userInfo = ref({}) as any
const fetchVideoData = async (page: number, size: number, userId?: number) => {
  if (query.value === null || query.value === undefined) {
    // console.log(query.value)
    return
  }
  const data = await video.getVideoDataByParams({
    userId,
    showTab: query.value,
    page,
    size
  })
  if (data) {
    if (query.value === 'post') {
      video.userPostVideos.push(...data)
    }
    if (query.value === 'like') {
      video.userLikeVideos.push(...data)
    }
    if (query.value === 'favorite_collection') {
      video.userCollectVideos.push(...data)
    }
    if (query.value === 'record') {
      video.userRecordVideos.push(...data)
    }
  }
  allowScroll.value = data && ((data.length > 0) as any)
}

onMounted(async () => {
  router.push({
    query: {
      showTab: 'post'
    }
  })
  if (!isDataLoaded.value) {
    fetchVideoData(page.value, size.value, userId.value)
    isDataLoaded.value = true
  }

  try {
    const res = await AuthUserInfo(userId.value)
    // console.log(res)
    if (res) {
      userInfo.value = res.data
      document.title = userInfo.value.userAuth
        ? `${userInfo.value.username}的主页 - ${userInfo.value.userAuth} - 抖音`
        : `${userInfo.value.username}的主页 - 抖音`
    }
  } catch (e) {
    console.log(e)
  }
})
onBeforeUnmount(() => {
  document.title = '抖音-记录美好生活'
})
// 滚动监听
const { y } = useScroll(window)

const load = () => {
  if (!allowScroll.value) {
    return
  }
  video.bottomLoading = true
  page.value += 1
  // fetchVideoData()
  video.bottomLoading = false
  fetchVideoData(page.value, size.value)
}

// console.log(page.value)
const theme = toRef(settingStore(), 'theme')
watchEffect(() => {
  if (theme.value === 'dark') {
    background.value = `url('${backgroundurlDarkURL}')`
  } else {
    background.value = `url('${backgroundurlLightURL}')`
  }
  // console.log(y.value)
  if (y.value > 60) {
    isDisplay.value = true
  } else {
    isDisplay.value = false
  }
  if (y.value > 160) {
    document.querySelector('.el-tabs__header')?.classList.add('header-scroll')
  } else {
    document
      .querySelector('.el-tabs__header')
      ?.classList.remove('header-scroll')
  }
  if (!isDataLoaded.value) {
    isDataLoaded.value = true
    fetchVideoData(page.value, size.value, userId.value)
  }

  //如果query改变，清空数据

  // fetchVideoData(page.value, size.value)
  if (query.value !== router.currentRoute.value.query.showTab) {
    query.value = router.currentRoute.value.query.showTab
    page.value = 1

    video.userPostVideos = []
    video.userLikeVideos = []
    video.userCollectVideos = []
    video.userRecordVideos = []
    // 调用API
    fetchVideoData(page.value, size.value, userId.value)
  }
})
const el = ref()
useInfiniteScroll(window, load, {
  distance: 500
})
// 监听滚动事件
</script>
<template>
  <div class="my" ref="el">
    <div class="user-detail" :class="{ scrolled: isDisplay }">
      <div class="user-detail-content max">
        <div class="user-header-background"></div>
        <user-header-other :userInfo="userInfo" />
        <user-tab-other />
      </div>
    </div>
    <user-footer />
  </div>
</template>

<style lang="scss" scoped>
.scrolled::before {
  opacity: 0; // 滚动后使背景图片消失
}
.my {
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  overflow-y: scroll;
  // overflow-x: hidden;
  user-select: none;
  min-height: 100%;
  .user-detail {
    // padding-top: 60px;
    display: flex;
    flex: 1 1;
    min-height: 100%;
    width: 100%;
    // &::before {
    //   background-image: v-bind(background);
    //   background-position: 50%;
    //   background-repeat: no-repeat;
    //   background-size: 1920px 172px;
    //   content: '';
    //   height: 172px;
    //   left: 0;
    //   position: absolute;
    //   right: 0;
    //   top: 0;
    //   // z-index: -1;
    //   transition: opacity 0.3s ease-in-out;
    // }
    .user-header-background {
      background-image: v-bind(background);
      background-position: 0 0;
      background-size: 100% 140%;
      height: 300px;
      pointer-events: none;
      width: 100vw;

      // background-position: 50%;
      // background-repeat: no-repeat;
      // background-size: 1920px 172px;
      height: 172px;
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
    }
    .user-detail-content {
      margin: 0 auto;
      max-width: none;
      width: calc(100% - 120px);
      max-width: 1208px;
      min-height: calc(100vh - 60px);
      // min-width: 682px;
      min-width: 760px;
    }
  }
}
@media (max-width: 1475px) {
  .user-detail {
    .user-detail-content.max {
      max-width: none;
      width: calc(100% - 120px);
    }
  }
}
@media (max-width: 1328px) {
  .user-detail {
    .user-detail-content {
      max-width: none;
      width: calc(100% - 120px);
    }
  }
}

@media (min-width: 1920px) {
  .user-detail {
    .user-detail-content {
      &::before {
        background-size: 100% 100%;
      }
    }
  }
}
</style>
