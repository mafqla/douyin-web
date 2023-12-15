import { Select } from '@douyinfe/semi-ui'
import styles from './style/mix-selection.module.scss'

const MixSelection: React.FC = () => {
  return (
    <div className={styles['mix-sel-wrap']}>
      <div className={styles['title-mix-add']}>
        <p className={styles['title-main']}>添加到</p>
      </div>
      <div className={styles['sel-area']}>
        <Select defaultValue={'1'} className={styles['select-mix-type']}>
          <Select.Option value="1">合集</Select.Option>
        </Select>
        <Select
          placeholder="请选择合集"
          className={styles['select-collection']}
        >
          <Select.Option value="1">不选择合集</Select.Option>
        </Select>
      </div>
    </div>
  )
}

export default MixSelection
