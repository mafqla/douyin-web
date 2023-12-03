<script setup lang="ts">
import { ref } from 'vue'
//历史记录
const historyList = ref([
  { id: 1, text: '曝一中国学者遭他国调查' },
  { id: 2, text: '白云苍狗' },
  { id: 3, text: '俄称一架苏24战机坠毁' },
  { id: 4, text: '大量空客飞机或将停飞' },
  { id: 5, text: '北大多名女生疑遇杀猪盘' }
])
//删除历史记录
const deleteHistory = (index: number) => {
  // console.log(id)
  historyList.value.splice(index, 1)
  //todo:调用接口删除历史记录
}

//清空历史记录
const clearHistory = () => {
  historyList.value = []
}
</script>
<template>
  <div class="search-history" v-if="historyList.length !== 0">
    <span class="search-history-title">历史记录</span>
    <div class="clear-history-btn" @click.stop.event="clearHistory">
      <svg
        width="14"
        height="14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class=""
        viewBox="0 0 14 14"
      >
        <path
          d="M6.358 6.213a.525.525 0 10-1.05 0v3.762a.525.525 0 101.05 0V6.213zM8.167 5.688c.29 0 .525.235.525.525v3.762a.525.525 0 11-1.05 0V6.213c0-.29.235-.525.525-.525z"
          fill="#2F3035"
          fill-opacity="0.7"
        ></path>
        <path
          d="M4.313 2.088c.098-.55.576-.95 1.134-.95h3.106c.559 0 1.037.4 1.134.95l.174.975h1.951a.656.656 0 010 1.312h-.68l-.417 6.898a1.692 1.692 0 01-1.688 1.59H4.974a1.692 1.692 0 01-1.69-1.59L2.87 4.375h-.682a.656.656 0 010-1.312H4.14l.174-.975zm4.393.975l-.138-.776a.015.015 0 00-.015-.012H5.447a.015.015 0 00-.014.012l-.138.776h3.41zM3.92 4.375l.412 6.835c.02.338.301.603.64.603h4.054c.34 0 .62-.265.64-.603l.412-6.835H3.921z"
          fill="#2F3035"
          fill-opacity="0.7"
        ></path>
      </svg>
      <span class="clear-history-btn-text">清除记录</span>
    </div>
  </div>
  <div class="search-history-container" v-if="historyList.length !== 0">
    <div
      v-for="(item, index) in historyList"
      :key="item.id"
      class="search-history-box"
    >
      <span class="search-history-box-text">{{ item.text }}</span>
      <div class="search-history-clear-icon" @click.stop="deleteHistory(index)">
        <svg
          width="14"
          height="14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="close-icon"
          viewBox="0 0 12 12"
        >
          <circle cx="6" cy="6" r="6" fill="rgba(228,228,230,1)"></circle>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.93 8.7a.545.545 0 10.77-.772L6.773 5.999 8.7 4.071a.545.545 0 00-.771-.771L6 5.228 4.072 3.3a.545.545 0 10-.771.771l1.928 1.928L3.3 7.93a.545.545 0 00.772.77L6 6.772l1.928 1.928z"
            fill="currentColor"
            fill-opacity="0.5"
          ></path>
        </svg>
      </div>
    </div>
    <div
      class="search-history-expand-icon"
      style="width: 22px"
      v-if="historyList.length >= 5"
    >
      <svg
        width="12"
        height="12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class=""
        viewBox="0 0 12 12"
      >
        <path
          d="M2.022 4.997A.6.6 0 012.472 4h7.057a.6.6 0 01.45.997L6.6 8.826a.8.8 0 01-1.2 0L2.022 4.997z"
          fill="currentColor"
          fill-opacity="0.7"
        ></path>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-history {
  align-items: center;
  display: flex;
  height: 40px;
  justify-content: space-between;
  padding: 0 20px;
  width: 100%;

  .clear-history-btn {
    align-items: center;
    cursor: pointer;
    display: flex;

    .clear-history-btn-text {
      color: var(--color-text-t3);
      font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
      font-size: 13px;
      font-weight: 400;
      margin-left: 2px;
    }

    svg path {
      fill: var(--color-text-t3);
    }
  }

  .search-history-title {
    color: var(--color-text-t0);
    font-size: 14px;
    font-size: 13px;
    font-weight: 600;
    line-height: 22px;
  }

  & .search-history-title,
  & .clear-history-btn {
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}

.search-history-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
  margin-left: -8px;
  margin-top: -8px;
  overflow: hidden;
  padding: 6px 20px 0;
}

html.dark .search-history-box:hover {
  background: #5d5f67;
}
.search-history-box {
  // background-color: #e4e4e6;
  background-color: var(--color-bg-b3);
  border-radius: 4px;
  // color: #161823;
  color: var(--color-text-t1);
  cursor: pointer;
  display: flex;
  height: 24px;
  margin-left: 8px;
  margin-top: 8px;
  max-width: -moz-calc(33.33333% - 8px);
  max-width: -webkit-calc(33.33333% - 8px);
  max-width: calc(33.33333% - 8px);
  padding: 2px 8px;
  position: relative;

  &:hover {
    background-color: #e3e5ec;
    // color: #000;
    color: var(--color-text-t0);

    .search-history-clear-icon {
      display: flex;
    }
  }

  .search-history-clear-icon {
    display: none;
    position: absolute;
    right: -7px;
    top: -7px;

    .close-icon {
      color: #2f3035;

      circle {
        fill: var(--color-bg-b3);
      }
    }
    &:hover .close-icon {
      color: #fe2c55;
    }
  }
}

html.dark .close-icon {
  path {
    fill: #fff;
    fill-opacity: 0.5;
  }
}
.search-history-box-text {
  font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  margin: 0;
  overflow: hidden;
  padding: 0;
  text-overflow: ellipsis;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  white-space: nowrap;
  width: 100%;
}

.search-history-expand-icon {
  align-items: center;
  // background-color: #e4e4e6;
  background-color: var(--color-bg-b3);
  // background-color: rgba(228, 228, 230, 1);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  height: 24px;
  justify-content: center;
  margin-left: 8px;
  margin-top: 8px;
  width: 22px;
}
</style>
