<script setup lang="ts">
import SearchSuggestion from '@/components/common/search-suggestion.vue'
import DyAvatar from '@/components/common/dy-avatar.vue'
import DyInput from '@/components/common/dy-input/index.vue'

const list = [
  {
    id: 1,
    user: {
      userAvatar:
        'https://p3-pc-sign.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?x-expires=1712570400&x-signature=sHygsuEx4uBSOb8ErbKxTlqV8b8%3D&from=2480802190',
      username: '笙歌落'
    },
    address: '北京',
    commentLike: 100,
    commentTime: '2024-04-12 12:00:00',
    commentInfo:
      '今天晚上刚看完 怎么说呢 其实这部电影挺深奥啊 我个人理解是真人接受自己恶的一面(对新母亲的厌恶 对学校的厌恶 自己撒过的谎 自己受过的伤 )我个人感觉那个苍鹭和真人很像 像是自己阴暗的一面 所以那个苍鹭才会成为真人去另一个所创造的黑暗的世界的领路人 他们在这途中遇到过很多困难 他们从一开始的互相厌恶到最后成为朋友 接受了对方 也就是接受了自己恶的一面 和自己和解 最后真人没有自己一个人逃离那个世界 而是带着他的新母亲还有那只苍鹭回到了自己的世界 他也和自己的亲生母亲做了告别 他的亲生母亲也选择了自己应该打开的那扇门 那个世界 生活并不是只充满恶的 在另一个世界婆婆们也都守护着真人 好好的爱着真人 最后那个恶的世界坍陷 真人回到了自己的世界之中 带着善意去对待世界 对待自己 “你想活出怎样的人生”你的人生其实由你自己选择 但是请永远热爱这个世界 因为这个世界永远不缺乏的就是“爱”(个人理解 勿喷)'
  },
  {
    id: 2,
    user: {
      userAvatar:
        'https://p3-pc-sign.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?x-expires=1712570400&x-signature=sHygsuEx4uBSOb8ErbKxTlqV8b8%3D&from=2480802190',
      username: '笙歌落'
    },
    address: '江苏',
    commentLike: 100,
    commentTime: '2021-09-09 12:00:00',
    commentInfo: '这个视频真的很好看@笙歌落 你看了吗？'
  },
  {
    id: 3,
    user: {
      userAvatar:
        'https://p3-pc-sign.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?x-expires=1712570400&x-signature=sHygsuEx4uBSOb8ErbKxTlqV8b8%3D&from=2480802190',
      username: '笙歌落'
    },
    address: '上海',
    commentLike: 100,
    commentTime: '2021-09-09 12:00:00',
    commentInfo: '想看看你们拍的照片[玫瑰]'
  }
]
</script>
<template>
  <div class="related-comment">
    <div class="related-comment-content">
      <div class="related-comment-header">
        <div class="related-comment-header-title">
          <span class="comment-title">全部评论</span>
          <div class="comment-title-line">
            <div class="comment-title-line-inner"></div>
          </div>
        </div>

        <div class="search-input-content">
          <dy-avatar
            userLink="//www.douyin.com/user/MS4wLjABAAAAqy1OO-UP9J2LJ1xSg_lsryKCicbLFLGzBgTRRT4W14Y"
            src="//p3-pc-sign.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?x-expires=1712570400&x-signature=sHygsuEx4uBSOb8ErbKxTlqV8b8%3D&from=2480802190"
            size="small"
          />
          <dy-input />
        </div>

        <div class="search-trend-container">
          <div class="trend-header">
            <span class="trend-title">大家都在搜：</span>
            <search-suggestion relatedText="你想活出什么样的人生" />
          </div>
        </div>
      </div>
      <div class="comment-list">
        <template v-for="it in list" :key="it.id">
          <comment-item
            :uid="it.id"
            :srcd="it.user.userAvatar"
            :username="it.user.username"
            :likenum="it.commentLike"
            :time="it.commentTime"
            :comment="it.commentInfo"
            :address="it.address"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.related-comment {
  width: 100%;
  margin-top: 16px;
}

.related-comment-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.related-comment-header {
  margin-bottom: 7.5px;

  .related-comment-header-title {
    color: var(--color-text-t4);
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    position: relative;

    .comment-title {
      background-color: var(--color-bg-b0);
      z-index: 2;
      padding-right: 8px;
      font-size: 16px;
      line-height: 24px;
      display: inline-block;
      position: relative;
    }

    .comment-title-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;

      .comment-title-line-inner {
        width: 100%;
        height: 1px;
        min-height: 1px;
        // background-color: rgba(22, 24, 35, 0.06);
        background-color: var(--color-line-l3);
        display: block;
        position: relative;
      }
    }
  }

  // 搜索输入框样式

  .search-input-content {
    margin-top: 16px;
    padding-bottom: 24.5px;
    display: flex;
  }

  // 搜索趋势模块样式
  .search-trend-container {
    padding-bottom: 2px;

    .trend-header {
      -webkit-app-region: no-drag;
      color: var(--color-text-t4);
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      flex: 1;
      margin-right: 20px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      display: flex;
      overflow: hidden;

      .trend-title {
        flex-shrink: 0;
      }
    }
  }
}
</style>
