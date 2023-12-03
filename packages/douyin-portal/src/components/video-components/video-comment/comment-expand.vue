<script setup lang="ts">
import {} from 'vue'

const props = defineProps({
  commentCount: {
    type: Number
    // required: true
  }
})
</script>
<template>
  <div class="comment-expand">
    <button class="comment-expand-btn">
      <div class="comment-line"></div>
      <div class="comment-content">
        <span class="comment-content-text"
          >展开{{ props.commentCount }}100条回复</span
        >
        <svg-icon icon="comment-expand" class="icon" />
      </div>
    </button>
    <button type="button" class="comment-content-collapse">
      <span>收起</span>
      <svg-icon icon="comment-collapse" class="icon" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.comment-expand {
  position: relative;

  .comment-expand-btn,
  .comment-content-collapse {
    background-color: transparent;
    border: none;
    // color: rgba(22,24,35, 0.34);
    color: rgba(255, 255, 255, 0.34);
    font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
    font-size: 12px;
    font-weight: 400;
    height: 20px;
    line-height: 20px;
    outline: none;
    // padding-left: 47px;
    position: relative;

    margin-top: 8px;
    padding-left: 35px;
    .comment-line {
      // background: rgba(231, 231, 236, 0.6);
      background: rgba(231, 231, 236, 0.6);
      content: '';
      height: 1px;
      left: 0;
      position: absolute;
      top: 50%;
      // width: 38px;
      width: 26px;
    }
    .comment-content {
      cursor: pointer;
      .comment-content-text {
      }
      .icon {
        width: 13px;
        height: 13px;
        color: rgba(255, 255, 255, 0.34);
      }
    }
  }

  .comment-content-collapse {
    margin-left: 13px !important;
    padding-left: 0 !important;

    .icon {
      width: 13px;
      height: 13px;
      color: rgba(255, 255, 255, 0.34);
    }
  }
}
</style>
