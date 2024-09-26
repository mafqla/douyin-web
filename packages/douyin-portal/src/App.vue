<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import {} from 'vue'
import useTheme from '@/hooks/useTheme'
import apis from './api/apis'
useTheme()
// 获取用户信息
const get_user_info = async () => {
  const user_info = await apis.getUserInfo()
  console.log(user_info)
}
onMounted(() => {
  get_user_info()
})
</script>
<style lang="scss" scoped></style>
