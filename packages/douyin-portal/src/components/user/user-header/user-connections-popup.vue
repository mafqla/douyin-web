<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import apis from '@/api/apis'
import type { IFollowingUser } from '@/api/tyeps/request_response/followingListRes'
import { VerifyBadge } from '@/components/common'
import Loading from '@/components/common/loading.vue'

const props = defineProps<{
  connect: string
  user_id: string
  user_sec_id: string
  followers_count?: number
  following_count?: number
}>()

const emit = defineEmits(['close'])

// 当前 tab
const activeTab = ref(props.connect)

// 排序选项
const sortOptions = [
  { label: '综合排序', value: 4 },
  { label: '最近关注', value: 1 },
  { label: '最早关注', value: 3 }
]
const currentSort = ref(sortOptions[0])
const isShowSort = ref(false)

// 搜索关键词
const searchKeyword = ref('')

// 关注列表数据
const followingList = ref<IFollowingUser[]>([])
const followingLoading = ref(false)
const followingOffset = ref(0)
const followingHasMore = ref(true)

// 粉丝列表数据
const followerList = ref<IFollowingUser[]>([])
const followerLoading = ref(false)
const followerOffset = ref(0)
const followerHasMore = ref(true)

// 获取关注列表
const getFollowingList = async (isLoadMore = false) => {
  if (followingLoading.value) return
  if (isLoadMore && !followingHasMore.value) return

  followingLoading.value = true
  try {
    const res = await apis.getFollowingList({
      user_id: props.user_id,
      sec_user_id: props.user_sec_id,
      count: 20,
      offset: followingOffset.value,
      min_time: 0,
      max_time: 0,
      source_type: currentSort.value.value,
      is_top: 1
    })

    if (res?.followings) {
      if (isLoadMore) {
        // 去重
        const existingIds = new Set(followingList.value.map((u) => u.uid))
        const newUsers = res.followings.filter((u) => !existingIds.has(u.uid))
        followingList.value.push(...newUsers)
      } else {
        followingList.value = res.followings
      }
      followingOffset.value += res.followings.length
      followingHasMore.value = res.has_more ?? res.followings.length >= 20
    } else {
      followingHasMore.value = false
    }
  } catch (err) {
    console.error('获取关注列表失败:', err)
  } finally {
    followingLoading.value = false
  }
}

// 获取粉丝列表
const getFollowerList = async (isLoadMore = false) => {
  if (followerLoading.value) return
  if (isLoadMore && !followerHasMore.value) return

  followerLoading.value = true
  try {
    const res = await apis.getFollowerList({
      user_id: props.user_id,
      sec_user_id: props.user_sec_id,
      count: 20,
      offset: followerOffset.value,
      min_time: 0,
      max_time: 0,
      source_type: 1
    })

    if (res?.followers) {
      if (isLoadMore) {
        const existingIds = new Set(followerList.value.map((u) => u.uid))
        const newUsers = res.followers.filter(
          (u: IFollowingUser) => !existingIds.has(u.uid)
        )
        followerList.value.push(...newUsers)
      } else {
        followerList.value = res.followers
      }
      followerOffset.value += res.followers.length
      followerHasMore.value = res.has_more ?? res.followers.length >= 20
    } else {
      followerHasMore.value = false
    }
  } catch (err) {
    console.error('获取粉丝列表失败:', err)
  } finally {
    followerLoading.value = false
  }
}

// 切换排序
const handleSort = (option: (typeof sortOptions)[0]) => {
  currentSort.value = option
  isShowSort.value = false
  // 重置并重新加载
  followingList.value = []
  followingOffset.value = 0
  followingHasMore.value = true
  getFollowingList()
}

// 切换 tab
const handleTabChange = (tab: string) => {
  activeTab.value = tab
  if (tab === 'attent' && followingList.value.length === 0) {
    getFollowingList()
  } else if (tab === 'fans' && followerList.value.length === 0) {
    getFollowerList()
  }
}

// 滚动加载更多
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  if (scrollHeight - scrollTop - clientHeight < 100) {
    if (activeTab.value === 'attent') {
      getFollowingList(true)
    } else {
      getFollowerList(true)
    }
  }
}

