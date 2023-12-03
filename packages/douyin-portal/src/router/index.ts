import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: layout,
    redirect: '/',
    children: [
      {
        path: '/discover',
        name: 'discover',
        component: () => import('@/views/discover.vue')
      },
      {
        path: '/',
        name: 'recommend',
        component: () => import('@/views/recommend.vue')
      },
      {
        path: '/follow',
        name: 'follow',
        component: () => import('@/views/follow.vue')
      },

      {
        path: '/user/:id',
        name: 'user',
        component: () => import('@/views/user.vue')
        // redirect: '/user/self?showTab=like',
        // children: [
        //   {
        //     path: 'self',
        //     component: () => import('@/views/my.vue')
        //   }
        // ]
      },
      {
        path: '/user/self',
        name: 'self',
        component: () => import('@/views/my.vue'),
      },
      {
        path: '/friend',
        name: 'friend',
        component: () => import('@/views/friend.vue')
      },
      {
        path: '/live',
        name: 'live',
        component: () => import('@/views/live.vue')
      },
      {
        path: '/vs',
        name: 'vs',
        component: () => import('@/views/theater.vue')
      },
      {
        path: 'hot',
        name: 'hot',
        component: () => import('@/views/hot.vue')
      },

      {
        path: '/channel/300201',
        name: 'entertainment',
        component: () => import('@/views/entertainment.vue')
      },
      {
        path: '/channel/300203',
        name: 'channel',
        component: () => import('@/views/knowledge.vue')
      },
      {
        path: '/channel/300204',
        name: 'food',
        component: () => import('@/views/food.vue')
      },
      {
        path: '/channel/300205',
        name: 'game',
        component: () => import('@/views/game.vue')
      },
      {
        path: '/channel/300206',
        name: 'anime',
        component: () => import('@/views/anime.vue')
      },
      {
        path: '/channel/300207',
        name: 'sports',
        component: () => import('@/views/sports.vue')
      },
      {
        path: '/channel/300208',
        name: 'fashion',
        component: () => import('@/views/fashion.vue')
      },
      {
        path: '/channel/300209',
        name: 'music',
        component: () => import('@/views/music.vue')
      }
    ]
  },
  {
    path: '/:pageName', // 使用动态路径，匹配不同的页面
    name: 'dynamicPage',
    component: () => import('@/components/common/modal.vue'),
    props: (route) => ({
      pageName: route.params.pageName,
      modalId: route.query.modal_id
    })
  },
  {
    path: '/post',
    name: 'post',
    component: () => import('@/views/post.vue')
  }

  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found'
  //   component: () => import('@/views/not-found/not-found.vue')
  // }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const modalId = to.query.modal_id
  if (modalId) {
    // 在这里根据 modalId 打开模态框
    // 或者触发事件告知应用打开模态框
  } else {
    // 没有 modal_id 查询参数，正常进入路由
  }
})

export default router
