import { Tooltip } from '@douyinfe/semi-ui'
import styles from './style/activity-rewards.module.scss'
import cs from 'classnames'
import { IconChevronRight } from '@douyinfe/semi-icons'
const ActivityRewards: React.FC = () => {
  return (
    <div>
      <div className={styles['title-activity']}>
        <p className={styles['title-main']}>
          作品活动奖励
          <Tooltip
            position="topLeft"
            style={{ maxWidth: '900px' }}
            content="添加活动将有机会获得流量奖励"
          >
            <span className={styles['icon']}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7 13.417A6.417 6.417 0 107 .583a6.417 6.417 0 000 12.834zm-.1-4.895c-.502 0-.752-.313-.752-.723 0-.61.302-1.003 1.008-1.538l.038-.03c.481-.365.817-.62.817-1.081 0-.518-.485-.82-1.026-.82-.444 0-.786.165-1.054.512-.193.2-.347.308-.61.308-.432 0-.654-.302-.654-.65 0-.353.2-.712.512-.985.422-.365 1.094-.598 1.983-.598 1.583 0 2.694.78 2.694 2.125 0 .98-.586 1.452-1.276 1.93-.467.343-.689.542-.866.946v.001c-.194.342-.342.603-.814.603zm-.012 2.427c-.547 0-.997-.353-.997-.9s.45-.9.997-.9c.547 0 .992.353.992.9s-.445.9-.992.9z"
                  fill="#1C1F23"
                  fillOpacity="0.35"
                ></path>
              </svg>
            </span>
            <svg
              width="32"
              height="14"
              viewBox="0 0 32 14"
              fill="none"
              className={styles['new-icon']}
            >
              <rect
                y="0.5"
                width="32"
                height="13"
                rx="6.5"
                fill="#FFE8E9"
              ></rect>
              <path
                d="M4.762 10.5V3.342h.971l3.76 5.62v-5.62h.908V10.5H9.43L5.67 4.875V10.5h-.908zm7.256 0V3.342h5.175v.845h-4.228v2.192h3.96v.84h-3.96v2.436h4.394v.845h-5.341zm7.9 0l-1.9-7.158h.972l1.09 4.692c.116.492.217.98.302 1.465.182-.765.29-1.206.322-1.323l1.362-4.834h1.143l1.025 3.623c.257.898.443 1.743.557 2.534.091-.452.21-.972.357-1.558l1.122-4.6h.953L25.26 10.5h-.913l-1.51-5.454a23.052 23.052 0 01-.224-.84c-.075.329-.145.609-.21.84L20.885 10.5h-.967z"
                fill="#FF2C55"
              ></path>
            </svg>
          </Tooltip>
        </p>

        <div className={styles['more-text']}>
          了解更多官方活动
          <IconChevronRight />
        </div>
      </div>

      <div className={styles['activity-list-container']}>
        <div className={styles['activity--content']}>
          <div className={styles['activity--top']}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              focusable="false"
              className={styles['activity--logo']}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0727 1H12.2688V1.05774V8.27562H12.2688V16.1286H12.2666C12.206 17.8291 10.8109 19.189 9.0988 19.189C7.3481 19.189 5.92889 17.7671 5.92889 16.0131C5.92889 14.2591 7.3481 12.8373 9.0988 12.8373C9.46215 12.8373 9.81123 12.8985 10.1363 13.0113V9.10303C9.79781 9.05245 9.45136 9.02624 9.0988 9.02624C5.24727 9.02624 2.125 12.1544 2.125 16.0131C2.125 19.8719 5.24727 23 9.0988 23C12.9503 23 16.0726 19.8719 16.0726 16.0131H16.0727V8.47579C17.566 9.54917 19.3969 10.1811 21.375 10.1811V6.37008C18.4466 6.37008 16.0727 3.99166 16.0727 1.05774V1Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className={styles['title--activity']}>全民悦读会第五季</span>
          </div>
          <div className={cs(styles['activity--bottom'], styles.add)}>
            <div className={styles.added}>
              <div className={styles.hover}>
                <svg
                  className={styles['add-icon']}
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.5 12C7.5 11.4477 7.94772 11 8.5 11H11V8.50001C11 7.94772 11.4477 7.50001 12 7.50001C12.5523 7.50001 13 7.94772 13 8.50001V11H15.5C16.0523 11 16.5 11.4477 16.5 12C16.5 12.5523 16.0523 13 15.5 13H13V15.5C13 16.0523 12.5523 16.5 12 16.5C11.4477 16.5 11 16.0523 11 15.5V13H8.5C7.94772 13 7.5 12.5523 7.5 12Z"></path>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20.5C7.30558 20.5 3.5 16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5Z"></path>
                </svg>
                添加
              </div>
            </div>
            <div className={styles['detail']}>活动详细</div>
          </div>
        </div>
        <div className={styles['activity--content']}>
          <div className={styles['activity--top']}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              focusable="false"
              className={styles['activity--logo']}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0727 1H12.2688V1.05774V8.27562H12.2688V16.1286H12.2666C12.206 17.8291 10.8109 19.189 9.0988 19.189C7.3481 19.189 5.92889 17.7671 5.92889 16.0131C5.92889 14.2591 7.3481 12.8373 9.0988 12.8373C9.46215 12.8373 9.81123 12.8985 10.1363 13.0113V9.10303C9.79781 9.05245 9.45136 9.02624 9.0988 9.02624C5.24727 9.02624 2.125 12.1544 2.125 16.0131C2.125 19.8719 5.24727 23 9.0988 23C12.9503 23 16.0726 19.8719 16.0726 16.0131H16.0727V8.47579C17.566 9.54917 19.3969 10.1811 21.375 10.1811V6.37008C18.4466 6.37008 16.0727 3.99166 16.0727 1.05774V1Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className={styles['title--activity']}>全民悦读会第五季</span>
          </div>
          <div className={styles['activity--bottom']}>
            <div className={styles['score--activity']}>热度：2.3万</div>
          </div>
        </div>
        <div className={styles['activity--content']}>
          <div className={styles['activity--top']}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              focusable="false"
              className={styles['activity--logo']}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0727 1H12.2688V1.05774V8.27562H12.2688V16.1286H12.2666C12.206 17.8291 10.8109 19.189 9.0988 19.189C7.3481 19.189 5.92889 17.7671 5.92889 16.0131C5.92889 14.2591 7.3481 12.8373 9.0988 12.8373C9.46215 12.8373 9.81123 12.8985 10.1363 13.0113V9.10303C9.79781 9.05245 9.45136 9.02624 9.0988 9.02624C5.24727 9.02624 2.125 12.1544 2.125 16.0131C2.125 19.8719 5.24727 23 9.0988 23C12.9503 23 16.0726 19.8719 16.0726 16.0131H16.0727V8.47579C17.566 9.54917 19.3969 10.1811 21.375 10.1811V6.37008C18.4466 6.37008 16.0727 3.99166 16.0727 1.05774V1Z"
                fill="currentColor"
              ></path>
            </svg>
            <span className={styles['title--activity']}>全民悦读会第五季</span>
          </div>
          <div className={styles['activity--bottom']}>
            <div className={styles['score--activity']}>热度：2.3万</div>
          </div>
        </div>
        <div className={styles['more--content']}>+33</div>
      </div>
    </div>
  )
}

export default ActivityRewards
