<script setup lang="ts">
import {} from 'vue'

const { wiki_doc_id, title, head_image_thin, abstract } = defineProps({
  wiki_doc_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  head_image_thin: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  }
})

const wikiUrl = computed(
  () =>
    `https://www.baike.com/wikiid/${wiki_doc_id}?baike_source=baike_search_pc`
)
</script>
<template>
  <div class="search-baike cs-view cs-card">
    <div class="cs-view block cs-text">
      <div class="cs-text-textWrapper color-0 t6">相关百科</div>
      <div class="cs-view items-center flex-row flex cs-flex">
        <div class="cs-view block cs-flex-item flex-1">
          <div class="cs-view items-start flex-row flex cs-flex mt-16">
            <div class="cs-view block cs-flex-item flex-none">
              <a
                :href="wikiUrl"
                target="_blank"
                rel="nofollow"
                class="cs-view block cs-image mr-12"
                style="width: 108px; height: 108px"
              >
                <div class="w-full h-full relative overflow-hidden rounded-3">
                  <div class="" style="width: 108px; height: 108px">
                    <div
                      class="cs-image-blur-bg abs-fill bg-no-repeat bg-cover"
                      style="background-image: url('')"
                    ></div>
                    <div
                      class="cs-image-blur-bg abs-fill bg-no-repeat bg-cover"
                      style="background-image: url('')"
                    ></div>
                    <div class="cs-image-blur-mask abs-fill"></div>
                    <div class="abs-fill flex">
                      <img
                        :src="head_image_thin"
                        width="100%"
                        height="100%"
                        class="cs-image-img relative object-cover"
                      />
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div class="cs-view block cs-flex-item flex-1">
              <div class="cs-view items-center flex-row flex cs-flex">
                <div class="cs-view block cs-flex-item flex-none HK6ns7VH">
                  <a
                    :href="wikiUrl"
                    target="_blank"
                    rel="nofollow"
                    class="cs-view block cs-text mr-0 UXxl5rAw"
                  >
                    <div
                      class="cs-text-textWrapper color-0 t4 hover:color-0-hover"
                    >
                      {{ title }}
                    </div>
                  </a>
                </div>
                <div class="cs-view block cs-flex-item flex-none VBbvA9km ml-4">
                  <div
                    class="cs-view items-center flex-row flex cs-tag items-center justify-center t10 px-6 py-1 cs-tag-lh rounded-7 cs-tag-bg-blue"
                  >
                    <div class="cs-view block cs-text">
                      <div
                        class="cs-text-textWrapper t10"
                        style="color: rgb(41, 140, 255)"
                      >
                        百科
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a
                :href="wikiUrl"
                target="_blank"
                rel="nofollow"
                class="cs-view block cs-text mt-12"
              >
                <div
                  class="cs-text-textWrapper line-clamp-3 whitespace-normal color-1 t8 hover:color-0-hover"
                >
                  {{ abstract }}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-baike {
  padding-left: 16px;
  padding-bottom: 16px;
  padding-right: 16px;
  padding-top: 16px;
  background-color: var(--color-bg-b1-white);
  border-bottom-left-radius: var(--radius-6);
  border-bottom-right-radius: var(--radius-6);
}
</style>
