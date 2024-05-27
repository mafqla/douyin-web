<script setup lang="ts">
import SearchBaike from './search-baike.vue'
import SearchHotspot from './search-hotspot.vue'
import searchSideCard from './search-side-card.vue'
import formatTime from '@/utils/date-format'
import dyAvatar from '@/components/common/dy-avatar.vue'
import type { DataSearch } from '@/api/tyeps/request_response/searchResponse'
import type { PropType } from 'vue'

const { searchResult } = defineProps({
  searchResult: {
    type: Array as PropType<DataSearch[]>,
    required: true
  }
})
const videoRefs = ref([])

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelector('video')?.play()
      } else {
        entry.target.querySelector('video')?.pause()
      }
    })
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: 1
  }
)

// 监听 videoRefs 数组的变化
watchEffect(() => {
  console.log(videoRefs.value)
  videoRefs.value.forEach((item) => {
    intersectionObserver.observe(item)
  })
})
</script>
<template>
  <ul class="scroll-list">
    <li
      class="scroll-item"
      v-for="({ aweme_info, sub_card_list }, index) in searchResult"
      :key="
        aweme_info?.aweme_id ??
        sub_card_list?.[0]?.card_info.attached_info.aweme_list[0].aweme_id
      "
      ref="videoRefs"
    >
      <div class="search-result-card">
        <template v-if="aweme_info">
          <div class="search-result-head">
            <a
              :href="`/user/${
                aweme_info?.author?.sec_uid ||
                sub_card_list?.[0]?.card_info.attached_info.aweme_list[0]
                  ?.author.sec_uid
              }`"
              target="_blank"
              rel="noreferrer"
            >
              <dy-avatar
                :src="
                  aweme_info?.author?.avatar_thumb?.url_list?.[0] ||
                  sub_card_list?.[0]?.card_info.attached_info.aweme_list[0]
                    ?.author.avatar_thumb.url_list[0] ||
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
                    sub_card_list?.[0]?.card_info.attached_info.aweme_list[0]
                      ?.author.sec_uid
                  }`"
                  target="_blank"
                  rel="noreferrer"
                >
                  <p class="search-result-head-info-name">
                    {{
                      aweme_info?.author?.nickname ||
                      sub_card_list?.[0]?.card_info.attached_info.aweme_list[0]
                        ?.author.nickname
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
              sub_card_list?.[0]?.card_info.attached_info.aweme_list[0].desc ||
              ''
            "
          />
        </template>
        <template v-if="sub_card_list">
          <search-hotspot
            :sentence="sub_card_list?.[0]?.card_info.hotspot_info.sentence"
            :sentence_id="
              sub_card_list?.[0]?.card_info.hotspot_info.sentence_id
            "
            :hot_value="sub_card_list?.[0]?.card_info.hotspot_info.hot_value"
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
                :isPlay="false"
                :isShowInfo="false"
              />
            </template>
            <template v-if="sub_card_list">
              <swiper-player
                :id="
                  Number(
                    sub_card_list[0].card_info.attached_info.aweme_list[0]
                      .aweme_id
                  )
                "
                :userId="
                  Number(
                    sub_card_list[0].card_info.attached_info.aweme_list[0]
                      .author.uid
                  )
                "
                :username="
                  sub_card_list[0].card_info.attached_info.aweme_list[0].author
                    .nickname
                "
                :uploadTime="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]
                    .create_time
                "
                :description="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]?.desc
                "
                :poster="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]?.video
                    ?.cover.url_list[0] ?? ''
                "
                :url="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]?.video
                    ?.play_addr?.url_list[2] ?? ''
                "
                :img="
                  sub_card_list?.[0]?.card_info.attached_info.aweme_list[0]
                    ?.author.avatar_thumb.url_list[0] ?? ''
                "
                :dianzan="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]
                    .statistics.digg_count
                "
                :comment="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]
                    .statistics.comment_count
                "
                :shoucang="
                  sub_card_list[0].card_info.attached_info.aweme_list[0]
                    .statistics.share_count
                "
                :isLike="
                  Boolean(
                    sub_card_list[0].card_info.attached_info.aweme_list[0]
                      .user_digged
                  )
                "
                :isCollect="
                  Boolean(
                    sub_card_list[0].card_info.attached_info.aweme_list[0]
                      .collect_stat
                  )
                "
                :isShowAvatar="true"
                :isPlay="false"
                :isShowInfo="true"
              >
                <searchSideCard
                  :aweme_list="
                    sub_card_list?.[0]?.card_info.attached_info.aweme_list
                  "
                />
              </swiper-player>
            </template>
          </div>
        </div>

        <template v-if="sub_card_list">
          <template v-for="item in sub_card_list?.[1]?.card_info.baikes">
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
</template>

<style lang="scss" scoped>
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
</style>
