<script setup lang="ts">
import { reactive, ref } from 'vue'
import videoItem from './video-item.vue'
import modelPlayer from '@/components/video-player/modal-player.vue'
import { useRouter } from 'vue-router'
import { videoStore } from '@/stores/videos'
import type { IVideoList } from '@/service/videos/videosType'

const props = defineProps({
  videoList: {
    type: Array<IVideoList>,
    required: true
  }
})
const router = useRouter()

const visible = ref(false)
// 点击获取数据
const modalData = reactive({
  id: 0,
  userId: 0,
  username: '',
  uploadTime: '',
  description: '',
  url: '',
  poster: '',
  isPlay: false,
  img: '',
  dianzan: 0,
  comment: 0,
  shoucang: 0,
  globalVolume: 0,

  isLike: false,
  isCollect: false,
  isAttention: 0
})
const handleModal = (item: IVideoList) => {
  modalData.id = item.id
  modalData.userId = item.userId
  modalData.username = item.userName
  modalData.uploadTime = item.uploadTime
  modalData.description = item.description
  modalData.url = item.videosAddress
  modalData.poster = item.videosCover
  modalData.isPlay = true
  modalData.img = item.userAvatar
  modalData.dianzan = item.likeCount
  modalData.comment = item.commentCount
  modalData.shoucang = item.collectCount

  modalData.isLike = item.isLike
  modalData.isCollect = item.isCollect
  modalData.isAttention = item.isAttention
  modalData.globalVolume = 0.6
  router.push({
    query: {
      ...router.currentRoute.value.query,
      modal_id: item.id
    }
  })
  visible.value = true
}

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
      :key="item.id"
      :modal_id="item.id"
      :imgSrc="item.videosCover"
      :videoUrl="item.videosAddress"
      :title="item.title"
      :dianzan="item.likeCount"
      @click.stop="handleModal(item)"
      @openModal="handleModal(item)"
    />
    <el-dialog
      v-model="visible"
      :show-close="false"
      :modal="false"
      :fullscreen="true"
      top="0vh"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <model-player v-bind="modalData" @closeBtn="handleClose" />
    </el-dialog>

    <Loading v-if="videoStore().bottomLoading" />
    <list-footer v-if="videoStore().isEmpty" />
  </div>
</template>

<style lang="scss" scoped>
.video-list {
  width: 100%;
  // display: inline-block;
}
</style>

<style>
.el-dialog__body,
.el-dialog__header {
  padding: 0 !important;
  margin: 0 !important;
}

.el-dialog.is-fullscreen {
  overflow: hidden !important;
}
</style>
