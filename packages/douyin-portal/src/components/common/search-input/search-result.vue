<script setup lang="ts">
import { ref, toRefs } from 'vue'

const props = defineProps({
  searchText: {
    type: String,
    default: ''
  }
})
const { searchText } = toRefs(props)
const resultList = ref([
  {
    id: '0',
    searchResultText: '十三十三',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '1',
    searchResultText: '三生三世十里桃花',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '2',
    searchResultText: '三生三世',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '3',
    searchResultText: '生生世世',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '4',
    searchResultText: '',
    userInfo: {
      userName: '四羊',
      userNum: 'ssssyyyy0316',
      userLogoSrc:
        'https://p3.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_f19624fcb7a81cfaa8b2e88cfd88f83f.jpeg?from=3782654143',
      userTagSrc: ''
    }
  },
  {
    id: '5',
    searchResultText: '',
    userInfo: {
      userName: '四羊',
      userNum: 'ssssyyyy0316',
      userLogoSrc:
        'https://p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-avt-0015_dfa79449697ce45b9347dbcca365f010.jpeg?from=3782654143',
      userTagSrc:
        'data:image/png;base64,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'
    }
  },
  {
    id: '6',
    searchResultText: 'ssssssss_y',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '7',
    searchResultText: 'ssss古立特',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '8',
    searchResultText: '松宝',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  },
  {
    id: '9',
    searchResultText: 'ssss',
    userInfo: {
      userName: '',
      userNum: '',
      userLogoSrc: '',
      userTagSrc: ''
    }
  }
])

const searchKeyword = ref(searchText)
const highlightedText = (text: string) => {
  if (!searchKeyword.value) {
    return ''
  }

  // 使用正则表达式进行全局搜索和替换，将匹配的关键字用 <span> 包裹以实现高亮
  const regex = new RegExp(searchKeyword.value, 'gi')
  const uniqueMatches = new Set<string>()

  return text.replace(regex, (match: string) => {
    if (!uniqueMatches.has(match)) {
      uniqueMatches.add(match)
      return `<span class="selected">${match}</span>`
    }
    return match
  })
}
</script>
<template>
  <div class="search-result">
    <div class="search-result-content">
      <template v-for="(item, index) in resultList">
        <div
          :index="index"
          class="search-result-box"
          :class="{
            'search-result-user': item.searchResultText === ''
          }"
        >
          <span
            class="search-result-text"
            v-if="item.searchResultText !== ''"
            v-html="
              highlightedText(item.searchResultText || item.userInfo.userNum)
            "
          >
          </span>
          <div class="user-logo" v-if="item.searchResultText === ''">
            <div class="user-logo-box">
              <img
                class="user-logo-img"
                :src="item.userInfo.userLogoSrc"
                alt="用户头像"
              />
              <img
                class="user-logo-tag"
                :src="item.userInfo.userTagSrc"
                alt="用户标签"
                v-if="item.userInfo.userTagSrc !== ''"
              />
            </div>
            <div class="user-info">
              <div class="user-info-author">
                <span class="search-result-text">{{
                  item.userInfo.userName
                }}</span>
              </div>
              <div class="user-info-num">
                抖音号：
                <span
                  v-html="
                    highlightedText(
                      item.searchResultText || item.userInfo.userNum
                    )
                  "
                ></span>
              </div>
            </div>
          </div>
          <div class="icon">
            <span class="user-text" v-if="item.searchResultText === ''"
              >个人主页</span
            >
            <svg
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="U0Pto7FV"
              v-if="item.searchResultText !== ''"
            >
              <rect
                x="6"
                y="5"
                width="10"
                height="1.5"
                rx="0.75"
                fill="#4F5168"
              ></rect>
              <rect
                x="7.061"
                y="5"
                width="16"
                height="1.5"
                rx="0.75"
                transform="rotate(45 7.06 5)"
                fill="#4F5168"
              ></rect>
              <rect
                x="7.5"
                y="5"
                width="10"
                height="1.5"
                rx="0.75"
                transform="rotate(90 7.5 5)"
                fill="#4F5168"
              ></rect>
            </svg>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-result {
  left: -2px;
  position: absolute;
  top: 36px;
  width: calc(100% + 2px);
  z-index: 50;

  .search-result-content {
    //  background-color: var(--color-bg-b0);
    background-color: var(--color-bg-b1);
    // background-color: rgba(249, 249, 249, 1);
    // border: 1px solid #f2f2f4;
    border: 1px solid var(--color-secondary-default);
    // border: 1px solid rgba(242, 242, 243, 1);
    border-radius: 4px;
    box-shadow: 0 0 24px rgba(0, 0, 0, 0.1);
    box-sizing: content-box;
    margin-top: 5px;
    padding: 10px 0;
    width: 100%;

    .search-result-box {
      align-items: center;
      // color: #161823;
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      cursor: pointer;
      display: flex;
      font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
      font-weight: 400;
      height: 32px;
      justify-content: space-between;
      padding: 0 20px;
      width: 100%;

      .search-result-text {
        flex-shrink: 1;
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        margin-right: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .selected {
          // color: #fe2c55;
          color: var(--color-primary);
        }
      }

      .user-logo {
        align-items: center;
        display: flex;
        flex-shrink: 1;
        overflow: hidden;

        .user-logo-box {
          flex-shrink: 0;
          position: relative;

          &,
          & .user-logo-img {
            border-radius: 18px;
            height: 36px;
            width: 36px;
          }

          .user-logo-tag {
            border-radius: 6px;
            height: 12px;
            left: 24px;
            position: absolute;
            top: 24px;
            width: 12px;
          }
        }
        .user-info {
          flex-shrink: 1;
          margin-left: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .user-info-author {
            align-items: center;
            display: flex;

            .search-result-text {
              flex-shrink: 1;
              font-size: 14px;
              font-weight: 600;
              line-height: 22px;
              margin-right: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .user-info-num {
            // color: rgba(22, 24, 35, 0.75);
            color: var(--color-text-t2);
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .selected {
              // color: #fe2c55;
              color: var(--color-primary);
            }
          }
          .selected,
          .search-result-text {
            -webkit-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        }
      }
      &:hover {
        // background-color: #e4e4e6;
        background-color: var(--color-bg-b3);
        // background-color: rgba(228, 228, 230, 1);
        .icon {
          align-items: center;
          // color: #161823;
          color: var(--color-text-t1);
          // color: rgba(22, 24, 35, 1);
          display: flex;
          flex-shrink: 0;
          flex-wrap: nowrap;
          padding-left: 4px;
        }
      }
      &.search-result-user {
        height: 52px;
      }
    }
    .icon {
      display: none;
    }
    .user-text {
      // color: #161823;
      color: var(--color-text-t1);
      // color: rgba(22, 24, 35, 1);
      font-size: 12px;
      line-height: 20px;
    }
  }
}

:deep(.selected) {
  // color: #fe2c55;
  color: var(--color-primary);
}
</style>
