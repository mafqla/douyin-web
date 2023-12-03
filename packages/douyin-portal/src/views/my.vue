<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef, watchEffect } from 'vue'
import { UserHeaderMy, LoginCode, UserTab, UserFooter } from '@/components/my'
import { userStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { videoStore } from '@/stores/videos'
// import backgroundurlLightURL from '@/assets/user-background-light.png'
// import backgroundurlDarkURL from '@/assets/user-background-dark.png'
import backgroundurlLightURL from '@/assets/personal_light.png'
import backgroundurlDarkURL from '@/assets/personal_dark.png'
import { useInfiniteScroll, useScroll } from '@vueuse/core'
import useTheme from '@/hooks/useTheme'
import { settingStore } from '@/stores/setting'

const background = ref(`url('${backgroundurlLightURL}')`)

//用户背景图
const backgroundurl = ref(
  'https://p9-pc-sign.douyinpic.com/obj/c84d0007ec6c02d356d6?x-expires=1698926400&x-signature=90nGwZ9Rbb2I8pbeCFifHXP1rmo%3D&from=2480802190'
)

const isDisplay = ref(false)
const router = useRouter()

const video = videoStore()

const store = userStore()
const isLogin = ref(false)
const isDataLoaded = ref(false)
const query = ref(router.currentRoute.value.query.showTab) as any
const page = ref(1)
const size = ref(10)
const allowScroll = ref(true)

const fetchVideoData = async (page: number, size: number) => {
  if (query.value === null || query.value === undefined) {
    // console.log(query.value)
    return
  }
  const data = await video.getVideoDataByParams({
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

//设置浏览器标题
document.title = store.userInfo.userAuth
  ? `${store.userInfo.username}的主页 - ${store.userInfo.userAuth} - 抖音`
  : `${store.userInfo.username}的主页 - 抖音`
onBeforeUnmount(() => {
  document.title = '抖音-记录美好生活'
})
onMounted(() => {
  isLogin.value = store.isLogin()
  if (!isDataLoaded.value && isLogin.value) {
    fetchVideoData(page.value, size.value)
    isDataLoaded.value = true
  }
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
  // console.log(theme.value)
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
  if (!isDataLoaded.value && isLogin.value) {
    isDataLoaded.value = true
    fetchVideoData(page.value, size.value)
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
    fetchVideoData(page.value, size.value)
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
        <div class="user-header-background">
          <div class="header-img-content">
            <div
              class="header-img"
              :style="{
                backgroundImage: `url(${backgroundurl})`
              }"
            ></div>
          </div>
          <div class="header-down-bg"></div>
          <div class="header-down-bg-1"></div>
          <div class="header-down-bg-2"></div>
          <div class="header-down-bg-3"></div>
        </div>
        <user-header-my />
        <user-tab />
        <login-code v-if="!isLogin" />
      </div>
    </div>
    <user-footer />
  </div>
</template>

<style lang="scss" scoped>
html.dark {
  .header-img {
    opacity: 1 !important;
  }
  .header-down-bg-1 {
    background-image: linear-gradient(
      180deg,
      rgba(29, 29, 36, 0),
      #161823
    ) !important;
    top: auto !important;
  }
  .header-down-bg-2 {
    background-image: linear-gradient(
      0deg,
      rgba(25, 26, 36, 0) 27.08%,
      #161823 104.06%
    ) !important;
  }

  .header-down-bg-3 {
    background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.5));
  }
}
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
      // background-image: v-bind(background);
      // background-position: 0 0;
      // background-size: 100% 140%;
      // height: 300px;
      // pointer-events: none;
      // width: 100vw;

      // // background-position: 50%;
      // // background-repeat: no-repeat;
      // // background-size: 1920px 172px;
      // // height: 172px;
      // left: 0;
      // position: absolute;
      // right: 0;
      // top: 0;
      height: 233px;
      // margin-top: -68px;
      overflow: hidden;
      position: relative;
      width: 100%;

      .header-img-content {
        height: 281px;
        position: absolute;
        right: 0;
        top: 0;
        width: 672px;

        .header-img {
          background-repeat: no-repeat;
          background-size: cover;
          height: 377px;
          margin-top: -48px;
          opacity: 0.15;
          width: 672px;
        }
      }

      .header-down-bg {
        background-image: var(--down-bg-color);
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
      }
      .header-down-bg-1 {
        background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #fff);
        bottom: -48px;
        height: 126px;
        top: 110px;
      }
      .header-down-bg-2 {
        background-image: linear-gradient(0deg, hsla(0, 0%, 100%, 0), #fff);
        height: 244px;
        top: 0;
      }
      .header-down-bg-1,
      .header-down-bg-2 {
        position: absolute;
        right: 0;
        width: calc(50% + 494px);
      }
      .header-down-3 {
        background-image: linear-gradient(
          90deg,
          hsla(0, 0%, 100%, 0),
          hsla(0, 0%, 100%, 0.3)
        );
        height: 240px;
        right: 0;
        width: 281px;
      }
    }
    .user-detail-content {
      margin: 0 auto;
      max-width: none;
      // width: calc(100% - 120px);
      width: 100%;
      // max-width: 1208px;
      min-height: calc(100vh - 60px);
      min-width: 682px;
      // min-width: 760px;
    }
    .user-detail-content.max {
      max-width: none !important;
      width: 100% !important;
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
  .header-down-bg-1,
  .header-down-bg-2 {
    width: calc(100% - 230px) !important;
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

// @media (max-width: 840px) {
//   .user-detail {
//     .user-detail-content {
//       margin: 0 20px;
//     }
//   }
// }

// :deep(.header) {
//   border-bottom: 1px solid hsla(0, 0%, 100%, 0.1) !important;
// }

// :global(.header-search-icon) {
//   :global(button) {
//     background-color: transparent !important;

//     :global(.icon-search) {
//       color: #fff;
//     }
//     :global(.btn-title) {
//       color: #fff !important;
//     }

//     :global(&:hover) {
//       background-color: hsla(0, 0%, 100%, 0.3) !important;
//       :global(.icon-search) {
//         color: #fff;
//       }
//       :global(.btn-title) {
//         color: #fff;
//       }
//     }
//   }
// }

// :global(.header-search-input) {
//   background-color: transparent !important;
//   border: 2px solid hsla(0, 0%, 100%, 0.3) !important;
//   caret-color: #fe2c55;

//   :global(&::placeholder) {
//     color: rgba(255, 255, 255, 1);
//   }

//   :global(&:active) {
//     border: 2px solid hsla(0, 0%, 100%, 0.3) !important;
//   }
// }

// :global(.header-right-item-overplay) {
//   background-color: hsla(0, 0%, 100%, 0.17) !important;
// }

// :global(.header-right-item:hover) {
//   p {
//     color: rgba(255, 255, 255, 1) !important;
//   }
//   .icon {
//     opacity: 1;
//   }
// }
// :global(.header-right) {
//   :global(.header-right-item) {
//     p {
//       color: rgba(255, 255, 255, 0.75) !important;
//     }
//     :global(.icon) {
//       opacity: 0.8;
//       color: #fff;

//       path {
//         fill: rgba(255, 255, 255, 1) !important;
//       }
//     }
//   }
// }
</style>
