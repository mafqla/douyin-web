<script lang="ts" setup>
import useTheme from '@/hooks/useTheme'
import { settingStore } from '@/stores/setting'
import { computed, ref, toRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const activeIndex = ref()

const menuItems = [
  { index: '1', title: '首页', path: '/discover', icon: '0' },
  { index: '2', title: '推荐', path: '/', icon: '-48' },
  { index: '3', title: '关注', path: '/follow', icon: '-96' },
  { index: '4', title: '朋友', path: '/friend', icon: '-144' },
  { index: '5', title: '我的', path: '/user/self', icon: '-720' },
  { index: '6', title: '直播', path: '/live', icon: '-192' },
  { index: '7', title: '放映厅', path: '/vs', icon: '-240' },
  { index: '8', title: '知识', path: '/channel/300203', icon: '-384' },
  { index: '9', title: '热点', path: '/hot', icon: '-288' },
  { index: '10', title: '游戏', path: '/channel/300205', icon: '-480' },
  { index: '11', title: '娱乐', path: '/channel/300201', icon: '-336' },
  { index: '12', title: '二次元', path: '/channel/300206', icon: '-480' },
  { index: '13', title: '音乐', path: '/channel/300209', icon: '-432' },
  { index: '14', title: '美食', path: '/channel/300204', icon: '-528' },
  { index: '15', title: '体育', path: '/channel/300207', icon: '-576' },
  { index: '16', title: '时尚', path: '/channel/300208', icon: '-624' }
]

const handleSelect = (index: any) => {
  // activeIndex.value = index
  // console.log(menuItems[index - 1].path)
  // router.push(menuItems[index - 1].path)

  const menuItem = menuItems.find((item) => item.index === index)
  if (menuItem) {
    activeIndex.value = index
    let newPath = menuItem.path

    // 如果选择的菜单项为 'user/self'，添加查询参数 showTab=like
    if (newPath === '/user/self') {
      newPath += '?showTab=like'
    }

    router.push(newPath)
  }
}

const calculateBackgroundPosition = (index: string) => {
  const offsetX = activeIndex.value === index ? -24 : 0
  //计算新的x坐标值
  const newX = parseInt(menuItems[Number(index) - 1].icon) + offsetX
  return `${newX}px 0px`
}

const activeMenu = computed(() => {
  const { path } = route
  const index = Object.values(menuItems).findIndex((item) => {
    // console.log(item.path, `/${path.split('/').splice(1, 2).join('/')}`)
    return (
      item.path === `/${path.split('/')[1]}` ||
      item.path === `/${path.split('/').splice(1, 2).join('/')}`
    )
  })
  activeIndex.value = (index + 1).toString()
  return (index + 1).toString()
})

const theme = toRef(settingStore(), 'theme')
</script>

<template>
  <div class="aside">
    <div class="aside-bar">
      <div class="aside-top">
        <div class="aside-logo">
          <a href="/" class="aside-logo-a"></a>
        </div>
      </div>

      <div class="aside-container">
        <div class="menu-container" :default-active="activeMenu">
          <template v-for="item in menuItems" :key="item.index">
            <div
              class="menu-item"
              :index="item.index"
              @click="handleSelect(item.index)"
              :class="{ active: activeIndex === item.index }"
            >
              <div class="item-container">
                <div
                  class="icon dark"
                  style="background-size: 816px auto"
                  :style="{
                    'background-position': calculateBackgroundPosition(
                      item.index
                    )
                  }"
                  v-show="theme === 'dark'"
                ></div>
                <div
                  class="icon light"
                  :style="{
                    'background-position': calculateBackgroundPosition(
                      item.index
                    ),
                    'background-size': '816px auto'
                  }"
                  v-show="theme === 'light'"
                ></div>

                <div class="title-container">
                  <span class="title">{{ item.title }}</span>
                </div>
              </div>
            </div>
            <div class="horizontal-line" v-if="item.index === '5'"></div>
          </template>
        </div>

        <div class="aside-bottom"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aside {
  flex-basis: $sidebar-width-min;
  flex-shrink: 0;
  position: relative;
  background: var(--color-bg-b0);
  z-index: 200;
  .aside-bar {
    width: $sidebar-width-min;
    background: no-repeat url(@/assets/test.png) var(--color-bg-b0);
    height: 100vh;
    position: fixed;
    z-index: 100;

    .aside-top {
      // height: 60px;
      height: 68px;
      width: 100%;
      position: relative;
      user-select: none;
      .aside-logo {
        // background: linear-gradient(
        //   180deg,
        //   #eff0f3 80%,
        //   rgba(241, 242, 245, 0)
        // );
        background: transparent !important;
        // background-image: url(@/assets/icons/douyin.svg);
        // background-repeat: no-repeat;
        // display: flex;
        // flex-basis: 72px;
        // justify-content: center;
        // left: 50%;
        // position: absolute;
        // top: 50%;
        // transform: translate(-24%, -28%);
        // width: 100%;
        // height: 60px;
        // z-index: 2;

        align-items: center;
        background: #f2f2f4;
        display: flex;
        flex-basis: $sidebar-width-min;
        flex-shrink: 0;
        height: 165%;
        justify-content: center;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        z-index: 2;

        .aside-logo-a {
          -webkit-app-region: no-drag;
          // background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTExLjY0IDEzLjQzNHYtMS4zMWMtLjQ1NS0uMDU1LS45MS0uMDkyLTEuMzg0LS4wOTJDNC42MDkgMTIuMDMyIDAgMTYuNjIgMCAyMi4yODJjMCAzLjQ2IDEuNzMgNi41MzcgNC4zNzIgOC4zOTRhMTAuMTc3IDEwLjE3NyAwIDAgMS0yLjc1LTYuOTczYy4wMTctNS41OSA0LjQ4LTEwLjE0MSAxMC4wMTgtMTAuMjY5WiIgZmlsbD0iIzAwRkFGMCIvPjxwYXRoIGQ9Ik0xMS44NzcgMjguMzQ1YTQuNjc1IDQuNjc1IDAgMCAwIDQuNjY0LTQuNDk3VjEuNTQ1aDQuMDhhNy4yMjYgNy4yMjYgMCAwIDEtLjEyNy0xLjQyaC01LjU3NXYyMi4zMDNhNC42NzUgNC42NzUgMCAwIDEtNC42NjMgNC40OTdjLS43ODMgMC0xLjUzLS4yLTIuMTY4LS41NDZhNC42NDQgNC42NDQgMCAwIDAgMy43OSAxLjk2NlpNMjguMjUyIDkuMTJWNy44OGE3LjY4MyA3LjY4MyAwIDAgMS00LjIyNi0xLjI1NiA3LjkxNiA3LjkxNiAwIDAgMCA0LjIyNiAyLjQ5NFoiIGZpbGw9IiMwMEZBRjAiLz48cGF0aCBkPSJNMjQuMDQ2IDYuNjI1YTcuNzIgNy43MiAwIDAgMS0xLjkxMy01LjA4aC0xLjQ5NGE3LjgzNSA3LjgzNSAwIDAgMCAzLjQwNyA1LjA4Wk0xMC4yNTYgMTcuNTg1YTQuNjc5IDQuNjc5IDAgMCAwLTQuNjgyIDQuNjc5YzAgMS44MDIgMS4wMiAzLjM1IDIuNTE0IDQuMTMzYTQuNzA3IDQuNzA3IDAgMCAxLS44OTMtMi43MzEgNC42NzkgNC42NzkgMCAwIDEgNC42ODItNC42OGMuNDc0IDAgLjk0Ny4wNzMgMS4zODQuMjE5di01LjY4Yy0uNDU1LS4wNTUtLjkxLS4wOTEtMS4zODQtLjA5MWgtLjIzN3Y0LjM3YTQuMzI1IDQuMzI1IDAgMCAwLTEuMzg0LS4yMloiIGZpbGw9IiNGRjAwNTAiLz48cGF0aCBkPSJNMjguMjUzIDkuMTJ2NC4zMzJjLTIuODk2IDAtNS41NTYtLjkyOC03Ljc0Mi0yLjQ5NHYxMS4zMDZjMCA1LjY0NC00LjU5IDEwLjI1LTEwLjI1NiAxMC4yNS0yLjE4NiAwLTQuMjA4LS42OTEtNS44NjUtMS44NTcgMS44NzYgMi4wMDMgNC41MzUgMy4yNzcgNy41MDUgMy4yNzcgNS42NDcgMCAxMC4yNTYtNC41ODcgMTAuMjU2LTEwLjI1VjEyLjM3OGExMy4yNjggMTMuMjY4IDAgMCAwIDcuNzQxIDIuNDk0di01LjU3YTkuNjEzIDkuNjEzIDAgMCAxLTEuNjM5LS4xODNaIiBmaWxsPSIjRkYwMDUwIi8+PHBhdGggZD0iTTIwLjUxIDIyLjI2NVYxMC45NTlhMTMuMjY4IDEzLjI2OCAwIDAgMCA3Ljc0MiAyLjQ5NFY5LjEyYTcuODUgNy44NSAwIDAgMS00LjIyNi0yLjQ5NCA3LjY2IDcuNjYgMCAwIDEtMy4zODgtNS4wOGgtNC4wOHYyMi4zMDNhNC42NzUgNC42NzUgMCAwIDEtNC42NjQgNC40OTcgNC42MjUgNC42MjUgMCAwIDEtMy43OS0xLjk0OCA0LjY3OCA0LjY3OCAwIDAgMS0yLjUxMy00LjEzMyA0LjY3OSA0LjY3OSAwIDAgMSA0LjY4Mi00LjY4Yy40NzMgMCAuOTQ3LjA3NCAxLjM4NC4yMnYtNC4zN2MtNS41MzguMTI3LTEwIDQuNjc5LTEwIDEwLjIzMiAwIDIuNjk0IDEuMDM4IDUuMTUyIDIuNzUgNi45NzNhMTAuMjEgMTAuMjEgMCAwIDAgNS44NjYgMS44NTdjNS42MjguMDE4IDEwLjIzNy00LjU4OCAxMC4yMzctMTAuMjMyWiIgZmlsbD0iIzExMSIvPjwvc3ZnPg==)
          //   no-repeat;
          background: var(--logo-small-url) no-repeat;
          height: 34px;
          opacity: 1;
          transition: opacity 0.3s;
          width: 30px;
        }
        // .icon {
        //   height: 34px;
        //   opacity: 1;
        //   width: 91px;
        // }
      }
    }

    .aside-container {
      background-position: 0 100%;
      background-size: cover;
      bottom: 0;
      height: calc(100vh - 68px);
      outline: none;
      width: $sidebar-width-min;
      z-index: 20;
      background: transparent !important;

      // bottom: 8px;
      overflow-x: hidden;
      overflow-y: scroll;
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      overscroll-behavior: contain;
      scrollbar-color: transparent transparent !important;
      position: fixed;
      scrollbar-width: none !important;

      &::-webkit-scrollbar {
        display: none;
      }
      :deep(.el-menu) {
        all: unset;
      }
      .menu-container {
        display: flex;
        flex-direction: column;
        // align-items: center;
        user-select: none;

        :deep(.menu-item:hover) {
          background-color: unset;
        }
        .menu-item {
          align-items: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          margin: 8px 10px 0;
          &.active,
          &:hover {
            // background: rgba(37, 38, 50, 0.08);
            background: var(--color-fill-hover);
            border-radius: 12px;
            span {
              color: var(--color-text-t0) !important;
            }

            .icon {
              opacity: 1 !important;
            }
          }

          .item-container {
            align-items: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            // justify-content: flex-start;
            padding: 6px 8px;
            width: 100%;
            position: relative;
            .icon {
              height: 24px;
              width: 24px;
              opacity: 0.5;
            }
            .icon.light {
              background-image: url(@/assets/nav_light.png);
            }
            .icon.dark {
              background-image: url(@/assets/nav_dark.png);
            }
            .title-container {
              display: flex;
              align-self: center;
              line-height: 1;
              margin-top: 4px;
              position: relative;

              .title {
                color: var(--color-text-t3);
                font-family: PingFang SC, DFPKingGothicGB-Medium, sans-serif;
                font-size: 12px;
                font-weight: 500;
                font-weight: 400;
                line-height: 20px;
                margin-top: -4px;
                max-width: 70px;
              }
            }
          }
        }

        // 选中的样式
        .menu-item.is-active {
          color: var(--color-text-t0);
          .icon {
            opacity: 1;
          }
          span {
            opacity: 1;
            color: var(--color-text-t0) !important;
          }
        }
      }

      .aside-bottom {
        width: $sidebar-width;
        height: 540px;
        display: block;
        position: absolute;
        bottom: -400px;
        z-index: 1;
      }
    }
  }
}
@media (min-width: 1240px) {
  .aside {
    flex-basis: $sidebar-width;
    .aside-bar {
      width: $sidebar-width;
      // .aside-container {
      //   width: $sidebar-width;
      // }

      .aside-container {
        width: $sidebar-width !important;
        bottom: 2px;

        .menu-item {
          height: 40px !important;
          margin: 2px 16px 0 !important;
          align-items: flex-end !important;
          flex-direction: row !important;

          .item-container {
            padding: 8px 16px !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: flex-start !important;

            .icon {
              margin-right: 12px;
            }

            .title-container {
              align-self: flex-start;
              margin-top: 0 !important;
              position: relative !important;
              word-break: keep-all !important;

              .title {
                font-size: 14px !important;
                line-height: 24px !important;
                transform: scale(1);
              }
            }
          }
        }

        .horizontal-line {
          // border-bottom: 1px solid rgba(22, 24, 35, 0.6);
          border-bottom: 1px solid var(--color-line-l3);
          height: 1px;
          margin: 12px 24px 10px;
          width: 112px;
        }
      }
    }
  }
  .aside-logo {
    background: #f2f2f4;
    height: 165%;
    flex-basis: $sidebar-width !important;
    .aside-logo-a {
      background-size: 72px 28px !important;
      height: 28px !important;
      opacity: 1 !important;
      width: 91px !important;
      // background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iMjkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwLjEyIDExLjg2di0xLjA3NGE5LjQ1NSA5LjQ1NSAwIDAgMC0xLjEzNi0uMDc1Yy00LjYzMSAwLTguNDEgMy43NjItOC40MSA4LjQwNiAwIDIuODM3IDEuNDE4IDUuMzYgMy41ODUgNi44ODNhOC4zNDcgOC4zNDcgMCAwIDEtMi4yNTYtNS43MThjLjAxNS00LjU4NCAzLjY3NS04LjMxNyA4LjIxNy04LjQyMVoiIGZpbGw9IiMwMEZBRjAiLz48cGF0aCBkPSJNMTAuMzE0IDI0LjA5YTMuODM0IDMuODM0IDAgMCAwIDMuODI0LTMuNjg5VjIuMTExaDMuMzQ3QTUuOTI3IDUuOTI3IDAgMCAxIDE3LjM4Ljk0NkgxMi44MXYxOC4yOWEzLjgzNCAzLjgzNCAwIDAgMS0zLjgyNSAzLjY4OSAzLjczOCAzLjczOCAwIDAgMS0xLjc3Ny0uNDQ4IDMuODA4IDMuODA4IDAgMCAwIDMuMTA3IDEuNjEzWk0yMy43NDMgOC4zMjJWNy4zMDdhNi4zMDEgNi4zMDEgMCAwIDEtMy40NjYtMS4wMyA2LjQ5MiA2LjQ5MiAwIDAgMCAzLjQ2NiAyLjA0NVoiIGZpbGw9IiMwMEZBRjAiLz48cGF0aCBkPSJNMjAuMjkzIDYuMjc3YTYuMzMyIDYuMzMyIDAgMCAxLTEuNTY5LTQuMTY1SDE3LjVhNi40MjYgNi40MjYgMCAwIDAgMi43OTMgNC4xNjVaTTguOTg0IDE1LjI2NWEzLjgzNyAzLjgzNyAwIDAgMC0zLjg0IDMuODM3IDMuODIgMy44MiAwIDAgMCAyLjA2MiAzLjM5IDMuODYgMy44NiAwIDAgMS0uNzMyLTIuMjQgMy44MzcgMy44MzcgMCAwIDEgMy44NC0zLjgzN2MuMzg4IDAgLjc3Ni4wNiAxLjEzNS4xNzl2LTQuNjU5YTkuNDU1IDkuNDU1IDAgMCAwLTEuMTM1LS4wNzRoLS4xOTV2My41ODNhMy41NDUgMy41NDUgMCAwIDAtMS4xMzUtLjE3OVoiIGZpbGw9IiNGRTJDNTUiLz48cGF0aCBkPSJNMjMuNzQ0IDguMzIydjMuNTU0Yy0yLjM3NSAwLTQuNTU3LS43NjItNi4zNS0yLjA0NnY5LjI3MmMwIDQuNjMtMy43NjQgOC40MDctOC40MSA4LjQwN2E4LjMzOSA4LjMzOSAwIDAgMS00LjgxLTEuNTIzYzEuNTM4IDEuNjQyIDMuNzIgMi42ODcgNi4xNTQgMi42ODcgNC42MzIgMCA4LjQxMS0zLjc2MiA4LjQxMS04LjQwNnYtOS4yNzJhMTAuODgyIDEwLjg4MiAwIDAgMCA2LjM1IDIuMDQ1VjguNDcxYTcuODg2IDcuODg2IDAgMCAxLTEuMzQ1LS4xNDlaIiBmaWxsPSIjRkUyQzU1Ii8+PHBhdGggZD0iTTE3LjM5NCAxOS4xMDNWOS44M2ExMC44ODIgMTAuODgyIDAgMCAwIDYuMzUgMi4wNDZWOC4zMjJhNi40MzcgNi40MzcgMCAwIDEtMy40NjctMi4wNDUgNi4yODIgNi4yODIgMCAwIDEtMi43NzktNC4xNjZoLTMuMzQ2VjIwLjRhMy44MzQgMy44MzQgMCAwIDEtMy44MjQgMy42ODkgMy43OTMgMy43OTMgMCAwIDEtMy4xMDgtMS41OTggMy44MzYgMy44MzYgMCAwIDEtMi4wNjEtMy4zOSAzLjgzNyAzLjgzNyAwIDAgMSAzLjgzOS0zLjgzN2MuMzg4IDAgLjc3Ny4wNiAxLjEzNS4xOFYxMS44NmMtNC41NDEuMTA0LTguMjAxIDMuODM3LTguMjAxIDguMzkxIDAgMi4yMS44NTEgNC4yMjYgMi4yNTUgNS43MmE4LjM3NCA4LjM3NCAwIDAgMCA0LjgxMSAxLjUyMmM0LjYxNi4wMTUgOC4zOTYtMy43NjMgOC4zOTYtOC4zOTFaIiBmaWxsPSIjMTExIi8+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ny4yNzYgNS44NDlINDUuMTJ2MTEuMzM4bC03LjE1LjYxOHYyLjI4N2w3LjE1LS42djUuMDkyaDIuMTU2di01LjI5M2wyLjIwNS0uMnYtMi4yODhsLTIuMjA2LjJWNS44NVptLTEyLjMgMGgtMi4xNzJ2My4xOUgzMC4yOHYyLjE3aDIuNTIzdjQuNDI1bC0yLjUyMy4zNjd2Mi4yODhsMi41MjMtLjM2N3YzLjc5YzAgLjMtLjI1MS41NTEtLjU1Mi41NTFoLTEuODJ2Mi4xNzFoMi43MjJhMS44MjUgMS44MjUgMCAwIDAgMS44MjEtMS44MnYtNS4wMWwyLjIwNi0uMzMzdi0yLjI4OGwtMi4yMDYuMzM0di00LjA5MWgyLjIwNlY5LjA1NWgtMi4yMDZWNS44NDlabTMuODk1IDEuNjA0TDQ0IDguMzd2Mi4yODhsLTUuMTMtLjkwMlY3LjQ1M1pNNDQgMTMuMTI5bC01LjEzLS45MTh2Mi4zMDRsNS4xMy45MTl2LTIuMzA1Wm0yMy40MzktMi43MjEtLjMzNCAxLjc3aDQuMjQzdjIuMTJINTIuMTg1di0yLjEyaDQuMzQ0bC0uMjg0LTEuNzdoMi4zMDVsLjI2OCAxLjc3aDUuOThsLjM1Mi0xLjc3aDIuMjg5Wm0zLjMwOC0zLjA1N2gtNy4yNjhsLS4zNjctMS41MDJoLTIuODI0bC4zNjggMS41MDJoLTcuODd2Mi4xMDRoMTcuOTYxVjcuMzUxWm0tMTUuMDAzIDguNTAxSDY3Ljc5YzEuMDE5IDAgMS44Mi44MTkgMS44MiAxLjgydjQuOTZjMCAxLjAwMi0uODE4IDEuODItMS44MiAxLjgySDU1Ljc0NGExLjgyNSAxLjgyNSAwIDAgMS0xLjgyMS0xLjgydi00Ljk2YzAtMS4wMDIuODE4LTEuODIgMS44Mi0xLjgyWm0xMS4yOTQgMS45N0g1Ni41MTJjLS4zIDAtLjU1MS4yMzQtLjUzNC41NTJ2Ljg4NWgxMS42MTF2LS44ODVjMC0uMy0uMjUtLjU1MS0uNTUxLS41NTFabS0xMC41MjYgNC42NzZoMTAuNTI2Yy4zIDAgLjUzNS0uMjUuNTM1LS41NXYtLjkwM0g1NS45NnYuOTAyYzAgLjMuMjUuNTUxLjU1MS41NTFaIiBmaWxsPSIjMTExIi8+PC9zdmc+)
      //   no-repeat !important;

      background: var(--logo-url) no-repeat !important;
    }
  }
}
</style>
