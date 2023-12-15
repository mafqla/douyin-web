import { Modal, Popover, Skeleton } from '@douyinfe/semi-ui'
import styles from './style/index.module.scss'
import cs from 'classnames'
import EditorIcon from '@/assets/icon/editor-icon.svg?react'
import ReplaceIcon from '@/assets/icon/replace-icon.svg?react'

import { IconImage, IconTickCircle } from '@douyinfe/semi-icons'
import { useEffect, useState } from 'react'
import CoverSelect from './CoverSelect'

const recommendationCovers = [
  {
    id: 1,
    imageSrc:
      'https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/c54a71a6081e43929451f4cedcc05254~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702518069&x-orig-sign=XlyNCSXD6kM6DMO5qhluBHCNJVg%3D'
  },
  {
    id: 2,
    imageSrc:
      'https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/c54a71a6081e43929451f4cedcc05254~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702518069&x-orig-sign=XlyNCSXD6kM6DMO5qhluBHCNJVg%3D'
  },
  {
    id: 3,
    imageSrc:
      'https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/c54a71a6081e43929451f4cedcc05254~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702518069&x-orig-sign=XlyNCSXD6kM6DMO5qhluBHCNJVg%3D'
  }
  // Add more cover objects as needed
]
const Index: React.FC = () => {
  const [selectedCover, setSelectedCover] = useState(null)
  //是否显示选取封面modal
  const [isSelectModal, setIsSelectModal] = useState(false)

  const handleCoverClick = (cover) => {
    // 选中当前封面，取消其他封面的选中状态
    setSelectedCover(cover)
  }

  const handleCoverSelectModal = () => {
    setIsSelectModal(true)
  }

  const handleCoverSelectonOk = () => {
    setIsSelectModal(false)
  }
  const handleCoverSelectonCancel = () => {
    setIsSelectModal(false)
  }

  useEffect(() => {
    console.log(isSelectModal)
  })
  return (
    <>
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
                    'url("https://p0-creator-media-private.douyin.com/tos-cn-i-jm8ajry58r/c54a71a6081e43929451f4cedcc05254~tplv-jm8ajry58r-image.image?policy=eyJ2bSI6MywidWlkIjoiODgzNTc1ODcxMzIifQ%3D%3D&rk3s=70809c85&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1702518069&x-orig-sign=XlyNCSXD6kM6DMO5qhluBHCNJVg%3D")',
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
            <div className={styles['controlContainer']}>
              <div className={styles['btn--icon']}>
                <EditorIcon />
                <span>编辑</span>
              </div>
              <div
                className={styles['btn--icon']}
                onClick={handleCoverSelectModal}
              >
                <ReplaceIcon />
                <span>替换</span>
              </div>
            </div>
          </div>
          <div className={styles['recommendContainer']}>
            <div
              className={styles['recommendDisplay']}
              style={{ height: '200px' }}
            >
              <span className={styles['recommendTitle']}>智能推荐封面</span>
              <div className={styles['recommendCoverContainer']}>
                {recommendationCovers.map((cover, index) => (
                  <Popover
                    showArrow
                    arrowPointAtCenter
                    key={cover?.id || index}
                    content={
                      <img
                        style={{
                          width: '211.5px'
                        }}
                        src={cover.imageSrc}
                      />
                    }
                    position="top"
                  >
                    <div
                      className={cs(styles['recommendCover'], {
                        [styles['selected']]: selectedCover?.id === cover.id
                      })}
                      style={{
                        width: '105.75px',
                        height: '141px'
                      }}
                      onClick={() => handleCoverClick(cover)}
                    >
                      <Skeleton
                        style={{ width: 200, height: 150 }}
                        placeholder={<Skeleton.Image />}
                        loading={false}
                      >
                        <div
                          className={styles['maskBox']}
                          style={{
                            width: '105.75px'
                          }}
                        >
                          <div className={styles['mask']}></div>
                          <img src={cover.imageSrc} alt={`Cover ${index}`} />
                        </div>
                        {selectedCover?.id === cover.id && (
                          <div className={styles['select-icon']}>
                            <IconTickCircle
                              style={{ color: 'rgb(255, 44, 85)' }}
                            />
                          </div>
                        )}
                      </Skeleton>
                    </div>
                  </Popover>
                ))}
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

      <Modal
        className={styles['modal']}
        width={1052}
        height={608}
        title={null}
        footer={null}
        visible={isSelectModal}
        closeOnEsc={true}
        onOk={handleCoverSelectonOk}
        onCancel={handleCoverSelectonCancel}
        header={false}
        maskClosable={false}
      >
        <CoverSelect
          handleOk={handleCoverSelectonOk}
          handleOpenEditor={handleCoverSelectonCancel}
          handleCoverSelectonCancel={handleCoverSelectonCancel}
        />
      </Modal>
    </>
  )
}

export default Index
