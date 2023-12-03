<script setup lang="ts">
import { ref } from 'vue'

//删除聊天
const isDelete = ref(false)
const handleDelete = () => {
  isDelete.value = true
}

//确认
const handleConfirm = () => {
  isDelete.value = false
}
//取消
const handleCancell = () => {
  isDelete.value = false
}
</script>
<template>
  <div
    class="action-more-box active"
    style="top: 43px; right: 12px; height: 254px"
    :style="{
      width: isDelete ? '260px' : 'auto',
      height: isDelete ? '138px' : '254px'
    }"
  >
    <div class="box-list">
      <div class="box-list-content" v-show="!isDelete">
        <div class="box-list-item">免打扰</div>
        <div class="box-list-item">置顶聊天</div>
        <div class="box-list-item" @click="handleDelete">删除聊天</div>
        <div class="box-list-item">举报</div>
        <div class="box-list-item">拉黑</div>
      </div>
      <div
        class="clear-msg"
        style="height: 74px"
        v-if="isDelete"
        :class="{ active: isDelete }"
      >
        <div class="clear-text">删除后将清除本会话的聊天记录</div>
        <div class="clear-msg-action">
          <div class="clear-msg-text delete" @click="handleConfirm">
            确认删除
          </div>
          <div class="clear-msg-text cancell" @click="handleCancell">取消</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.action-more-box {
  background-color: var(--color-bg-b1);
  border-radius: 4px;
  // box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  box-shadow: var(--shadow-1);
  padding: 12px 0;
  position: absolute;
  transition: all 0.3s;
  width: 148px;
  z-index: 99;
  &.active {
    animation: KDfx35rv 0.4s ease-in;
    animation-fill-mode: forwards;
    overflow: hidden;
    padding: 0;

    .box-list {
      animation: _rGZhmPY;
      animation-duration: 0.4s;
      animation-fill-mode: forwards;
      animation-timing-function: cubic-bezier(0.34, 0.69, 0.1, 1);
      // background-color: var(--color-bg-b1);
      padding: 12px 0;
    }
  }

  .box-list-content {
    display: block;
    position: relative;
    width: 148px;

    .box-list-item {
      // color: #161823;
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      cursor: pointer;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      padding: 12px 24px;
      width: 100%;
    }
  }

  .clear-msg {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    left: 0;
    opacity: 0;
    padding: 0 32px;
    position: absolute;
    top: 32px;
    transition: all 0.3s linear;
    width: 260px;
    z-index: -1;

    &.active {
      animation: W7sJW9lL;
      animation-duration: 0.4s;
      animation-fill-mode: forwards;
      animation-timing-function: cubic-bezier(0.34, 0.69, 0.1, 1);
      opacity: 1;
      z-index: 99;
    }

    @keyframes W7sJW9lL {
      0% {
        transform: scale(0);
        transform-origin: 100% 0;
      }
      100% {
        transform: scale(1);
        transform-origin: 100% 0;
      }
    }
    .clear-text {
      // color: #161823;
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      width: 100%;
    }

    .clear-msg-action {
      display: flex;
      height: 34px;
      justify-content: space-between;
      position: relative;
      width: 100%;
      .clear-msg-text {
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        font-size: 12px;
        font-weight: 500;
        height: 100%;
        justify-content: center;
        width: 88px;

        &.delete {
          background-color: #ff2c55;
          // color: #fff;
          color: var(--color-const-text-white);
        }

        &.cancell {
          // background-color: #f2f2f4;
          background-color: var(--color-secondary-default);
          // color: rgba(22, 24, 35, 0.75);
          color: var(--color-text-t2);
        }
      }
    }
  }
}
@keyframes KDfx35rv {
  0% {
    box-shadow: none;
  }
  100% {
    // box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
    box-shadow: var(--shadow-1);
  }
}

@keyframes _rGZhmPY {
  0% {
    transform: translateY(-80px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
