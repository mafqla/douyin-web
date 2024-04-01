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
      isScrolled.value = false
    }
  },
  true
)
//获取路由地址

watchEffect(() => {
  isUserRoute.value = router.currentRoute.value.path.includes('user')
  isSearchRoute.value = router.currentRoute.value.path.includes('search')
})
</script>

<template>
  <div class="main" :class="{ user: isUserRoute }">
    <div class="bg" :style="isSearchRoute ? { background: 'unset' } : {}"></div>
    <aside-bar />

    <div
      class="right-container min"
      :class="{
        searchLayout: isSearchRoute
      }"
    >
      <div
        class="douyin-header"
        :class="{
          scrolled: isScrolled,
          user: isUserRoute,
          search: isSearchRoute
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
  height: 100vh;
  width: 100%;

  &.user {
    height: auto;

    // .bg {
    //   // display: none;
    // }
    // :deep(.aside .aside-bar) {
    //   background: transparent !important;
    // }
    // .affix {
    //   background: unset !important;
    // }
  }
  .bg {
    background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
    height: 100vh;
    position: fixed;
    width: 100vw;
  }
}
.douyin-header.scrolled {
  background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
  background-position-x: -72px;
}

.right-container {
  // width: calc(100% - $sidebar-width);
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

  height: var(--header-height);
  transition: height 0.4s ease 0s;

  flex-grow: 0;
  flex-shrink: 0;
  // height: var(--header-height);
  // position: relative;
  // width: 100%;
  z-index: 502;
}
.douyin-header.user {
  position: fixed;
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
  }
}

@media (max-width: 1240px) {
  .right-container {
    &.searchLayout {
      padding-top: unset;
    }
  }
}
</style>
