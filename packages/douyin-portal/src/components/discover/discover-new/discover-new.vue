<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import DiscoverBottom from '../discover-bottom/discover-bottom.vue'
import newItem from './new-item.vue'
import { getHotVideoList } from '@/service/videos/videos'

// const newData = [
//   {
//     id: 1,
//     title: 'test',
//     describe: 'test',
//     img: 'https://p6-pc-sign.douyinpic.com/obj/image-cut-tos-priv/dafe68e698b5680638080f1798c5db5f?biz_tag=&from=65706370&s=&sc=&se=false&sh=&x-expires=1681912800&x-signature=oj8v72UI2LWWHurVLFoDPnu0eW4%3D',
//     playNumber: '1098.1万',
//     playTime: '00:31',
//     author: 'test',
//     rank: 0
//   },
//   {
//     id: 2,
//     title: 'test',
//     describe: 'test',
//     img: 'https://p6-pc-sign.douyinpic.com/obj/image-cut-tos-priv/dafe68e698b5680638080f1798c5db5f?biz_tag=&from=65706370&s=&sc=&se=false&sh=&x-expires=1681912800&x-signature=oj8v72UI2LWWHurVLFoDPnu0eW4%3D',
//     playNumber: '1098.1万',
//     playTime: '00:31',
//     author: 'test',
//     rank: 1
//   },
//   {
//     id: 3,
//     title: 'test',
//     describe: 'test',
//     img: 'https://p6-pc-sign.douyinpic.com/obj/image-cut-tos-priv/dafe68e698b5680638080f1798c5db5f?biz_tag=&from=65706370&s=&sc=&se=false&sh=&x-expires=1681912800&x-signature=oj8v72UI2LWWHurVLFoDPnu0eW4%3D',
//     playNumber: '1098.1万',
//     playTime: '00:31',
//     author: 'test',
//     rank: 2
//   },
//   {
//     id: 4,
//     title: 'test',
//     describe: 'test',
//     img: 'https://p6-pc-sign.douyinpic.com/obj/image-cut-tos-priv/dafe68e698b5680638080f1798c5db5f?biz_tag=&from=65706370&s=&sc=&se=false&sh=&x-expires=1681912800&x-signature=oj8v72UI2LWWHurVLFoDPnu0eW4%3D',
//     playNumber: '1098.1万',
//     playTime: '00:31',
//     author: 'test',
//     rank: 3
//   },
//   {
//     id: 5,
//     title: 'test',
//     describe: 'test',
//     img: 'https://p6-pc-sign.douyinpic.com/obj/image-cut-tos-priv/dafe68e698b5680638080f1798c5db5f?biz_tag=&from=65706370&s=&sc=&se=false&sh=&x-expires=1681912800&x-signature=oj8v72UI2LWWHurVLFoDPnu0eW4%3D',
//     playNumber: '1098.1万',
//     playTime: '00:31',
//     author: 'test',
//     rank: 4
//   },
//   {
//     id: 6,
//     title: 'test',
//     describe: 'test',
//     img: 'https://p6-pc-sign.douyinpic.com/obj/image-cut-tos-priv/dafe68e698b5680638080f1798c5db5f?biz_tag=&from=65706370&s=&sc=&se=false&sh=&x-expires=1681912800&x-signature=oj8v72UI2LWWHurVLFoDPnu0eW4%3D',
//     playNumber: '1098.1万',
//     playTime: '00:31',
//     author: 'test',
//     rank: 5
//   }
// ]
const newData = ref([] as any)
watchEffect(async () => {
  const list = await getHotVideoList()
  console.log(list)
  newData.value = list.data
})
// console.log(newData.value)
</script>
<template>
  <div class="discover-new">
    <div class="discover-new-title">热榜</div>

    <template v-for="item in newData" :key="item.id">
      <new-item :item="item" />
    </template>
    <discover-bottom>
      <div>查看更多热榜内容</div>
    </discover-bottom>
  </div>
</template>

<style lang="scss" scoped>
.discover-new {
  font-family: PingFang SC, DFPKingGothicGB-Regular, sans-serif;
  font-weight: 400;
  padding: 8px 30px 24px;
  min-width: 508px;
  height: 100%;
  position: relative;

  .discover-new-title {
    // color: #000;
    color: rgba(0, 0, 0, 1);
    font-size: 22px;
    line-height: 34px;
    margin-bottom: 24px;
  }
}

@media (min-width: 2472px) {
  .discover-new {
    padding: 8px 0 24px;
  }
}
</style>
