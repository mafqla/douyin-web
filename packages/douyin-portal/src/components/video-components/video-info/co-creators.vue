<script setup lang="ts">
import type { ICoCreator } from '@/api/tyeps/common/aweme'
import { SvgIcon } from '@/components/common'

defineProps<{
  creators: ICoCreator[]
}>()
</script>

<template>
  <div v-if="creators.length > 0" class="co-creators-container">
    <ul class="co-creators-list">
      <li v-for="creator in creators" :key="creator.uid" class="co-creator-item">
        <div class="co-creator-avatar-wrapper">
          <a 
            :href="`/user/${creator.sec_uid}`" 
            class="co-creator-avatar-link"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <span class="co-creator-avatar">
              <img :src="creator.avatar_thumb.url_list[0]" :alt="creator.nickname" />
            </span>
          </a>
          <!-- 关注按钮 -->
          <div v-if="creator.follow_status === 0" class="co-creator-follow-btn">
            <SvgIcon class="icon" icon="avfollow" />
          </div>
        </div>
        <div class="co-creator-name">
          <span class="co-creator-nickname">{{ creator.nickname }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.co-creators-container {
  margin-top: 8px;

  .co-creators-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 16px;
  }

  .co-creator-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .co-creator-avatar-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .co-creator-avatar-link {
    display: block;
    text-decoration: none;
  }

  .co-creator-avatar {
    display: block;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    padding: 2px;
    background: linear-gradient(135deg, var(--color-primary), rgba(var(--cyan-400), 1));

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      background-color: var(--color-bg-b0);
    }
  }

  .co-creator-follow-btn {
    position: absolute;
    bottom: -6px;
    right: -6px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      width: 20px;
      height: 20px;
      color: var(--color-const-text-white);
    }
  }

  .co-creator-name {
    margin-top: 4px;
    max-width: 56px;
    text-align: center;
  }

  .co-creator-nickname {
    font-size: 12px;
    color: var(--color-const-text-white);
    text-shadow: 0 0 1px var(--color-mask-m3);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
}
</style>
