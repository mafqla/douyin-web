<script setup lang="ts">
import formatTime from '@/utils/date-format'
import { handleCommentParser } from '@/utils/commentParser'
import DyInput from '@/components/common/dy-input/index.vue'
import { computed, ref, watchEffect } from 'vue'

interface IimageList {
  origin_url: {
    url: string
  }
  thumb_url: {
    uri: string
  }
  medium_url: {
    uri: string
  }
}
const props = defineProps({
  uid: Number,
  srcd: String,
  username: String,
  time: String,
  comment: String,
  likenum: Number,
  address: String,
  imageList: Array<IimageList>
})
//子评论列表
const replyCommentList = ref([]) as any

const isOpenAvatar = ref(false)
const openAvatar = () => {
  isOpenAvatar.value = true
}
//回复用户
//输入框的值
const comment = ref('')
watchEffect(() => {
  console.log('textValue', comment.value)
})
const isOpenInput = ref(false)
const replyText = computed(() => {
  return isOpenInput.value ? '回复中' : '回复'
})
const replyUser = (uid: Number, username: String) => {
  console.log('replyUser', uid, username)
}
const handleSubmit = (data: string) => {
  console.log('handleSubmit', data)
}

// 实现展开评论
const isOpenExpand = ref(false)
const noMore = ref(false)

const onExpand = () => {
  isOpenExpand.value = true
  console.log('onExpand')
  noMore.value = true
}

