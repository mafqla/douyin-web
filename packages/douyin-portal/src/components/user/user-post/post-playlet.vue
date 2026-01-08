<script setup lang="ts">
import UserError from '../user-error/index.vue'

defineProps<{
  user_id: string
}>()
</script>

<template>
  <div class="post-playlet">
    <user-error
      icon="empty-list-user"
      title="暂无内容"
      desc="该账号还未发布过短剧哦～"
      class="no-show"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-playlet {
  width: 100%;
  margin-top: 8px;
}

.no-show {
  margin: 120px 0;
}
</style>
