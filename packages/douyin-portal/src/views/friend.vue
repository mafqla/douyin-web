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

    res.cards.forEach((item: any) => {
      //json格式化每个item 的子项
      return parseJsonStrings(item)
    })
    console.log(res.cards)
    list.value.push(...res.cards)
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
            :video_id="slotProp.item.aweme.aweme_id"
            :video_img="slotProp.item.aweme.video?.cover.url_list[0]"
            :video_uploadtime="slotProp.item.aweme.create_time"
            :video_time="slotProp.item.aweme.video?.duration"
            :video_like="slotProp.item.aweme.statistics?.digg_count"
            :video_author="slotProp.item.aweme.author?.nickname"
            :video_title="slotProp.item.aweme.desc"
            :video_isFellow="slotProp.item.aweme.author?.follow_status"
            :video_url="slotProp.item.aweme.video?.play_addr?.url_list ?? ''"
            :aweme_type="slotProp.item.aweme.aweme_type"
            :is_live_photo="slotProp.item.aweme.is_live_photo"
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
