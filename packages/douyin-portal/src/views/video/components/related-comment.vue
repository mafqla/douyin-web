<script setup lang="ts">
import apis from '@/api/apis';
import type { IComments } from '@/api/tyeps/request_response/commentListRes';
import DyAvatar from '@/components/common/dy-avatar.vue';
import DyInput from '@/components/common/dy-input/index.vue';
import Loading from '@/components/common/loading.vue';
import SearchSuggestion from '@/components/common/search-suggestion.vue';
import { useVirtualList } from '@/hooks';

const props = defineProps(
  {
    aweme_id: String,
    author_id: String,
    relatedText: String

  }
)

const commentList = ref<IComments[]>([])
const isLoadingMore = ref(true);
const hasMore = ref(true);
const cursor = ref(0);
const count = ref(5);
const getCommentList = async () => {
  if (!hasMore.value) return;
  isLoadingMore.value = true
  try {
    const res = await apis.getCommentList(Number(props.aweme_id), cursor.value, count.value)
    cursor.value = res.cursor
    count.value = 20
    commentList.value.push(...res.comments)
    if (!isLoadingMore.value) {
      hasMore.value = Boolean(res.has_more)
    }
    isLoadingMore.value = false;
  } catch (error) {
    console.log(error)
  }
}
const containerRef = ref(null);
onMounted(() => {
  getCommentList();
});

useInfiniteScroll(
  window, () => {
    getCommentList()
  },
  { distance: 100 }
)


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
          <dy-avatar userLink="//www.douyin.com/user/MS4wLjABAAAAqy1OO-UP9J2LJ1xSg_lsryKCicbLFLGzBgTRRT4W14Y"
            src="//p3-pc-sign.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?x-expires=1712570400&x-signature=sHygsuEx4uBSOb8ErbKxTlqV8b8%3D&from=2480802190"
            size="small" />
          <dy-input />
        </div>

        <div class="search-trend-container">
          <div class="trend-header">
            <span class="trend-title">大家都在搜：</span>
            <search-suggestion :relatedText />
          </div>
        </div>
      </div>
      <div class="comment-list" ref="containerRef">
        <template v-for="it in commentList" :key="it.cid">
          <comment-item v-bind="it" :author_id="props.author_id" />
        </template>

        <Loading :show="isLoadingMore" :isShowText="true" text="评论加载中..." />
        <list-footer v-if="!hasMore" />
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
