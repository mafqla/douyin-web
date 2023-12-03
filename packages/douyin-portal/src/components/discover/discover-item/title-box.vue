<script setup lang="ts">
import {} from 'vue'
import formatTime from '@/utils/date-format'

const props = defineProps({
  title: String,
  author: String,
  fellow: Boolean,
  comment: Number,
  collect: Number,
  time: String
})
</script>
<template>
  <div class="item-title-box">
    <div class="item-title-content">
      <div class="item-title-content-title">{{ props.title }}</div>
      <div class="item-title-author">
        <span class="item-title-bottom"
          ><span class="item-title-author-f">@</span
          ><span class="item-title-author-name">{{ props.author }}</span>
        </span>
        <!-- <span class="item-title-tag fellow">
          <span class="item-title-tag-name">已关注</span>
        </span>
        <span class="item-title-tag comment">
          <span class="item-title-tag-name">评论</span>
        </span>
        <span class="item-title-tag collect">
          <span class="item-title-tag-name">收藏</span>
        </span> -->

        <span class="item-title-time"> · {{ formatTime(props.time) }}</span>
        <div class="more">
          <svg
            width="22"
            height="22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class=""
            viewBox="0 0 22 23"
          >
            <path
              d="M15.583 11.5a1.833 1.833 0 113.667 0 1.833 1.833 0 01-3.667 0zM9.167 11.5a1.833 1.833 0 113.666 0 1.833 1.833 0 01-3.666 0zM4.583 9.667a1.833 1.833 0 100 3.666 1.833 1.833 0 000-3.666z"
              fill="#fff"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.item-title-box {
  position: relative;
  flex: 1 1;
  // padding: 12px 20px 22px;
  padding: 12px;
  background: var(--color-bg-b1);
  // background: rgba(37, 38, 50, 1);
  .item-title-content {
    position: relative;

    .item-title-content-title,
    .item-title-author {
      cursor: pointer;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
    .item-title-content-title {
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      // color: rgba(22, 24, 35, 1);
      color: var(--color-text-t1);
      // color: rgb(255, 255, 255, .9);
      display: -webkit-box;
      font-size: 15px;
      height: 46px;
      line-height: 23px;
    }

    .item-title-author {
      display: inline-flex;
      font-size: 14px;
      line-height: 22px;
      margin-top: 6px;
      // margin-top: 8px;
      // white-space-collapse: collapse;
      white-space: nowrap;
      // text-wrap: nowrap;
      width: 100%;

      // color: rgba(22, 24, 35, 0.34);
      color: var(--color-text-t3);
      // color: rgba(255, 255, 255, 0.5);
      .item-title-bottom {
        backface-visibility: hidden;
        display: inline-block;
        text-overflow: ellipsis;
        // white-space-collapse: collapse;
        white-space: nowrap;
        // text-wrap: nowrap;
        overflow: hidden;

        .item-title-author-f {
          vertical-align: text-top;
        }

        .item-title-author-name {
          // position: relative;
          // top: 1px;
          margin-left: 4px;
        }
      }

      .item-title-tag {
        display: flex;
        align-self: center;
        align-items: center;
        height: 18px;
        margin-left: 4px;
        border-radius: 2px;

        .item-title-tag-name {
          backface-visibility: hidden;
          display: inline-block;
          font-size: 12px;
          line-height: 1;
          transform: scale(0.9166);
          padding: 0px 3px;
        }
      }
      .item-title-tag.fellow {
        background: rgba(242, 242, 243, 1);
        color: rgba(22, 24, 35, 0.34);
      }
      .item-title-tag.comment {
        background: rgba(108, 208, 136, 0.1);
        color: rgba(108, 208, 136, 0.9);
      }
      .item-title-tag.collect {
        background: rgba(255, 153, 1, 0.1);
        color: rgba(255, 153, 1, 0.9);
      }

      .item-title-time {
        // color: rgba(22, 24, 35, 0.34);
        color: var(--color-text-t3);
        // color: rgba(255, 255, 255, 0.5);
        font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 23px;
        margin-left: 5px;
      }

      .more {
        display: none;
        position: absolute;
        right: 0;

        path {
          // fill: rgba(22, 24, 35, 0.6);
          fill: var(--color-text-t3);
        }
      }
    }
  }
}
</style>
