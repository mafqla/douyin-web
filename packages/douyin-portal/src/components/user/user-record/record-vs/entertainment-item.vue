<script setup lang="ts">
import type { ILVideoHistoryItem } from '@/api/tyeps/request_response/vsRecord'
import {} from 'vue'

const props = defineProps<{
  item: ILVideoHistoryItem
}>()

const formattedTime = computed(() => {
  const { msec } = props.item
  const hours = Math.floor(msec / 3600000)
  const minutes = Math.floor((msec % 3600000) / 60000)
  const seconds = Math.floor((msec % 60000) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>
<template>
  <div class="entertainment-item">
    <a
      :href="`/lvdetail/${item.episode_id}`"
      class="entertainment-item-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="entertainment-item-content">
        <div class="entertainment-item-content-left">
          <div class="entertainment-item-content-left-i">
            <img
              :src="item.cover_url"
              :alt="item.title_after"
              class="entertainment-item-content-left-i-img"
            />
          </div>
          <span class="entertainment-item-content-left-time">{{
            formattedTime
          }}</span>
        </div>
        <div class="entertainment-item-content-right">
          <div class="entertainment-item-content-right-title">
            {{ item.title_before }} | {{ item.title_after }}
          </div>
          <div class="entertainment-item-content-right-blank"></div>
          <div class="entertainment-item-content-right-time-content">
            <svg-icon
              icon="funnel"
              class="entertainment-item-content-right-time-content-icon"
            />
            <span class="entertainment-item-content-right-time-content-d">
              观看到{{ item.progress }}%
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<style lang="scss" scoped>
.entertainment-item {
  display: inline-block;
  margin-bottom: 16px;
  vertical-align: top;
  width: calc(50% - 8px);
  &:nth-child(2n + 1) {
    margin-right: 16px;
  }

  .entertainment-item-link {
    position: relative;

    .entertainment-item-content {
      background-color: var(--color-bg-b1-white);
      border-radius: 12px;
      display: flex;
      height: 112px;
      overflow: hidden;
      padding: 16px;
      &:hover {
        background-color: var(--color-bg-b2);
      }
      &-left {
        border-radius: 4px;
        flex: none;
        overflow: hidden;
        position: relative;
        width: 161px;
        &-i {
          align-items: center;
          display: flex;
          height: 100%;
          justify-content: center;
          position: relative;
          width: 100%;
          &-img {
            color: #161722;
            max-width: 161px;
            max-height: 90px;
            object-fit: cover;
            position: relative;
            transition: all 0.3s linear;
            width: 161px;
            height: 90px;
            flex-shrink: 0;
          }
        }
        &-time {
          bottom: 2px;
          color: #fff;
          font-size: 12px;
          letter-spacing: 0.6px;
          position: absolute;
          right: 16px;
        }
      }
      &-right {
        flex: 1 1;
        margin-left: 8px;
        width: calc(100% - 130px);
        &-title {
          color: var(--color-text-t1);
          font-size: 14px;
          font-weight: 500;
          height: 30px;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &-blank {
          display: flex;
          height: 22px;
          margin: 6px 0;
        }
        &-time-content {
          display: flex;
          color: var(--color-text-t3);
          &-icon {
            // margin-right: 4px;
            width: 20px;
            height: 20px;
          }
          &-d {
            font-size: 12px;
            line-height: 22px;
          }
        }
      }
    }
  }
}
</style>
