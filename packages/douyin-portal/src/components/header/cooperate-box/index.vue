<script setup lang="ts">
import { } from 'vue'

const links = [
  {
    text: '发布视频',
    url: 'https://creator.douyin.com/creator-micro/content/upload'
  },
  {
    text: '视频管理',
    url: 'https://creator.douyin.com/creator-micro/content/manage'
  },
  {
    text: '作品数据',
    url: 'https://creator.douyin.com/creator-micro/data/stats/overview'
  },
  {
    text: '直播数据',
    url: 'https://livedata.douyin.com/'
  },
  {
    text: '创作者学习中心',
    url: 'https://creator.douyin.com/creator-school'
  },
  {
    text: '创作者服务平台',
    url: 'https://creator.douyin.com'
  }
]
</script>
<template>
  <div class="cooperate-box">
    <ul class="cooperate-list">
      <li v-for="(item, index) in links" :key="index">
        <div>
          <div class="cooperate-link-container">
            <a :href="item.url" class="cooperate-link" target="_blank" rel="noopener nofollow noreferrer">{{ item.text
              }}</a>
            <div class="cooperate-link-icon"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.cooperate-box {
  animation: showcooperate 0.4s ease-in, hidecooperate 0s linear 0.4s;
  animation-fill-mode: forwards;
  display: block;
  left: 50%;
  overflow: hidden;
  padding: 0;
  position: absolute;
  // top: 56px;
  transform: translateX(-30%);
  border-radius: 16px;
}

.cooperate-list {
  animation: slideInList;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.34, 0.69, 0.1, 1);
  background: var(--color-bg-b1-white);
  border-radius: 16px;
  padding: 12px;
}

.cooperate-link-container {
  position: relative;
  width: auto;
}

.cooperate-link {
  align-items: center;
  color: var(--color-text-t1);
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: auto;
  height: 46px;
  justify-content: flex-start;
  line-height: 22px;
  margin: 0;
  padding: 0 24px;
  position: relative;
  white-space: nowrap;
  width: 160px;
}

.cooperate-link:hover {
  background: var(--color-fill-hover);
  border-radius: 12px;
}

// html.dark .cooperate-link:hover {
// }

.cooperate-link-icon {
  cursor: default;
}

@keyframes showcooperate {
  0% {
    box-shadow: none;
  }

  100% {
    box-shadow: var(--shadow-1);
  }
}

@keyframes hidecooperate {
  0% {
    overflow: hidden;
  }

  100% {
    overflow: visible;
  }
}

@keyframes slideInList {
  0% {
    transform: translateY(-80px);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
