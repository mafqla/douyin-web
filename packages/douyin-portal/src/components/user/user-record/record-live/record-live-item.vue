<script setup lang="ts">
import type { ILiveRecordItem } from '@/api/tyeps/request_response/liveRecordRes'
import DyAvatar from '@/components/common/dy-avatar.vue'
import {} from 'vue'
const props = defineProps<{
  item: {
    date: ILiveRecordItem
    arr: ILiveRecordItem[]
  }
}>()
</script>
<template>
  <div class="record-live-item">
    <div class="user-record-date">{{ item.date.placeholder.msg }}</div>
    <div class="record-list">
      <div
        class="record-item"
        v-for="item in props.item.arr"
        :key="item.UserLiveRecord.user_id"
      >
        <div class="user-avatar">
          <dy-avatar
            :src="item.UserLiveRecord.avatar.url_list[0]"
            size="medium"
          />
        </div>

        <div class="user-info">
          <div class="user-head">
            <div class="user-nickname">
              <span> {{ item.UserLiveRecord.nickname }}</span>
            </div>
            <div class="user-tag"></div>
          </div>
          <div class="user-live-desc">
            <span>{{ item.user_info.signature }}</span>
          </div>

          <div class="live-end-time">
            {{ item.UserLiveRecord.scheduled_text }}
          </div>
        </div>
        <dy-button
          class="follow-btn"
          :class="{ follow: item.UserLiveRecord.follow_status }"
        >
          {{ item.UserLiveRecord.follow_status ? '已关注' : '关注' }}
        </dy-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.record-live-item {
  width: 100%;
}

.user-record-date {
  color: var(--color-text-t3);
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  padding: 10px 0px;
}

.record-list {
  width: 100%;
  flex-wrap: wrap;
  display: flex;
  gap: 16px;
}

.record-item {
  width: calc(33.3333% - 10.6667px);
  // width: 100%;
  background-color: var(--color-bg-b1);
  height: 88px;
  box-sizing: border-box;
  cursor: pointer;
  align-items: center;
  display: flex;
  border-radius: 12px;
  padding: 12px;
}

.user-info {
  width: 0px;
  flex: 1 1 0%;
  margin: 0px 8px 0px 12px;

  .user-head {
    margin-bottom: 4px;
    display: flex;

    .user-nickname {
      color: var(--color-text-t1);
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      span {
        text-overflow: ellipsis;
        cursor: pointer;
        font-weight: 400;
        white-space: nowrap;
        overflow: hidden;
        color: var(--color-text-t1);
        font-size: 14px;
        line-height: 22px;
      }
    }

    .user-tag {
      min-width: 12px;
      margin-left: 8px;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      white-space: nowrap;
      flex: 1 1 0%;
      overflow: hidden;
      justify-content: flex-start;
      align-items: center;
      display: flex;
    }
  }

  .user-live-desc {
    color: var(--color-text-t3);
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    span {
      text-overflow: ellipsis;
      color: var(--color-text-t3);
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .live-end-time {
    text-overflow: ellipsis;
    color: var(--color-text-t3);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
  }
}

.follow-btn {
  background: var(--color-primary);
  color: var(--btn-color);
  min-width: 68px !important;
  width: 68px !important;
  font-size: 12px;
  border-radius: 10px;
  height: 32px;

  &:hover {
    background: var(--btn-bg-hover);
    color: var(--btn-color);
  }

  &.follow {
    background: var(--btn-bg);
  }
}
</style>
