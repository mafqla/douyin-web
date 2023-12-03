<script setup lang="ts">
import type { IUserInfoResult } from '@/service/auth/AuthType'
import { type PropType, computed, ref } from 'vue'
import { attention } from '@/service/attention/index'

const props = defineProps({
  userInfo: {
    type: Object as PropType<IUserInfoResult>,
    default: () => ({})
  }
})

const isAttention = computed({
  get() {
    return props.userInfo.isAttention
  },
  set(val) {
    props.userInfo.isAttention = val
  }
})

// console.log(isAttention.value)
const handleAttention = async (id: number) => {
  await attention(id)
  if (isAttention.value === 1 || isAttention.value === 3) {
    isAttention.value = 2
  } else {
    isAttention.value = 1
  }
}
//预览头像
const isOpenAvatar = ref(false)
const openAvatar = () => {
  isOpenAvatar.value = true
}
</script>

<template>
  <div class="user-detail-header">
    <div class="user-avatar" @click="openAvatar">
      <el-avatar :size="112" :src="userInfo.avatar" />
    </div>
    <img-modal
      :open="isOpenAvatar"
      :avatar="userInfo.avatar"
      @close="isOpenAvatar = false"
    />
    <div class="user-info">
      <div class="user-name">
        <h1 class="user-name-login">
          <span>{{ userInfo.username }}</span>
        </h1>
      </div>
      <div class="user-info-detail">
        <div class="user-item">
          <div class="user-info-text">关注</div>
          <div class="user-number">{{ userInfo.attentionCount }}</div>
        </div>
        <div class="user-item">
          <div class="user-info-text">粉丝</div>
          <div class="user-number">{{ userInfo.fansCount }}</div>
        </div>
        <div class="user-item">
          <div class="user-info-text">获赞</div>
          <div class="user-number">{{ userInfo.likeCount }}</div>
        </div>
      </div>
      <p class="user-account">
        <span class="user-account-num"> 抖音号：{{ userInfo.userNum }} </span>
        <!-- 作者页面显示 -->
        <span class="user-account-addr">ip属地: {{ userInfo.ipAddress }}</span>
        <template v-if="userInfo.gender !== null">
          <span class="user-account-info">
            <svg-icon
              v-if="userInfo.gender === '女'"
              icon="small-woman"
              class="user-account-icon"
            />
            <svg-icon
              v-if="userInfo.gender === '男'"
              icon="small-man"
              class="user-account-icon"
            />
            <span v-if="userInfo.birthday !== null"
              >{{
                Math.ceil(
                  (Date.now() - new Date(userInfo.birthday).getTime()) /
                    31557600000
                )
              }}岁</span
            >
          </span>
        </template>

        <template v-if="userInfo.address !== null">
          <span class="user-account-info">{{ userInfo.address }}</span>
        </template>
        <template v-if="userInfo.school !== null">
          <span class="user-account-info">{{ userInfo.school }}</span>
        </template>
      </p>

      <div class="user-signature">
        <span> {{ userInfo.userSignature }}</span>
      </div>
    </div>

    <div class="action">
      <download-btn style="margin: unset" class="other" />
      <button
        class="content-btn"
        :class="{ follow: isAttention === 2 }"
        @click="handleAttention(userInfo.id)"
      >
        {{ isAttention === 1 ? '已关注' : '关注' }}
      </button>

      <button class="content-btn">私信</button>
      <button class="content-btn more">
        <svg-icon icon="more" class="icon" />
      </button>
      <button class="content-btn more">
        <div class="share">
          <svg-icon icon="fenxiang" class="icon" />
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-detail-header {
  display: flex;
  margin-bottom: 24px;
  margin-top: 32px;
  position: relative;
  width: 100%;

  .user-info {
    // flex: 1 1;
    // align-items: flex-start;
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    // margin-left: 40px;
    // min-width: 560px;

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
        span {
          color: var(--color-text-t1);
          display: block;
          flex: none;
          font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
          font-size: 20px;
          font-weight: 500;
          line-height: 28px;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        // border: 1px solid #f2f2f4;
        // border: 1px solid rgba(242, 242, 243, 0.08);
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
        // color: rgba(22, 24, 35, 0.6);
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

        .user-text {
          color: var(--color-text-t3);
          font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
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
    bottom: 0;
    display: flex;
    position: absolute;
    right: 0;
    flex-wrap: wrap;
    max-width: 300px;

    :deep(.content-text) {
      width: 208px;
    }

    .other {
      margin-bottom: 12px !important;
      margin-top: 20px !important;
    }

    .content-btn {
      // background: #e4e4e6 !important;
      background: var(--color-bg-b3) !important;
      // background: rgba(242, 242, 243, 1);
      border: none;
      // color: #161823 !important;
      color: var(--color-text-t1) !important;
      // color: rgba(22, 24, 35, 1);
      font-size: 13px;
      font-weight: 400;
      // margin: 0 0 0 8px;
      margin: 0 8px 0 0;

      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      // margin: 0 8px;
      outline: none;
      padding: 0 16px;
      position: relative;
      border-radius: 4px;
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
      // font-size: 14px;
      // font-weight: 500;
      height: 36px;
      line-height: 22px;
      min-width: 88px;

      &:hover {
        background: rgba(228, 228, 230, 1) !important;
        color: rgba(22, 24, 35, 1) !important;
      }
      &.follow {
        background-color: #fe2c55 !important;
        color: #fff !important;

        &:hover {
          background-color: #d21b46 !important;
        }
      }

      &.more {
        width: 36px !important;
        min-width: 36px !important;
        padding: unset !important;

        .share {
          height: 45px;
          width: 50px;
          position: relative;
          .icon {
            width: 50px;
            height: 45px;
            // color: #161823;
            color: var(--color-text-t0);
          }
        }
        .icon {
          width: 36px;
          height: 36px;
          // color: #161823;
          color: var(--color-text-t0);
        }
      }
    }
  }
}

// @media (max-width: 1024px) {
//   .user-detail-header {
//     padding-bottom: 68px;
//   }
// }
// @media (max-width: 940px) {
//   .user-detail-header {
//     padding-bottom: 68px;
//   }
// }

@media (max-width: 1180px) {
  .user-detail-header {
    padding-bottom: 68px;
    .action {
      bottom: -24px;
      left: 0;
    }
  }
}

@media (max-width: 1024px) {
  .user-detail-header {
    padding-bottom: 68px;

    .action {
      bottom: -24px;
      left: 0;
    }
  }
}
</style>
