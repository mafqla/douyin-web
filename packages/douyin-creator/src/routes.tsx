import { AuthParams } from '@/utils/authentication'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import PageLayout from './layout'
import Index from '@/pages/index'
import { lazy, Suspense } from 'react'
import Upload from '@/pages/content/upload/index'

const lazyLoad = (Component) => (
  <Suspense>
    <Component />
  </Suspense>
)

const test = import.meta.glob('./pages/**/*.tsx')
console.log('test', test)

// const upload = lazy(() => import('@/pages/content/upload/index'))
const publish = lazy(() => import('@/pages/content/publish/index'))
const manage = lazy(() => import('@/pages/content/manage/index'))
const home = lazy(() => import('@/pages/home/Home'))
const collectionManage = lazy(() => import('@/pages/content/collection/index'))
const collectionCreate = lazy(() => import('@/pages/content/collection/create'))
const originalProtection = lazy(
  () => import('@/pages/content/OriginalProtection')
)
const following = lazy(() => import('@/pages/data/following/following'))
const importantFollowing = lazy(
  () => import('@/pages/data/important/following')
)
const follower = lazy(() => import('@/pages/data/following/follower'))
const followingComment = lazy(() => import('@/pages/data/following/comment'))
const followingChat = lazy(() => import('@/pages/data/following/chat'))

const intro = lazy(() => import('@/pages/help/intro'))
const contact = lazy(() => import('@/pages/help/contact'))
const convention = lazy(() => import('@/pages/help/convention'))
const editor = lazy(() => import('@/pages/help/editor'))
export type IRoute = AuthParams & {
  name: string
  key: string
  // 当前页是否展示面包屑
  breadcrumb?: boolean
  children?: IRoute[]
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean
}
export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Index />
  },

  {
    path: '',
    element: <Navigate to="creator-micro" />
  },

  {
    path: '/creator-micro',
    element: <PageLayout />,

    children: [
      {
        path: '',
        element: <Navigate to="home" />
      },

      {
        path: 'content/upload',
        element: <Upload />
      },
      {
        path: 'content/publish',
        element: lazyLoad(publish)
      },
      {
        path: 'home',
        element: lazyLoad(home)
      },
      {
        path: 'content/material/manage',
        element: <div>content/material/manage</div>
      },
      {
        path: 'content/manage',
        element: lazyLoad(manage)
      },
      {
        path: 'content/collection/manage',
        element: lazyLoad(collectionManage)
      },
      {
        path: 'content/collection/create',
        element: lazyLoad(collectionCreate)
      },
      {
        path: 'content/original_protection',
        element: lazyLoad(originalProtection)
      },
      {
        path: 'data/following/following',
        element: lazyLoad(following)
      },
      {
        path: 'data/important/following',
        element: lazyLoad(importantFollowing)
      },
      {
        path: 'data/following/follower',
        element: lazyLoad(follower)
      },
      {
        path: 'data/following/comment',
        element: lazyLoad(followingComment)
      },
      {
        path: 'data/following/chat',
        element: lazyLoad(followingChat)
      },
      {
        path: 'data/stats/overview',
        element: <div>data/stats/overview</div>
      },
      {
        path: 'data/stats/video',
        element: <div>data/stats/video</div>
      },
      {
        path: 'data/stats/follower/portrait',
        element: <div>data/stats/follower/portrait</div>
      },
      {
        path: 'data/stats/weekly',
        element: <div>data/stats/weekly</div>
      },
      {
        path: 'live-data/data/overview',
        element: <div>live-data/data/overview</div>
      },
      {
        path: 'data/live/video',
        element: <div>data/live/video</div>
      },
      {
        path: 'revenue/overview',
        element: <div>revenue/overview</div>
      },
      {
        path: 'market/home/recommend',
        element: <div>market/home/recommend</div>
      },
      {
        path: 'creative-guidance',
        element: <div>creative-guidance</div>
      },
      {
        path: 'creator/help/intro',
        element: lazyLoad(intro)
      },
      {
        path: 'creator/help/contact',
        element: lazyLoad(contact)
      },
      {
        path: 'creator/help/convention',
        element: lazyLoad(convention)
      },
      {
        path: 'creator/help/editor',
        element: lazyLoad(editor)
      }
    ]
  },
  {
    path: '*',
    element: <div>404</div>
  }
])
