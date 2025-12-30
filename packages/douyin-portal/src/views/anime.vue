<script setup lang="ts">
import {} from 'vue'
import apis from '@/api/apis'

const loading = ref<boolean>(true)
const animeRef = ref<HTMLDivElement | null>(null)
const column = ref(5)

/**
 * 获取动漫数据
 */
const getData = async () => {
  try {
    const res = await apis.homeFeed(10, 1)
    res.cards.forEach((item: any) => {
      item.aweme = JSON.parse(item.aweme)
    })
    // console.log(res)

    return res.cards
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
getData()
const animeRefObserver = new ResizeObserver((entries) => {
  changeColumn(entries[0].target.clientWidth)
})

const changeColumn = (width: number) => {
  if (width > 960) {
    column.value = 5
  } else if (width >= 690 && width < 960) {
    column.value = 4
  } else if (width >= 500 && width < 690) {
    column.value = 3
  } else {
    column.value = 2
  }
}

onMounted(() => {
  animeRef.value && animeRefObserver.observe(animeRef.value)
})

onUnmounted(() => {
  animeRef.value && animeRefObserver.unobserve(animeRef.value)
})
</script>
<template>
  <Loading :show="loading" :isShowText="true" :center="true">
    <div class="anime" ref="animeRef">
      <virtual-waterfall
        :request="getData"
        :gap="15"
        :page-size="10"
        :column="column"
        :enter-size="42"
      >
        <template #item="{ item, itemHeight }">
          <waterfall-item
            :videoId="String(item.aweme_id)"
            :videoImg="item.video?.cover.url_list[0] ?? ''"
            :videoUploadtime="item.create_time"
            :videoTime="item.video?.duration"
            :videoLike="item.statistics?.digg_count"
            :videoAuthor="item.author?.nickname"
            :videoTitle="item.desc"
            :videoIsFellow="item.author?.follow_status"
            :videoUrl="item.video?.play_addr.url_list[2]"
            :awemeType="item.aweme_type"
            :isLivePhoto="item.is_live_photo"
            :authorId="item.author?.uid || ''"
            :isLoading="loading"
          />
        </template>
      </virtual-waterfall>
    </div>
  </Loading>
</template>

<style lang="scss" scoped></style>
