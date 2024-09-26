<script setup lang="ts">
import { ref } from 'vue'
import apis from '@/api/apis'
import type { IListItem } from '@/api/tyeps/request_response/hotSearchRes'
// 热榜
const hotList = ref<IListItem[]>([])

const getHotList = async () => {
  const res = await apis.getHotSearch()
  hotList.value = res.data.word_list.slice(0, 6)
}
onMounted(() => {
  getHotList()
})
const goToSearch = (keyword: string) => {
  const searchUrl = `${window.location.origin}/search/${encodeURIComponent(
    keyword
  )}`
  window.open(searchUrl, '_blank')
}
</script>
<template>
  <div class="search-hot-top">
    <span class="search-hot-top-title">抖音热点</span>
  </div>
  <div class="search-hot-container">
    <div
      v-for="(item, index) in hotList"
      :key="item.sentence_id"
      class="search-hot-box"
      :class="{
        'hot-box-top': index === 0,
        'hot-box-rank': index > 0 && index < 4
      }"
    >
      <div class="search-hot-box-title">
        <svg-icon v-if="index === 0" icon="hot-top" class="num-icon" />
        <svg-icon v-if="index === 1" icon="hot-1" class="num-icon" />
        <svg-icon v-if="index === 2" icon="hot-2" class="num-icon" />
        <svg-icon v-if="index === 3" icon="hot-3" class="num-icon" />
        <div class="hot-box-icon-num" v-if="index >= 4">
          {{ index }}
        </div>
        <span class="hot-box-text" @click="goToSearch(item.word)">{{
          item.word
        }}</span>
        <!-- <img
          src="data:image/png;base64,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"
          class="hot-box-img"
          style="width: 18px; height: 18px"
          v-if="item.isHot"
        />
        <img
          src="data:image/png;base64,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"
          class="hot-box-img"
          style="width: 30px; height: 18px"
          v-if="item.isFirstRelease"
        />
        <img
          src="data:image/png;base64,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"
          class="hot-box-img"
          style="width: 18px; height: 18px"
          v-if="item.isNew"
        /> -->
      </div>
      <!-- <div
        class="hot-box-num"
        :class="{
          'hot-box-rank-num': index > 0 && index < 4
        }"
        v-if="item.num !== ''"
      >
        {{ item.num }}
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-hot-top {
  height: 32px;
  cursor: pointer;
  border-radius: 8px;
  justify-content: space-between;
  align-items: center;
  margin: 6px 6px 0;
  padding: 0 4px;
  display: flex;
  .search-hot-top-title {
    color: var(--color-text-t3);
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 13px;
    font-weight: 600;
    line-height: 22px;
  }
}
// .hot-box-top {
//   background: var(--linear-gradient-bg-top) !important;
//   flex-shrink: 0;
// }

.search-hot-box {
  // background: var(--linear-gradient-bg-1);
  border-radius: 8px;
  cursor: pointer;
  height: 32px;
  justify-content: space-between;
  margin: 6px 6px 0;
  padding: 0 4px;

  &,
  & .search-hot-box-title {
    align-items: center;
    display: flex;
  }

  .search-hot-box-title {
    flex-shrink: 1;
    overflow: hidden;
  }

  .hot-box-rank-num {
    color: #ad9692;
  }
  .hot-box-num {
    color: var(--color-text-t3);
    flex-shrink: 0;
    font-size: 10px;
    padding-left: 8px;
  }

  &.z9qGEsHa,
  &:hover {
    background: var(--color-bg-b3) !important;
  }
}

.hot-box-text {
  color: var(--color-text-t1);
  flex-shrink: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// .hot-box-rank {
//   background: var(--linear-gradient-bg-num);
//   flex-shrink: 0;
// }

.hot-box-img {
  background-repeat: no-repeat;
  background-size: cover;
}
._mLDXtMc,
.hot-box-img {
  flex-shrink: 0;
  margin-left: 4.8px;
}

.num-icon {
  margin-right: 4px;
  width: 16px;
  height: 16px;
}

.hot-box-icon-num {
  align-items: center;
  color: var(--color-text-t3);
  display: flex;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  height: 16px;
  justify-content: center;
  margin-right: 4px;
  width: 16px;
}
</style>