// 过滤后的列表
const filteredFollowingList = computed(() => {
  if (!searchKeyword.value) return followingList.value
  const keyword = searchKeyword.value.toLowerCase()
  return followingList.value.filter(
    (u) =>
      u.nickname?.toLowerCase().includes(keyword) ||
      u.unique_id?.toLowerCase().includes(keyword) ||
      u.short_id?.includes(keyword)
  )
})

const filteredFollowerList = computed(() => {
  if (!searchKeyword.value) return followerList.value
  const keyword = searchKeyword.value.toLowerCase()
  return followerList.value.filter(
    (u) =>
      u.nickname?.toLowerCase().includes(keyword) ||
      u.unique_id?.toLowerCase().includes(keyword) ||
      u.short_id?.includes(keyword)
  )
})

// 当前显示的列表
const currentList = computed(() => {
  return activeTab.value === 'attent'
    ? filteredFollowingList.value
    : filteredFollowerList.value
})

const isLoading = computed(() => {
  return activeTab.value === 'attent'
    ? followingLoading.value
    : followerLoading.value
})

const hasMore = computed(() => {
  return activeTab.value === 'attent'
    ? followingHasMore.value
    : followerHasMore.value
})

// 获取头像
const getAvatarUrl = (user: IFollowingUser) => {
  return (
    user.avatar_thumb?.url_list?.[0] ||
    user.avatar_medium?.url_list?.[0] ||
    user.avatar_larger?.url_list?.[0] ||
    ''
  )
}

// 获取关注状态文本
const getFollowStatusText = (user: IFollowingUser) => {
  if (user.follow_status === 2) return '相互关注'
  if (user.follow_status === 1) return '已关注'
  return '关注'
}

// 获取显示名称（粉丝列表优先显示备注名）
const getDisplayName = (user: IFollowingUser) => {
  // 如果是粉丝列表且有备注名，优先显示备注名
  if (activeTab.value === 'fans' && user.remark_name) {
    return user.remark_name
  }
  return user.nickname
}

