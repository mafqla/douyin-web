<script setup lang="ts">
import {} from 'vue'

const props = defineProps<{
  title: string
  describe: string
  playNumber: number
  author: string
  rank: number
}>()
</script>
<template>
  <div class="new-right">
    <div class="new-right-header">
      <div class="new-right-title hot">
        <template v-if="props.rank === 0">
          <svg-icon icon="home-top-hot" class="icon-top-hot" />
        </template>
        <template v-else>
          <svg-icon icon="home-hot" class="icon-hot" />
        </template>
        {{ props.title }}
      </div>
      <template v-if="props.rank !== 0">
        <div class="play-number">{{ props.playNumber }}</div>
      </template>
    </div>
    <div class="division"></div>
    <div class="new-right-content">
      <div class="new-right-content-describe">
        {{ props.describe }}
      </div>
      <div class="new-right-contetn-author">
        <span>@{{ props.author }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.new-right {
  border-radius: 0 6px 6px 0;
  padding: 16px 24px;
  width: calc(100% - 238px);
  .new-right-header {
    display: flex;
    padding: 8px 0 22px;
    position: relative;
    .new-right-title {
      cursor: pointer;
      flex: 1 1;
      font-size: 15px;
      height: 24px;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .icon-top-hot {
        width: 24px;
        height: 24px;
        left: -2px;
        margin-right: 0;
        position: relative;
        top: -2px;
      }
      .icon-hot {
        width: 18px;
        height: 18px;
        margin-right: 3px;
        position: relative;
        top: -2px;
      }
    }
    .new-right-title.hot {
      // color: #face15;
      color: rgba(250, 206, 21, 1);
    }

    .play-number {
      // color: rgba(22, 24, 35, 0.6);
      color: rgba(22, 24, 35, 0.6);
      font-size: 13px;
      line-height: 24px;
      margin-left: 20px;
    }
  }

  .division {
    // background: rgba(22, 24, 35, 0.06);
    background: rgba(22, 24, 35, 0.06);
    height: 1px;
    width: 100%;
  }
  .new-right-content {
    font-size: 14px;
    line-height: 22px;
    padding-top: 16px;
    position: relative;
    .new-right-content-describe {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      // color: rgba(22,24,35, 0.6);
      color: rgba(22, 24, 35, 0.6);
      display: -webkit-box;
      height: 44px;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .new-right-contetn-author {
      // color: rgba(22, 24, 35, 0.34);
      color: rgba(22, 24, 35, 0.34);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
