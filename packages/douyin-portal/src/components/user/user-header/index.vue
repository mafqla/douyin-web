<script setup lang="ts">
import type { IUserDetailRes } from '@/api/tyeps/request_response/userDetailRes'
import { type PropType, computed, ref } from 'vue'
import dyAvatar from '@/components/common/dy-avatar.vue'
import { VerifyBadge } from '@/components/common'
import { useCount } from '@/hooks'
import { Toast } from '@/components/ui'
import userConnectionsPopup from './user-connections-popup.vue'

const props = defineProps({
  userInfo: {
    type: Object as PropType<IUserDetailRes>,
    default: () => ({})
  }
})

const isAttention = computed({
  get() {
    return props.userInfo.user.follow_status
  },
  set(val) {
    props.userInfo.user.follow_status = val
  }
})

// console.log(isAttention.value)
const handleAttention = async (id: string) => {
  // if (isAttention.value === 1 || isAttention.value === 3) {
  //   isAttention.value = 2
  // } else {
  //   isAttention.value = 1
  // }
}
//预览头像
const isOpenAvatar = ref(false)
const openAvatar = () => {
  isOpenAvatar.value = true
}
//打开粉丝列表或关注列表
const isOpenConnect = ref(false)
const connect = ref('fans')
// 是否可以打开粉丝列表或关注列表
const isCanOpen = computed(() => {
  // 如果 following_follower_list_toast 为 true，则不允许打开
  // 如果 following_follower_list_toast 未定义或为 null，则默认为 false（允许打开）
  return !(
    props.userInfo.user?.general_permission?.following_follower_list_toast ??
    false
  )
})

const openConnectionsPopup = (name: string) => {
  if (isCanOpen.value) {
    isOpenConnect.value = true
    connect.value = name
  } else {
    // 根据传入的name参数定制提示信息
    const message =
      name === 'fans'
        ? '由于该用户隐私设置，粉丝列表不可见'
        : '由于该用户隐私设置，关注列表不可见'
    
    // 直接使用 Toast，默认配置已经是居中显示
    Toast.info({
      content: message,
      duration: 3000,
      showClose: false,
      icon: null
    })
  }
}

// 解析账号认证信息
const accountCertLabel = computed(() => {
  try {
    const certInfo = props.userInfo.user?.account_cert_info
    if (certInfo) {
      const parsed = JSON.parse(certInfo)
      return parsed.label_text || ''
    }
  } catch {
    return ''
  }
  return ''
})
</script>

