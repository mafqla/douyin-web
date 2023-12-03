import { AuthParams } from '@/utils/authentication'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import PageLayout from './layout'
import Index from '@/pages/index'
import Home from './pages/home/Home'
import { Contact, Convention, Editor, Intro } from './pages/help'
import {
  Follower,
  Following,
  ImportantFocus,
  Comment,
  Chat
} from './pages/data'

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
        path: 'home',
        element: <Home />
      },
      {
        path: 'content/material/manage',
        element: <div>content/material/manage</div>
      },
      {
        path: 'content/manage',
        element: <div>content/material/manage/:id</div>
      },
      {
        path: 'content/collection/manage',
        element: <div>content/collection/manage</div>
      },
      {
        path: 'content/original_protection',
        element: <div>content/original_protection</div>
      },
      {
        path: 'data/following/following',
        element: <Following />
      },
      {
        path: 'data/important/following',
        element: <ImportantFocus />
      },
      {
        path: 'data/following/follower',
        element: <Follower />
      },
      {
        path: 'data/following/comment',
        element: <Comment />
      },
      {
        path: 'data/following/chat',
        element: <Chat />
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
        element: <Intro />
      },
      {
        path: 'creator/help/contact',
        element: <Contact />
      },
      {
        path: 'creator/help/convention',
        element: <Convention />
      },
      {
        path: 'creator/help/editor',
        element: <Editor />
      }
    ]
  },
  {
    path: '*',
    element: <div>404</div>
  }
])
