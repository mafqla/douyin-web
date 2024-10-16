<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { userStore } from '@/stores/user'

//是否登录
let isLogin: any = ref(false)
const src = ref('')
const store = userStore()

watchEffect(() => {
  // console.log(store.isLogin())
  isLogin.value = store.isLogin
  src.value = store.userInfo.user.avatar_300x300.url_list[0]
})
</script>
<template>
  <div class="header-right-avatar">
    <el-popover :show-arrow="false" placement="bottom-end">
      <template #reference>
        <dy-avatar :src="src" size="small" />
      </template>
      <template #default>
        <user-popup
          :isLogin="true"
          :src="src"
          :nickname="store.userInfo.user.nickname"
          :likeCount="store.userInfo.user.favoriting_count"
          :followingsCount="store.userInfo.user.follower_count"
          :followersCount="store.userInfo.user.following_count"
          :postsCount="store.userInfo.user.aweme_count"
          :collectCount="
            store.userInfo.user_collect_count.collect_count_list[0]
              .collect_count
          "
          :watchLaterCount="0"
          @logout="store.logout()"
        />
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