// 高亮搜索关键词
const highlightKeyword = (text: string) => {
  if (!searchKeyword.value || !text) return text
  const keyword = searchKeyword.value
  const regex = new RegExp(
    `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi'
  )
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 获取抖音号
const getDouyinId = (user: IFollowingUser) => {
  return user.unique_id || user.short_id || ''
}

// 关注/取消关注用户
const handleFollow = async (user: IFollowingUser) => {
  const isFollowing = user.follow_status === 1 || user.follow_status === 2
  const type = isFollowing ? 0 : 1

  try {
    // const res = await apis.followUser(user.uid, user.sec_uid, type)
    // if (res.status_code === 0) {
    //   // 更新本地状态
    //   user.follow_status = res.follow_status
    // }
  } catch (err) {
    console.error('关注操作失败:', err)
  }
}

// 移除粉丝
const handleRemoveFollower = async (user: IFollowingUser) => {
  try {
    await apis.removeFollower(user.uid, user.sec_uid)
    // 从列表中移除
    const index = followerList.value.findIndex((u) => u.uid === user.uid)
    if (index > -1) {
      followerList.value.splice(index, 1)
    }
  } catch (err) {
    console.error('移除粉丝失败:', err)
  }
}

// 解析认证标签
const getCertLabel = (user: IFollowingUser) => {
  if (!user.account_cert_info) return ''
  try {
    const parsed = JSON.parse(user.account_cert_info)
    return parsed.label_text || ''
  } catch {
    return ''
  }
}

// 初始化
onMounted(() => {
  if (activeTab.value === 'attent') {
    getFollowingList()
  } else {
    getFollowerList()
  }
})

// 监听 tab 变化
watch(
  () => props.connect,
  (newVal) => {
    activeTab.value = newVal
    handleTabChange(newVal)
  }
)
</script>

<template>
  <div class="user-connections-popup">
    <div class="close" @click="emit('close')">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <path
          d="M22.133 23.776a1.342 1.342 0 101.898-1.898l-4.112-4.113 4.112-4.112a1.342 1.342 0 00-1.898-1.898l-4.112 4.112-4.113-4.112a1.342 1.342 0 10-1.898 1.898l4.113 4.112-4.113 4.113a1.342 1.342 0 001.898 1.898l4.113-4.113 4.112 4.113z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div class="tab">
      <div class="tab-wrapper">
        <div class="content">
          <!-- Tab 切换 -->
          <div class="tab-stats">
            <div
              class="tab-stats-text"
              :class="{ active: activeTab === 'attent' }"
              @click="handleTabChange('attent')"
            >
              关注({{ following_count ?? 0 }})
            </div>
            <div
              class="tab-stats-text"
              :class="{ active: activeTab === 'fans' }"
              @click="handleTabChange('fans')"
            >
              粉丝({{ followers_count ?? 0 }})
            </div>
          </div>

          <div class="bottom-border"></div>

          <!-- 搜索和排序 -->
          <div class="input">
            <div class="input-content" :class="{ expanded: searchKeyword }">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                class="search-icon"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 5.333a5.667 5.667 0 103.237 10.319l2.723 2.722a1 1 0 001.414-1.415l-2.722-2.722A5.667 5.667 0 0011 5.333zM7.333 11a3.667 3.667 0 117.334 0 3.667 3.667 0 01-7.334 0z"
                  fill="currentColor"
                />
              </svg>
              <input
                v-model="searchKeyword"
                class="input-text"
                type="text"
                placeholder="搜索用户名字或抖音号"
              />
              <svg
                v-if="searchKeyword"
                class="clear-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                @click="searchKeyword = ''"
              >
                <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.3" />
                <path
                  d="M10.5 5.5L5.5 10.5M5.5 5.5L10.5 10.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <!-- 排序（仅关注列表显示且没有搜索关键词时） -->
            <div
              v-show="activeTab === 'attent' && !searchKeyword"
              class="sort"
              @mouseenter="isShowSort = true"
            >
              <svg width="16" height="14" viewBox="0 0 16 14" class="sort-icon">
                <path
                  d="M.894 12.648H8.48a.812.812 0 00.785-.816.806.806 0 00-.785-.785H.894a.798.798 0 00-.815.785.798.798 0 00.785.816h.03zm0-4.934H8.48a.796.796 0 00.785-.806.806.806 0 00-.785-.785H.894a.796.796 0 00-.02 1.59h.02zm0-4.935H8.48a.796.796 0 00.785-.805.806.806 0 00-.785-.785H.894a.796.796 0 000 1.59zm11.948-1.437a.796.796 0 00-1.59 0v11.153a.793.793 0 001.264.642l3.059-2.232a.8.8 0 00.193-1.112.8.8 0 00-1.111-.193c-.01 0-.01.01-.02.01l-1.795 1.305V1.342z"
                  fill="currentColor"
                />
              </svg>
              <span class="sort-text">{{ currentSort.label }}</span>
              <ul
                class="sort-list"
                v-show="isShowSort"
                @mouseleave="isShowSort = false"
              >
                <li
                  v-for="option in sortOptions"
                  :key="option.value"
                  :class="{ active: currentSort.value === option.value }"
                  @click="handleSort(option)"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 用户列表 -->
          <div class="user-list-container" @scroll="handleScroll">
            <Loading
              :show="isLoading && currentList.length === 0"
              :isShowText="false"
            >
              <div v-if="currentList.length > 0">
                <div
                  v-for="user in currentList"
                  :key="user.uid"
                  class="list-item"
                >
                  <div class="list-avatar">
                    <router-link
                      :to="`/user/${user.sec_uid}`"
                      class="link"
                      @click="emit('close')"
                    >
                      <div class="avatar-component">
                        <img
                          :src="getAvatarUrl(user)"
                          :alt="user.nickname"
                          class="avatar-img"
                        />
                      </div>
                    </router-link>
                  </div>

                  <div class="list-info">
                    <div class="list-info-top">
                      <div class="list-info-name">
                        <router-link
                          :to="`/user/${user.sec_uid}`"
                          class="link"
                          @click="emit('close')"
                        >
                          <span
                            class="name-text"
                            v-html="highlightKeyword(getDisplayName(user))"
                          ></span>
                        </router-link>
                        <VerifyBadge :cert-info="user.account_cert_info" />
                      </div>
                      <div class="list-info-type" v-if="getCertLabel(user)">
                        <span class="type-text">{{ getCertLabel(user) }}</span>
                      </div>
                    </div>
                    <div
                      class="list-info-douyin-id"
                      v-if="searchKeyword && getDouyinId(user)"
                    >
                      <span class="douyin-id-label">抖音号：</span>
                      <span
                        class="douyin-id-text"
                        v-html="highlightKeyword(getDouyinId(user))"
                      ></span>
                    </div>
                    <div class="list-info-signature" v-else-if="user.signature">
                      <span class="signature-text">{{ user.signature }}</span>
                    </div>
                  </div>

                  <div class="list-action">
                    <button
                      class="content-btn"
                      :class="{ follow: user.follow_status === 0 }"
                      @click="handleFollow(user)"
                    >
                      <span class="btn-text">{{
                        getFollowStatusText(user)
                      }}</span>
                    </button>
                    <button
                      v-if="activeTab === 'fans'"
                      class="content-btn remove-btn"
                      @click="handleRemoveFollower(user)"
                    >
                      <span class="btn-text">移除</span>
                    </button>
                  </div>
                </div>

                <!-- 加载更多 -->
                <div v-if="isLoading" class="loading-more">
                  <Loading :show="true" :isShowText="false" />
                </div>
                <div v-else-if="!hasMore" class="nomore">暂时没有更多了</div>
              </div>

              <div v-else-if="!isLoading" class="empty">
                <span>{{
                  searchKeyword ? '未找到匹配的用户' : '暂无数据'
                }}</span>
              </div>
            </Loading>
          </div>

          <div class="mask-bg"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-connections-popup {
  animation: user-scale 0.4s cubic-bezier(0.34, 0.69, 0.1, 1),
    fade-in 0.2s linear;
  background: var(--color-bg-b1);
  border-radius: 16px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  padding: 0;
  position: relative;
  z-index: 10;
}

.close {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;

  svg path {
    fill: var(--color-text-t2);
  }
}

.tab {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;

  .tab-wrapper {
    height: 672px;
    max-height: calc(-144px + 100vh);
    flex-direction: column;
    display: flex;
    overflow: hidden;
  }

  .content {
    width: 560px;
    flex-direction: column;
    display: flex;
    position: relative;
    flex: 1 1 0%;
    padding: 36px 40px;
    overflow: hidden;
    border-radius: 16px;

    .tab-stats {
      display: flex;
      flex-direction: row;
      min-height: 48px;

      .tab-stats-text {
        color: var(--color-text-t3);
        font-weight: 400;
        cursor: pointer;
        font-size: 18px;
        line-height: 26px;
        margin-bottom: 22px;
        margin-right: 40px;
        position: relative;

        &.active,
        &:hover {
          color: var(--color-text-t1);
        }

        &.active::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: var(--color-primary);
          border-radius: 1px;
        }
      }
    }

    .input {
      display: flex;
      margin: 12px 0;

      .input-content {
        align-items: center;
        background: var(--color-secondary-default);
        border-radius: 6px;
        display: flex;
        flex: 1 1;
        height: 32px;
        transition: all 0.3s;
        margin-right: 24px;

        &.expanded {
          margin-right: 0;
          border-radius: 6px;
        }

        .search-icon {
          margin-left: 6px;
          flex-shrink: 0;

          path {
            fill: var(--color-text-t4);
          }
        }

        .input-text {
          background: transparent;
          border: none;
          border-radius: 4px;
          color: var(--color-text-t1);
          flex: 1 1;
          height: 32px;
          outline: none;

          &::placeholder {
            color: rgb(117, 117, 117);
          }
        }

        .clear-icon {
          margin-right: 8px;
          cursor: pointer;
          flex-shrink: 0;
          color: var(--color-text-t3);

          &:hover {
            color: var(--color-text-t1);
          }
        }
      }

      .sort {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        position: relative;
        width: 78px;

        .sort-icon {
          margin-right: 6px;

          path {
            fill: var(--color-text-t1);
          }
        }

        .sort-text {
          color: var(--color-text-t1);
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
        }

        .sort-list {
          background: var(--color-bg-b1);
          border-radius: 4px;
          box-shadow: var(--shadow-1);
          display: block;
          left: 0;
          padding: 8px;
          position: absolute;
          top: calc(100% + 10px);
          z-index: 1;

          li {
            align-items: center;
            color: var(--color-text-t1);
            display: flex;
            font-size: 14px;
            font-weight: 400;
            height: auto;
            justify-content: flex-start;
            line-height: 22px;
            margin: 16px 17px;
            padding: 0;
            position: relative;
            white-space: nowrap;

            &:hover {
              color: var(--color-text-t0);
            }

            &.active {
              color: var(--color-primary);
            }
          }
        }

        &:hover {
          .sort-icon path {
            fill: var(--color-primary-hover);
          }

          .sort-text {
            color: var(--color-primary-hover);
          }
        }
      }
    }

    .bottom-border {
      background-color: var(--color-line-l3);
      display: block;
      height: 1px;
      min-height: 1px;
      position: relative;
      width: 100%;
    }
  }

  .mask-bg {
    background: var(--mask-background);
    border-radius: 4px;
    bottom: 0;
    display: block;
    height: 88px;
    left: 0;
    pointer-events: none;
    position: absolute;
    width: 100%;
    z-index: 1;
  }
}

.user-list-container {
  margin: 0 -34px -20px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 0 28px 0 40px;
  flex: 1;

  .list-item {
    align-items: center;
    display: flex;
    margin: 17px 0;
    padding-bottom: 17px;
    border-bottom: 1px solid var(--color-line-l3);
  }

  .list-avatar {
    .link {
      position: relative;
    }

    .avatar-component {
      border: 1px solid var(--color-line-l3);
      border-radius: 50%;
      box-sizing: content-box;
      flex-grow: 0;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;
      height: 60px;
      width: 60px;

      .avatar-img {
        height: 100%;
        position: relative;
        width: 100%;
        border-radius: 50%;
      }
    }
  }

  .list-info {
    flex: 1 1;
    margin: 0 12px;
    width: 0;

    .list-info-top {
      display: flex;
      margin: 4px 0;
      align-items: center;

      .list-info-name {
        color: var(--color-text-t1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: flex;
        align-items: center;

        .link {
          position: relative;

          .name-text {
            color: var(--color-text-t1);
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            &:hover {
              color: var(--color-primary);
            }

            :deep(.highlight) {
              color: var(--color-primary);
            }
          }
        }
      }

      .list-info-type {
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        overflow: hidden;
        white-space: nowrap;
        align-items: center;
        display: flex;
        margin-left: 8px;

        .type-text {
          color: var(--color-text-t3);
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .list-info-signature {
      color: var(--color-text-t1);
      margin: 4px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .signature-text {
        color: var(--color-text-t3);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .list-info-douyin-id {
      margin: 4px 0;
      font-size: 12px;
      line-height: 20px;

      .douyin-id-label {
        color: var(--color-text-t3);
      }

      .douyin-id-text {
        color: var(--color-text-t3);

        :deep(.highlight) {
          color: var(--color-primary);
        }
      }
    }
  }

  .list-action {
    align-items: center;
    display: flex;
    justify-content: center;

    .content-btn {
      min-width: 88px;
      width: 68px;
      opacity: 1;
      transition: all 0.2s;
      background-color: var(--secondary-bg-color);
      color: var(--color-text-t1);
      border-radius: 10px;
      font-size: 14px;
      height: 36px;
      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      outline: none;
      padding: 0 16px;
      position: relative;
      margin: 0 8px;

      &:hover {
        background-color: var(--secondary-bg-color-hover);
      }

      &.follow {
        background-color: var(--color-primary);
        color: var(--color-const-text-white);

        &:hover {
          background-color: var(--color-primary-hover);
        }
      }

      &.remove-btn {
        margin-left: 8px;
        min-width: auto;
        color: var(--color-text-t3);

        &:hover {
          background-color: var(--color-bg-b3);
          border-color: var(--color-line-l1);
        }
      }

      .btn-text {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .loading-more {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }

  .nomore {
    align-items: center;
    color: var(--color-text-t4);
    display: flex;
    font-size: 12px;
    justify-content: center;
    line-height: 20px;
    min-height: 100px;
  }

  .empty {
    align-items: center;
    color: var(--color-text-t4);
    display: flex;
    font-size: 14px;
    justify-content: center;
    min-height: 200px;
  }
}

@keyframes user-scale {
  0% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
