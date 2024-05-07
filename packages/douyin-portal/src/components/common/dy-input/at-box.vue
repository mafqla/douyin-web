<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
const mockData = [
  {
    id: 1,
    username: 'test',
    userAvatar:
      'https://p3-dy-ipv6.byteimg.com/aweme/100x100/tos-cn-i-0813c001/1f4'
  },
  {
    id: 2,
    username: 'test',
    userAvatar:
      'https://p3-dy-ipv6.byteimg.com/aweme/100x100/tos-cn-i-0813c001/1f4'
  },
  {
    id: 3,
    username: 'test',
    userAvatar:
      'https://p3-dy-ipv6.byteimg.com/aweme/100x100/tos-cn-i-0813c001/1f4'
  }
]

const emit = defineEmits(['user-selected', 'close'])

const selectUser = (user: any) => {
  emit('user-selected', user)
}

//点击emoji弹窗外部关闭emoji弹窗
const handleClickOutside = (event: MouseEvent) => {
  // 检查点击的目标元素是否不是.emoji类或.emoji的子元素
  if (
    !(event.target as HTMLElement).closest('.at-box') &&
    !(event.target as HTMLElement).closest('.at-icon')
  ) {
    emit('close')
  }
}
// 监听点击事件
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
// 移除监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="at-box">
    <div class="at-box-inner">
      <div v-for="user in mockData" :key="user.id">
        <div class="user-avatar-box" @click="selectUser(user)">
          <div class="user-avatar-box-inner">
            <dy-avatar :src="user.userAvatar" size="small" />
            <span class="user-name">{{ user.username }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.at-box {
  height: 184px;
  width: 413px;
  background-color: var(--color-bg-b1-white);
  z-index: 50;
  box-shadow: var(--shadow-1);
  border-radius: 12px;
  padding: 16px 18px;
  position: absolute;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;

  margin-top: 20px;

  scrollbar-color: #363741 var(--color-bg-b1-white);

  .at-box-inner {
    width: 375px;
    flex-wrap: wrap;
    justify-content: flex-start;
    display: flex;
  }

  .user-avatar-box {
    justify-content: center;
    display: flex;

    &:hover {
      .user-name {
        color: #ff2c55;
      }
    }

    .user-avatar-box-inner {
      width: 63px;
      height: 64px;
      cursor: pointer;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin: 0 6px 24px;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    .user-name {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-t3);
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      overflow: hidden;
    }
  }
}
</style>
