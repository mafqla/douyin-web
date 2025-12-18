<script setup lang="ts">
import type { IVisitedUser } from '@/api/tyeps/request_response/userVisitedListRes'
import DyAvatar from '@/components/common/dy-avatar.vue'
import { DyButton } from '@/components/ui'

const props = defineProps<{
  item: IVisitedUser
}>()

const emit = defineEmits<{
  openWorks: [user: IVisitedUser]
}>()

// 点击整个 item 打开作品
const handleClick = () => {
  emit('openWorks', props.item)
}
</script>
<template>
  <div class="record-visited-item" @click="handleClick">
    <div class="user-avatar">
      <dy-avatar :src="item.avatar_medium?.url_list?.[0]" size="medium" />
    </div>
    <div class="user-info">
      <div class="user-nickname">
        <span>{{ item.nickname }}</span>
      </div>
      <div class="user-desc">
        <span v-if="item.signature" class="user-signature">{{
          item.signature
        }}</span>
      </div>
      <div
        class="user-unread-content"
        v-if="
          item.following_list_secondary_information_struct
            ?.secondary_information_text
        "
      >
        <span class="user-unread">
          {{
            item.following_list_secondary_information_struct
              .secondary_information_text
          }}
        </span>
      </div>
    </div>
    <DyButton
      class="follow-btn"
      :class="{
        follow: item.follow_status === 1,
        mutual: item.follow_status === 2
      }"
      :theme="item.follow_status ? 'light' : 'solid'"
      type="primary"
      size="small"
    >
      {{
        item.follow_status === 2
          ? '相互关注'
          : item.follow_status === 1
          ? '已关注'
          : '关注'
      }}
    </DyButton>
  </div>
</template>

<style lang="scss" scoped>
.record-visited-item {
  width: calc(33.3333% - 10.6667px);
  background-color: var(--color-bg-b1-white);
  height: 88px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 12px;
  align-items: center;
  padding: 12px;
  display: flex;

  &:hover {
    background-color: var(--color-bg-b2);
  }
}

.user-info {
  width: 0px;
  flex: 1 1 0%;
  margin: 0px 8px 0px 12px;

  .user-nickname {
    color: var(--color-text-t1);
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 2px;

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

  .user-desc {
    color: var(--color-text-t3);
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .user-signature {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      flex-shrink: 1;
      min-width: 0;
    }
  }
  .user-unread-content {
    display: flex;
    .user-unread {
      height: 16px;
      box-sizing: border-box;
      background: var(--color-secondary-default);
      color: var(--color-text-t2);
      border-radius: 4px;
      padding: 1px 4px;
      font-size: 10px;
      font-weight: 400;
      line-height: 16px;
    }
  }
}

.follow-btn {
  background: var(--color-primary);
  color: var(--btn-color);
  min-width: 68px !important;
  width: 68px !important;
  font-size: 14px;
  border-radius: 10px;
  height: 32px;

  &:hover {
    background: rgba(242, 242, 244, 0.12) !important;
  }

  &.follow,
  &.mutual {
    background: var(--btn-bg);
  }

  &.mutual {
    min-width: 80px !important;
    width: 80px !important;
  }
}
</style>
