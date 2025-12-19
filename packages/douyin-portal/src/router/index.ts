import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import layout from '@/layout/index.vue'
import { menuRoutes, otherRoutes } from './routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: layout,
    redirect: '/',
    children: [...menuRoutes, ...otherRoutes]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => { })

export default router
