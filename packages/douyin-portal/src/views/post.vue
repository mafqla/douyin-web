<script setup lang="ts">
import { uploadVideo } from '@/service/videos/videos'
import { ref } from 'vue'

//视频上传接口
const upload = async (
  video: any,
  title: any,
  desciption: any,
  cover: any,
  status: any
) => {
  const formData = uploadVideo(video, title, desciption, cover, status)
}
const textarea = ref('')
</script>
<template>
  <div class="post">
    <el-upload
      class="upload-demo"
      drag
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
    >
      <el-icon class="el-icon--upload">
        <svg width="30" height="23" viewBox="0 0 30 23" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22.786 6.744a8.667 8.667 0 10-16.884 3.938 6 6 0 00.432 11.985h15.333a8 8 0 001.12-15.923zm-7.359.278a.667.667 0 00-.854 0l-6.865 5.722c-.24.2-.099.59.213.59h4.413v6c0 .367.298.666.666.666h4a.667.667 0 00.667-.667v-6h4.413c.311 0 .453-.39.213-.59l-6.866-5.72z"
            fill="#9B9EA0"
          ></path>
        </svg>
      </el-icon>
      <div class="el-upload__text">
        点击上传 <em>或直接将视频文件拖入此区域</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          为了更好的观看体验和平台安全，平台将对上传的视频预审。超过40秒的视频建议上传横版视频
        </div>
      </template>
    </el-upload>
    <div class="info--qElns">
      <div class="info-item--1S8MG">
        <p class="title--1cW8N">视频格式</p>
        <p class="desc--1MyNZ">支持常用格式，推荐使用mp4、webm</p>
      </div>
      <div class="info-item--1S8MG">
        <p class="title--1cW8N">视频大小</p>
        <p class="desc--1MyNZ">视频文件大小不超过16G，时长在60分钟以内</p>
      </div>
      <div class="info-item--1S8MG">
        <p class="title--1cW8N">视频分辨率</p>
        <p class="desc--1MyNZ">分辨率为720p（1280x720）及以上</p>
      </div>
    </div>
  </div>

  <div class="post-x">
    <div class="post-c">
      <h2 class="title">发布视频</h2>
      <el-input
        v-model="textarea"
        maxlength="500"
        placeholder="写一个合适的标题，能让更多人看到"
        show-word-limit
        type="textarea"
        class="textarea"
      />

      <div class="title--1is25 title-upload">
        <p class="title-main--26LgI">设置封面</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.post {
  width: 100%;
  height: 100%;
  position: relative;

  .upload-demo {
    height: 360px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    background: rgba(46, 50, 56, 0.05);
    border: 1px dashed rgba(28, 31, 35, 0.08);
    margin-top: 18px;
    .el-icon--upload {
      width: 30px;
      height: 23px;
      margin-bottom: 10px;
    }
    .el-upload__text,
    em {
      margin-top: 14px;
      line-height: 25px;
      font-weight: bold;
      color: rgba(28, 31, 35, 0.8);
      font-size: 14px;
    }
    .el-upload__tip {
      font-size: 12px;
      color: #9b9ea0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  :deep(.el-upload-dragger) {
    border: none;
    background-color: transparent;
  }

  .info--qElns {
    width: 100%;
    display: flex;
    margin-top: 8px;

    .info-item--1S8MG {
      flex: 1;
      background: rgba(46, 50, 56, 0.05);
      border-radius: 4px;
      height: 72px;
      flex-direction: column;
      margin-right: 10px;
      align-items: left;
      padding: 16px;
      .title--1cW8N {
        font-style: normal;
        font-weight: normal;
        line-height: 20px;
        font-weight: bold;
        font-size: 14px;
        color: rgba(28, 31, 35, 0.9);
        text-align: left !important;
        margin-bottom: 2px;
      }
      .desc--1MyNZ {
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 17px;
        color: rgba(28, 31, 35, 0.55);
        color: rgba(28, 31, 35, 0.55);
        text-align: left !important;
      }
    }
  }
}

.post-x {
  display: flex;
  justify-content: center;
  align-items: center;

  .post-c {
    width: 552px;
    margin-top: 60px;

    .title {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 33px;
      color: rgba(28, 31, 35, 0.9);
      margin-bottom: 16px;
    }

    .textarea {
      width: 100%;
      height: 112px;
      border-radius: 4px;
      background: rgba(46, 50, 56, 0.05);
      border: 1px solid rgba(28, 31, 35, 0.08);
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 20px;
      color: rgba(28, 31, 35, 0.9);
      resize: none;

      :deep(.el-textarea__inner) {
        background: transparent;
        border: none;
        height: 112px;
      }
    }
  }
}
</style>
