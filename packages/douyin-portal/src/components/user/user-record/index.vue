<script setup lang="ts">
import {} from 'vue'
import RecordVideo from './record-video.vue'
import RecordVs from './record-vs/index.vue'
import RecordLive from './record-live/index.vue'

// const props = defineProps<{
//   //用户id
//   user_id: string
// }>()

const route = useRoute()
const router = useRouter()
const tabs = ['video', 'vs', 'live']
const activeTab = ref((route.query.showSubTab as string) || 'video')

const getTabTitle = (tab: string) => {
  const titles: { [key: string]: string } = {
    video: '视频',
    vs: '影视综',
    live: '直播'
  }
  return titles[tab]
}

const handleTabChange = (tab: string) => {
  activeTab.value = tab
  router.push({
    query: {
      ...route.query,
      showSubTab: tab
    }
  })
}
</script>
<template>
  <div class="user-record">
    <user-tabbar-2>
      <div class="tabbar-2-content">
        <div
          v-for="tab in tabs"
          :key="tab"
          class="tabbar-2-item"
          :class="{ active: activeTab === tab }"
          @click="handleTabChange(tab)"
        >
          <span class="tabbar-2-item-text">{{ getTabTitle(tab) }}</span>
        </div>
      </div>
      <div class="tabbar-2-end">
        <div class="clear-content">
          <svg-icon icon="clear" class="clear-icon" />
        </div>

        <svg-icon icon="help" class="help-icon" />
      </div>
    </user-tabbar-2>

    <div class="user-record-content">
      <record-video v-if="activeTab === 'video'" />
      <record-vs v-if="activeTab === 'vs'" />
      <record-live v-if="activeTab === 'live'" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-show {
  margin: 120px 0;
}
.user-record {
  position: relative;
}

.tabbar-2-content {
  position: relative;
  white-space: nowrap;
  outline: none;

  .tabbar-2-item {
    margin-right: 10px;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
    color: var(--color-text-2);
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    display: inline-block;
    position: relative;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 6px;
    padding: 3px 12px;

    &.active {
      color: var(--color-primary);
      background-color: rgba(254, 44, 85, 0.12);
      border-width: initial;
      border-style: none;
      border-color: initial;
      border-image: initial;

      &:hover {
        cursor: default;
        color: var(--color-primary);
        font-weight: 600;
      }
    }
    &:hover {
      cursor: default;
      color: var(--color-text-0);
      font-weight: 600;
    }

    .tabbar-2-item-text {
      font-size: 13px;
      line-height: 21px;
    }
  }
}

.tabbar-2-end {
  height: 44px;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 0;
  display: flex;
  position: relative;

  .clear-content {
    cursor: pointer;
    align-items: center;
    margin-right: 20px;
    display: flex;
    position: relative;
  }
  .clear-icon {
    width: 16px;
    height: 16px;
    cursor: pointer;
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
  .help-icon {
    width: 16px;
    height: 16px;
    // margin-left: 20px;
    cursor: pointer;
    opacity: 0.5;
  }
}
</style>
