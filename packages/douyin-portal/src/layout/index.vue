<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import AsideBar from '@/layout/AsideBar.vue'
import HeaderNav from '@/layout/HeaderNav.vue'
import { useRouter } from 'vue-router'
import { userStore } from '@/stores/user'
// 设置背景颜色
const backgroundColor = ref(true)
const isScrolled = ref(false)
const router = useRouter()
const isUserRoute = ref(false)
const isSearchRoute = ref(false)
const isVideoRoute = ref(false)
// 滚动监听
window.addEventListener(
  'scroll',
  function () {
    // console.log(window.scrollY)
    if (window.scrollY > 60) {
      backgroundColor.value = false
      isScrolled.value = true
    } else {
      backgroundColor.value = true
      isScrolled.value = false
    }

    if (isSearchRoute.value) {
      backgroundColor.value = false
      // isScrolled.value = false
    }
  },
  true
)
//获取路由地址

watchEffect(() => {
  isUserRoute.value = router.currentRoute.value.path.includes('user')
  isSearchRoute.value = router.currentRoute.value.path.includes('search')
  isVideoRoute.value = router.currentRoute.value.path.includes('video')
})
</script>

<template>
  <div
    class="main"
    :class="{ user: isUserRoute, video: isVideoRoute, search: isSearchRoute }"
  >
    <div class="bg" :class="{ search: isSearchRoute }"></div>
    <aside-bar />

    <div
      class="right-container min"
      :class="{
        searchLayout: isSearchRoute,
        videoLayout: isVideoRoute
      }"
    >
      <div
        class="douyin-header"
        :class="{
          scrolled: isScrolled,
          user: isUserRoute,
          search: isSearchRoute,
          video: isVideoRoute
        }"
      >
        <div class="douyin-header-content" :class="{ none: backgroundColor }">
          <header-nav :class="{ scrolled: isScrolled }" />
        </div>
      </div>

      <router-view v-slot="{ Component, route }" :key="userStore().routerKey">
        <!-- <keep-alive> -->
        <component :is="Component" :key="route.path" />
        <!-- </keep-alive> -->
      </router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  //  background-color: var(--color-bg-b0);
  background-position: top;
  background-size: cover;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;

  &.user,
  &.video,
  &.search {
    height: auto;

    .bg {
      display: none;
    }
    :deep(.aside .aside-bar) {
      background: transparent !important;
    }
    // .affix {
    //   background: unset !important;
    // }
  }

  .bg {
    background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
    height: 100vh;
    position: fixed;
    width: 100vw;

    &.search {
      background: unset;
    }
  }
}

.right-container {
  // width: calc(100% - $sidebar-width);
  padding-top: var(--header-height);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;

  &.min {
    min-height: 450px;
  }

  &.searchLayout {
    padding-top: var(--header-height);
    position: relative;
    width: 100%;
    overflow-y: auto;
  }

  &.videoLayout {
    padding-top: var(--header-height);
    position: relative;
    overflow-y: auto;
  }
}

.douyin-header-content {
  // height: 60px;
  height: var(--header-height);
  min-width: 628px;
  width: 100%;

  &.none {
    background-color: transparent;
  }
}

.douyin-header {
  background-position-x: -72px;
  width: calc(100% - 72px);
  position: fixed;
  top: 0;
  right: 0;

  height: var(--header-height);
  transition: height 0.4s ease 0s;

  flex-grow: 0;
  flex-shrink: 0;
  // height: var(--header-height);
  // position: relative;
  // width: 100%;
  z-index: 502;

  &.video,
  &.search {
    position: fixed;
    top: 0;
  }
  &.user {
    position: fixed;
  }
  &.scrolled {
    background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
    background-position-x: -72px;
  }

  &.search.scrolled,
  &.user.scrolled,
  &.video.scrolled {
    background: var(--color-bg-b0);
  }
}

// .affix {
//   background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
//   background-position-x: -72px;
// }
// .el-affix--fixed {
//   width: calc(100% - 72px);
// }

@media (min-width: 1240px) {
  .douyin-header {
    background-position-x: calc(var(--navigation-expend-width) * -1);
    width: calc(100% - var(--navigation-expend-width));

    &.scrolled {
      background-position-x: calc(var(--navigation-expend-width) * -1);
    }

    &.user {
      position: fixed;

      width: calc(100% - var(--navigation-expend-width));
    }

    &.search {
      position: fixed;
      top: 0;
      width: calc(100% - var(--navigation-expend-width));
    }

    &.video {
      position: fixed;
      top: 0;
      width: calc(100% - var(--navigation-expend-width));
    }
  }
}
</style>
