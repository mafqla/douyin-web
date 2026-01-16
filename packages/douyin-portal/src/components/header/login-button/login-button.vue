<script setup lang="ts">
import useTheme from '@/hooks/useTheme'
import { DyPopover, DyButton } from '@/components/ui'
const { toggleTheme } = useTheme()
</script>
<template>
  <div class="login-button">
    <dy-popover position="bottomRight" trigger="click">
      <dy-button type="primary" class="login-btn">
        <svg-icon class="user-avatar-icon" icon="circle_close" />
        <span class="login-button-title">登录</span>
      </dy-button>
      <template #content>
        <user-popup :isLogin="false" />
      </template>
    </dy-popover>
  </div>
</template>

<style lang="scss" scoped>
.login-button {
  margin-left: 16px;

  .login-btn {
    width: 112px;
    height: 36px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-avatar-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
}
</style>
