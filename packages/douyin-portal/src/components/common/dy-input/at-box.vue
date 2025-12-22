<script setup lang="ts">
import apis from '@/api/apis'
import type { IAtUser } from '@/api/tyeps/request_response/atListRes'
import { onMounted, onUnmounted, ref } from 'vue'

interface IAtUserDisplay {
  uid: string
  username: string
  userAvatar: string
  isFriend: boolean
}

const props = defineProps({
  groupId: {
    type: String,
    default: ''
  }
})

const userList = ref<IAtUserDisplay[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const cursor = ref(0)
const atBoxRef = ref<HTMLElement | null>(null)

// 获取@用户列表
const fetchAtList = async (isLoadMore = false) => {
  if (isLoadMore) {
    if (loadingMore.value || !hasMore.value) return
    loadingMore.value = true
  } else {
    loading.value = true
    cursor.value = 0
    userList.value = []
  }

  try {
    const res = await apis.getAtList({ 
      cursor: cursor.value, 
      scene: 2, 
      group_id: props.groupId 
    })
    
    if (res.user_list) {
      // 转换数据格式
      const users = res.user_list.map((user: IAtUser) => ({
        uid: user.uid,
        username: user.nickname,
        userAvatar: user.avatar_thumb?.url_list?.[0] || user.avatar_168x168?.url_list?.[0] || '',
        isFriend: user.follower_status === 1 // 互相关注的是朋友
      }))
      
      if (isLoadMore) {
        userList.value.push(...users)
      } else {
        // 首次加载，朋友排在前面
        userList.value = users.sort((a: IAtUserDisplay, b: IAtUserDisplay) => {
          if (a.isFriend && !b.isFriend) return -1
          if (!a.isFriend && b.isFriend) return 1
          return 0
        })
      }
      
      cursor.value = res.cursor
      hasMore.value = res.has_more
    }
  } catch (error) {
    console.error('获取@用户列表失败:', error)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 滚动加载更多
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  
  // 距离底部 50px 时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    fetchAtList(true)
  }
}

const emit = defineEmits(['user-selected', 'close'])

const selectUser = (user: IAtUserDisplay) => {
  emit('user-selected', { username: user.username, uid: user.uid })
}

// 点击弹窗外部关闭弹窗
const handleClickOutside = (event: MouseEvent) => {
  if (
    !(event.target as HTMLElement).closest('.at-box') &&
    !(event.target as HTMLElement).closest('.at-icon')
  ) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchAtList()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
<template>
  <div class="at-box" ref="atBoxRef" @wheel.stop @touchmove.stop @scroll="handleScroll">
    <div class="at-box-inner" v-if="userList.length > 0">
      <div v-for="user in userList" :key="user.uid">
        <div class="user-avatar-box" @click="selectUser(user)">
          <div class="user-avatar-box-inner">
            <dy-avatar :src="user.userAvatar" size="small" />
            <span class="user-name">{{ user.username }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 首次加载 -->
    <div class="at-box-loading" v-if="loading">
      <Loading :show="true" />
    </div>
    
    <!-- 加载更多 -->
    <div class="at-box-loading-more" v-if="loadingMore">
      <Loading :show="true" />
    </div>
    
    <!-- 空状态 -->
    <div class="at-box-empty" v-if="!loading && userList.length === 0">
      <span>暂无关注的人</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.at-box {
  width: 100%;
  max-height: 184px;
  background-color: var(--color-bg-b1-white);
  z-index: 50;
  box-shadow: var(--shadow-1);
  border-radius: 12px;
  padding: 16px 18px;
  position: absolute;
  left: 0;
  bottom: 100%;
  margin-bottom: 8px;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-color: #363741 var(--color-bg-b1-white);

  .at-box-inner {
    width: 100%;
    flex-wrap: wrap;
    justify-content: flex-start;
    display: flex;

    & > div {
      width: 25%;
    }
  }

  .at-box-loading,
  .at-box-empty {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-t3);
    font-size: 14px;
  }

  .at-box-loading-more {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-avatar-box {
    justify-content: center;
    display: flex;

    &:hover {
      .user-name {
        color: #ff2c55;
      }
    }

    .user-avatar-box-inner {
      width: 63px;
      height: 64px;
      cursor: pointer;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin: 0 6px 24px;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    .user-name {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-t3);
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 20px;
      overflow: hidden;
    }
  }
}
</style>
