<script setup lang="ts">
import { attention } from '@/service/attention'
import { ref, watchEffect } from 'vue'

const props = defineProps({
  connect: String
})
const connect = ref(props.connect)
const emit = defineEmits(['close'])
//搜索框边距
const margin = ref(0)
//排序
const sort = ref('综合排序')
const sortList = ['综合排序', '最近关注', '最早关注']
//是否显示排序
const isShowSort = ref(false)
const handleSort = (type: string) => {
  sort.value = type
  isShowSort.value = false
}

//切换选项卡
const handleTab = (type: string) => {
  connect.value = type
}
watchEffect(() => {
  console.log(sort.value)
  if (connect.value === 'attent') {
    margin.value = 24
  } else {
    margin.value = 0
  }
})

//关注
const isAttention = ref(true)
const handleAttention = async (id: number) => {
  await attention(id)
  isAttention.value = !isAttention.value
}

// 是否显示
const isPopup = ref(false)
const handlePopup = () => {
  isPopup.value = !isPopup.value
}
</script>
<template>
  <div class="user-connections-popup">
    <div class="close" @click="$emit('close')">
      <svg
        width="36"
        height="36"
        fill="#A9AAB7"
        xmlns="http://www.w3.org/2000/svg"
        class="u1O5vnab"
        viewBox="0 0 36 36"
      >
        <path
          d="M22.133 23.776a1.342 1.342 0 101.898-1.898l-4.112-4.113 4.112-4.112a1.342 1.342 0 00-1.898-1.898l-4.112 4.112-4.113-4.112a1.342 1.342 0 10-1.898 1.898l4.113 4.112-4.113 4.113a1.342 1.342 0 001.898 1.898l4.113-4.113 4.112 4.113z"
          fill="#0A0C20"
        ></path>
      </svg>
    </div>
    <div class="tab">
      <div class="content">
        <div class="tab-stats">
          <div
            class="tab-stats-text"
            :class="{ active: connect === 'attent' }"
            @click="handleTab('attent')"
          >
            关注({{ 0 }})
          </div>
          <div
            class="tab-stats-text"
            :class="{ active: connect === 'fans' }"
            @click="handleTab('fans')"
          >
            粉丝({{ 0 }})
          </div>
        </div>
        <div class="bottom-border"></div>
        <div class="input">
          <div class="input-content" :style="{ marginRight: `${margin}px` }">
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="search-icon"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11 5.333a5.667 5.667 0 103.237 10.319l2.723 2.722a1 1 0 001.414-1.415l-2.722-2.722A5.667 5.667 0 0011 5.333zM7.333 11a3.667 3.667 0 117.334 0 3.667 3.667 0 01-7.334 0z"
                fill="#2F3035"
                fill-opacity="0.4"
              ></path>
            </svg>
            <input
              class="input-text"
              type="text"
              placeholder="搜索用户名字或抖音号"
            />
          </div>
          <div
            class="sort"
            v-show="connect === 'attent'"
            @mouseenter="isShowSort = true"
          >
            <svg
              width="16"
              height="14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="sort-icon"
            >
              <path
                d="M.894 12.648H8.48a.812.812 0 00.785-.816.806.806 0 00-.785-.785H.894a.798.798 0 00-.815.785.798.798 0 00.785.816h.03zm0-4.934H8.48a.796.796 0 00.785-.806.806.806 0 00-.785-.785H.894a.796.796 0 00-.02 1.59h.02zm0-4.935H8.48a.796.796 0 00.785-.805.806.806 0 00-.785-.785H.894a.796.796 0 000 1.59zm11.948-1.437a.796.796 0 00-1.59 0v11.153a.793.793 0 001.264.642l3.059-2.232a.8.8 0 00.193-1.112.8.8 0 00-1.111-.193c-.01 0-.01.01-.02.01l-1.795 1.305V1.342z"
                fill="#2F3035"
                fill-opacity="0.9"
              ></path>
            </svg>
            <span class="sort-text">{{ sort }}</span>
            <ul
              class="sort-list"
              v-show="isShowSort"
              @mouseleave="isShowSort = false"
            >
              <li
                v-for="(option, index) in sortList"
                :key="index"
                @click="handleSort(option)"
              >
                {{ option }}
              </li>
            </ul>
          </div>
        </div>

        <div class="user-fans-container">
          <div>
            <div class="list-item">
              <div class="list-avatar">
                <a
                  href="//www.douyin.com/user/MS4wLjABAAAAISMJwLxAdIyVnQkkPT9Rv1PRzBraeitmytvKlmZWhmE"
                  class="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div class="avatar-component size" data-e2e="live-avatar">
                    <img
                      src="//p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_bc601ef2bf2e2e10a18325c426183525"
                      alt="赵露思头像"
                      class="avatar-img"
                    />
                  </div>
                </a>
              </div>
              <div class="list-info">
                <div class="list-info-top">
                  <div class="list-info-name">
                    <a
                      href="//www.douyin.com/user/MS4wLjABAAAAISMJwLxAdIyVnQkkPT9Rv1PRzBraeitmytvKlmZWhmE"
                      class="link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="name-text">赵露思</span>
                    </a>
                  </div>
                  <div class="list-info-type">
                    <span class="type-icon"></span>
                    <span class="type-text">演员</span>
                  </div>
                </div>
                <div class="list-info-signature">
                  <span class="signature-text">微博：赵露思的微博</span>
                </div>
              </div>

              <div class="list-action attention">
                <button
                  class="content-btn"
                  :class="{ follow: !isAttention }"
                  @click="handleAttention(1)"
                >
                  <div class="btn-text">
                    {{ isAttention ? '已关注' : '关注' }}
                  </div>
                </button>
                <button
                  class="content-btn"
                  :class="{
                    popup: isPopup
                  }"
                  v-show="connect === 'fans'"
                >
                  <div
                    class="btn"
                    :class="{ btnPopup: isPopup }"
                    @click="handlePopup"
                  >
                    <div class="text">移除</div>
                  </div>

                  <div class="pop-up-content" v-show="isPopup">
                    <div class="pop-up-content-btn">
                      <span class="btn-true" @click="handlePopup"
                        >确认移除</span
                      >
                      <div class="split-line"></div>
                      <span class="btn" @click="handlePopup">取消</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="list-bottom" v-show="!isPopup"></div>

            <div class="list-item">
              <div class="list-avatar">
                <a
                  href="//www.douyin.com/user/MS4wLjABAAAAISMJwLxAdIyVnQkkPT9Rv1PRzBraeitmytvKlmZWhmE"
                  class="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div class="avatar-component size" data-e2e="live-avatar">
                    <img
                      src="//p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_bc601ef2bf2e2e10a18325c426183525"
                      alt="赵露思头像"
                      class="avatar-img"
                    />
                  </div>
                </a>
              </div>
              <div class="list-info">
                <div class="list-info-top">
                  <div class="list-info-name">
                    <a
                      href="//www.douyin.com/user/MS4wLjABAAAAISMJwLxAdIyVnQkkPT9Rv1PRzBraeitmytvKlmZWhmE"
                      class="link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="name-text">赵露思</span>
                    </a>
                  </div>
                  <div class="list-info-type">
                    <span class="type-icon-2"></span>
                    <span class="type-text">演员</span>
                  </div>
                </div>
                <div class="list-info-signature">
                  <span class="signature-text">微博：赵露思的微博</span>
                </div>
              </div>

              <div class="list-action attention">
                <button
                  class="content-btn"
                  :class="{ follow: !isAttention }"
                  @click="handleAttention(1)"
                >
                  <div class="btn-text">
                    {{ isAttention ? '相互关注' : '关注' }}
                  </div>
                </button>
                <button
                  class="content-btn"
                  :class="{
                    popup: isPopup
                  }"
                >
                  <div
                    class="btn"
                    :class="{ btnPopup: isPopup }"
                    @click="handlePopup"
                  >
                    <div class="text">移除</div>
                  </div>

                  <div class="pop-up-content" v-show="isPopup">
                    <div class="pop-up-content-btn">
                      <span class="btn-true" @click="handlePopup"
                        >确认移除</span
                      >
                      <div class="split-line"></div>
                      <span class="btn" @click="handlePopup">取消</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div class="list-bottom" v-show="!isPopup"></div>
            <div class="tip" v-show="isPopup">
              <div class="tip-content">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8 16A8 8 0 108 0a8 8 0 000 16zM7 3.678C7 3.301 7.41 3 7.924 3h.205c.514 0 .924.301.924.678v5.343c0 .377-.41.679-.924.679h-.205C7.411 9.7 7 9.398 7 9.02V3.678zm.3 8.878a.95.95 0 01-.3-.683.95.95 0 01.3-.684 1.073 1.073 0 011.453 0c.19.179.3.43.3.684a.95.95 0 01-.3.683 1.073 1.073 0 01-1.452 0z"
                    fill="#C4C4C4"
                  ></path>
                </svg>
                <span
                  >移除粉丝后对方将不再关注你，且不会收到通知，你也不会被推荐给对方</span
                >
              </div>
              <div class="list-bottom"></div>
            </div>
          </div>

          <div class="nomore">暂时没有更多了</div>
        </div>
        <div class="mask-bg"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-connections-popup {
  animation: user-scale 0.4s cubic-bezier(0.34, 0.69, 0.1, 1),
    fade-in 0.2s linear;
  background: var(--color-bg-b1);
  border-radius: 4px;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
  padding: 36px 40px;
  position: relative;
  z-index: 10;
}

