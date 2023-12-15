import { Select } from '@douyinfe/semi-ui'
import styles from './style/hotspot-selection.module.scss'

const HotspotSelection: React.FC = () => {
  return (
    <div className={styles['container-hot']}>
      <div className={styles['header']}>
        <span className={styles['title-hot']}>申请关联热点</span>
        <div className={styles['icon']}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 13.417A6.417 6.417 0 107 .583a6.417 6.417 0 000 12.834zm-.1-4.895c-.502 0-.752-.313-.752-.723 0-.61.302-1.003 1.008-1.538l.038-.03c.481-.365.817-.62.817-1.081 0-.518-.485-.82-1.026-.82-.444 0-.786.165-1.054.512-.193.2-.347.308-.61.308-.432 0-.654-.302-.654-.65 0-.353.2-.712.512-.985.422-.365 1.094-.598 1.983-.598 1.583 0 2.694.78 2.694 2.125 0 .98-.586 1.452-1.276 1.93-.467.343-.689.542-.866.946v.001c-.194.342-.342.603-.814.603zm-.012 2.427c-.547 0-.997-.353-.997-.9s.45-.9.997-.9c.547 0 .992.353.992.9s-.445.9-.992.9z"
              fill="#1C1F23"
              fillOpacity="0.35"
            ></path>
          </svg>
        </div>
      </div>
      <Select
        placeholder="请输入热点词"
        showClear={true}
        style={{ width: '100%' }}
      ></Select>
    </div>
  )
}

export default HotspotSelection
