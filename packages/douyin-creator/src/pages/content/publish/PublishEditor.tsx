import { Input, Popover, Tag } from '@douyinfe/semi-ui'
import styles from './style/publish-editor.module.scss'
import cs from 'classnames'

const PublishEditor: React.FC = () => {
  return (
    <div className={styles['editor-container']}>
      <div className={styles['editor-comp-publish-container']}>
        <div className={styles['editor-kit-root-container']}>
          <div className={styles['editor-kit-editor-container']}>
            <div className={styles['container--input']}>
              <Input
                placeholder="好的作品标题可获得更多浏览"
                suffix={<span className={styles['lmit-word']}>0/30</span>}
              />
            </div>

            <div className={styles['editor-kit-outer-container']}>
              <div
                className={styles['editor-kit-container']}
                contentEditable="true"
                spellCheck="false"
                style={{ height: '97px' }}
                data-placeholder="添加作品简介"
              ></div>
            </div>
            <div className={styles.toolbar}>
              <div>
                <div className={styles['toolbar-comp-container']}>
                  <div className={styles['toolbar-comp-button-container']}>
                    <div className={styles['toolbar-button']}>#添加话题</div>
                    <div className={styles['toolbar-button']}>@好友</div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  textAlign: 'right',
                  color: 'rgba(37, 38, 50, 0.6)',
                  fontSize: '12px'
                }}
              >
                0 / 1000
              </div>
            </div>
            <div>
              <div className={styles.line}></div>
              <div className={styles['container--re']}>
                <div className={styles['title--re']}>推荐</div>
                <div className={styles['list--re']}>
                  <Tag
                    className={styles['margin-tag']}
                    color="white"
                    type="light"
                  >
                    #推荐话题
                  </Tag>
                  <Tag
                    className={styles['margin-tag']}
                    color="white"
                    type="light"
                  >
                    #推荐话题
                  </Tag>
                  <Tag
                    className={styles['margin-tag']}
                    color="white"
                    type="light"
                  >
                    #推荐话题
                  </Tag>
                  <Tag
                    className={styles['margin-tag']}
                    color="white"
                    type="light"
                  >
                    #推荐话题
                  </Tag>
                </div>

                <Popover
                  showArrow
                  position="bottomRight"
                  style={{
                    width: '550px',
                    padding: '1px 8px 4px 1px',
                    marginTop: '4px',
                    marginRight: '-10px'
                  }}
                  content={
                    <div>
                      <Tag
                        className={cs(styles['margin-tag'], styles['more-tag'])}
                        color="white"
                        type="light"
                      >
                        #推荐话题
                      </Tag>
                    </div>
                  }
                >
                  <Tag className={styles['more-tag']} type="light">
                    +15
                  </Tag>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishEditor
