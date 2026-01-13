export default {
  // ----------------- 登录 -----------------
  login: `/as/accounts/login`,

  // ----------------- 测试dy-url -----------------
  search: `/aweme/v1/web/general/search/single/`,
  suggest_words: `/aweme/v1/web/api/suggest_words/`,
  //首页视频流,
  home_feed: `/aweme/v2/web/module/feed/`,
  recomend_feed: `/aweme/v1/web/tab/feed/`,
  video_detail: `/aweme/v1/web/aweme/detail/`,
  video_related: `/aweme/v1/web/aweme/related/`,

  //用户信息
  user_info: `/aweme/v1/web/user/profile/self/`,
  //其他用户信息
  user_other_info: `/aweme/v1/web/user/profile/other/`,
  //用户作品列表
  user_post: `/aweme/v1/web/aweme/post/`,
  //用户当前的作品列表
  user_locate_post: `/aweme/v1/web/locate/post/`,

  //用户创建的合集
  user_mix: `/aweme/v1/web/mix/list/`,
  // 用户创建的合集详细信息（视频列表）
  user_mix_detail: `/aweme/v1/web/mix/aweme/`,
  // 合集详情
  mix_detail: `/aweme/v1/web/mix/detail/`,
  //用户的点赞列表
  user_like: `/aweme/v1/web/aweme/favorite/`,
  //用户收藏夹列表
  user_collect_folder: `/aweme/v1/web/collects/list/`,
  //用户收藏夹详细信息
  user_collect_folder_detail: `/aweme/v1/web/collects/video/list/`,
  //用户的收藏视频列表
  user_collect_video: `/aweme/v1/web/aweme/listcollection/`,
  //用户收藏的音乐列表
  user_collect_music: `/aweme/v1/web/music/listcollection/`,
  //用户收藏的合集列表
  user_collect_mix: `/aweme/v1/web/mix/listcollection/`,
  //用户的关注列表
  user_follow: `/aweme/v1/web/user/following/list/`,
  //用户的粉丝列表
  user_fans: `/aweme/v1/web/user/follower/list/`,
  //用户观看记录
  user_record_video: `/aweme/v1/web/history/read/`,
  user_record_vs: `/aweme/v1/web/lvideo/query/history/`,
  user_record_live: `/aweme/v1/web/webcast/feed/`,
  //用户页搜索
  user_home_search: `/aweme/v1/web/home/search/item/`,
  //评论
  comment_list: `/aweme/v1/web/comment/list/`,
  //评论回复
  comnet_reply: `/aweme/v1/web/comment/list/reply/`,

  // 底部栏热门
  footer_link: '/aweme/v1/web/seo/inner/link/',

  //搜索框热搜
  hot_search: '/aweme/v1/web/hot/search/list/',
  //搜索建议
  search_sug: '/aweme/v1/web/search/sug/',
  //用户访客记录
  user_visited_list: '/aweme/v1/web/view/user/visited/list/',
  //稍后再看列表
  watch_later_list: '/aweme/v1/web/watchlater/list/',
  // IM关系列表（分享好友列表）
  im_relation_list: '/aweme/v1/web/im/spotlight/relation/',
  // @用户列表
  at_list: '/aweme/v1/web/familiar/atlist/',
  // 短剧列表
  series_list: '/aweme/v1/web/series/list/',
  // 私密作品列表
  private_aweme: '/aweme/v1/web/private/aweme/',
  // 关注视频流
  follow_feed: '/aweme/v1/web/follow/feed/',
  // 关注直播列表
  follow_live_feed: '/webcast/web/feed/follow/'
  // ----------------- 测试dy-url -----------------
}
