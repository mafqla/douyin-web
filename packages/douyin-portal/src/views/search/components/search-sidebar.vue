<script setup lang="ts">
import {} from 'vue'

interface SearchItem {
  id: number
  query: string
  description: string
}

const props = defineProps({
  searchData: {
    type: Array as () => SearchItem[],
    required: true,
    validator: (propValue: SearchItem[]) => {
      const isValid = propValue.every((item) => {
        return (
          typeof item.id === 'number' &&
          typeof item.query === 'string' &&
          typeof item.description === 'string'
        )
      })
      return isValid
    }
  }
})
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-title">相关搜索</div>
    <ul class="sidebar-list">
      <li class="sidebar-item" v-for="item in props.searchData" :key="item.id">
        <svg-icon icon="sider-search" class="sidebar-item-icon" />
        <span>
          <span class="highlight-text">{{ item.query }}</span>
        </span>
        <span>
          <span class="default-text"></span>
          {{ item.description }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-content {
  position: fixed;
  top: 68px;
  margin-top: 90px;
  .sidebar-title {
    font-size: 18px;
    margin-bottom: 16px;
    margin-left: 4px;

    color: var(--color-text-t1);
    font-weight: 500;
    line-height: 26px;
  }
  .sidebar-list {
    align-items: flex-start;
    display: flex;
    flex-direction: column;

    .sidebar-item {
      border-radius: 6px;
      color: var(--color-text-t1);
      cursor: pointer;
      font-size: 14px;
      font-weight: 400;
      height: 36px;
      line-height: 24px;
      max-width: 100%;
      overflow: hidden;
      padding: 6px 12px 6px 2px;
      text-overflow: ellipsis;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      white-space: nowrap;
      width: 100%;

      &:hover {
        background-color: var(--color-fill-hover);
      }

      .sidebar-item-icon {
        width: 24px;
        height: 24px;
        color: var(--color-text-t4);
        margin-top: -3px;
      }
      .highlight-text {
        color: var(--color-text-t3);
      }
    }
    .default-text {
      margin-right: 1px;
    }
  }
}
</style>
