export interface ISuggestWords {
  // 推荐词汇的数组，每个元素包含一组推荐词汇及其相关信息
  suggest_words: SuggestWordItem[]
}

/**
 * 定义一个表示单个推荐词汇项的接口
 */
interface SuggestWordItem {
  // 词汇对象数组，每个对象包含一个推荐词汇及其唯一标识符和附加信息
  words: Word[]
  // 推荐词汇出现的场景，例如评论区顶部推荐、详情页内推荐等
  scene: string
  // 推荐词汇旁边的图标链接，当前为空字符串表示没有图标
  icon_url: string
  // 推荐词汇旁边的提示文本，例如“大家都在搜：”
  hint_text: string
  // 额外信息，可能包含一些用于搜索或推荐的附加数据
  extra_info: string
}

interface Word {
  // 推荐词汇的文本
  word: string
  // 词汇的唯一标识符
  word_id: string
  // 词汇的附加信息，通常包含一些用于搜索或推荐的附加数据
  info: string
}
