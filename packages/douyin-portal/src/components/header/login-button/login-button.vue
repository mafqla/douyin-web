<script setup lang="ts">
import useTheme from '@/hooks/useTheme'
import { } from 'vue'
const { toggleTheme } = useTheme()
</script>
<template>
  <div class="login-button">
    <el-popover :show-arrow="false" placement="bottom-end">
      <template #reference>
        <el-button class="login-button" color="#fe2c55">
          <svg-icon class="user-avatar-icon" icon="circle_close" />
          <span class="login-button-title">登录</span>
        </el-button>
      </template>
      <template #default>
        <user-popup :isLogin="false" />
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.login-button {
  width: 112px;
  height: 36px;
  line-height: 36px;
  margin-left: 16px;
  border-radius: 12px;
  color: rgb(255, 255, 255);
  font-size: 15px;
  font-weight: 400;
  display: flex;
  align-items: center;

  .user-avatar-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
}
</style>