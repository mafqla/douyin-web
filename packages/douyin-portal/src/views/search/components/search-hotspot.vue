<script setup lang="ts">
import { useCount } from '@/hooks'
import formatTime from '@/utils/date-format'
import {} from 'vue'
import hotIcon from '@/assets/hot/hotspot-rank-default.png'

const { sentence, sentence_id, hot_value, update_time, board_icon } =
  defineProps({
    sentence: {
      type: String,
      required: true
    },
    sentence_id: {
      type: String,
      required: true
    },
    hot_value: {
      type: Number,
      required: true
    },
    update_time: {
      type: Number,
      required: true
    },
    board_icon: {
      type: Object,
      required: false
    }
  })

const hot_value_str = computed(() => {
  return useCount(hot_value)
})
const time_str = computed(() => {
  return formatTime(update_time)
})
</script>
<template>
  <div class="search-hotspot-container">
    <div class="hotspot-thumbnail">
      <img :src="hotIcon" alt="Hotspot Thumbnail" class="thumbnail-image" />
      <p class="hotspot-stats">
        <span>{{ hot_value_str }}</span>
        <span class="separator">·</span>
        <span>{{ time_str }}</span>
      </p>
    </div>
    <p class="hotspot-title">{{ sentence }}</p>
  </div>
</template>

<style lang="scss" scoped>
.search-hotspot-container {
  cursor: pointer;
  .hotspot-thumbnail {
    align-items: center;
    display: flex;
  }
}

.thumbnail-image {
  display: block;
  height: 20px;
}

.hotspot-stats {
  margin-left: 12px;
  color: var(--color-text-t3);
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.6px;
  line-height: 20px;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .separator {
    margin: 0 8px;
  }
}

.hotspot-title {
  color: var(--color-text-t1);
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  margin-top: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