<template>
  <div class="user-detail-header" v-if="userInfo">
    <div class="user-avatar" @click="openAvatar">
      <dy-avatar
        size="large"
        :src="userInfo.user?.avatar_300x300.url_list[0] ?? ''"
      />
    </div>
    <img-modal
      :open="isOpenAvatar"
      :avatar="userInfo.user?.avatar_300x300.url_list[0]"
      @close="isOpenAvatar = false"
    />
    <div class="user-info">
      <div class="user-name">
        <h1 class="user-name-login">
          <span class="bage-name">{{ userInfo.user?.nickname }}</span>
          <VerifyBadge
            :cert-info="userInfo.user?.account_cert_info"
            :size="16"
          />
        </h1>
        <div class="user-bage" v-if="accountCertLabel">
          <span class="bage-name">{{ accountCertLabel }}</span>
        </div>
      </div>
      <div class="user-info-detail">
        <div class="user-item" @click="openConnectionsPopup('attent')">
          <div class="user-info-text">关注</div>
          <div class="user-number">
            {{ useCount(userInfo.user?.following_count) }}
          </div>
        </div>
        <div class="user-item" @click="openConnectionsPopup('fans')">
          <div class="user-info-text">粉丝</div>
          <div class="user-number">
            {{ useCount(userInfo.user?.mplatform_followers_count) }}
          </div>
        </div>
        <modal :open="isOpenConnect" @close="isOpenConnect = false">
          <user-connections-popup
            :connect="connect"
            :user_id="userInfo.user?.uid"
            :user_sec_id="userInfo.user?.sec_uid"
            :followers_count="userInfo.user?.mplatform_followers_count"
            :following_count="userInfo.user?.following_count"
            @close="isOpenConnect = false"
          />
          />
        </modal>
        <div class="user-item">
          <div class="user-info-text">获赞</div>
          <div class="user-number">
            {{ useCount(userInfo.user?.total_favorited) }}
          </div>
        </div>
      </div>
      <p class="user-account">
        <span class="user-account-num">
          抖音号：{{ userInfo.user?.unique_id || userInfo.user?.short_id }}
        </span>
        <!-- 作者页面显示 -->
        <span class="user-account-addr" v-if="userInfo.user?.ip_location">
          {{ userInfo.user.ip_location }}
        </span>
        <template
          v-if="userInfo.user?.gender !== null && userInfo.user?.gender !== 0"
        >
          <span class="user-account-info">
            <svg-icon
              v-if="userInfo.user?.gender === 2"
              icon="small-woman"
              class="user-account-icon"
            />
            <svg-icon
              v-if="userInfo.user?.gender === 1"
              icon="small-man"
              class="user-account-icon"
            />
            <span v-if="userInfo.user?.gender === 2" >女</span>
            <span v-if="userInfo.user?.gender === 1" >男</span>
            <span v-if="userInfo.user?.user_age && userInfo.user?.user_age > 0"
              >{{ userInfo.user?.user_age }}岁</span
            >
          </span>
        </template>

        <template v-if="userInfo.user?.city">
          <span class="user-account-info"
            >{{ userInfo.user.city }}·{{ userInfo.user?.district }}</span
          >
        </template>
        <template v-if="userInfo.user?.school_name">
          <span class="user-account-info">{{
            userInfo.user?.school_name
          }}</span>
        </template>
      </p>

      <div class="user-signature">
        <span> {{ userInfo.user?.signature }}</span>
      </div>
    </div>

    <div class="action">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-detail-header {
  width: 100%;
  max-width: 1520px;
  margin: 28px auto 21px;
  margin-top: -142px;
  display: flex;
  position: relative;

  .user-avatar {
    :deep(.dy-avatar .avatar-size-large) {
      width: 112px;
      height: 112px;
    }
  }
  .user-info {
    align-content: center;
    align-items: center;
    display: flex;
    flex: 1 1;
    flex-wrap: wrap;
    margin-left: 32px;
    .user-name {
      display: flex;
      position: relative;
      width: 100%;
      .user-name-noin {
        color: var(--color-text-t1);
        font-size: 20px;
        font-weight: 400;
        line-height: 28px;
        margin-bottom: 14px;
      }
      .user-name-login {
        display: flex;
        align-items: center;

        span {
          color: var(--color-text-t1);
          display: block;
          flex: none;
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .user-bage {
        justify-content: flex-start;
        align-items: center;
        margin-left: 16px;
        display: flex;
        flex: 1;

        .bage-name {
          color: var(--color-text-t3);
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          overflow: hidden;
        }
      }
    }

    .user-account {
      align-items: center;
      display: flex;
      height: 22px;
      margin-top: 6px;
      width: 100%;

      span {
        color: var(--color-text-t3);
        // color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        line-height: 20px;
      }
      .user-account-num,
      .user-account-addr {
        margin-right: 20px;
      }

      .user-account-info {
        align-items: center;
        background: var(--color-secondary-default);
        color: var(--color-text-t2);
        border-radius: 2px;
        display: flex;
        height: 20px;
        margin-right: 2px;
        padding: 0 8px;

        .user-account-icon {
          width: 12px;
          height: 12px;
          margin-right: 4px;
          color: #f5588e;
        }
      }
    }
    .user-info-text {
      color: var(--color-text-t3);
      font-size: 14px;
      line-height: 22px;
      margin-right: 6px;
    }
    .user-number {
      align-items: center;
      display: flex;
      height: 22px;
      margin-top: 6px;
      color: var(--color-text-t1);
      font-size: 16px;
      line-height: 24px;
    }
    .user-signature {
      display: flex;
      height: 23px;
      margin-top: 4px;
      position: relative;
      width: 100%;

      span {
        color: var(--color-text-t1);
        font-size: 12px;
        line-height: 20px;
        font-weight: 400;
      }
    }

    .user-info-detail {
      // justify-content: flex-start;
      display: flex;
      margin-top: 4px;
      width: 100%;

      .user-item {
        align-items: baseline;
        display: flex;
        justify-content: flex-start;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          .user-info-text {
            color: var(--color-text-t2);
          }
          
          .user-number {
            color: var(--color-text-t0);
          }
        }

        .user-text {
          color: var(--color-text-t3);
          font-weight: 400;
        }

        .user-line {
          color: var(--color-text-t1);
          font-size: 20px;
          font-weight: 400;
          line-height: 28px;
          margin-left: 6px;
          transform: scaleX(0.5);
        }
        .user-line-number {
          color: var(--color-text-t1);
          font-size: 16px;
          line-height: 24px;
          margin-left: 6px;
        }

        &::after {
          border-left: 1px solid var(--color-secondary-default);
          content: '';
          height: 16px;
          margin: 0 16px;
          width: 0;
        }

        &:last-child {
          &::after {
            border: none;
            content: none;
          }
        }
      }
    }
  }

  .action {
    height: 112px;
    flex-wrap: wrap;
    align-content: space-between;
    align-items: center;
    bottom: 0;
    display: flex;
    position: absolute;
    right: 0;
    max-width: 300px;

    :deep(.content-text) {
      width: 208px;
    }
  }
}

@media (max-width: 1740px) {
  .user-detail-header {
    width: calc(100% - 60px);
  }
}
@media (max-width: 1400px) {
  .action {
    bottom: 8px;
    max-width: 280px !important;
  }
}
// @media (max-width: 1180px) {
//   .user-detail-header {
//     padding-bottom: 68px;
//     .action {
//       bottom: -24px;
//       left: 0;
//     }
//   }
// }

// @media (max-width: 1024px) {
//   .user-detail-header {
//     padding-bottom: 68px;

//     .action {
//       bottom: -24px;
//       left: 0;
//     }
//   }
// }
</style>
