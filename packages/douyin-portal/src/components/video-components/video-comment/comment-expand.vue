<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const props = defineProps({
  commentCount: {
    type: Number
    // required: true
  },
  isExpanded: {
    type: Boolean,
    required: false
  },
  noMore: {
    type: Boolean,
    required: false
  }
})

const isExpandedRef = ref(props.isExpanded)
const noMoreRef = ref(props.noMore)

watchEffect(() => {
  isExpandedRef.value = props.isExpanded
  noMoreRef.value = props.noMore
})
</script>
<template>
  <div class="comment-expand">
    <button
      class="comment-expand-btn"
      @click="$emit('onExpand')"
      v-if="!noMoreRef"
    >
      <div class="comment-line"></div>
      <div class="comment-content">
        <span class="comment-content-text" v-if="!isExpandedRef">
          展开{{ props.commentCount }}条回复
        </span>
        <span class="comment-content-text" v-else>展开更多</span>
        <svg-icon icon="comment-expand" class="icon" />
      </div>
    </button>
    <button
      type="button"
      class="comment-content-collapse"
      v-if="isExpandedRef"
      @click="$emit('onCollapse')"
    >
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

    font-size: 12px;
    font-weight: 400;
    height: 20px;
    line-height: 20px;
    outline: none;
    // padding-left: 47px;
    position: relative;

    margin-top: 8px;
    padding-left: 35px;

    color: var(--color-text-t4);
    .comment-line {
      background: var(--btn-line);
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
      .icon {
        width: 13px;
        height: 13px;
        color: var(--color-text-t4);
      }
    }
  }

  .comment-content-collapse {
    margin-left: 13px !important;
    padding-left: 0 !important;

    .icon {
      width: 13px;
      height: 13px;
      color: var(--color-text-t4);
    }
  }
}
</style>
