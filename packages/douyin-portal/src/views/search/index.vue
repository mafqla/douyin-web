<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import SearchSidebar from './components/search-sidebar.vue'
import SearchTabs from './components/search-tabs.vue'
import searchSigle from './components/search-sigle.vue'
import { useTitle } from '@vueuse/core'
import apis from '@/api/apis'
import type { searchParams } from '@/api/tyeps/request_params/searchParams'
import type {
  DataSearch,
  Word
} from '@/api/tyeps/request_response/searchResponse'
import { useRoute } from 'vue-router'
import { videosCtrolStore } from '@/stores/videos-control'

useTitle('发现更多精彩视频 - 抖音搜索')
onUnmounted(() => {
  document.title = '抖音-记录美好生活'
})

const route = useRoute()
const query = ref(route.params.keyword as string)
const offset = ref(0)
const count = ref(10)
const loading = ref(true)

const searchResult = ref<DataSearch[]>([])
async function search() {
  try {
    const res = await apis.search({
      keyword: query.value,
      offset: offset.value,
      count: count.value
    } as searchParams)
    // console.log(res)
    if (res && Array.isArray(res.data)) {
      searchResult.value = res.data
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 搜索建议
const suggest_word = ref<Word[]>([])
const searchSuggest = async (query: string) => {
  try {
    const res = await apis.searchSuggest(query)
    if (res && Array.isArray(res.data)) {
      suggest_word.value.length = 0
      res.data.forEach((item) => {
        if (Array.isArray(item.words)) {
          suggest_word.value.push(...item.words)
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  search()
  searchSuggest(query.value)
})
</script>
<template>
  <div class="search-container">
    <div class="search-content">
      <div class="search-center">
        <div class="search-center-head">
          <search-tabs />
        </div>
        <div class="search-center-content">
          <div v-if="true" style="margin-top: 66px">
            <search-sigle :searchResult="searchResult" />
          </div>
        </div>
      </div>
      <div class="search-sidebar">
        <search-sidebar :query="query" :searchData="suggest_word" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-container {
  display: flex;
  flex: 1;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.search-content {
  width: 1520px;
  display: flex;

  .search-center {
    flex: 1 1;
    width: 0;

    .search-center-head {
      background-color: var(--color-bg-b0);
      box-sizing: content-box;
      margin-left: -34px;
      padding: 0 34px;
      position: fixed;
      transition: transform 0.4s;
      z-index: 200;
    }

    .search-center-content {
      width: calc(100% - 30px);
    }

    .search-center-head {
      width: 1250px;
    }
  }

  .search-sidebar {
    width: 240px;
    flex-shrink: 0;
    height: 100%;
    position: relative;
    z-index: 300;
  }
}

@media screen and (min-width: 1800px) {
}

@media screen and (max-width: 1800px) and (min-width: 1081px) {
  .search-content {
    padding-left: 60px;
    padding-right: 60px;
    width: 100%;
  }

  .search-center-content {
    width: calc(100% - 30px);
  }

  .search-center-head {
    width: calc(100% - var(--navigation-width) - 390px) !important;
  }
}

@media screen and (max-width: 1080px) and (min-width: 1021px) {
  .search-center-head,
  .search-center-content,
  .search-content {
    width: 888px;
  }

  .search-sidebar {
    display: none;
  }
}

@media screen and (max-width: 1020px) and (min-width: 861px) {
  .search-content {
    padding-left: 30px;
    padding-right: 30px;
    width: 100%;
  }

  .search-center-content {
    width: 100%;
  }

  .search-center-head {
    width: calc(100% - var(--navigation-width) - 60px);
  }

  .search-sidebar {
    display: none;
  }
}

@media screen and (max-width: 860px) {
  .search-center-head,
  .search-center-content,
  .search-content {
    width: 728px;
  }

  .search-sidebar {
    display: none;
  }
}

@media screen and (max-width: 810px) {
  .search-content {
    overflow: hidden;
  }
}
</style>
