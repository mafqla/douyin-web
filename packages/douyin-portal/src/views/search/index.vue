<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import SearchSidebar from './components/search-sidebar.vue'
import SearchTabs from './components/search-tabs.vue'
import SearchBaike from './components/search-baike.vue'
import SearchHotspot from './components/search-hotspot.vue'
import searchSideCard from './components/search-side-card.vue'
import { useTitle } from '@vueuse/core'
import { vIntersectionObserver } from '@vueuse/components'
import formatTime from '@/utils/date-format'
import dyAvatar from '@/components/common/dy-avatar.vue'
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
    console.log(res)
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

const root = ref<HTMLElement | null>(null)

//当前可视范围的子项索引
const isVisibleIndex = ref(0)
function onIntersectionObserver(index: number) {
  return (entries: IntersectionObserverEntry[]) => {
    const [{ isIntersecting }] = entries
    if (isIntersecting) {
      isVisibleIndex.value = index
    }
  }
}

const isActiveIndex = (index: number) => index === isVisibleIndex.value
</script>
<template>
  <div class="search-container" ref="root">
    <div class="search-content">
      <div class="search-center">
        <div class="search-center-head">
          <search-tabs />
        </div>
        <div class="search-center-content">
          <div style="display: block; margin-top: 66px">
            <ul class="scroll-list">
              <li
                class="scroll-item"
                v-for="({ aweme_info, sub_card_list }, index) in searchResult"
                :key="
                  aweme_info?.aweme_id ??
                  sub_card_list?.[0]?.card_info.attached_info.aweme_list[0]
                    .aweme_id
                "
                v-intersection-observer="[
                  () => onIntersectionObserver(index),
                  { root, threshold: 0.5 }
                ]"
              >
                <div class="search-result-card">
                  <template v-if="aweme_info">
                    <div class="search-result-head">
                      <a
                        :href="`/user/${
                          aweme_info?.author?.sec_uid ||
                          sub_card_list?.[0]?.card_info.attached_info
                            .aweme_list[0]?.author.sec_uid
                        }`"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <dy-avatar
                          :src="
                            aweme_info?.author?.avatar_thumb?.url_list?.[0] ||
                            sub_card_list?.[0]?.card_info.attached_info
                              .aweme_list[0]?.author.avatar_thumb.url_list[0] ||
                            ''
                          "
                          size="small"
                        />
                      </a>

                      <div class="search-result-head-info">
                        <div class="search-result-head-content">
                          <a
                            class="user-link"
                            :href="`/user/${
                              aweme_info?.author?.sec_uid ||
                              sub_card_list?.[0]?.card_info.attached_info
                                .aweme_list[0]?.author.sec_uid
                            }`"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <p class="search-result-head-info-name">
                              {{
                                aweme_info?.author?.nickname ||
                                sub_card_list?.[0]?.card_info.attached_info
                                  .aweme_list[0]?.author.nickname
                              }}
                            </p>
                          </a>

                          <p class="search-result-head-info-time">
                            <span class="dot">·</span>
                            {{
                              formatTime(
                                aweme_info?.create_time ||
                                  sub_card_list?.[0]?.card_info.attached_info
                                    .aweme_list[0].create_time ||
                                  ''
                              )
                            }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <ellipsis-expand
                      class="video-info-desc search"
                      style="
                        --lineClamp: 2;
                        --lineHeight: 26px;
                        --maxHeight: 48px;
                        margin: 16px 0;
                      "
                      :description="
                        aweme_info?.desc ||
                        sub_card_list?.[0]?.card_info.attached_info
                          .aweme_list[0].desc ||
                        ''
                      "
                    />
                  </template>
                  <template v-if="sub_card_list">
                    <search-hotspot
                      :sentence="
                        sub_card_list?.[0]?.card_info.hotspot_info.sentence
                      "
                      :sentence_id="
                        sub_card_list?.[0]?.card_info.hotspot_info.sentence_id
                      "
                      :hot_value="
                        sub_card_list?.[0]?.card_info.hotspot_info.hot_value
                      "
                      :update_time="
                        sub_card_list?.[0]?.card_info.hotspot_info.update_time
                      "
                    />
                  </template>
                  <div class="scroll-item-content">
                    <div class="scroll-item-player">
                      <template v-if="aweme_info">
                        <swiper-player
                          :id="Number(aweme_info.aweme_id)"
                          :userId="Number(aweme_info.author.uid)"
                          :username="aweme_info.author.nickname"
                          :uploadTime="aweme_info.create_time"
                          :description="aweme_info?.desc"
                          :poster="aweme_info?.video?.cover.url_list[0] ?? ''"
                          :url="aweme_info?.video?.play_addr?.url_list[2] ?? ''"
                          :img="aweme_info?.video?.cover.url_list[0] ?? ''"
                          :dianzan="aweme_info.statistics.digg_count"
                          :comment="aweme_info.statistics.comment_count"
                          :shoucang="aweme_info.statistics.share_count"
                          :isLike="Boolean(aweme_info.user_digged)"
                          :isCollect="Boolean(aweme_info.collect_stat)"
                          :isShowAvatar="false"
                          :isPlay="isActiveIndex(index)"
                          :isShowInfo="false"
                        />
                      </template>
                      <template v-if="sub_card_list">
                        <swiper-player
                          :id="
                            Number(
                              sub_card_list[0].card_info.attached_info
                                .aweme_list[0].aweme_id
                            )
                          "
                          :userId="
                            Number(
                              sub_card_list[0].card_info.attached_info
                                .aweme_list[0].author.uid
                            )
                          "
                          :username="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0].author.nickname
                          "
                          :uploadTime="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0].create_time
                          "
                          :description="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0]?.desc
                          "
                          :poster="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0]?.video?.cover.url_list[0] ?? ''
                          "
                          :url="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0]?.video?.play_addr?.url_list[2] ??
                            ''
                          "
                          :img="
                            sub_card_list?.[0]?.card_info.attached_info
                              .aweme_list[0]?.author.avatar_thumb.url_list[0] ??
                            ''
                          "
                          :dianzan="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0].statistics.digg_count
                          "
                          :comment="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0].statistics.comment_count
                          "
                          :shoucang="
                            sub_card_list[0].card_info.attached_info
                              .aweme_list[0].statistics.share_count
                          "
                          :isLike="
                            Boolean(
                              sub_card_list[0].card_info.attached_info
                                .aweme_list[0].user_digged
                            )
                          "
                          :isCollect="
                            Boolean(
                              sub_card_list[0].card_info.attached_info
                                .aweme_list[0].collect_stat
                            )
                          "
                          :isShowAvatar="true"
                          :isPlay="isActiveIndex(index)"
                          :isShowInfo="true"
                        >
                          <searchSideCard
                            :aweme_list="
                              sub_card_list?.[0]?.card_info.attached_info
                                .aweme_list
                            "
                          />
                        </swiper-player>
                      </template>
                    </div>
                  </div>

                  <template v-if="sub_card_list">
                    <template
                      v-for="item in sub_card_list?.[1]?.card_info.baikes"
                    >
                      <search-baike
                        v-if="sub_card_list?.[1]?.type === 999"
                        :wiki_doc_id="item.wiki_doc_id"
                        :title="item.title"
                        :head_image_thin="item.head_image_thin"
                        :abstract="item.abstract"
                      />
                    </template>
                  </template>
                </div>
              </li>
            </ul>
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

    .scroll-list {
      display: flex;
      flex-wrap: wrap;
      position: relative;

      .scroll-item {
        width: 100%;

        .search-result-card {
          margin-bottom: 32px;

          .search-result-head {
            width: 100%;
            display: flex;
            align-items: center;

            .search-result-head-info {
              flex: 1 1;
              margin-left: 12px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;

              .search-result-head-content {
                align-items: center;
                display: flex;

                .user-link {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .search-result-head-info-name {
                  color: var(--color-text-t1);
                  font-size: 16px;
                  line-height: 24px;
                }

                .search-result-head-info-time {
                  color: var(--color-text-t1);
                  flex-shrink: 0;
                  font-size: 12px;
                  font-weight: 400;
                  letter-spacing: 0.6px;
                  line-height: 20px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;

                  .dot {
                    margin: 0 4px;
                  }
                }
              }
            }
          }
        }

        .scroll-item-content {
          height: 0;
          padding-top: calc(56.25% + 33px);
          position: relative;
          width: 100%;

          margin-top: 16px;

          .scroll-item-player {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
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
