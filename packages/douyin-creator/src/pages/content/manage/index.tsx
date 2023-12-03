import { Input, TabPane, Tabs } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import { IconDelete, IconSearch } from '@douyinfe/semi-icons'
import cs from 'classnames'
const Index = () => {
  return (
    <div className={styles['micro--manage']}>
      <div className={styles['card--manage']}>
        <div className={styles['title--manage']}>
          <div className={styles['card-head--manage']}>
            <div>作品管理</div>
            <div className="search">
              <Input
                className={styles['search-input--manage']}
                prefix={<IconSearch />}
                placeholder={'搜索作品'}
              />
            </div>
          </div>
        </div>

        <Tabs
          defaultActiveKey="1"
          tabBarExtraContent={
            <div className={styles['content-header-total--manage']}>
              共11个作品
            </div>
          }
        >
          <TabPane tab="全部作品" itemKey="1">
            <div className={styles['content-body--manage']}>
              <div className={styles['video-card--manage']}>
                <div
                  className={styles['video-card-cover--manage']}
                  style={{
                    backgroundImage:
                      'url(https://p26-sign.douyinpic.com/tos-cn-i-dy/c871caa543f241f9a16422a3eef6ae96~c5_300x400.webp?x-expires=1702785600&x-signature=%2BvC%2BGiCIjmXdd8qi687HSgEaDiI%3D&from=3213915784_large&s=PackSourceEnum_SERIES_WEB&se=false&sc=cover&biz_tag=aweme_video&l=20231203123025A07D2E592F87CCF57155)',
                    backgroundColor: 'rgb(0, 0, 0)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  <div className={styles['video-card-top']}></div>
                  <div className={styles['video-card-bottom']}></div>
                  <div className={styles['video-left-top-tag']}></div>
                  <span className={styles['img-top--manage']}></span>
                  <span className={styles['badge--manage']}>00:15</span>
                  <span className={styles['private-mark']}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.4 0A1.4 1.4 0 002 1.4V3a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2V1.4A1.4 1.4 0 006.6 0H3.4zM4 3V2h2v1H4zm0 2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-2z"
                        fill="#fff"
                      ></path>
                    </svg>
                    私密
                  </span>
                </div>
                <div className={styles['video-card-info--stqta']}>
                  <div
                    className={cs(
                      styles['info-title-text'],
                      styles['info-title-small-desc'],
                      styles['info-title-text-disable']
                    )}
                  >
                    无作品描述
                  </div>
                  <div className={styles['info-row--manage']}>
                    <div className={styles['info-figure']}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <g clipPath="url(#eye_svg__clip0)">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.956 7.244s-.058.184-.117.245c-.037.118-.1.237-.17.372-.04.074-.08.152-.122.239-.292.489-.702 1.1-1.286 1.772C11.151 11.156 9.397 12.5 7 12.5c-2.397 0-4.15-1.344-5.261-2.628A12.276 12.276 0 01.453 8.1l-.292-.611c-.059-.061-.117-.245-.117-.245-.059-.122-.059-.305 0-.488 0 0 .058-.184.117-.245.037-.118.1-.237.17-.372.04-.073.08-.152.122-.239.292-.489.701-1.1 1.286-1.772C2.849 2.844 4.603 1.5 7 1.5c2.397 0 4.15 1.344 5.261 2.628.585.672.994 1.283 1.286 1.772l.292.611c.059.061.117.245.117.245a.704.704 0 010 .488zM7 10a3 3 0 100-6 3 3 0 000 6z"
                            fill="#1C1F23"
                            fillOpacity="0.3"
                          ></path>
                          <circle cx="7" cy="7" r="2" fill="#C4C4C4"></circle>
                        </g>
                        <defs>
                          <clipPath id="eye_svg__clip0">
                            <path fill="#fff" d="M0 0h14v14H0z"></path>
                          </clipPath>
                        </defs>
                      </svg>
                      <span className={styles['info-figure-text']}>0</span>
                    </div>
                    <div className={styles['info-figure']}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.32 10.42c1.25-1.26 1.98-2.574 1.98-4.103C13.3 3.215 10.48.7 7 .7S.7 3.215.7 6.318C.7 9.42 3.61 11.55 7.09 11.55v.932c0 .37.384.607.708.429.907-.5 2.484-1.445 3.52-2.491zM7.93 6.426a.944.944 0 11-1.889 0 .944.944 0 011.889 0zm-3.912.944a.944.944 0 100-1.889.944.944 0 000 1.889zm6.88-.944a.944.944 0 11-1.889 0 .944.944 0 011.89 0z"
                          fill="#1C1F23"
                          fillOpacity="0.3"
                        ></path>
                      </svg>
                      <span className={styles['info-figure-text']}>0</span>
                    </div>
                    <div className={styles['info-figure']}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.542.75c-.99 0-1.892.395-2.44 1.142C5.349 1.145 4.447.75 3.458.75 1.569.75 0 2.314 0 4.175c0 .126.006.184 0 .19.01.429.222 1.202.392 1.527 1.144 2.365 4.758 4.87 4.928 5.033.17.163.34.325.68.325s.51-.162.68-.325c.17-.162 3.329-2.442 4.71-4.658.06-.151.1-.226.203-.38.066-.16.132-.304.204-.38.125-.428.196-.751.203-1.142-.005-.011 0-.065 0-.19C12 2.315 10.43.75 8.542.75z"
                          fill="#1C1F23"
                          fillOpacity="0.3"
                        ></path>
                      </svg>
                      <span className={styles['info-figure-text']}>0</span>
                    </div>
                    <div className={styles['info-figure']}></div>
                  </div>
                  <div
                    className={cs(
                      styles['info-op'],
                      styles['info-row--manage']
                    )}
                  >
                    <div className={styles['info-op-left']}>
                      <div className={styles['info-time']}>
                        2023年10月04日 14:16
                      </div>
                    </div>
                  </div>

                  <div className={styles['op-btns']}>
                    <div
                      className={cs(styles['op-btn'], styles['ghost-btn'])}
                      style={{
                        color: 'rgb(119, 120, 123)',
                        cursor: 'pointer'
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M9.667 3L13 6.333l1.39-1.39c.521-.521.521-1.365 0-1.886l-1.447-1.448a1.333 1.333 0 00-1.886 0L9.667 3zM1.498 14.09l1.121-3.924a.667.667 0 01.17-.288L8.667 4 12 7.333l-5.878 5.878a.667.667 0 01-.288.17L1.91 14.5a.333.333 0 01-.412-.411z"
                          fill="#1C1F23"
                          fillOpacity="0.6"
                        ></path>
                      </svg>
                      <span>修改描述和封面</span>
                    </div>
                    <div
                      className={cs(styles['op-btn'], styles['ghost-btn'])}
                      style={{
                        color: 'rgb(119, 120, 123)',
                        cursor: 'pointer'
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 2a2 2 0 00-2 2v2a2 2 0 00-2 2v5a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2V4a2 2 0 00-2-2H6zm2.5 6h-1a.5.5 0 00-.5.5V12a.5.5 0 00.5.5h1A.5.5 0 009 12V8.5a.5.5 0 00-.5-.5zM10 6V4H6v2h4z"
                          fill="#1C1F23"
                          fillOpacity="0.6"
                        ></path>
                      </svg>
                      <span>设置权限</span>
                    </div>
                    <div
                      className={cs(styles['op-btn'], styles['ghost-btn'])}
                      style={{
                        color: 'rgb(254, 44, 85)',
                        cursor: 'pointer'
                      }}
                    >
                      <IconDelete />
                      <span>删除作品</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles['load-more--manage']}>
              <div className={styles['loading-text--manage']}>没有更多作品</div>
            </div>
          </TabPane>
          <TabPane tab="已发布" itemKey="2">
            <div className={styles['load-more--manage']}>
              <div className={styles['loading-text--manage']}>没有更多作品</div>
            </div>
          </TabPane>
          <TabPane tab="审核中" itemKey="3">
            <div className={styles['load-more--manage']}>
              <div className={styles['loading-text--manage']}>没有更多作品</div>
            </div>
          </TabPane>
          <TabPane tab="未通过" itemKey="4">
            <div className={styles['load-more--manage']}>
              <div className={styles['loading-text--manage']}>没有更多作品</div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
