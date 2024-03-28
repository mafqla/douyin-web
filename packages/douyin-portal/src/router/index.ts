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
        path: '/search/:keyword',
        name: 'search',
        component: () => import('@/views/search/index.vue')
      },

      {
        path: '/user/:id',
        name: 'user',
        component: () => import('@/views/user.vue')
      },
      {
        path: '/user/self',
        name: 'self',
        component: () => import('@/views/my.vue')
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

router.beforeEach((to) => {})

export default router