.close {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
  svg path {
    fill: var(--color-text-t2);
  }
}

.tab {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  .content {
    display: flex;
    flex-direction: column;
    height: 672px;
    margin-bottom: -14px;
    margin-top: -10px;
    max-height: calc(100vh - 144px);
    width: 560px;

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

        &.active,
        &:hover {
          color: var(--color-text-t1);
        }
      }
    }

    .input {
      display: flex;
      margin: 12px 0;
      .input-content {
        align-items: center;
        background: var(--color-secondary-default);
        border-radius: 4px;
        display: flex;
        flex: 1 1;
        height: 32px;
        transition: all 0.3s;
        .search-icon {
          margin-left: 6px;
          path {
            fill: var(--color-text-t4);
          }
        }
        .input-text {
          background: var(--color-tertiary-default);
          border: none;
          border-radius: 4px;
          color: var(--color-text-t1);
          flex: 1 1;
          height: 32px;

          //去除点击时的蓝色边框
          outline: none;
          &::placeholder {
            color: rgb(117, 117, 117);
            text-overflow: inherit;
            white-space-collapse: preserve;
            text-wrap: nowrap;
            overflow-wrap: normal;
            line-height: initial !important;
            -webkit-user-modify: read-only !important;
            overflow: hidden;
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
          }
        }

        &:hover {
          .sort-icon {
            path {
              fill: var(--color-primary-hover);
            }
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

.user-fans-container {
  margin: 0 -34px -20px;
  overflow-x: hidden;
  overflow-y: scroll;
  padding: 0 28px 0 40px;

  .list-item {
    align-items: center;
    display: flex;
    margin: 17px 0;
  }
  .list-avatar {
    .link {
      position: relative;
    }
    .avatar-component {
      border: 1px solid var(--color-line-l3) !important;
      border-radius: 50%;
      box-sizing: content-box;
      flex-grow: 0;
      flex-shrink: 0;
      overflow: hidden;
      position: relative;

      .avatar-img {
        height: 100%;
        position: relative;
        width: 100%;
        border-radius: 50%;
      }
    }
    .size {
      height: 60px;
      width: 60px;
    }
  }

  .list-info {
    flex: 1 1;
    margin: 0 12px;
    width: 0;

    .list-info-top {
      display: flex;
      margin: 4px 0;

      .list-info-name {
        color: var(--color-text-t1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

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
          }
        }
      }
      .list-info-type {
        flex: 1 1;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        min-width: 45px;
        overflow: hidden;
        white-space: nowrap;

        align-items: center;
        display: flex;
        // flex-shrink: 0;
        justify-content: flex-start;
        margin-left: 16px;

        .type-icon {
          height: 16px;
          width: 16px;
          background: var(--type-icon-1) no-repeat 50% / contain;
        }
        .type-icon-2 {
          height: 16px;
          width: 16px;
          background: var(--type-icon-2) no-repeat 50% / contain;
        }
        .type-text {
          color: var(--color-text-t3);
          flex: 1 1;
          font-size: 12px;
          font-weight: 400;
          line-height: 20px;
          margin-left: 4px;
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
        color: var(--color-text-t1);

        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .list-action {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 168px;

    &.attention {
      width: unset;
    }

    .content-btn {
      min-width: unset;
      opacity: 1;
      transition: all 0.2s;
      width: 68px;

      background-color: var(--secondary-bg-color);
      color: var(--color-text-t3);

      border-radius: 4px;
      font-size: 14px;
      height: 32px;

      align-items: center;
      border: 0;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      margin: 0 8px;
      outline: none;
      padding: 0 16px;
      position: relative;

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

      .btn-text {
        font-size: 14px;
        font-weight: 500;
        min-width: 56px;
      }
      .btn {
        .text {
          font-size: 14px;
          font-weight: 500;
          min-width: 36px;
        }
        &.btnPopup {
          opacity: 0;
          transition: all 0.2s;
          width: 0;
          overflow: hidden;
        }
      }

      &.popup {
        min-width: 68px;
        width: unset;
      }
      .pop-up-content {
        align-items: center;
        display: flex;
        transition: all 0.2s;
        width: 120px;
        .pop-up-content-btn {
          display: flex;

          font-weight: 500;
          min-width: 120px;

          .btn-true,
          .btn {
            opacity: 1;
            transition: all 0.2s;
          }
          .btn-true {
            color: #ff2c55;
            font-size: 14px;
          }
          .btn {
            font-size: 14px;
          }
          .split-line {
            opacity: 1;
            transition: all 0.2s;
            background-color: #c9c9cc;
            display: block;
            height: 11px;
            margin: 4px 17px 0 17px;
            position: relative;
            width: 1px;
          }
        }
      }
    }
  }

  .list-bottom {
    background-color: var(--color-line-l3);
    height: 1px;
    min-height: 1px;
    position: relative;
    width: 100%;
  }

  .tip {
    transition: height 0.3s;
    .tip-content {
      height: 41px;
      margin: -8px 8px 12px 0;

      align-items: center;
      background: var(--color-bg-b3);
      border-radius: 4px;
      display: flex;
      // height: 0;
      justify-content: center;
      transition: height 0.3s;

      svg {
        path {
          fill: var(--color-text-t3);
        }
      }

      span {
        color: var(--color-text-t3);

        font-weight: 400;
        margin-left: 10px;
      }
    }
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
