<script setup lang="ts">
import {} from 'vue'
import DiscoverItem from '../discover-item/discover-item.vue'
import DiscoverBottom from '../discover-bottom/discover-bottom.vue'
import { discoverStore } from '@/stores/discover'

const store = discoverStore()
console.log(store.categoriesList)
</script>
<template>
  <div class="discover-classify">
    <div class="discover-content">
      <div class="discover-main">
        <template v-for="item in store.categoriesList as any">
          <discover-item
            :id="item.id"
            :img="item.videosCover"
            :videoTime="item.videosTime"
            :like="item.likeCount"
            :title="item.title"
            :author="item.authorName"
            :comment="item.commentCount"
            :time="item.uploadTime"
          />
        </template>
      </div>
      <discover-bottom>
        <div>查看更多精选视频</div>
      </discover-bottom>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discover-classify {
  min-width: 508px;
  height: 100%;
  position: relative;
  padding: 16px 30px 0;
  //滚动条隐藏
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  .discover-content {
    padding-bottom: 40px;
  }
  .discover-main {
    display: flex;
    flex-wrap: wrap;
    margin: 0px -8px;
  }
}

@media (min-width: 2472px) {
  .discover-classify {
    padding: 16px 0 0;
  }
}
</style>
