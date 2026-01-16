<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import useTheme from '@/hooks/useTheme'
import {} from 'vue'
import apis from './api/apis'
import { userStore } from './stores/user'
useTheme()

const user = userStore()
// 获取用户信息
const get_user_info = async () => {
  const user_info = await apis.getUserInfo()
  // console.log(user_info)
  if (user_info.status_code === 0) {
    // 获取用户信息成功
    user.userInfo = user_info
    user.isLogin = true
  } else {
    // 获取用户信息失败
    user.isLogin = false
  }
}
onMounted(() => {
  get_user_info()
})
</script>
<style lang="scss" scoped></style>
