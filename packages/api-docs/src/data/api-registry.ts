import type { ApiCategory } from '@/types/api'

/**
 * 抖音 API 注册表
 * 基于 douyin-portal 项目的 API 定义
 */
export const apiRegistry: ApiCategory[] = [
  {
    id: 'feed',
    name: '首页/推荐',
    description: '获取首页和推荐页的视频流',
    icon: 'Home',
    apis: [
      {
        id: 'homeFeed',
        name: '获取首页视频流',
        description: '获取首页视频流数据，支持分页和分类筛选',
        url: '/aweme/v2/web/module/feed/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '获取数量', example: '10' },
          { name: 'refresh_index', type: 'number', required: true, description: '刷新索引，用于分页', example: '0' },
          { name: 'tag_id', type: 'string', required: false, description: '分类标签ID（可选）', example: '' }
        ],
        responseType: 'IhomeFeedRes',
        responseFields: [
          {
            name: 'aweme_list',
            type: 'array',
            description: '视频列表',
            children: [
              { name: 'aweme_id', type: 'string', description: '视频唯一ID' },
              { name: 'desc', type: 'string', description: '视频描述/标题' },
              { name: 'create_time', type: 'number', description: '创建时间戳' },
              {
                name: 'author',
                type: 'object',
                description: '作者信息',
                children: [
                  { name: 'uid', type: 'string', description: '用户ID' },
                  { name: 'nickname', type: 'string', description: '用户昵称' },
                  { name: 'sec_uid', type: 'string', description: '用户加密ID' },
                  { name: 'avatar_thumb', type: 'object', description: '头像缩略图' }
                ]
              },
              {
                name: 'video',
                type: 'object',
                description: '视频信息',
                children: [
                  { name: 'play_addr', type: 'object', description: '播放地址' },
                  { name: 'cover', type: 'object', description: '封面图' },
                  { name: 'duration', type: 'number', description: '视频时长(毫秒)' },
                  { name: 'width', type: 'number', description: '视频宽度' },
                  { name: 'height', type: 'number', description: '视频高度' }
                ]
              },
              {
                name: 'statistics',
                type: 'object',
                description: '统计数据',
                children: [
                  { name: 'digg_count', type: 'number', description: '点赞数' },
                  { name: 'comment_count', type: 'number', description: '评论数' },
                  { name: 'collect_count', type: 'number', description: '收藏数' },
                  { name: 'share_count', type: 'number', description: '分享数' }
                ]
              }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多数据' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getRecommendFeed',
        name: '获取推荐页视频',
        description: '获取推荐页视频流数据',
        url: '/aweme/v1/web/tab/feed/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '获取数量', example: '10' },
          { name: 'refresh_index', type: 'number', required: true, description: '刷新索引', example: '0' }
        ],
        responseType: 'IrecommendFeedRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '分页游标' }
        ]
      }
    ]
  },
  {
    id: 'search',
    name: '搜索相关',
    description: '搜索视频、用户等内容',
    icon: 'Search',
    apis: [
      {
        id: 'search',
        name: '综合搜索',
        description: '根据关键词搜索视频、用户等内容',
        url: '/aweme/v1/web/general/search/single/',
        method: 'GET',
        params: [
          { name: 'keyword', type: 'string', required: true, description: '搜索关键词', example: '美食' },
          { name: 'offset', type: 'number', required: false, description: '偏移量', example: '0' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'search_source', type: 'string', required: false, description: '搜索来源', example: 'normal_search' },
          {
            name: 'sort_type',
            type: 'number',
            required: false,
            description: '排序类型',
            example: '0',
            enum: [
              { label: '综合排序', value: '0' },
              { label: '最多点赞', value: '1' },
              { label: '最新发布', value: '2' }
            ]
          },
          {
            name: 'publish_time',
            type: 'number',
            required: false,
            description: '发布时间筛选',
            example: '0',
            enum: [
              { label: '不限', value: '0' },
              { label: '一天内', value: '1' },
              { label: '一周内', value: '7' },
              { label: '半年内', value: '180' }
            ]
          }
        ],
        responseType: 'SearchResponse',
        responseFields: [
          {
            name: 'data',
            type: 'array',
            description: '搜索结果列表',
            children: [
              { name: 'aweme_info', type: 'object', description: '视频信息' },
              { name: 'user_info', type: 'object', description: '用户信息' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '分页游标' }
        ]
      },
      {
        id: 'searchSuggest',
        name: '搜索关键词推荐',
        description: '获取搜索关键词推荐列表',
        url: '/aweme/v1/web/api/suggest_words/',
        method: 'GET',
        params: [
          { name: 'query', type: 'string', required: false, description: '搜索词', example: '' },
          { name: 'from_group_id', type: 'string', required: false, description: '来源分组ID', example: '' }
        ],
        responseType: 'searchSuggestResponse',
        responseFields: [
          { name: 'suggest_words', type: 'array', description: '推荐词列表' }
        ]
      },
      {
        id: 'getSearchSug',
        name: '搜索建议',
        description: '根据关键词获取搜索建议列表',
        url: '/aweme/v1/web/search/sug/',
        method: 'GET',
        params: [
          { name: 'keyword', type: 'string', required: true, description: '搜索关键词', example: '抖音' }
        ],
        responseType: 'ISearchSugRes',
        responseFields: [
          {
            name: 'sug_list',
            type: 'array',
            description: '建议列表',
            children: [
              { name: 'word', type: 'string', description: '建议词' },
              { name: 'info', type: 'string', description: '附加信息' }
            ]
          }
        ]
      },
      {
        id: 'getHotSearch',
        name: '获取热搜',
        description: '获取热搜榜单列表',
        url: '/aweme/v1/web/hot/search/list/',
        method: 'GET',
        params: [],
        responseType: 'HotSearchRes',
        responseFields: [
          {
            name: 'word_list',
            type: 'array',
            description: '热搜词列表',
            children: [
              { name: 'word', type: 'string', description: '热搜词' },
              { name: 'hot_value', type: 'number', description: '热度值' },
              { name: 'position', type: 'number', description: '排名位置' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'video',
    name: '视频相关',
    description: '获取视频详情、评论等',
    icon: 'Video',
    apis: [
      {
        id: 'getVideoDetail',
        name: '获取视频详情',
        description: '根据视频ID获取视频详细信息',
        url: '/aweme/v1/web/aweme/detail/',
        method: 'GET',
        params: [
          { name: 'aweme_id', type: 'string', required: true, description: '视频ID', example: '7123456789012345678' }
        ],
        responseType: 'IVideoDetailRes',
        responseFields: [
          {
            name: 'aweme_detail',
            type: 'object',
            description: '视频详情',
            children: [
              { name: 'aweme_id', type: 'string', description: '视频ID' },
              { name: 'desc', type: 'string', description: '视频描述' },
              { name: 'author', type: 'object', description: '作者信息' },
              { name: 'video', type: 'object', description: '视频信息' },
              { name: 'music', type: 'object', description: '背景音乐' },
              { name: 'statistics', type: 'object', description: '统计数据' },
              { name: 'status', type: 'object', description: '视频状态' }
            ]
          }
        ]
      },
      {
        id: 'getVideoRelated',
        name: '获取相关推荐',
        description: '获取视频相关推荐列表',
        url: '/aweme/v1/web/aweme/related/',
        method: 'GET',
        params: [
          { name: 'aweme_id', type: 'string', required: true, description: '视频ID', example: '7123456789012345678' },
          { name: 'count', type: 'string', required: true, description: '获取数量', example: '20' },
          { name: 'filterGids', type: 'string', required: false, description: '过滤的视频ID', example: '' },
          { name: 'refresh_index', type: 'string', required: false, description: '刷新索引', example: '1' }
        ],
        responseType: 'IRelatedVideoRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '推荐视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' }
        ]
      },
      {
        id: 'getCommentList',
        name: '获取评论列表',
        description: '获取视频评论列表',
        url: '/aweme/v1/web/comment/list/',
        method: 'GET',
        params: [
          { name: 'aweme_id', type: 'string', required: true, description: '视频ID', example: '7123456789012345678' },
          { name: 'cursor', type: 'number', required: true, description: '分页游标', example: '0' },
          { name: 'count', type: 'number', required: true, description: '每页数量', example: '20' }
        ],
        responseType: 'ICommentListRes',
        responseFields: [
          {
            name: 'comments',
            type: 'array',
            description: '评论列表',
            children: [
              { name: 'cid', type: 'string', description: '评论ID' },
              { name: 'text', type: 'string', description: '评论内容' },
              { name: 'create_time', type: 'number', description: '评论时间' },
              { name: 'digg_count', type: 'number', description: '点赞数' },
              { name: 'reply_comment_total', type: 'number', description: '回复数' },
              { name: 'user', type: 'object', description: '评论用户信息' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' },
          { name: 'total', type: 'number', description: '评论总数' }
        ]
      },
      {
        id: 'getCommentReply',
        name: '获取评论回复',
        description: '获取评论的回复列表',
        url: '/aweme/v1/web/comment/list/reply/',
        method: 'GET',
        params: [
          { name: 'item_id', type: 'string', required: true, description: '视频ID', example: '7123456789012345678' },
          { name: 'comment_id', type: 'string', required: true, description: '评论ID', example: '7123456789012345678' },
          { name: 'cursor', type: 'number', required: true, description: '分页游标', example: '0' },
          { name: 'count', type: 'number', required: true, description: '每页数量', example: '20' }
        ],
        responseType: 'ICommentReplyRes',
        responseFields: [
          { name: 'comments', type: 'array', description: '回复列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      }
    ]
  },
  {
    id: 'user',
    name: '用户信息',
    description: '获取用户资料和关系',
    icon: 'User',
    apis: [
      {
        id: 'getUserInfo',
        name: '获取当前用户信息',
        description: '获取当前登录用户的个人信息',
        url: '/aweme/v1/web/user/profile/self/',
        method: 'GET',
        params: [],
        responseType: 'IUserDetailRes',
        responseFields: [
          {
            name: 'user',
            type: 'object',
            description: '用户信息',
            children: [
              { name: 'uid', type: 'string', description: '用户ID' },
              { name: 'sec_uid', type: 'string', description: '加密用户ID' },
              { name: 'nickname', type: 'string', description: '昵称' },
              { name: 'signature', type: 'string', description: '个性签名' },
              { name: 'avatar_larger', type: 'object', description: '大头像' },
              { name: 'aweme_count', type: 'number', description: '作品数' },
              { name: 'following_count', type: 'number', description: '关注数' },
              { name: 'follower_count', type: 'number', description: '粉丝数' },
              { name: 'total_favorited', type: 'number', description: '获赞数' }
            ]
          }
        ]
      },
      {
        id: 'getUserOtherInfo',
        name: '获取其他用户信息',
        description: '根据用户ID获取其他用户的个人信息',
        url: '/aweme/v1/web/user/profile/other/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' }
        ],
        responseType: 'IUserDetailRes',
        responseFields: [
          { name: 'user', type: 'object', description: '用户信息' }
        ]
      },
      {
        id: 'getFollowingList',
        name: '获取关注列表',
        description: '获取用户的关注列表',
        url: '/aweme/v1/web/user/following/list/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'offset', type: 'number', required: false, description: '偏移量', example: '0' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'min_time', type: 'number', required: false, description: '最小时间', example: '0' }
        ],
        responseType: 'IUserPostRes',
        responseFields: [
          { name: 'followings', type: 'array', description: '关注用户列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'total', type: 'number', description: '总数' }
        ]
      },
      {
        id: 'getFollowerList',
        name: '获取粉丝列表',
        description: '获取用户的粉丝列表',
        url: '/aweme/v1/web/user/follower/list/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'offset', type: 'number', required: false, description: '偏移量', example: '0' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'min_time', type: 'number', required: false, description: '最小时间', example: '0' }
        ],
        responseType: 'IUserPostRes',
        responseFields: [
          { name: 'followers', type: 'array', description: '粉丝用户列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'total', type: 'number', description: '总数' }
        ]
      }
    ]
  },
  {
    id: 'userContent',
    name: '用户内容',
    description: '获取用户作品、点赞等',
    icon: 'FileVideo',
    apis: [
      {
        id: 'getUserPost',
        name: '获取用户作品',
        description: '获取用户发布的视频作品列表',
        url: '/aweme/v1/web/aweme/post/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'max_cursor', type: 'number', required: false, description: '最大游标', example: '0' }
        ],
        responseType: 'IUserPostRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'max_cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserLike',
        name: '获取用户点赞',
        description: '获取用户点赞的视频列表',
        url: '/aweme/v1/web/aweme/favorite/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'max_cursor', type: 'number', required: false, description: '最大游标', example: '0' }
        ],
        responseType: 'IUserLikeRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'max_cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserMix',
        name: '获取用户合集',
        description: '获取用户创建的合集列表',
        url: '/aweme/v1/web/mix/list/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'cursor', type: 'string', required: false, description: '游标', example: '0' }
        ],
        responseType: 'IMixInfo',
        responseFields: [
          {
            name: 'mix_infos',
            type: 'array',
            description: '合集列表',
            children: [
              { name: 'mix_id', type: 'string', description: '合集ID' },
              { name: 'mix_name', type: 'string', description: '合集名称' },
              { name: 'desc', type: 'string', description: '合集描述' },
              { name: 'statis', type: 'object', description: '统计信息' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'string', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserMixDetail',
        name: '获取合集视频列表',
        description: '获取用户创建的合集详细信息（视频列表）',
        url: '/aweme/v1/web/mix/aweme/',
        method: 'GET',
        params: [
          { name: 'mix_id', type: 'string', required: true, description: '合集ID', example: '7123456789012345678' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'cursor', type: 'string', required: false, description: '游标', example: '0' }
        ],
        responseType: 'IUserMixDetailRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'string', description: '下一页游标' }
        ]
      },
      {
        id: 'getMixDetail',
        name: '获取合集详情',
        description: '获取合集的详细信息',
        url: '/aweme/v1/web/mix/detail/',
        method: 'GET',
        params: [
          { name: 'mix_id', type: 'string', required: true, description: '合集ID', example: '7123456789012345678' }
        ],
        responseType: 'IMixDetailRes',
        responseFields: [
          {
            name: 'mix_info',
            type: 'object',
            description: '合集信息',
            children: [
              { name: 'mix_id', type: 'string', description: '合集ID' },
              { name: 'mix_name', type: 'string', description: '合集名称' },
              { name: 'desc', type: 'string', description: '合集描述' },
              { name: 'cover_url', type: 'object', description: '封面图' }
            ]
          }
        ]
      },
      {
        id: 'getUserLocatePost',
        name: '获取用户当前作品列表',
        description: '获取用户当前打开的视频列表',
        url: '/aweme/v1/web/locate/post/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'max_cursor', type: 'number', required: false, description: '最大游标', example: '0' },
          { name: 'locate_item_id', type: 'string', required: false, description: '定位视频ID', example: '' }
        ],
        responseType: 'IUserPostRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'max_cursor', type: 'number', description: '下一页游标' }
        ]
      }
    ]
  },
  {
    id: 'collect',
    name: '收藏相关',
    description: '管理用户收藏内容',
    icon: 'Bookmark',
    apis: [
      {
        id: 'getUserCollectFloderList',
        name: '获取收藏夹列表',
        description: '获取用户的收藏夹列表',
        url: '/aweme/v1/web/collects/list/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'cursor', type: 'string', required: true, description: '分页游标', example: '0' }
        ],
        responseType: 'IUserCollectsListRes',
        responseFields: [
          {
            name: 'collects_list',
            type: 'array',
            description: '收藏夹列表',
            children: [
              { name: 'collects_id', type: 'string', description: '收藏夹ID' },
              { name: 'collects_name', type: 'string', description: '收藏夹名称' },
              { name: 'collects_count', type: 'number', description: '收藏数量' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'string', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserCollectFloderDetail',
        name: '获取收藏夹视频',
        description: '获取用户收藏夹下的视频列表',
        url: '/aweme/v1/web/collects/video/list/',
        method: 'GET',
        params: [
          { name: 'collects_id', type: 'string', required: true, description: '收藏夹ID', example: '7123456789012345678' },
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'cursor', type: 'string', required: true, description: '分页游标', example: '0' }
        ],
        responseType: 'IUserCollectFloderDetail',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'string', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserCollectVideo',
        name: '获取收藏的视频',
        description: '获取用户收藏的视频列表',
        url: '/aweme/v1/web/aweme/listcollection/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'cursor', type: 'number', required: true, description: '分页游标', example: '0' }
        ],
        responseType: 'IUserCollectVideo',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserCollectMusic',
        name: '获取收藏的音乐',
        description: '获取用户收藏的音乐列表',
        url: '/aweme/v1/web/music/listcollection/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'cursor', type: 'number', required: true, description: '分页游标', example: '0' }
        ],
        responseType: 'IUserCollectMusicRes',
        responseFields: [
          {
            name: 'music_list',
            type: 'array',
            description: '音乐列表',
            children: [
              { name: 'id', type: 'string', description: '音乐ID' },
              { name: 'title', type: 'string', description: '音乐标题' },
              { name: 'author', type: 'string', description: '作者' },
              { name: 'play_url', type: 'object', description: '播放地址' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserCollectMix',
        name: '获取收藏的合集',
        description: '获取用户收藏的合集列表',
        url: '/aweme/v1/web/mix/listcollection/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'cursor', type: 'string', required: true, description: '分页游标', example: '0' }
        ],
        responseType: 'IMixListRes',
        responseFields: [
          { name: 'mix_infos', type: 'array', description: '合集列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'string', description: '下一页游标' }
        ]
      }
    ]
  },
  {
    id: 'record',
    name: '观看记录',
    description: '用户观看历史和访客记录',
    icon: 'History',
    apis: [
      {
        id: 'getUserRecordVideo',
        name: '获取观看记录',
        description: '获取用户观看视频的记录',
        url: '/aweme/v1/web/history/read/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'max_cursor', type: 'number', required: true, description: '分页游标', example: '0' },
          {
            name: 'status',
            type: 'number',
            required: false,
            description: '观看进度',
            example: '-1',
            enum: [
              { label: '不限', value: '-1' },
              { label: '未看完', value: '0' },
              { label: '已看完', value: '1' }
            ]
          },
          {
            name: 'directory',
            type: 'number',
            required: false,
            description: '视频时长',
            example: '0',
            enum: [
              { label: '不限', value: '0' },
              { label: '小于1分钟', value: '1' },
              { label: '1-3分钟', value: '2' },
              { label: '3-10分钟', value: '3' },
              { label: '10分钟以上', value: '4' }
            ]
          },
          {
            name: 'category',
            type: 'number',
            required: false,
            description: '视频分类',
            example: '0',
            enum: [
              { label: '不限', value: '0' },
              { label: '二次元', value: '1' },
              { label: '音乐', value: '2' },
              { label: '体育', value: '3' },
              { label: '电影', value: '4' },
              { label: '游戏', value: '5' }
            ]
          }
        ],
        responseType: 'IVideoRecordRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'max_cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserRecordVs',
        name: '获取影视综记录',
        description: '获取用户观看影视综的记录',
        url: '/aweme/v1/web/lvideo/query/history/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: true, description: '数量', example: '20' },
          { name: 'cursor', type: 'number', required: true, description: '分页游标', example: '0' }
        ],
        responseType: 'IVsRecordRes',
        responseFields: [
          { name: 'list', type: 'array', description: '影视综列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserRecordLive',
        name: '获取直播记录',
        description: '获取用户观看直播的记录',
        url: '/aweme/v1/web/webcast/feed/',
        method: 'GET',
        params: [
          { name: 'max_time', type: 'number', required: true, description: '时间戳', example: '0' }
        ],
        responseType: 'ILiveRecordRes',
        responseFields: [
          { name: 'data', type: 'array', description: '直播列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' }
        ]
      },
      {
        id: 'getUserVisitedList',
        name: '获取访客记录',
        description: '获取用户的访客记录列表',
        url: '/aweme/v1/web/view/user/visited/list/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'cursor', type: 'string', required: false, description: '游标', example: '' }
        ],
        responseType: 'IUserVisitedListRes',
        responseFields: [
          {
            name: 'visited_list',
            type: 'array',
            description: '访客列表',
            children: [
              { name: 'user', type: 'object', description: '访客用户信息' },
              { name: 'visit_time', type: 'number', description: '访问时间' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'string', description: '下一页游标' }
        ]
      },
      {
        id: 'getWatchLaterList',
        name: '获取稍后再看',
        description: '获取稍后再看列表',
        url: '/aweme/v1/web/watchlater/list/',
        method: 'GET',
        params: [
          { name: 'offset', type: 'number', required: false, description: '偏移量', example: '0' }
        ],
        responseType: 'IWatchLaterListRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'total', type: 'number', description: '总数' }
        ]
      }
    ]
  },
  {
    id: 'other',
    name: '其他',
    description: '其他功能接口',
    icon: 'MoreHorizontal',
    apis: [
      {
        id: 'getFooterLinks',
        name: '获取底部链接',
        description: '获取底部栏热门链接',
        url: '/aweme/v1/web/seo/inner/link/',
        method: 'GET',
        params: [],
        responseType: 'FooterLinksRes',
        responseFields: [
          { name: 'links', type: 'array', description: '链接列表' }
        ]
      },
      {
        id: 'getImRelationList',
        name: '获取好友列表',
        description: '获取IM关系列表（分享好友列表）',
        url: '/aweme/v1/web/im/spotlight/relation/',
        method: 'GET',
        params: [
          { name: 'count', type: 'number', required: false, description: '数量', example: '50' },
          { name: 'max_time', type: 'number', required: false, description: '最大时间', example: '' },
          { name: 'min_time', type: 'number', required: false, description: '最小时间', example: '1550248238' }
        ],
        responseType: 'IImRelationRes',
        responseFields: [
          {
            name: 'followings',
            type: 'array',
            description: '好友列表',
            children: [
              { name: 'sec_uid', type: 'string', description: '用户加密ID' },
              { name: 'nickname', type: 'string', description: '昵称' },
              { name: 'avatar_thumb', type: 'object', description: '头像' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'min_time', type: 'number', description: '最小时间游标' },
          { name: 'max_time', type: 'number', description: '最大时间游标' }
        ]
      },
      {
        id: 'getAtList',
        name: '获取@用户列表',
        description: '获取可@的用户列表',
        url: '/aweme/v1/web/familiar/atlist/',
        method: 'GET',
        params: [
          { name: 'cursor', type: 'number', required: false, description: '游标', example: '0' },
          { name: 'scene', type: 'number', required: false, description: '场景', example: '2' },
          { name: 'group_id', type: 'string', required: false, description: '分组ID', example: '' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' }
        ],
        responseType: 'IAtListRes',
        responseFields: [
          {
            name: 'user_list',
            type: 'array',
            description: '用户列表',
            children: [
              { name: 'sec_uid', type: 'string', description: '用户加密ID' },
              { name: 'nickname', type: 'string', description: '昵称' },
              { name: 'unique_id', type: 'string', description: '抖音号' }
            ]
          },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      },
      {
        id: 'getUserHomeSearch',
        name: '用户主页搜索',
        description: '搜索用户喜欢的视频等',
        url: '/aweme/v1/web/home/search/item/',
        method: 'GET',
        params: [
          { name: 'sec_user_id', type: 'string', required: true, description: '用户加密ID', example: 'MS4wLjABAAAA...' },
          { name: 'keyword', type: 'string', required: true, description: '搜索关键词', example: '' },
          { name: 'count', type: 'number', required: false, description: '数量', example: '20' },
          { name: 'cursor', type: 'number', required: false, description: '游标', example: '0' }
        ],
        responseType: 'IUserHomeSearchRes',
        responseFields: [
          { name: 'aweme_list', type: 'array', description: '视频列表' },
          { name: 'has_more', type: 'boolean', description: '是否有更多' },
          { name: 'cursor', type: 'number', description: '下一页游标' }
        ]
      }
    ]
  }
]

/**
 * 获取所有 API 的扁平列表
 */
export function getAllApis() {
  return apiRegistry.flatMap(category => category.apis)
}

/**
 * 根据 ID 查找 API
 */
export function findApiById(id: string) {
  for (const category of apiRegistry) {
    const api = category.apis.find(a => a.id === id)
    if (api) return api
  }
  return null
}

/**
 * 根据关键词搜索 API
 */
export function searchApis(keyword: string) {
  const lowerKeyword = keyword.toLowerCase()
  return getAllApis().filter(api =>
    api.name.toLowerCase().includes(lowerKeyword) ||
    api.description.toLowerCase().includes(lowerKeyword) ||
    api.url.toLowerCase().includes(lowerKeyword)
  )
}
