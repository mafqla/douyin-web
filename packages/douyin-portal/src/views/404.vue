<script setup lang="ts">
import HeaderNav from '@/layout/HeaderNav.vue'
import { useTitle } from '@vueuse/core'
import {} from 'vue'

useTitle(window.location.href)
</script>
<template>
  <div class="error-page">
    <div class="bg"></div>
    <div class="error-header">
      <div class="aside-top">
        <div class="aside-logo">
          <a href="/" class="aside-logo-a"></a>
        </div>
      </div>
      <div class="douyin-header">
        <div class="douyin-header-content">
          <header-nav />
        </div>
      </div>
    </div>

    <div class="container">
      <div class="error-content" aria-label="Error Message">
        <div class="icon-placeholder">
          <div class="error-icon"></div>
        </div>
        <div class="error-message">你要观看的视频不存在</div>
        <div class="additional-info"></div>
        <div class="action-buttons"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  height: 100%;
  width: 100%;
  background-color: var(--color-bg-b0);
  background-position: top;
  background-size: cover;
  flex-direction: column;
  align-items: stretch;
  display: flex;
  .bg {
    background: no-repeat url(/src/assets/test.png) var(--color-bg-b0);
    height: 100vh;
    position: fixed;
    width: 100vw;
  }
  .error-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }
  .aside-top {
    // height: 60px;
    height: 68px;
    width: 100%;
    position: relative;
    user-select: none;
    flex-shrink: 0;
    flex-basis: 72px;
    justify-content: center;
    align-items: center;
    display: flex;

    .aside-logo {
      background: transparent !important;
      align-items: center;
      background: #f2f2f4;
      display: flex;
      flex-basis: $sidebar-width-min;
      flex-shrink: 0;
      height: 165%;
      justify-content: center;
      left: 50%;
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      z-index: 2;

      .aside-logo-a {
        -webkit-app-region: no-drag;

        background: var(--logo-small-url) no-repeat;
        height: 34px;
        opacity: 1;
        transition: opacity 0.3s;
        width: 30px;
      }
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
    z-index: 502;
    .douyin-header-content {
      height: var(--header-height);
      min-width: 628px;
      width: 100%;
    }
  }
}
.container {
  width: 100%;
  height: 100%;
  // padding-top: var(--header-height);
  flex-direction: column;
  display: flex;
}
.error-content {
  min-height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
  position: relative;

  .icon-placeholder {
    margin-bottom: 27px;
    position: relative;
    .error-icon {
      background-image: var(--notFound-image);
      width: 240px;
      height: 160px;
      background-size: 100% 100%;
    }
  }
  .error-message {
    color: var(--color-text-t1);
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    position: relative;
  }
  .additional-info {
    color: var(--color-text-t3);
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 22px;
    position: relative;
  }
  .action-buttons {
    margin-top: 24px;
    display: flex;
    position: relative;
  }
}
</style>
