import React from 'react'
import { Typography, Badge } from '@douyinfe/semi-ui'
import styles from './style/index.module.less'

const { Text } = Typography
interface TooltipProps {
  title: string
  data: {
    name: string
    value: string
    color: string
  }[]
  color?: string
  name?: string
  formatter?: (value: string) => React.ReactNode
}

function CustomTooltip(props: TooltipProps) {
  const { formatter = (value) => value, color, name } = props
  return (
    <div className={styles['customer-tooltip']}>
      <div className={styles['customer-tooltip-title']}>
        <Text strong>{props.title}</Text>
      </div>
      <div>
        {props.data.map((item, index) => (
          <div className={styles['customer-tooltip-item']} key={index}>
            <div>
              <Badge style={{ color: color || item.color }} />
              {name || item.name}
            </div>
            <div>
              <Text strong>{formatter(item.value)}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomTooltip
