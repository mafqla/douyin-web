<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { userStore } from '@/stores/user'


//是否登录
let isLogin: any = ref(false)
const src = ref('')
const store = userStore()

watchEffect(() => {
  // console.log(store.isLogin())
  isLogin.value = store.isLogin()
  src.value = store.userInfo.avatar
})
</script>
<template>
  <div class="header-right-avatar">
    <el-popover :show-arrow="false" placement="bottom-end">
      <template #reference>
        <dy-avatar :src="src" size="small" />
      </template>
      <template #default>
        <user-popup :isLogin="true" :src="src" :nickname="store.userInfo.username" :likeCount="store.userInfo.likeCount"
          :followingsCount="store.userInfo.attentionCount" :followersCount="store.userInfo.fansCount"
          :postsCount="store.userInfo.uploadVideosCount" :collectCount="store.userInfo.collectVideosCount"
          :watchLaterCount="0" @logout="store.logout()" />
      </template>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.header-right-avatar {
  width: 32px;
  height: 32px;
  margin-left: 16px;
}
</style>
<style lang="scss">
.el-popover,
.el-popover.el-popper,
.el-popper.is-light {
  width: 0 !important;
  height: 0 !important;
  border: none !important;
  padding: 0;
}
</style>
