import { IconChevronRight } from '@douyinfe/semi-icons'
import './style/title-card.scss'

interface PropsTitle {
  title: string
  subTitle?: string
  hasmore?: boolean
  onMoreClick?: () => void
}

const TitleCard: React.FC<PropsTitle> = ({
  title,
  subTitle,
  hasmore,
  onMoreClick
}) => {
  return (
    <div className="titleWrapper">
      <span className="title">{title}</span>
      {subTitle && <span className="subTitle">{subTitle}</span>}
      {hasmore && (
        <div className="hasMore" onClick={onMoreClick}>
          <span>更多</span>
          <IconChevronRight />
        </div>
      )}
    </div>
  )
}

export default TitleCard
