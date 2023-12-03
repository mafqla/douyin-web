<script setup lang="ts">
import {} from 'vue'

const props = defineProps({
  srcd: String,
  username: String,
  time: String,
  comment: String,
  likenum: Number
})
</script>
<template>
  <div class="comment-item">
    <div class="comment-item-avatar">
      <a href="#" class="comment-item-avatar-link">
        <div class="avatar-container">
          <img :src="props.srcd" alt="笙歌落头像" class="img" />
        </div>
      </a>
    </div>
    <div class="comment-item-content">
      <div class="comment-item-index">
        <div class="comment-item-info-wrap">
          <div class="comment-item-content-header-name">
            <a href="#" class="header-name-link">
              <span class="header-name-text">{{ props.username }}</span>
            </a>
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
            <div class="header-more-text"></div>
          </div>
        </div>
        <p class="comment-item-content-text">
          <span class="comment-item-content-text-text">
            {{ props.comment }}
          </span>
        </p>
        <div class="comment-item-content-time">
          <span class="comment-item-content-time-text">{{ props.time }}</span>
          <span class="comment-item-content-address-text">江苏</span>
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

            <div class="comment-item-content-footer-reply">
              <div class="footer-reply-content">
                <svg-icon icon="small-reply" class="icon" />
                <span>回复</span>
              </div>
            </div>
          </div>
        </div>

        <!-- <comment-expand /> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  margin-top: 9px;
  position: relative;

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
            // color: rgba(22, 24, 35, 0.6);
            color: rgba(255, 255, 255, 0.5);
            line-height: 20px;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            .header-name-text {
              // color: rgba(22, 24, 35, 0.6);
              color: rgba(255, 255, 255, 0.5);
              font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
              // font-size: 12px;
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
          opacity: 0;
          width: 14px;
          display: inline;
          position: relative;

          .header-more-text {
            font-size: 18px;
            font-weight: 500;
            height: 21px;
            width: 13px;

            color: rgba(22, 24, 35, 0.34);
          }
        }

        &:hover {
          .comment-item-content-header-more {
            opacity: 1;
          }
        }
      }

      .comment-item-content-text {
        position: relative;
        text-align: justify;
        word-break: break-all;

        .comment-item-content-text-text {
          margin-top: 8px;
          font-size: 13px;
          // color: #161823;
          color: rgba(255, 255, 255, 0.9);
          // font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
          // font-size: 14px;
          font-weight: 400;
          line-height: 22px;
        }
      }
      .comment-item-content-time {
        // color: rgba(22, 24, 35, 0.6);
        color: rgba(255, 255, 255, 0.5);
        font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
        position: relative;
        .comment-item-content-time-text {
          margin-right: 8px;
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            margin: 0 3px;
            background-color: rgba(255, 255, 255, 0.5);
          }
        }
        .comment-item-content-address-text {
        }
      }
      .comment-item-content-footer {
        position: relative;

        .comment-footer-content {
          flex-direction: row-reverse;
          justify-content: flex-end;

          align-items: center;
          // color: rgba(22, 24, 35, 0.6);
          color: rgba(255, 255, 255, 0.5);
          display: flex;
          font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
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
          // color:rgba(22, 24, 35, 0.6);
          color: rgba(255, 255, 255, 0.5);
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
