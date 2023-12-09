import React from 'react'
import './index.scss'

interface EmptyProps {
  className?: string
  text?: string
  children?: React.ReactNode
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLElement>
  image?: string
}

const Empty: React.FC<EmptyProps> = ({
  className,
  text,
  children,
  style,
  onClick,
  image
}) => {
  return (
    <div
      className={`empty-container ${className || ''}`}
      style={style}
      onClick={onClick}
    >
      <img
        alt="empty"
        src={
          image ||
          '//lf6-cdn-tos.bytescm.com/obj/static/douyin_creator/fe/pc/static/image/empty-work.7069cf23.png'
        }
        className="empty-image"
      />
      <div className="empty-text">{text}</div>
      {children}
    </div>
  )
}

export default Empty
