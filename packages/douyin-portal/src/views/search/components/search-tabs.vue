<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//切换布局
const currentLayout = ref(true)

const route = useRoute()
const router = useRouter()
//当前切换的选项
const currentTab = ref(route.query.type || 'general')
const handleClick = (tabName: string) => {
  currentTab.value = tabName
  router.push({ query: { tabName } })
}
</script>
<template>
  <div class="search-center-tabs">
    <div class="search-center-tabs-content">
      <span
        class="tabs-item"
        :class="{ active: currentTab === 'general' }"
        @click="handleClick('general')"
        >综合</span
      >
      <span
        class="tabs-item"
        :class="{ active: currentTab === 'video' }"
        @click="handleClick('video')"
        >视频</span
      >
      <span
        class="tabs-item"
        :class="{ active: currentTab === 'users' }"
        @click="handleClick('users')"
        >用户</span
      >
      <span
        class="tabs-item"
        :class="{ active: currentTab === 'live' }"
        @click="handleClick('live')"
        >直播</span
      >
      <div
        class="swiper-layout-1"
        :class="{ active: !currentLayout }"
        @click="currentLayout = !currentLayout"
      >
        <svg-icon icon="multi-column" class="column-icon-1" />

        <div class="m-2">多列</div>
      </div>
      <div
        class="swiper-layout-2"
        :class="{ active: currentLayout }"
        style="margin-left: 8px"
        @click="currentLayout = !currentLayout"
      >
        <svg-icon icon="single-column" class="column-icon-2" />
        <div class="m-2">单列</div>
      </div>
      <div class="swiper-layout-dropdown" style="margin-left: 22px">
        <span class="dropdown-text"
          >筛选
          <svg
            width="12"
            height="12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="arrow"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9.898 8.28a.75.75 0 01-1.06 0l-2.83-2.828L3.18 8.28a.75.75 0 01-1.06-1.06l3.358-3.36a.75.75 0 011.061 0l3.359 3.36a.75.75 0 010 1.06z"
              fill="#4F5168"
            ></path></svg
        ></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-center-tabs {
  margin-bottom: 20px;
  position: relative;
  width: 100%;

  margin-top: 10px;

  .search-center-tabs-content {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 26px;
    .tabs-item {
      color: var(--color-text-t2);
      cursor: pointer;
      font-size: 18px;
      font-weight: 400;
      line-height: 26px;
      margin-right: 40px;
      vertical-align: middle;
      width: 67px;

      &:hover,
      &.active {
        color: var(--color-primary);
      }
    }
  }
}
.swiper-layout-1,
.swiper-layout-2 {
  color: var(--color-text-0-hover);
  font-weight: 500;

  background-color: var(--color-fill-tag-grey);
  border-radius: 42px;
  color: var(--color-text-3);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 13px;
  line-height: 21px;
  padding: 6px 12px 6px 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  .m-2 {
    margin-left: 2px;
  }
}
.column-icon-1,
.column-icon-2 {
  width: 20px;
  height: 20px;
  color: var(--color-text-3);
}
.swiper-layout-1 {
  margin-left: auto;
  &:hover,
  &.active {
    color: var(--color-text-0-hover);
    font-weight: 500;
  }
  &.active {
    .column-icon-1 {
      color: var(--color-text-0-hover);
      font-weight: 500;
    }
  }
}
@media (max-width: 1240px) {
  .swiper-layout-1 {
    margin-left: unset;
  }
}
.swiper-layout-2 {
  &:hover,
  &.active {
    color: var(--color-text-0-hover);
    font-weight: 500;
  }

  &.active {
    .column-icon-2 {
      color: var(--color-text-0-hover);
      font-weight: 500;
    }
  }
}
.swiper-layout-dropdown {
  flex-shrink: 0;

  .dropdown-text {
    align-items: center;
    color: var(--color-text-t3);
    cursor: pointer;
    display: flex;
    font-size: 18px;
    font-weight: 400;
    line-height: 26px;
    margin-left: auto;
    position: relative;
  }
  .arrow {
    margin-left: 6px;
    position: relative;
    top: -1px;

    transform: rotate(180deg);
  }
}
</style>
