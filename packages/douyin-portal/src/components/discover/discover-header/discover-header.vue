<script setup lang="ts">
import { getCategoriesList } from '@/service/discover/discover'
import { discoverStore } from '@/stores/discover'
import { ref, watchEffect } from 'vue'

let tagList: any = ref('')
//获取分类列表

watchEffect(async () => {
  const data = await getCategoriesList()
  tagList.value = data.data
})
// console.log(tagList.value)
const store = discoverStore()
//点击切换分类
const changeTag = (item: any) => {
  console.log(item)
  store.getCategoriesList(1, 10, item)
}

//获取全部分类视频
const getAllCategoriesList = () => {
  store.getCategoriesList(1, 10, '')
}
</script>
<template>
  <div class="discover-header">
    <div class="discover-header-container">
      <p class="discover-header-container-title">编辑精选</p>
      <div class="discover-header-container-tag">
        <div class="discover-header-container-tag-c">
          <div class="blank"></div>
          <ul class="discover-header-container-tag-c-list">
            <div>
              <div class="discover-list total">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="rjWqLEh8"
                  viewBox="0 0 22 22"
                >
                  <path
                    d="M10.571 6.786a2.786 2.786 0 11-5.571 0 2.786 2.786 0 015.571 0zM10.571 14.214a2.786 2.786 0 11-5.571 0 2.786 2.786 0 015.571 0zM18 6.786a2.786 2.786 0 11-5.571 0 2.786 2.786 0 015.571 0zM18 14.214a2.786 2.786 0 11-5.571 0 2.786 2.786 0 015.571 0z"
                    fill="#fff"
                  ></path></svg
                ><span class="tag-title" @click="getAllCategoriesList"
                  >全部</span
                >
              </div>
            </div>
            <template v-for="item in tagList">
              <div class="discover-list">
                <img :src="item.img" class="discover-img" />
                <span class="tag-title" @click="changeTag(item.title)">
                  {{ item.title }}
                </span>
              </div>
            </template>
          </ul>
        </div>
        <div class="discover-tag-controller">
          <span class="discover-tag prev">
            <svg
              width="6"
              height="9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 6 9"
            >
              <path
                d="M2.241 1.161a.857.857 0 10-1.212 1.212L3.534 4.88 1.03 7.384A.857.857 0 002.24 8.596l3.104-3.104.007-.007a.857.857 0 000-1.212L2.241 1.16z"
                fill="#fff"
              ></path>
            </svg>
          </span>
          <span class="discover-tag next disable">
            <svg
              width="6"
              height="9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class=""
              viewBox="0 0 6 9"
            >
              <path
                d="M2.241 1.161a.857.857 0 10-1.212 1.212L3.534 4.88 1.03 7.384A.857.857 0 002.24 8.596l3.104-3.104.007-.007a.857.857 0 000-1.212L2.241 1.16z"
                fill="#fff"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discover-header {
  user-select: none;
  .discover-header-container {
    display: flex;
    margin-bottom: 8px;
    margin-top: 32px;
    padding: 0px 30px;
    .discover-header-container-title {
      color: rgba(0, 0, 0, 1);
      font-size: 22px;
      line-height: 34px;
      white-space: nowrap;
    }
    .discover-header-container-tag {
      margin-left: 24px;
      flex: 1 1 0%;
      align-items: center;
      display: flex;
      width: 100%;

      .discover-header-container-tag-c {
        display: table;
        position: relative;
        table-layout: fixed;
        width: 100%;
        min-width: 458px;
        overflow: hidden;
        --liner-bg: linear-gradient(270deg, #fff, hsla(0, 0%, 100%, 0) 94.23%);
        --liner-bg2: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0) 94.23%);

        .blank {
          height: 100%;
          pointer-events: none;
          position: absolute;
          top: 0px;
          width: 90px;
          z-index: 2;
          background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0) 94.23%);
        }
        .discover-header-container-tag-c-list {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          width: 100%;
          scrollbar-width: none;
          -ms-overflow-style: none;
          &::-webkit-scrollbar {
            display: none;
          }
          .discover-list {
            margin-right: 12px;
            align-items: center;
            color: rgba(22, 24, 35, 0.6);
            display: flex;
            height: 28px;
            border: 1px solid rgba(228, 228, 230, 1);
            border-radius: 100px;
            padding: 3px;
            .discover-img {
              font-size: 12px;
              height: 22px;
              width: 22px;
              border-radius: 50%;
              overflow: hidden;
            }

            .tag-title {
              font-family: 'PingFang SC', DFPKingGothicGB-Regular, sans-serif;
              font-size: 13px;
              font-weight: 400;
              line-height: 21px;
              margin: 0px 10px 0px 4px;
            }
          }

          .discover-list.total {
            background-color: rgba(242, 242, 243, 1);
            color: rgba(22, 24, 35, 1);
            cursor: pointer;
            border: 1px solid rgba(242, 242, 243, 1);
          }
        }
        .discover-header-container-tag-c-list::after {
          content: '';
          height: 100%;
          pointer-events: none;
          position: absolute;
          right: 0px;
          top: 0px;
          width: 90px;
          background: linear-gradient(
            270deg,
            #fff,
            hsla(0, 0%, 100%, 0) 94.23%
          );
        }
      }

      .discover-tag-controller {
        align-items: center;
        display: flex;
        position: relative;
        flex: 0 0 66px;
        .discover-tag {
          background-color: rgba(242, 242, 243, 1);
          cursor: pointer;
          display: inline-block;
          height: 24px;
          text-align: center;
          width: 24px;
          border-radius: 50%;
          &.prev {
            position: relative;

            svg {
              left: 50%;
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%) rotate(180deg);
            }
          }
          &.next {
            margin-left: 16px;
            position: relative;

            svg {
              left: 50%;
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
          &.disable {
            cursor: not-allowed;
            background-color: rgba(0, 0, 0, 0.1);
          }
        }
      }
    }
  }
}
@media (min-width: 1440px) {
  .discover-tag-controller {
    display: none !important;
  }
}
</style>
