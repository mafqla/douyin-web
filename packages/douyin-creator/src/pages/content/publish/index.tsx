import {
  Button,
  DatePicker,
  Popover,
  Radio,
  Select,
  Skeleton,
  Switch,
  Tag,
  Tooltip
} from '@douyinfe/semi-ui'
import styles from './style/publish.module.scss'
import { Input } from '@douyinfe/semi-ui'
import cs from 'classnames'
import {
  IconChevronRight,
  IconHelpCircle,
  IconImage,
  IconScissors,
  IconTiktokLogo,
  IconUpload
} from '@douyinfe/semi-icons'
const Publish = () => {
  return (
    <div className={styles.publish}>
      <div className={styles.container}>
        <div className={styles.title}>发布视频</div>
        <div className={styles.content}>
          <div className={styles['content-form']}>
            <div className={styles['disc-title']}>
              <div className={styles['disc-title-content']}>
                <div className={styles['title-text']}>
                  <p className={styles['title-main']}>
                    作品描述
                    <Tooltip
                      position="bottomLeft"
                      style={{ maxWidth: '900px' }}
                      content={
                        <div>
                          <div>
                            1.作品标题仅支持输入文本，如需添加#话题和@好友则在标题下方区域输入
                          </div>
                          <div>
                            2.作品标题会在双列场景下优先展示，可在右侧的预览进行查看
                          </div>
                          <div>3.避免作品标题与简介填写一样的内容噢！</div>
                        </div>
                      }
                    >
                      <span className={styles['icon']}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7 13.417A6.417 6.417 0 107 .583a6.417 6.417 0 000 12.834zm-.1-4.895c-.502 0-.752-.313-.752-.723 0-.61.302-1.003 1.008-1.538l.038-.03c.481-.365.817-.62.817-1.081 0-.518-.485-.82-1.026-.82-.444 0-.786.165-1.054.512-.193.2-.347.308-.61.308-.432 0-.654-.302-.654-.65 0-.353.2-.712.512-.985.422-.365 1.094-.598 1.983-.598 1.583 0 2.694.78 2.694 2.125 0 .98-.586 1.452-1.276 1.93-.467.343-.689.542-.866.946v.001c-.194.342-.342.603-.814.603zm-.012 2.427c-.547 0-.997-.353-.997-.9s.45-.9.997-.9c.547 0 .992.353.992.9s-.445.9-.992.9z"
                            fill="#1C1F23"
                            fillOpacity="0.35"
                          ></path>
                        </svg>
                      </span>
                    </Tooltip>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles['editor-container']}>
              <div className={styles['editor-comp-publish-container']}>
                <div className={styles['editor-kit-root-container']}>
                  <div className={styles['editor-kit-editor-container']}>
                    <div className={styles['container--input']}>
                      <Input
                        placeholder="好的作品标题可获得更多浏览"
                        suffix={
                          <span className={styles['lmit-word']}>0/30</span>
                        }
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
                          <div
                            className={styles['toolbar-comp-button-container']}
                          >
                            <div className={styles['toolbar-button']}>
                              #添加话题
                            </div>
                            <div className={styles['toolbar-button']}>
                              @好友
                            </div>
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
                                className={cs(
                                  styles['margin-tag'],
                                  styles['more-tag']
                                )}
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
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
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
                    <span className={styles['title--activity']}>
                      全民悦读会第五季
                    </span>
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
                    <span className={styles['title--activity']}>
                      全民悦读会第五季
                    </span>
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
                    <span className={styles['title--activity']}>
                      全民悦读会第五季
                    </span>
                  </div>
                  <div className={styles['activity--bottom']}>
                    <div className={styles['score--activity']}>热度：2.3万</div>
                  </div>
                </div>
                <div className={styles['more--content']}>+33</div>
              </div>
            </div>

            <div className={`${styles['title-upload']}`}>
              <p className={styles['title-main']}>设置封面</p>
            </div>

            <div className={styles['content-upload-new']}>
              <div className={styles['wrapper--upload']}>
                <div className={styles['coverControl--XR']}>
                  <div className={styles['cover']}>
                    <div
                      className={cs(styles['bg-c'], styles['filter'])}
                      style={{
                        backgroundImage:
                          'url("https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/a1c024ff281842c28fb65cd9d061d69f~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702199714&x-orig-sign=eM3vyiYSgjHIxvGfZSw%2F6yT1go0%3D")',
                        backgroundColor: 'rgb(0, 0, 0)',
                        backgroundSize: '100%',
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div className={styles['filter']}>
                      <IconImage style={{ color: 'rgb(255, 255, 255)' }} />
                      <div className={styles['title--filter']}>选择封面</div>
                    </div>
                  </div>
                  <div className={styles['controlContainer']}></div>
                </div>
                <div className={styles['recommendContainer']}>
                  <div
                    className={styles['recommendDisplay']}
                    style={{ height: '200px' }}
                  >
                    <span className={styles['recommendTitle']}>
                      智能推荐封面
                    </span>
                    <div className={styles['recommendCoverContainer']}>
                      <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                          <img
                            style={{
                              width: '211.5px'
                            }}
                            src="https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/a1c024ff281842c28fb65cd9d061d69f~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702199714&x-orig-sign=eM3vyiYSgjHIxvGfZSw%2F6yT1go0%3D"
                          />
                        }
                        position="top"
                      >
                        <div
                          className={styles['recommendCover']}
                          style={{
                            width: '105.75px',
                            height: '141px'
                          }}
                        >
                          <div
                            className={styles['maskBox']}
                            style={{
                              width: '105.75px'
                            }}
                          >
                            <div className={styles['mask']}></div>
                            <img src="https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/a1c024ff281842c28fb65cd9d061d69f~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702199714&x-orig-sign=eM3vyiYSgjHIxvGfZSw%2F6yT1go0%3D" />
                          </div>
                        </div>
                      </Popover>
                      <div
                        className={styles['recommendCover']}
                        style={{
                          width: '105.75px',
                          height: '141px'
                        }}
                      >
                        <div
                          className={styles['maskBox']}
                          style={{
                            width: '105.75px'
                          }}
                        >
                          <div className={styles['mask']}></div>
                          <img src="https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/a1c024ff281842c28fb65cd9d061d69f~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702199714&x-orig-sign=eM3vyiYSgjHIxvGfZSw%2F6yT1go0%3D" />
                        </div>
                      </div>
                      <div
                        className={styles['recommendCover']}
                        style={{
                          width: '105.75px',
                          height: '141px'
                        }}
                      >
                        <Skeleton
                          style={{ width: 200, height: 150 }}
                          placeholder={<Skeleton.Image />}
                          loading={true}
                        >
                          <div
                            className={styles['maskBox']}
                            style={{
                              width: '105.75px'
                            }}
                          >
                            <div className={styles['mask']}></div>
                            <img src="https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/a1c024ff281842c28fb65cd9d061d69f~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702199714&x-orig-sign=eM3vyiYSgjHIxvGfZSw%2F6yT1go0%3D" />
                          </div>
                        </Skeleton>
                      </div>
                    </div>
                  </div>

                  <div className={styles['tip']}>
                    <div>
                      好封面会吸引更多人浏览作品
                      <Popover
                        position="bottomRight"
                        showArrow
                        content={
                          <div className={styles.tipContainer}>
                            <div className={styles.tipTitle}>
                              <span>什么是优质封面</span>
                              <span className={styles.toExample}>
                                创作技巧及示例 &gt;
                              </span>
                            </div>
                            <div className={styles.coverList}>
                              <div className={styles.coverItem}>
                                <div className={styles.coverBox}>
                                  <img
                                    src="https://p3-pc-douyin-creator.byteimg.com/tos-cn-i-zomxhfrryo/tinified/img1.png~tplv-zomxhfrryo-0.png"
                                    alt=""
                                  />
                                </div>
                                <div className={styles.tipText}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    className={styles.successIcon}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17.8831 9.82235L11.6854 17.4112C11.4029 17.7806 10.965 17.9981 10.5 18C10.035 18.0019 9.59533 17.788 9.30982 17.421L5.81604 13.4209C5.30744 12.767 5.42524 11.8246 6.07916 11.316C6.73308 10.8074 7.67549 10.9252 8.1841 11.5791L10.4838 14.0439L15.5 8C16.0032 7.34193 16.9446 7.21641 17.6027 7.71964C18.2608 8.22287 18.3863 9.16428 17.8831 9.82235Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <span>画质清晰，建议分辨率不低于 720p</span>
                                </div>
                              </div>
                              <div className={styles.coverItem}>
                                <div className={styles.coverBox}>
                                  <img
                                    src="https://p3-pc-douyin-creator.byteimg.com/tos-cn-i-zomxhfrryo/tinified/img3.png~tplv-zomxhfrryo-0.png"
                                    alt=""
                                  />
                                </div>
                                <div className={styles.tipText}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    className={styles.successIcon}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17.8831 9.82235L11.6854 17.4112C11.4029 17.7806 10.965 17.9981 10.5 18C10.035 18.0019 9.59533 17.788 9.30982 17.421L5.81604 13.4209C5.30744 12.767 5.42524 11.8246 6.07916 11.316C6.73308 10.8074 7.67549 10.9252 8.1841 11.5791L10.4838 14.0439L15.5 8C16.0032 7.34193 16.9446 7.21641 17.6027 7.71964C18.2608 8.22287 18.3863 9.16428 17.8831 9.82235Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <span>有信息量，封面能反映视频主题</span>
                                </div>
                              </div>

                              <div className={styles.coverItem}>
                                <div className={styles.coverBox}>
                                  <img
                                    src="https://p3-pc-douyin-creator.byteimg.com/tos-cn-i-zomxhfrryo/tinified/img5.png~tplv-zomxhfrryo-0.png"
                                    alt=""
                                  />
                                </div>
                                <div className={styles.tipText}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    className={styles.successIcon}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17.8831 9.82235L11.6854 17.4112C11.4029 17.7806 10.965 17.9981 10.5 18C10.035 18.0019 9.59533 17.788 9.30982 17.421L5.81604 13.4209C5.30744 12.767 5.42524 11.8246 6.07916 11.316C6.73308 10.8074 7.67549 10.9252 8.1841 11.5791L10.4838 14.0439L15.5 8C16.0032 7.34193 16.9446 7.21641 17.6027 7.71964C18.2608 8.22287 18.3863 9.16428 17.8831 9.82235Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <span>构图合理，协调美观，色彩适宜</span>
                                </div>
                              </div>

                              <div className={styles.coverItem}>
                                <div className={styles.coverBox}>
                                  <img
                                    src="https://p3-pc-douyin-creator.byteimg.com/tos-cn-i-zomxhfrryo/tinified/img13.png~tplv-zomxhfrryo-0.png"
                                    alt=""
                                  />
                                </div>
                                <div className={styles.tipText}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    className={styles.errorIcon}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17.0352 16.8626C16.4597 17.4585 15.5101 17.4751 14.9142 16.8996L12.0368 14.121L9.25822 16.9984C8.68274 17.5943 7.73314 17.6109 7.13722 17.0354C6.5413 16.4599 6.52472 15.5103 7.1002 14.9144L9.87883 12.037L7.00147 9.2584C6.40555 8.68293 6.38897 7.73332 6.96445 7.1374C7.53992 6.54148 8.48953 6.52491 9.08545 7.10038L11.9628 9.87901L14.7414 7.00165C15.3169 6.40573 16.2665 6.38916 16.8624 6.96463C17.4584 7.54011 17.4749 8.48971 16.8995 9.08563L14.1208 11.963L16.9982 14.7416C17.5941 15.3171 17.6107 16.2667 17.0352 16.8626Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <span>画质模糊，内容难以辨认</span>
                                </div>
                              </div>

                              <div className={styles.coverItem}>
                                <div className={styles.coverBox}>
                                  <img
                                    src="https://p3-pc-douyin-creator.byteimg.com/tos-cn-i-zomxhfrryo/tinified/18.png~tplv-zomxhfrryo-0.png"
                                    alt=""
                                  />
                                </div>
                                <div className={styles.tipText}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    className={styles.errorIcon}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17.0352 16.8626C16.4597 17.4585 15.5101 17.4751 14.9142 16.8996L12.0368 14.121L9.25822 16.9984C8.68274 17.5943 7.73314 17.6109 7.13722 17.0354C6.5413 16.4599 6.52472 15.5103 7.1002 14.9144L9.87883 12.037L7.00147 9.2584C6.40555 8.68293 6.38897 7.73332 6.96445 7.1374C7.53992 6.54148 8.48953 6.52491 9.08545 7.10038L11.9628 9.87901L14.7414 7.00165C15.3169 6.40573 16.2665 6.38916 16.8624 6.96463C17.4584 7.54011 17.4749 8.48971 16.8995 9.08563L14.1208 11.963L16.9982 14.7416C17.5941 15.3171 17.6107 16.2667 17.0352 16.8626Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <span>构图不当，展示不全，封面无美感</span>
                                </div>
                              </div>
                              <div className={styles.coverItem}>
                                <div className={styles.coverBox}>
                                  <img
                                    src="https://p3-pc-douyin-creator.byteimg.com/tos-cn-i-zomxhfrryo/tinified/20.png~tplv-zomxhfrryo-0.png"
                                    alt=""
                                  />
                                </div>
                                <div className={styles.tipText}>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    focusable="false"
                                    className={styles.errorIcon}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM17.0352 16.8626C16.4597 17.4585 15.5101 17.4751 14.9142 16.8996L12.0368 14.121L9.25822 16.9984C8.68274 17.5943 7.73314 17.6109 7.13722 17.0354C6.5413 16.4599 6.52472 15.5103 7.1002 14.9144L9.87883 12.037L7.00147 9.2584C6.40555 8.68293 6.38897 7.73332 6.96445 7.1374C7.53992 6.54148 8.48953 6.52491 9.08545 7.10038L11.9628 9.87901L14.7414 7.00165C15.3169 6.40573 16.2665 6.38916 16.8624 6.96463C17.4584 7.54011 17.4749 8.48971 16.8995 9.08563L14.1208 11.963L16.9982 14.7416C17.5941 15.3171 17.6107 16.2667 17.0352 16.8626Z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <span>构图不当，展示不全，封面无美感</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <span className={styles['tipSpan']}>优质封面示例</span>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles['container-chapter']}>
              <div className={styles.title}>
                <p className={styles.titleMain}>
                  <div className={styles.header}>
                    <p className={styles.addChapterText}>添加章节</p>
                  </div>
                </p>
              </div>
              <div className={`${styles.content} ${styles.disabled}`}>
                <div className={`${styles.icon} ${styles.disabled}`}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M15.375 10.125a1.125 1.125 0 000-2.25h-5.25v-5.25a1.125 1.125 0 00-2.25 0v5.25h-5.25a1.125 1.125 0 000 2.25h5.25v5.25a1.125 1.125 0 002.25 0v-5.25h5.25z"
                      fill="#232323"
                      fillOpacity="0.6"
                    ></path>
                  </svg>
                </div>
                <p className={`${styles.text} ${styles.disabled}`}>
                  为进度条增加章节信息
                </p>
                <div className={styles.edit}></div>
              </div>
            </div>

            <div className={styles['anchor-part']}>
              <div className={styles.header}>
                <div className={styles.title}>
                  <p className={styles['title-main']}>添加标签</p>
                </div>

                <Tooltip
                  position="topLeft"
                  style={{ maxWidth: '450px' }}
                  content="一个视频仅支持添加一个标签，标签包含位置、小程序"
                >
                  <div className={styles.icon}>
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
                </Tooltip>
              </div>

              <div className={styles['anchor-container']}>
                <Select defaultValue={'1'} className={styles['select']}>
                  <Select.Option value="1">位置</Select.Option>
                  <Select.Option value="2">小程序</Select.Option>
                </Select>

                <div className={styles['anchor-component']}>
                  <Select
                    arrowIcon={false}
                    placeholder="请输入地理位置"
                    showClear={true}
                    style={{ width: '440px' }}
                  ></Select>
                </div>
              </div>

              <div className={styles['sub-title-global']}>
                <div className={styles['recommend']}>
                  <span className={styles['recommend-label']}>为你推荐：</span>
                  <div className={styles['scroll-container']}>
                    <div
                      className={styles['scroll-content']}
                      style={{ width: '100%' }}
                    >
                      <div className={styles['recommend-list']}>
                        <span className={styles['recommend-list-item']}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M6 6c.774 0 1.4-.663 1.4-1.48 0-.819-.628-1.48-1.4-1.48-.772 0-1.4.663-1.4 1.48S5.226 6 6 6zm0 5.5c-.758 0-4-4.432-4-6.769C2 2.394 3.79.5 6 .5s4 1.894 4 4.231C10 7.068 6.758 11.5 6 11.5z"
                              stroke="#000"
                            ></path>
                          </svg>
                          香港仔海滨公园
                        </span>
                        <span className={styles['recommend-list-item']}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M6 6c.774 0 1.4-.663 1.4-1.48 0-.819-.628-1.48-1.4-1.48-.772 0-1.4.663-1.4 1.48S5.226 6 6 6zm0 5.5c-.758 0-4-4.432-4-6.769C2 2.394 3.79.5 6 .5s4 1.894 4 4.231C10 7.068 6.758 11.5 6 11.5z"
                              stroke="#000"
                            ></path>
                          </svg>
                          香港仔港湾
                        </span>
                        <span className={styles['recommend-list-item']}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M6 6c.774 0 1.4-.663 1.4-1.48 0-.819-.628-1.48-1.4-1.48-.772 0-1.4.663-1.4 1.48S5.226 6 6 6zm0 5.5c-.758 0-4-4.432-4-6.769C2 2.394 3.79.5 6 .5s4 1.894 4 4.231C10 7.068 6.758 11.5 6 11.5z"
                              stroke="#000"
                            ></path>
                          </svg>
                          海怡半岛
                        </span>
                        <span className={styles['recommend-list-item']}>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M6 6c.774 0 1.4-.663 1.4-1.48 0-.819-.628-1.48-1.4-1.48-.772 0-1.4.663-1.4 1.48S5.226 6 6 6zm0 5.5c-.758 0-4-4.432-4-6.769C2 2.394 3.79.5 6 .5s4 1.894 4 4.231C10 7.068 6.758 11.5 6 11.5z"
                              stroke="#000"
                            ></path>
                          </svg>
                          香港特别行政区·南区
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles['payVideoContainer']}>
                <div className={styles['formHeader']}>
                  <div className={styles['formTitle']}>
                    付费视频
                    <div className={styles['icon']}>
                      <IconHelpCircle
                        style={{ color: 'rgba(37, 38, 50, 0.35)' }}
                      />
                    </div>
                  </div>
                  <Switch
                    defaultChecked={false}
                    onChange={(v) => console.log(v)}
                  />
                </div>

                <div className={styles.tip}>
                  提示：打开付费开关，用户需付费才可观看视频
                </div>
              </div>
            </div>

            <div className={styles['container-hot']}>
              <div className={styles['header']}>
                <span className={styles['title-hot']}>申请关联热点</span>
                <div className={styles['icon']}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      fill-rule="evenodd"
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

            <div className={styles['mix-sel-wrap']}>
              <div className={styles['title-mix-add']}>
                <p className={styles['title-main']}>添加到</p>
              </div>
              <div className={styles['sel-area']}>
                <Select
                  defaultValue={'1'}
                  className={styles['select-mix-type']}
                >
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

            <div className={styles['title-other']}>
              <p className={styles['title-main']}>同步到其他平台</p>
            </div>
            <div className={styles['preview']}>
              <div className={styles['info']}>
                <div className={styles['first-part']}>
                  <div className={styles['toutiao']}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path
                        d="M21.373 25.993H4.627A4.632 4.632 0 010 21.366V4.626A4.632 4.632 0 014.627 0h16.746A4.632 4.632 0 0126 4.627v16.746a4.626 4.626 0 01-4.627 4.62z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M26 20.014L0.008 21.374V5.977L26 4.62v15.395z"
                        fill="#FF373C"
                      ></path>
                      <path
                        d="M7.092 10.323V8.748L3.535 8.43v1.574l3.557.32zM3.534 11.088v1.574l3.557.32v-1.567l-3.557-.327zM12.647 15.194l-10.04.52v-1.403l10.04-.527v1.41zM23.386 14.63l-10.034.527v-1.41l10.034-.528v1.411zM22.828 8.83l-7.3.379V7.805l7.3-.386V8.83z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M9.862 7.746l-1.597.081c-.045 3.179-.082 4.969-.661 6.254-.58 1.3-1.827 2.376-4.292 4.522l-.32.275 2.518-.134c4.107-3.624 4.263-4.411 4.352-10.998zM11.095 15.974l-1.93.104 1.551 2.392 1.924-.097-1.545-2.399zM21.848 15.417l-1.93.097 1.552 2.399 1.93-.104-1.552-2.392zM16.835 15.677l-1.93.104-1.553 2.555 1.931-.104 1.553-2.555zM19.175 18.031l-1.634.082V12.73l1.634-.09v5.392zM21.358 7.5v.988c-.928.802-2.814 2.154-8.013 3.298v1.5c6.313-1.36 8.466-3.268 9.484-4.226V7.42l-1.47.082z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M15.187 8.704c-.067-.045-.134-.097-.2-.134l-1.36.891s.61.438.676.483c1.114.765 3.142 2.161 9.083 2.822v-1.5c-5.4-.639-7.204-1.879-8.199-2.562z"
                        fill="#fff"
                      ></path>
                      <path
                        d="M13.627 9.454l1.374.832 1.656-2.54-1.507-.631-1.523 2.339z"
                        fill="#fff"
                      ></path>
                      <rect
                        x="0.25"
                        y="0.25"
                        width="25.5"
                        height="25.5"
                        rx="5.75"
                        stroke="#161823"
                        strokeOpacity="0.12"
                        strokeWidth="0.5"
                      ></rect>
                    </svg>
                    <span className={styles['toutiao-title']}>今日头条</span>
                  </div>

                  <Switch
                    defaultChecked={false}
                    onChange={(v) => console.log(v)}
                  />
                </div>
                <div className={styles['third-part']}>
                  <span className={styles['info-sub']}>
                    提示：打开同步开关可以同步内容至头条绑定账号
                  </span>
                </div>
              </div>
            </div>
            <div className={styles['title-other']}>
              <p className={styles['title-main']}>允许他人保存视频</p>
            </div>

            <div className={styles['download-content']}>
              <Radio
                className={styles['radio']}
                style={{ backgroundColor: 'rgb(253, 245, 247)' }}
              >
                <span style={{ color: 'rgb(254, 44, 85)' }}>允许 </span>
              </Radio>
              <Radio
                className={styles['radio']}
                style={{ backgroundColor: 'rgb(248, 249, 249)' }}
              >
                <span>不允许 </span>
              </Radio>
            </div>

            <div className={styles['publish-settings']}>
              <p className={styles['publish-settings-title']}> 发布设置</p>
              <p className={styles['mytitle']}> 设置谁可以看</p>
              <div>
                <Radio
                  className={styles['radio']}
                  style={{ backgroundColor: 'rgb(253, 245, 247)' }}
                >
                  <span style={{ color: 'rgb(254, 44, 85)' }}>公开 </span>
                </Radio>
                <Radio
                  className={styles['radio']}
                  style={{ backgroundColor: 'rgb(248, 249, 249)' }}
                >
                  <span>好友可见 </span>
                </Radio>
                <Radio
                  className={styles['radio']}
                  style={{ backgroundColor: 'rgb(248, 249, 249)' }}
                >
                  <span>仅自己可见</span>
                </Radio>
              </div>

              <div className={styles['schedule-part']}>
                <div className={styles['title-schedule']}>
                  <p className={styles['title-main-schedule']}>发布时间</p>
                </div>
                <div className={styles['row--schedule']}>
                  <Radio
                    className={styles['radio']}
                    style={{ backgroundColor: 'rgb(253, 245, 247)' }}
                  >
                    <span style={{ color: 'rgb(254, 44, 85)' }}>立即发布 </span>
                  </Radio>

                  <div className={styles['container-schedule']}>
                    <Radio
                      className={styles['radio']}
                      style={{ backgroundColor: 'rgb(248, 249, 249)' }}
                    >
                      <span>定时发布 </span>
                    </Radio>
                    <div className={styles['highlight--2']}>
                      <Tooltip
                        position="bottom"
                        content="可选时间支持设置到2小时后及14天内"
                        style={{ maxWidth: '450px' }}
                      >
                        <IconHelpCircle
                          style={{ color: 'rgba(37, 38, 50, 0.35)' }}
                        />
                      </Tooltip>
                    </div>
                  </div>

                  <DatePicker type="dateTime" style={{ width: '175px' }} />
                </div>
              </div>
            </div>

            <div className={styles['content-confirm-container']}>
              <Button type="primary" theme="solid" style={{ width: '120px' }}>
                发布
              </Button>
              <Button
                type="tertiary"
                style={{
                  width: '120px',
                  marginLeft: '12px',
                  color: '#6b7075',
                  background: 'rgba(46,50,56,.05)'
                }}
              >
                取消
              </Button>
            </div>
          </div>
          <div className={styles['content-preview']}>
            <div className={styles['phone-container']}>
              <div className={styles['phone']}>
                <div className={styles['previewTab']}>
                  <div className={styles.tabContainer}>
                    <div className={`${styles.tabItem} ${styles.active}`}>
                      预览视频
                    </div>
                    <div className={styles.tabItem}>预览封面/标题</div>
                  </div>
                </div>

                <div className={styles['phone-screen']}>
                  <div style={{ display: 'none' }}>
                    <div
                      className={styles['player-container']}
                      style={{ width: '243px', height: '505px' }}
                    >
                      <video
                        src="https://video-cn.douyin.com/2583426c5c9ed52720f0ac68f6d8a889/6575adf2/tos-cn-ve-15/osiAObT1OgB9nlCIgsODAMBCMAdeQaJLliIIel?a=10006&br=1977&bt=1977&btag=200008000&cd=0%7C0%7C0%7C0&ch=0&cr=0&cs=0&dr=0&ds=3&dy_q=1702207452&dy_va_biz_cert=&feature_id=f0150a16a324336cda5d6dd0b69ed299&ft=usKtpj77JWH6BM0uJy1r0PD1&l=20231210192412E169EE7EBC0FDE2F8551&mime_type=video_mp4&ply_type=3&policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&qs=0&rc=NXZpTGRTaFBnKXF3cjFyZHUxbHhnZmU1Zmc1MzlkODgzOmdlZDNAaWprcjQ6OmY2bW8zMzRpMzNAU2xrdmlxRDpqcWJrYG9xYmBrdmw6I2NhNTE1NF82XjEzM14wLjZhIzBiYi9yNDAxbmAtLWQtL3Nz"
                        loop
                        autoPlay
                        preload="auto"
                        controlsList="nodownload"
                        disablePictureInPicture
                        style={{ width: '243px' }}
                        className={styles['player-video']}
                      ></video>
                    </div>
                    <img
                      src="https://p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?from=2956013662"
                      className={styles['avater-class']}
                    ></img>
                    <img
                      src="//lf-cdn-tos.bytescm.com/obj/static/douyin-creator-content/micro/imgs/out.fda62ba6.png"
                      className={styles['preview-card']}
                    ></img>
                    <img
                      src="data:image/png;base64,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"
                      className={styles['preview-like']}
                    ></img>
                    <div className={styles['layer-top']}>
                      <div className={styles['bottom-binder']}>
                        <div className={styles['user-name']}>@󠀀ㅤ󠀀ㅤ󠀀</div>
                        <div
                          id="phoneText"
                          className={`${styles['input-text']} ${styles['input-text-v2']}`}
                        >
                          <span style={{ fontWeight: 'bold' }}>
                            #好好生活慢慢相遇
                          </span>
                          <span> </span>
                          <span style={{ fontWeight: 'bold' }}>#温柔女孩</span>
                        </div>
                        <div className={styles['music-binder']}>
                          <IconTiktokLogo />
                          <div className={styles['music-text']}>
                            <div
                              className={`${styles['inner-text']} ${styles['text1']}`}
                              style={{ left: '-308px' }}
                            >
                              󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @󠀀ㅤ󠀀ㅤ󠀀 󠀀ㅤ󠀀ㅤ󠀀创作的原声 -
                              @󠀀ㅤ󠀀ㅤ󠀀 󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @󠀀ㅤ󠀀ㅤ󠀀
                            </div>
                            <div
                              className={`${styles['inner-text']} ${styles['text2']}`}
                              style={{ left: '102px' }}
                            >
                              󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @󠀀ㅤ󠀀ㅤ󠀀 󠀀ㅤ󠀀ㅤ󠀀创作的原声 -
                              @󠀀ㅤ󠀀ㅤ󠀀 󠀀ㅤ󠀀ㅤ󠀀创作的原声 - @󠀀ㅤ󠀀ㅤ󠀀
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: ' block' }}>
                    <div className={styles['preview-container--2']}>
                      <img
                        src="//lf-cdn-tos.bytescm.com/obj/static/douyin-creator-content/micro/imgs/out.fda62ba6.png"
                        className={styles['preview-cover-bg']}
                      ></img>
                      <div className={styles['dual-columns']}>
                        <div className={styles['column-container']}>
                          <div className={styles['cover-box']}>
                            <div
                              className={styles['ccover--x']}
                              style={{ height: '144px' }}
                            >
                              <img
                                src="https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/a1c024ff281842c28fb65cd9d061d69f~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&amp;rk3s=70809c85&amp;x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&amp;x-orig-expires=1702211051&amp;x-orig-sign=ojSdQaNmJwIohz9QZ%2FwA%2F5OZALo%3D"
                                alt=""
                              />
                            </div>
                            <div className={styles['cover-info']}>
                              <div className={styles['describe']}>
                                <div>请填写作品标题...</div>
                              </div>
                              <div className={styles['user-info']}>
                                <div className={styles['avatar-box']}>
                                  <div className={styles['avatar']}>
                                    <img
                                      src="https://p11.douyinpic.com/aweme/100x100/aweme-avatar/tos-cn-i-0813c001_fddf54d2b1544d0aa4f0987fefc73f65.jpeg?from=2956013662"
                                      alt=""
                                    />
                                  </div>
                                  <div className={styles['nickname']}>
                                    󠀀ㅤ󠀀ㅤ󠀀
                                  </div>
                                </div>
                                <div className={styles['user-like']}>
                                  <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                                    alt=""
                                  />
                                  <span>0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles['cover-box']}>
                            <div
                              className={styles['ccover--x']}
                              style={{ height: '144px' }}
                            ></div>
                            <div className={styles['cover-info']}>
                              <div className={styles['describe']}>
                                <div>************************</div>
                              </div>
                              <div className={styles['user-info']}>
                                <div className={styles['avatar-box']}>
                                  <div className={styles['avatar']}></div>
                                  <div className={styles['nickname']}>***</div>
                                </div>
                                <div className={styles['user-like']}>
                                  <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                                    alt=""
                                  />
                                  <span>0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles['cover-box']}>
                            <div
                              className={styles['ccover--x']}
                              style={{ height: '144px' }}
                            ></div>
                            <div className={styles['cover-info']}>
                              <div className={styles['describe']}>
                                <div>************************</div>
                              </div>
                              <div className={styles['user-info']}>
                                <div className={styles['avatar-box']}>
                                  <div className={styles['avatar']}></div>
                                  <div className={styles['nickname']}>***</div>
                                </div>
                                <div className={styles['user-like']}>
                                  <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                                    alt=""
                                  />
                                  <span>0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={styles['column-container']}>
                          {' '}
                          <div className={styles['cover-box']}>
                            <div
                              className={styles['ccover--x']}
                              style={{ height: '144px' }}
                            ></div>
                            <div className={styles['cover-info']}>
                              <div className={styles['describe']}>
                                <div>************************</div>
                              </div>
                              <div className={styles['user-info']}>
                                <div className={styles['avatar-box']}>
                                  <div className={styles['avatar']}></div>
                                  <div className={styles['nickname']}>***</div>
                                </div>
                                <div className={styles['user-like']}>
                                  <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                                    alt=""
                                  />
                                  <span>0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles['cover-box']}>
                            <div
                              className={styles['ccover--x']}
                              style={{ height: '144px' }}
                            ></div>
                            <div className={styles['cover-info']}>
                              <div className={styles['describe']}>
                                <div>************************</div>
                              </div>
                              <div className={styles['user-info']}>
                                <div className={styles['avatar-box']}>
                                  <div className={styles['avatar']}></div>
                                  <div className={styles['nickname']}>***</div>
                                </div>
                                <div className={styles['user-like']}>
                                  <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZBAMAAAA2x5hQAAAAKlBMVEVHcEz///////////////////////////////////////////////////+LBpLMAAAADXRSTlMAIMPf72CeR4BwMBCwhPewcgAAAKVJREFUGNNjYCAFiIYzMJSGQzlCd++agzCYw2irGXbXV3Xa3QkgHvMNBoa1QLzEEcSLTWBg4DBgYGC9BuKdXcDAwA3EDC4gni7MaF0BIGGLwjsrAOOBiN4JEA7jJRC51wDCY7sKJm9CeLJgUW7fAoiTAsCCtWBHbLoBUcJ5GWg3o24C1OheoM7F12DWsvsmcvo2wL0rfFnXHcn3vZcEkHiMAoTDCwDT9iR9fERK5wAAAABJRU5ErkJggg=="
                                    alt=""
                                  />
                                  <span>0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['long-card']}>
                    <div className={styles['preview-button']}>
                      <label className={styles['upload-btn']}>
                        <input
                          className={styles['upload-btn-input']}
                          type="file"
                          name="upload-btn"
                          accept="video/mp4,video/x-m4v,video/*"
                        />
                        <Button
                          theme="borderless"
                          className={styles['icon-div']}
                          icon={<IconUpload size="large" />}
                        ></Button>
                      </label>
                      <div className={styles['text']}>重新上传</div>
                    </div>
                    <div className={styles['preview-button']}>
                      <Button
                        theme="borderless"
                        className={styles['icon-div']}
                        icon={<IconScissors size="large" />}
                      ></Button>
                      <div className={styles['text']}>视频剪辑</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section>
              <section className={styles['postAssistant']}>
                <section>
                  <section
                    className={cs(
                      styles['foldButtonWrapper'],
                      styles['fold-head'],
                      styles['unfold--head']
                    )}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.75 4.5C1.75 2.98122 2.98122 1.75 4.5 1.75H15.5C17.0188 1.75 18.25 2.98122 18.25 4.5V15.5C18.25 17.0188 17.0188 18.25 15.5 18.25H4.5C2.98122 18.25 1.75 17.0188 1.75 15.5V4.5ZM5.25 6.5C5.25 6.08579 5.58579 5.75 6 5.75H14C14.4142 5.75 14.75 6.08579 14.75 6.5C14.75 6.91421 14.4142 7.25 14 7.25H6C5.58579 7.25 5.25 6.91421 5.25 6.5ZM5.25 10C5.25 9.58579 5.58579 9.25 6 9.25H8.5C8.91421 9.25 9.25 9.58579 9.25 10C9.25 10.4142 8.91421 10.75 8.5 10.75H6C5.58579 10.75 5.25 10.4142 5.25 10ZM6 12.75C5.58579 12.75 5.25 13.0858 5.25 13.5C5.25 13.9142 5.58579 14.25 6 14.25H8.5C8.91421 14.25 9.25 13.9142 9.25 13.5C9.25 13.0858 8.91421 12.75 8.5 12.75H6ZM15.0303 9.96967C15.3232 10.2626 15.3232 10.7374 15.0303 11.0303L12.5303 13.5303C12.2374 13.8232 11.7626 13.8232 11.4697 13.5303L10.4697 12.5303C10.1768 12.2374 10.1768 11.7626 10.4697 11.4697C10.7626 11.1768 11.2374 11.1768 11.5303 11.4697L12 11.9393L13.9697 9.96967C14.2626 9.67678 14.7374 9.67678 15.0303 9.96967Z"
                        fill="#1C1F23"
                        fillOpacity="0.6"
                      ></path>
                    </svg>
                    <span className={styles['content--fold']}>发文助手</span>
                  </section>
                  <section
                    className={cs(
                      styles['mainPanelWrapper'],
                      styles['unfold-main'],
                      styles['fold-main']
                    )}
                  >
                    <p className={styles['titleWrapper']}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.75 4.5C1.75 2.98122 2.98122 1.75 4.5 1.75H15.5C17.0188 1.75 18.25 2.98122 18.25 4.5V15.5C18.25 17.0188 17.0188 18.25 15.5 18.25H4.5C2.98122 18.25 1.75 17.0188 1.75 15.5V4.5ZM5.25 6.5C5.25 6.08579 5.58579 5.75 6 5.75H14C14.4142 5.75 14.75 6.08579 14.75 6.5C14.75 6.91421 14.4142 7.25 14 7.25H6C5.58579 7.25 5.25 6.91421 5.25 6.5ZM5.25 10C5.25 9.58579 5.58579 9.25 6 9.25H8.5C8.91421 9.25 9.25 9.58579 9.25 10C9.25 10.4142 8.91421 10.75 8.5 10.75H6C5.58579 10.75 5.25 10.4142 5.25 10ZM6 12.75C5.58579 12.75 5.25 13.0858 5.25 13.5C5.25 13.9142 5.58579 14.25 6 14.25H8.5C8.91421 14.25 9.25 13.9142 9.25 13.5C9.25 13.0858 8.91421 12.75 8.5 12.75H6ZM15.0303 9.96967C15.3232 10.2626 15.3232 10.7374 15.0303 11.0303L12.5303 13.5303C12.2374 13.8232 11.7626 13.8232 11.4697 13.5303L10.4697 12.5303C10.1768 12.2374 10.1768 11.7626 10.4697 11.4697C10.7626 11.1768 11.2374 11.1768 11.5303 11.4697L12 11.9393L13.9697 9.96967C14.2626 9.67678 14.7374 9.67678 15.0303 9.96967Z"
                          fill="#1C1F23"
                          fillOpacity="0.6"
                        ></path>
                      </svg>
                      <span className={styles['title-unfold']}>发文助手</span>
                    </p>
                    <section className="">
                      <section
                        className={cs(
                          styles['onlyQuickContentWrapper'],
                          styles['normalContentWrapper'],
                          styles['contentWrapper']
                        )}
                      >
                        <div className="right--3PUTu"></div>
                      </section>
                      <section>
                        <section className={styles['resultWrapper']}>
                          <section className={styles['titleWrapper-2']}>
                            <p
                              className={styles['title--ai']}
                              style={{ color: 'rgb(47, 48, 53)' }}
                            >
                              未见异常
                            </p>
                            <p className={styles['title--ai']}></p>
                          </section>
                          <section className={styles['contentWrapper--2']}>
                            检测通过，暂未发现异常
                          </section>
                        </section>
                      </section>
                      <p
                        className={cs(
                          styles['onlyQuickContentBtn'],
                          styles['btn--quickContent']
                        )}
                      >
                        重新检测
                      </p>
                    </section>
                    <p className={styles['foldBtn']}>
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.9141 10.8036C13.5236 11.1941 12.8904 11.1941 12.4999 10.8036L8.72869 7.03234L4.95745 10.8036C4.56693 11.1941 3.93376 11.1941 3.54324 10.8036C3.15271 10.413 3.15271 9.77988 3.54324 9.38936L8.02158 4.91102C8.41211 4.52049 9.04527 4.52049 9.43579 4.91102L13.9141 9.38936C14.3047 9.77988 14.3047 10.413 13.9141 10.8036Z"
                          fill="#1C1F23"
                          fillOpacity="0.6"
                        ></path>
                      </svg>
                    </p>
                  </section>
                </section>
              </section>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Publish