const onCollapse = () => {
  isOpenExpand.value = false
  noMore.value = false
  console.log('onCollapse')
}
</script>
<template>
  <div class="comment-item">
    <dy-avatar
      userLink="//www.douyin.com/user/MS4wLjABAAAAqy1OO-UP9J2LJ1xSg_lsryKCicbLFLGzBgTRRT4W14Y"
      :src="props.srcd"
      size="small"
      class="comment-item-avatar"
    />
    <div class="comment-item-content">
      <div class="comment-item-index" :class="{ oninput: isOpenInput }">
        <div class="comment-item-info-wrap">
          <div class="comment-item-content-header-name">
            <a href="#" class="header-name-link">
              <span class="header-name-text">{{ props.username }}</span>
            </a>
            <comment-item-tag tag="作者" style="background: rgb(254, 44, 85)" />
          </div>
          <div class="comment-item-content-header-more">
            <el-popover :show-arrow="false" placement="bottom-end">
              <template #reference>
                <div class="header-more-text">...</div>
              </template>
              <template #default>
                <div class="video-report">
                  <div class="video-report-text">举报</div>
                </div>
              </template>
            </el-popover>
          </div>
        </div>
        <div class="comment-item-content-text">
          <span class="comment-item-content-text-text">
            <span v-html="handleCommentParser(props.comment ?? '')"> </span>
            <div class="comment-img-list" v-if="props.imageList">
              <div class="img-box" v-for="item in props.imageList">
                <div class="img-inner" :key="item.origin_url.url">
                  <img
                    :src="item.thumb_url.uri"
                    alt=""
                    width="100%"
                    height="100%"
                    @click="openAvatar"
                  />
                </div>
                <modal
                  :open="isOpenAvatar"
                  :isShowClose="true"
                  @close="isOpenAvatar = false"
                >
                  <img
                    class="comment-img-modal"
                    style="max-width: 70%; max-height: 90%; border-radius: 4px"
                    :src="item.medium_url.uri"
                  />
                </modal>
              </div>
            </div>
          </span>
        </div>
        <div class="comment-item-content-time">
          <span class="comment-item-content-time-text">
            {{ formatTime(props.time ?? '') }}
            ·
            {{ props.address }}
          </span>
        </div>
        <div class="comment-item-content-footer">
          <div class="comment-footer-content">
            <div class="comment-item-content-footer-like">
              <p class="like">
                <svg-icon icon="small-like" class="icon" />
                <span>{{ props.likenum }}</span>
              </p>
              <p class="dislike">
                <svg-icon icon="small-dislike" class="icon" />
              </p>
            </div>
            <div class="comment-item-content-footer-share">
              <div class="footer-share-content">
                <svg-icon icon="small-share" class="icon" />
                <span>分享</span>
              </div>
            </div>

            <div
              class="comment-item-content-footer-reply"
              @click="isOpenInput = !isOpenInput"
            >
              <div class="footer-reply-content">
                <svg-icon icon="small-reply" class="icon" />
                <span>{{ replyText }}</span>
              </div>
            </div>
          </div>
          <div class="reply-input" v-if="isOpenInput">
            <dy-input @update:value="comment = $event" @submit="handleSubmit" />
          </div>
        </div>
      </div>

      <div class="comment-item-reply">
        <template v-for="item in replyCommentList">
          <div class="comment-item-index" :class="{ oninput: isOpenInput }">
            <div class="comment-item-info-wrap">
              <div class="comment-item-content-header-name">
                <a href="#" class="header-name-link">
                  <span class="header-name-text">{{ item.username }}</span>
                </a>
                <comment-item-tag
                  tag="作者"
                  style="background: rgb(254, 44, 85)"
                />
                <div
                  class="comment-item-reply-line"
                  style="
                    border-top-width: 4px;
                    border-bottom-width: 4px;
                    border-left-width: 5px;
                    border-left-color: rgba(255, 255, 255, 0.6);
                  "
                ></div>
              </div>
              <div class="comment-item-content-header-more">
                <el-popover :show-arrow="false" placement="bottom-end">
                  <template #reference>
                    <div class="header-more-text">...</div>
                  </template>
                  <template #default>
                    <div class="video-report">
                      <div class="video-report-text">举报</div>
                    </div>
                  </template>
                </el-popover>
              </div>
            </div>
            <div class="comment-item-content-text">
              <span class="comment-item-content-text-text">
                <span v-html="handleCommentParser(item.comment ?? '')"> </span>
                <div class="comment-img-list" v-if="item.imageList">
                  <div class="img-box" v-for="it in item.imageList">
                    <div class="img-inner" :key="it.origin_url.url">
                      <img
                        :src="it.thumb_url.uri"
                        alt=""
                        width="100%"
                        height="100%"
                        @click="openAvatar"
                      />
                    </div>
                    <modal
                      :open="isOpenAvatar"
                      :isShowClose="true"
                      @close="isOpenAvatar = false"
                      class=""
                    >
                      <img
                        class="comment-img-modal"
                        style="
                          max-width: 70%;
                          max-height: 90%;
                          border-radius: 4px;
                        "
                        :src="it.medium_url.uri"
                      />
                    </modal>
                  </div>
                </div>
              </span>
            </div>
            <div class="comment-item-content-time">
              <span class="comment-item-content-time-text">
                {{ formatTime(item.time ?? '') }}
                ·
                {{ item.address }}
              </span>
            </div>
            <div class="comment-item-content-footer">
              <div class="comment-footer-content">
                <div class="comment-item-content-footer-like">
                  <p class="like">
                    <svg-icon icon="small-like" class="icon" />
                    <span>{{ props.likenum }}</span>
                  </p>
                  <p class="dislike">
                    <svg-icon icon="small-dislike" class="icon" />
                  </p>
                </div>
                <div class="comment-item-content-footer-share">
                  <div class="footer-share-content">
                    <svg-icon icon="small-share" class="icon" />
                    <span>分享</span>
                  </div>
                </div>

                <div
                  class="comment-item-content-footer-reply"
                  @click="isOpenInput = !isOpenInput"
                >
                  <div class="footer-reply-content">
                    <svg-icon icon="small-reply" class="icon" />
                    <span>{{ replyText }}</span>
                  </div>
                </div>
              </div>
              <div class="reply-input" v-if="isOpenInput">
                <dy-input
                  @update:value="comment = $event"
                  @submit="handleSubmit"
                />
              </div>
            </div>
          </div>
        </template>
        <comment-expand
          :isExpanded="isOpenExpand"
          :noMore="noMore"
          @onExpand="onExpand"
          @onCollapse="onCollapse"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  margin-top: 9px;
  position: relative;

  &:hover {
    .comment-item-content-header-more {
      opacity: 1 !important;
    }
  }

  .comment-item-avatar {
    margin-right: 8px;
    cursor: pointer;
    // margin-right: 12px;
    z-index: 1;
    .comment-item-avatar-link {
      position: relative;
      .avatar-container {
        height: 32px;
        margin-top: 4px;
        width: 32px;

        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        border-radius: 50%;
        box-sizing: content-box;
        flex-grow: 0;
        flex-shrink: 0;
        overflow: hidden;
        position: relative;
        .img {
          border-radius: 50%;
          height: 100%;
          position: relative;
          width: 100%;
        }
      }
    }
  }

  .comment-item-content {
    flex-grow: 1;
    width: 0;
    .comment-item-index {
      padding: 4px 0;
      position: relative;

      &.oninput {
        background: var(--input-linear);
      }
      .comment-item-info-wrap {
        align-items: center;
        display: flex;
        margin-bottom: 4px;
        .comment-item-content-header-name {
          align-items: center;
          display: flex;
          flex: 1 1;
          margin-right: 12px;
          overflow: hidden;
          position: relative;
          .header-name-link {
            max-width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--color-text-t3);
            margin-right: 8px;
            line-height: 20px;
            overflow: hidden;
            .header-name-text {
              color: var(--color-text-t3);
              font-size: 13px;
              font-weight: 400;
              line-height: 20px;
            }
          }

          .comment-item-reply-line {
            border: 8px solid transparent;
            border-left: 10px solid #000;
            border-right: none;
            display: inline-block;
            height: 0;
            vertical-align: middle;
            width: 0;

            margin: 0 8px;
          }
        }
        .comment-item-content-header-more {
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          display: inline;
          position: relative;
          width: 14px;
          opacity: 0;

          .header-more-text {
            color: var(--color-text-t4);
            border-radius: 8px;
            font-size: 16px;
          }
        }

        .video-report {
          background: var(--color-bg-b1);
          width: 95px;
          color: var(--color-text-t1);
          height: 38px;
          cursor: pointer;
          z-index: 1000;
          border-radius: 12px;
          justify-content: center;
          align-items: center;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          display: flex;
          position: absolute;
          top: 22px;
          left: -80px;
          box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          padding: 8px;

          position: absolute;
          inset: 0px auto auto 0px;
          transform: translate3d(-82.6667px, 20.6667px, 0px);
        }
        .video-report-text {
          color: var(--color-text-t1);
          white-space: nowrap;
          padding: 4px 8px;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
        }
      }
      .comment-item-content-text {
        position: relative;
        text-align: justify;
        word-break: break-all;

        .comment-item-content-text-text {
          margin-top: 8px;
          font-size: 13px;
          color: var(--color-text-t1);
          font-weight: 400;
          line-height: 22px;
        }

        :deep(img) {
          width: 16px;
          height: 16px;
          vertical-align: text-bottom;
          margin: 0 4px;
          position: relative;
          top: -2px;
        }
        :deep(.header-name-link) {
          margin-left: 2px;
          margin-right: 2px;

          &:hover {
            text-decoration: underline;
          }
        }

        .comment-img-list {
          display: flex;
          .img-box {
            width: 90px;
            height: 120px;
            .img-inner {
              position: relative;
              img {
                width: 90px;
                height: 120px;
                cursor: zoom-in;
                justify-content: flex-start;
                border-radius: 8px;
              }
            }
          }
        }
      }
      .comment-item-content-time {
        color: var(--color-text-t3);
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        position: relative;
        .comment-item-content-time-text {
          margin-right: 8px;
          // &::after {
          //   content: '';
          //   position: absolute;
          //   top: 50%;
          //   width: 2px;
          //   height: 2px;
          //   border-radius: 50%;
          //   margin: 0 3px;
          //   background-color: rgba(255, 255, 255, 0.5);
          // }
        }
      }
      .comment-item-content-footer {
        position: relative;

        .comment-footer-content {
          flex-direction: row-reverse;
          justify-content: flex-end;

          align-items: center;
          color: var(--color-text-t3);
          display: flex;
          font-size: 12px;
          font-weight: 500;
          height: 20px;
          line-height: 20px;
          margin-top: 11px;
        }
        .comment-item-content-footer-like {
          display: flex;
          margin-left: 10px;

          .like {
            span {
              font-size: 12px;
              margin-top: 1px;
            }
          }
          .dislike {
            margin-right: 2px;
          }

          .like,
          .dislike {
            align-items: center;
            cursor: pointer;
            display: flex;
            justify-content: center;
            margin-right: 10px;
          }
        }
        .comment-item-content-footer-reply,
        .comment-item-content-footer-share {
          position: relative;

          .footer-reply-content,
          .footer-share-content {
            align-items: center;
            cursor: pointer;
            display: flex;
            // margin-left: 0;

            span {
              font-size: 12px;
            }
          }
        }

        .footer-share-content {
          margin-left: 10px;
        }

        .icon {
          width: 20px;
          height: 20px;
          color: var(--color-text-t3);
          opacity: 0.9;
        }

        .reply-input {
          margin-top: 17px;
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style>
