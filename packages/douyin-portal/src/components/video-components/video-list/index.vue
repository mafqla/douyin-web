<script setup lang="ts">
import { reactive, ref } from 'vue'
import videoItem from './video-item.vue'
import { useRouter } from 'vue-router'
import type { IAwemeInfo } from '@/api/tyeps/common/aweme'

const props = defineProps<{
  videoList: IAwemeInfo[]
}>()
const router = useRouter()

const visible = ref(false)

//关闭modal
const handleClose = () => {
  visible.value = false
  //去除路由参数
  router.push({
    query: {
      ...router.currentRoute.value.query,
      modal_id: undefined
    }
  })
}
</script>

<template>
  <div class="video-list">
    <video-item
      v-for="item in props.videoList"
      :key="item.aweme_id"
      :aweme="item"
    />
  </div>
</template>

<style lang="scss" scoped>
.video-list {
  width: 100%;
  // display: inline-block;
}
</style>
