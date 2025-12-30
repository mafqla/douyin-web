import type { RouteRecordRaw } from 'vue-router'

export interface MenuMeta {
    title: string
    icon: string // 图标背景位置
    group?: number // 分组，用于显示分隔线
    hidden?: boolean // 是否在菜单中隐藏
}

export type MenuRoute = RouteRecordRaw & {
    meta?: MenuMeta
}

// 菜单路由配置
export const menuRoutes: MenuRoute[] = [
    // 第一组
    {
        path: '/discover',
        name: 'discover',
        component: () => import('@/views/discover/index.vue'),
        meta: { title: '精选', icon: '0', group: 1 }
    },
    {
        path: '/',
        name: 'recommend',
        component: () => import('@/views/recommend.vue'),
        meta: { title: '推荐', icon: '-48', group: 1 }
    },
    {
        path: '/ai',
        name: 'ai',
        component: () => import('@/views/recommend.vue'),
        meta: { title: 'AI抖音', icon: '-96', group: 1 }
    },
    // 第二组
    {
        path: '/follow',
        name: 'follow',
        component: () => import('@/views/follow.vue'),
        meta: { title: '关注', icon: '-144', group: 2 }
    },
    {
        path: '/friend',
        name: 'friend',
        component: () => import('@/views/friend.vue'),
        meta: { title: '朋友', icon: '-192', group: 2 }
    },
    {
        path: '/user/self',
        name: 'self',
        component: () => import('@/views/my/index.vue'),
        meta: { title: '我的', icon: '-816', group: 2 }
    },
    // 第三组
    {
        path: '/live',
        name: 'live',
        component: () => import('@/views/live.vue'),
        meta: { title: '直播', icon: '-240', group: 3 }
    },
    {
        path: '/vs',
        name: 'vs',
        component: () => import('@/views/theater.vue'),
        meta: { title: '放映厅', icon: '-288', group: 3 }
    },
    {
        path: '/drama',
        name: 'drama',
        component: () => import('@/views/theater.vue'),
        meta: { title: '短剧', icon: '-960', group: 3 }
    },
    {
        path: '/hot',
        name: 'hot',
        component: () => import('@/views/hot.vue'),
        meta: { title: '热点', icon: '-384', group: 4 }
    },
    {
        path: '/channel/300201',
        name: 'entertainment',
        component: () => import('@/views/entertainment.vue'),
        meta: { title: '娱乐', icon: '-432', group: 4 }
    },
    {
        path: '/channel/300203',
        name: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: { title: '知识', icon: '-480', group: 4 }
    },
    {
        path: '/channel/300206',
        name: 'anime',
        component: () => import('@/views/anime.vue'),
        meta: { title: '二次元', icon: '-528', group: 4 }
    },
    {
        path: '/channel/300205',
        name: 'game',
        component: () => import('@/views/game.vue'),
        meta: { title: '游戏', icon: '-576', group: 4 }
    },
    {
        path: '/channel/300204',
        name: 'food',
        component: () => import('@/views/food.vue'),
        meta: { title: '美食', icon: '-624', group: 4 }
    },
    {
        path: '/channel/300207',
        name: 'sports',
        component: () => import('@/views/sports.vue'),
        meta: { title: '体育', icon: '-672', group: 4 }
    },
    {
        path: '/channel/300208',
        name: 'fashion',
        component: () => import('@/views/fashion.vue'),
        meta: { title: '时尚', icon: '-720', group: 4 }
    },
    {
        path: '/channel/300209',
        name: 'music',
        component: () => import('@/views/music.vue'),
        meta: { title: '音乐', icon: '-768', group: 4 }
    }
]

// 非菜单路由（不在侧边栏显示）
export const otherRoutes: RouteRecordRaw[] = [
    {
        path: '/video/:id',
        name: 'video',
        component: () => import('@/views/video/index.vue')
    },
    {
        path: '/note/:id',
        name: 'note',
        component: () => import('@/views/note/index.vue')
    },
    {
        path: '/search/:keyword',
        name: 'search',
        component: () => import('@/views/search/index.vue')
    },
    {
        path: '/user/:id',
        name: 'user',
        component: () => import('@/views/user/index.vue')
    }
]
