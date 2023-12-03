import { TabPane, Tabs } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { useNavigate } from 'react-router-dom'

const Collection = () => {
  const navigator = useNavigate()
  //跳转到创建合集页面
  const handleCreateCollection = () => {
    console.log('跳转到创建合集页面')
    navigator('/creator-micro/content/collection/create')
  }
  return (
    <div className={styles['micro--collection']}>
      <div className={styles['container--collection']}>
        <p className={styles['title--collection']}>我的合集</p>

        <Tabs defaultActiveKey="1">
          <TabPane tab="全部合集" itemKey="1">
            <div className={styles['container--collection']}>
              <div className="collection-content">
                <div
                  className={styles['empty--collection']}
                  onClick={handleCreateCollection}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    className={styles['empty-icon--collection']}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M26 13c0 7.18-5.82 13-13 13S0 20.18 0 13 5.82 0 13 0s13 5.82 13 13zm-19-.5a.5.5 0 01.5-.5H12V7.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V12h4.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H14v4.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V14H7.5a.5.5 0 01-.5-.5v-1z"
                      fill="#9B9EA0"
                    ></path>
                  </svg>
                  <div className={styles['empty-title--collection']}>
                    自定义创建合集
                  </div>
                  <div className={styles['empty-subTitle--collection']}>
                    你没有合集，点击创建合集
                  </div>
                </div>
              </div>
              <div className={styles['load-more--manage']}>
                <div className={styles['loading-text--manage']}>
                  没有更多合集
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="待发布" itemKey="2">
            <div className={styles['container--collection']}>
              <div className="collection-content"></div>
              <div className={styles['load-more--manage']}>
                <div className={styles['loading-text--manage']}>
                  没有更多合集
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tab="已发布" itemKey="3">
            <div className={styles['container--collection']}>
              <div className={styles['container--collection']}>
                <div className="collection-content"></div>
                <div className={styles['load-more--manage']}>
                  <div className={styles['loading-text--manage']}>
                    没有更多合集
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="审核中" itemKey="4">
            <div className={styles['container--collection']}>
              <div className={styles['container--collection']}>
                <div className="collection-content"></div>
                <div className={styles['load-more--manage']}>
                  <div className={styles['loading-text--manage']}>
                    没有更多合集
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="未通过" itemKey="5">
            <div className={styles['container--collection']}>
              <div className={styles['container--collection']}>
                <div className="collection-content"></div>
                <div className={styles['load-more--manage']}>
                  <div className={styles['loading-text--manage']}>
                    没有更多合集
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Collection
