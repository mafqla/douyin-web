<script setup lang="ts">
import { ref } from 'vue'
import { ElEmpty } from 'element-plus'
import { videoStore } from '@/stores/videos'
const activeName = ref('videos')
const handleClick = (tab: any) => {
  console.log(tab)
}
</script>
<template>
  <div class="user-history">
    <template v-if="videoStore().isEmpty.record">
      <el-empty
        image="https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/image/EmptySearch.19da93c9.png"
        description="暂无内容"
      />
    </template>
    <template v-else>
      <div class="user-history-list">
        <el-tabs v-model="activeName" @tab-click="handleClick(activeName)">
          <el-tab-pane label="视频" name="videos">
            <video-list :videoList="videoStore().userRecordVideos" />
          </el-tab-pane>
          <el-tab-pane label="影视综" name="entertainment">
            <entertainment />
          </el-tab-pane>
          <!-- <el-tab-pane>
            <div class="OiLwyYXX">
              <div class="TUBbFcH5">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class=""
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 2a3 3 0 00-3 3v2H5.5a2.5 2.5 0 00-.323 4.98l-.996 6.727A2 2 0 006.159 21h11.682a2 2 0 001.978-2.293l-.996-6.728A2.5 2.5 0 0018.5 7H15V5a3 3 0 00-3-3zm1 5V5a1 1 0 10-2 0v2h2zm3.804 5H7.196L6.16 19h2.008l.669-4.014a1 1 0 111.972.33L10.194 19h1.973l.669-4.014a1 1 0 111.972.33L14.194 19h3.647l-1.037-7zM5 9.5a.5.5 0 01.5-.5h13a.5.5 0 010 1h-13a.5.5 0 01-.5-.5z"
                    fill="#2F3035"
                    fill-opacity="0.4"
                    opacity="0.5"
                  ></path>
                </svg>
                <div class="U9iddXEL">清除历史</div>
              </div>
              <div class="NRiH5zYV vQ9j2nLk">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.999 4A7.998 7.998 0 004 11.999a7.998 7.998 0 007.999 7.999 7.998 7.998 0 007.999-7.999A7.998 7.998 0 0011.999 4zm.89 13.332h-1.78v-1.778h1.78v1.778zm2.024-5.798c-.87 1.327-2.007 1.52-2.007 3.129H11.1v-.526c-.033-1.016.44-1.84 1.366-2.47.96-.702 1.278-.901 1.278-1.88 0-1.063-1.04-1.355-1.759-1.355-1.202 0-1.764.925-1.764 1.796l-1.771-.005c0-2.555 1.954-3.55 3.963-3.55 1.886 0 3.139 1.408 3.14 2.733.003.842-.171 1.442-.64 2.128z"
                    fill="#2F3035"
                    fill-opacity="0.4"
                    opacity="0.4"
                  ></path>
                </svg>
              </div>
            </div>
          </el-tab-pane> -->
        </el-tabs>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.user-history {
  width: 100%;
  height: 100%;
  :deep(.el-empty__image) {
    background-size: 100% 100%;
    height: 158px;
    width: 236px;
  }
  :deep(.el-empty__description) {
    p {
      // color: rgba(22, 24, 35, 1);
      color: #161823;
      font-family: sans-serif -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue;
      font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
      font-size: 18px;
      font-weight: 500;
      line-height: 26px;
    }
  }

  .user-history-list {
    margin-top: 12px;
    position: relative;

    :deep(.el-tabs__header) {
      align-items: center;
      background-color: var(--color-bg-b0);
      // background-color: rgba(255, 255, 255, 1);
      display: flex;
      height: 40px;
      justify-content: space-between;
      margin-bottom: 4px;
      position: relative;
      width: 100%;
      border: none;

      .el-tabs__item {
        font-size: 13px;
        line-height: 21px;

        &::before {
          // background: #f2f2f4;
          background: rgba(242, 242, 243, 1);
          content: '';
          height: 16px;
          left: -2px;
          position: absolute;
          top: 4px;
          width: 1px;
        }
        &:first-child::before {
          display: none;
        }
      }
    }
  }
}
</style>
