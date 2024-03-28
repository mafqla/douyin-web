<script setup lang="ts">
import { ref } from 'vue'
import SearchSidebar from './components/search-sidebar.vue'
import SearchTabs from './components/search-tabs.vue'
/**
 * 测试数据
 */
const searchData = [
  {
    id: 1,
    query: '测试1',
    description: '测试描述1'
  },
  {
    id: 2,
    query: '测试2',
    description: '测试描述2'
  },
  {
    id: 3,
    query: '测试3',
    description: '测试描述3'
  },
  {
    id: 4,
    query: '测试4',
    description: '测试描述4'
  },
  {
    id: 5,
    query: '测试5',
    description: '测试描述5'
  },
  {
    id: 6,
    query: '测试6',
    description: '测试描述6'
  },
  {
    id: 7,
    query: '测试7',
    description: '测试描述7'
  },
  {
    id: 8,
    query: '测试8',
    description: '测试描述8'
  },
  {
    id: 9,
    query: '测试9',
    description: '测试描述9'
  },
  {
    id: 10,
    query: '测试10',
    description: '测试描述10'
  }
]
</script>
<template>
  <div class="search-container">
    <div class="search-content">
      <div class="search-center">
        <div class="search-center-head">
          <search-tabs />
        </div>
        <div class="search-center-content"></div>
      </div>
      <div class="search-sidebar">
        <search-sidebar :searchData="searchData" />
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

    .search-center-head,
    .search-center-content {
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
