<script setup lang="ts">
import { ref } from 'vue'

const selectedOption = ref('全部消息')
const isDropdownOpen = ref(false)

const options = ['全部消息', '粉丝', '@我的', '评论', '赞', '弹幕']

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectOption = (option: string) => {
  selectedOption.value = option
  isDropdownOpen.value = false
}
</script>
<template>
  <div class="notice-type-list">
    <div class="cur-filter" @click="toggleDropdown">
      {{ selectedOption }}
      <div class="select-icon">
        <svg
          width="10"
          height="6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class=""
          viewBox="0 0 10 6"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.102.72a.75.75 0 011.06 0l2.83 2.828L7.82.72a.75.75 0 011.06 1.06L5.522 5.14a.75.75 0 01-1.061 0L1.102 1.78a.75.75 0 010-1.06z"
            fill="#2F3035"
            fill-opacity="0.7"
          ></path>
        </svg>
      </div>
    </div>
    <div
      class="select-dropdown"
      v-if="isDropdownOpen"
      :class="{ open: isDropdownOpen }"
    >
      <div
        class="select-option"
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notice-type-list {
  position: relative;

  .cur-filter {
    // color: rgba(22, 24, 35, 0.6);
    color: var(--color-text-t3);
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 500;

    .select-icon {
      align-items: center;
      display: flex;
      margin-left: 6px;
    }
  }
  .select-dropdown {
    animation: slideInList;
    animation-duration: 0.4s;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.34, 0.69, 0.1, 1);
    background: #fff;
    border-radius: 4px;
    // border: 1px solid rgba(242, 242, 243, 0.08);
    // box-shadow: 0 0 0.5px 0 rgba(242, 242, 243, 0.08);
    padding: 12px 0;
    position: absolute;
    top: 36px;
    width: 120px;
    right: -14px;
    z-index: 10;

    .select-option {
      cursor: pointer;
      font-size: 14px;
      padding: 12px 24px;

      &:hover {
        background: linear-gradient(
          90deg,
          #fff,
          #f2f2f4 33.33%,
          #f2f2f4 66.67%,
          #fff
        );
      }
    }
  }
}

@keyframes slideInList {
  0% {
    transform: translateY(-80px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
