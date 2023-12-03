import { Button, Input, SideSheet, Switch } from '@douyinfe/semi-ui'
import styles from './style/create.module.scss'
import cs from 'classnames'
import { useState } from 'react'
import { IconSearch } from '@douyinfe/semi-icons'
import { Checkbox } from '@douyinfe/semi-ui/lib/es/checkbox'
const Create = () => {
  const [visible, setVisible] = useState(false)
  const change = () => {
    setVisible(!visible)
  }
  return (
    <div className={styles['micro-collection--create']}>
      <div className={styles['card-collection-create']}>
        <div className={styles['title--create']}>
          <p className={styles.title}>创建合集</p>
        </div>
        <div className={styles['container--create']}>
          <div className={styles['desc-section']}>
            <div className={styles['input-section']}>
              <p className={styles['input-label']}>
                合集标题
                <span style={{ color: 'rgb(250, 57, 47)' }}>*</span>
              </p>
              <div className={styles['input--title']}>
                <input
                  className={styles['input-inner']}
                  placeholder="请输入合集标题"
                  maxLength={20}
                />
                <div className={styles['counter']}>0/20</div>
              </div>
              <p className={styles['input-label']}>合集简介</p>
              <div className={cs(styles['input--title'], styles['input-desc'])}>
                <textarea
                  className={styles['input-inner']}
                  placeholder="请输入合集简介"
                  rows={4}
                  maxLength={200}
                />
                <div className={styles['counter']}>0/200</div>
              </div>
            </div>
            <div className={styles['input-vertical']}></div>

            <div className={styles['upload-btn']}>
              <p className={styles['input-label']}>
                合集封面
                <span style={{ color: 'rgb(250, 57, 47)' }}>*</span>
                <div className={styles['cover']}>
                  <div className={styles['cover-icon']}>
                    <svg width="30" height="23" viewBox="0 0 30 23" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M22.786 6.744a8.667 8.667 0 10-16.884 3.938 6 6 0 00.432 11.985h15.333a8 8 0 001.12-15.923zm-7.359.278a.667.667 0 00-.854 0l-6.865 5.722c-.24.2-.099.59.213.59h4.413v6c0 .367.298.666.666.666h4a.667.667 0 00.667-.667v-6h4.413c.311 0 .453-.39.213-.59l-6.866-5.72z"
                        fill="#9B9EA0"
                      ></path>
                    </svg>
                  </div>
                  <p> 上传合集封面</p>
                </div>
                <p className={styles['cover-prompt']}>
                  文件大小不超过5M，分辨率至少为100*100，1080*1080最佳
                </p>
              </p>
              <input
                className={styles['upload-btn-input']}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
              />
            </div>
          </div>
          <div className="wrapper">
            <div className={styles['label--config']}>
              <div className={styles['label-title']}>合集付费配置</div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                focusable="false"
                color="rgba(37, 38, 50, 0.35)"
                style={{ marginLeft: '4px' }}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM11.8281 14.6094C10.9688 14.6094 10.5391 14.0723 10.5391 13.3691C10.5391 12.3242 11.0566 11.6504 12.2676 10.7324C12.2894 10.7158 12.3111 10.6993 12.3326 10.6829C13.1573 10.0555 13.7324 9.61807 13.7324 8.82812C13.7324 7.93945 12.9023 7.42188 11.9746 7.42188C11.2129 7.42188 10.627 7.70508 10.168 8.30078C9.83594 8.64258 9.57227 8.82812 9.12305 8.82812C8.38086 8.82812 8 8.31055 8 7.71484C8 7.10938 8.3418 6.49414 8.87891 6.02539C9.60156 5.40039 10.7539 5 12.2773 5C14.9922 5 16.8965 6.33789 16.8965 8.64258C16.8965 10.3223 15.8906 11.1328 14.709 11.9531C13.9082 12.5391 13.5273 12.8809 13.2246 13.5742L13.2238 13.5756C12.8922 14.1609 12.638 14.6094 11.8281 14.6094ZM11.8086 18.7695C10.8711 18.7695 10.0996 18.1641 10.0996 17.2266C10.0996 16.2891 10.8711 15.6836 11.8086 15.6836C12.7461 15.6836 13.5078 16.2891 13.5078 17.2266C13.5078 18.1641 12.7461 18.7695 11.8086 18.7695Z"
                  fill="currentColor"
                ></path>
              </svg>
              <Switch className={styles['switch--config']} checked={false} />
            </div>

            <div className="content">
              <div className={styles['close-tip']}>
                提示：打开付费开关，则该合集变为付费合集，可为合集配置价格进行售卖
              </div>
            </div>
          </div>

          <div className={styles['collection-section']}>
            <div className={styles['sub-title']}>
              <span>合集内作品 0</span>
            </div>

            <div
              className={styles['add-section']}
              onClick={() => setVisible(true)}
            >
              <div className={styles['empty--add']}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  className={styles['empty-icon--add']}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M26 13c0 7.18-5.82 13-13 13S0 20.18 0 13 5.82 0 13 0s13 5.82 13 13zm-19-.5a.5.5 0 01.5-.5H12V7.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5V12h4.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H14v4.5a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5V14H7.5a.5.5 0 01-.5-.5v-1z"
                    fill="#9B9EA0"
                  ></path>
                </svg>
                <div className={styles['empty-title--add']}>点击添加作品</div>
                <div className={styles['empty-subTitle--add']}>
                  添加上传的视频作品到你的合集里
                </div>
              </div>
            </div>

            <div
              className={styles['collection-operation--create']}
              style={{
                height: '53px',
                lineHeight: '53px',
                width: '912px',
                paddingLeft: '40px',
                left: '-40px',
                bottom: '-40px',
                position: 'absolute'
              }}
            >
              <Button
                type="primary"
                theme="solid"
                className={styles['btn-create']}
              >
                创建
              </Button>
              <Button type="primary">取消</Button>

              <SideSheet title="作品列表" visible={visible} onCancel={change}>
                <div className={styles['container--sidebar']}>
                  <div className={styles['search-container']}>
                    <Input
                      prefix={<IconSearch />}
                      placeholder={'请输入作品描述查找作品'}
                    />
                  </div>
                  <div className={styles['header-info']}>
                    <div className={styles['checkbox--content']}>
                      <Checkbox />
                      <div className={styles['label--text']}>
                        只看可添加的作品
                      </div>
                    </div>
                    <span className={styles['header-total']}>共 0 个作品</span>
                  </div>
                  <div className={styles['main--sidebar']}>
                    <div className={styles['load-more--manage']}>
                      <div className={styles['loading-text--manage']}>
                        没有更多视频
                      </div>
                    </div>
                  </div>
                </div>
              </SideSheet>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Create
