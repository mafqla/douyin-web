import { Popover } from '@douyinfe/semi-ui'
import styles from './index.module.scss'
import React from 'react'

type Props = {
  icon: React.ReactNode
  content: string
  position:
    | 'left'
    | 'right'
    | 'top'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTopOver'
    | 'rightTopOver'
    | 'leftBottomOver'
    | 'rightBottomOver'
}

const CustomPopover: React.FC<Props> = ({ icon, content, position }) => {
  return (
    <Popover
      position={position}
      content={<div className={styles['custom-head-tips']}>{content}</div>}
      style={{
        transformOrigin: '0% 50%',
        padding: '8px 12px',
        backgroundColor: 'rgb(196, 196, 196)'
      }}
    >
      {icon}
    </Popover>
  )
}

export default CustomPopover
