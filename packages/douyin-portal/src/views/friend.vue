<script setup lang="ts">
import { type Ref } from 'vue'
import apis from '@/api/apis'
import VirtualWaterfall from '@/components/common/virtual-waterfall/index.vue'
import HotItem from '@/components/discover/hot-item/index.vue'
import { parseJsonStrings } from '@/utils/parseJsonStrings'
import type { ICards } from '@/api/tyeps/request_response/homeFeedRes'

const loading = ref<boolean>(true)
const nextLoding = ref<boolean>(false)
const animeRef = ref<HTMLDivElement | null>(null)

const list = ref([]) as Ref<ICards[]>
const isOver = ref(false)
const count = ref(20)
const refresh_index = ref(1)
/**
 * 获取数据
 */
const getData = async () => {
  try {
    const res = await apis.homeFeed(count.value, refresh_index.value)

    // res.aweme_list.forEach((item: any) => {
    //   //json格式化每个item 的子项
    //   return parseJsonStrings(item)
    // })
    console.log(res.aweme_list)
    list.value.push(...res.aweme_list)
    refresh_index.value++
    isOver.value = !Boolean(res.has_more)
    loading.value = false
  } catch (error) {
    // console.error(error)
    return []
  } finally {
  }
}

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
  getData()
})
const getNext: () => Promise<void> = async (): Promise<void> => {
  if (nextLoding.value) return
  nextLoding.value = true
  await getData()

  nextLoding.value = false
}

// watchEffect(() => {
//   console.log(list.value)
// })
</script>
<template>
  <Loading :show="loading" :isShowText="true" :center="true">
    <div class="friend" ref="animeRef">
      <virtual-waterfall
        class="waterfall"
        :list="list"
        :virtual-time="200"
        :isMounted="isMounted"
        :isLoading="loading"
        :isOver="isOver"
        @scrollReachBottom="getNext"
      >
        <template v-slot:default="slotProp">
          <!-- <hot-item /> -->
          <waterfall-item
            :videoId="slotProp.item.aweme.aweme_id"
            :videoImg="slotProp.item.aweme.video?.cover.url_list[0]"
            :videoUploadtime="slotProp.item.aweme.create_time"
            :videoTime="slotProp.item.aweme.video?.duration"
            :videoLike="slotProp.item.aweme.statistics?.digg_count"
            :videoAuthor="slotProp.item.aweme.author?.nickname"
            :videoTitle="slotProp.item.aweme.desc"
            :videoIsFellow="slotProp.item.aweme.author?.follow_status"
            :videoUrl="slotProp.item.aweme.video?.play_addr?.url_list ?? []"
            :awemeType="slotProp.item.aweme.aweme_type"
            :isLivePhoto="slotProp.item.aweme.is_live_photo"
            :authorId="slotProp.item.aweme.author?.uid || ''"
            :isLoading="loading"
          />
        </template>
        <template v-slot:loading>
          <Loading :show="nextLoding" :isShowText="true" />
        </template>
        <template v-slot:footer>
          <list-footer />
        </template>
      </virtual-waterfall>
    </div>
  </Loading>
</template>

<style lang="scss" scoped>
.friend {
  // overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
}
</style>
