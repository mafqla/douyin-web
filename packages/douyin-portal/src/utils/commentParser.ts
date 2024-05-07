import emojiList from '@/components/common/dy-input/emojiList'
export const getEmojiUrl = (emojiCode: string): string | null => {
  const emoji = emojiList.find((emoji) => emoji.display_name === emojiCode)
  if (
    emoji &&
    emoji.emoji_url &&
    emoji.emoji_url.url_list &&
    emoji.emoji_url.url_list.length > 0
  ) {
    return emoji.emoji_url.url_list[0]
  } else {
    return null
  }
}

export const handleCommentParser = (content: string): string => {
  //1. 匹配content中的表情符号，[]替换为img标签
  let parsedContent = content.replace(/\[([^\[\]]+)\]/g, (match, emojiCode) => {
    const emojiUrl = getEmojiUrl(match)
    // console.log('emojiUrl:', emojiUrl)
    if (emojiUrl) {
      return `<img src="${emojiUrl}" alt="${match}" style="margin: 0px 4px; vertical-align: text-bottom;"/>`
    }
    return match
  })
  //2. 匹配content中的@用户，@用户文本为 '@用户名 '，替换为a标签加span标签
  parsedContent = parsedContent.replace(/@([^\s]+)\s/g, (match) => {
    return `<a href="#" class="header-name-link"><span>${match}</span></a>`
  })
  return parsedContent
}
