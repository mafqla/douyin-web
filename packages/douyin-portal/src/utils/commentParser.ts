import type { TextExtraItem } from '@/api/tyeps/request_response/commentListRes'
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

export const handleCommentParser = (
  content: string,
  textExtra?: TextExtraItem[]
): string => {
  let parsedContent = content

  // 1. 根据传入的textExtra，替换content中的文本额外信息
  if (textExtra && textExtra.length > 0) {
    // 按 start 位置降序排列，避免替换时影响后续替换
    textExtra.sort((a, b) => b.start - a.start)

    textExtra.forEach((item) => {
      const username = content.slice(item.start, item.end).trim()
      const replacement = `<a href="/user/${item.sec_uid}" class="header-name-link" target="_blank"><span>${username}</span></a>`
      parsedContent =
        parsedContent.slice(0, item.start) +
        replacement +
        parsedContent.slice(item.end)
    })
  }

  // 2. 匹配content中的表情符号，[]替换为img标签
  parsedContent = parsedContent.replace(
    /\[([^\[\]]+)\]/g,
    (match, emojiCode) => {
      const emojiUrl = getEmojiUrl(match)
      if (emojiUrl) {
        return `<img class="emoji-img" src="${emojiUrl}" alt="${match}" style="margin: 0px 4px; vertical-align: text-bottom;"/>`
      }
      return match
    }
  )

  return parsedContent
}
