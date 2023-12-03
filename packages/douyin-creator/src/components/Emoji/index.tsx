import { FC, MouseEvent } from 'react'
import emojiList from './emojiList'
import styles from './index.module.scss'

interface EmojiProps {
  onSelectEmoji: (emoji: EmojiItem) => void
}

interface EmojiItem {
  origin_uri: string
  display_name: string
  hide: number
  emoji_url: {
    uri: string
    url_list: string[]
  }
}

const Emoji: FC<EmojiProps> = ({ onSelectEmoji }) => {
  const handleSelectEmoji = (
    emoji: EmojiItem,
    event: MouseEvent<HTMLImageElement>
  ) => {
    event.preventDefault()
    onSelectEmoji(emoji)
  }

  return (
    <div className={styles['cmt-emoji']}>
      {emojiList.map((emoji, index) => (
        <img
          key={index}
          src={emoji.emoji_url.url_list[0]}
          alt={emoji.display_name}
          onClick={(e) => handleSelectEmoji(emoji, e)}
        />
      ))}
    </div>
  )
}

export default Emoji
