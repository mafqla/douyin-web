import { useState } from 'react'
import styles from './style/post-assistant.module.scss'
import cs from 'classnames'

const PostAssistant = () => {
  const [isFold, setIsFold] = useState(true)

  const handleFold = () => {
    setIsFold(!isFold)
  }

  //todo: 调用接口获取检测结果
  const getCheckResult = () => {
    return true
  }
  return (
    <section>
      <section className={styles['post-assistant']}>
        <section>
          <section
            className={cs(
              styles['fold-btn-wrapper'],
              !isFold ? styles['unfold--head'] : styles['fold-head']
            )}
            onClick={handleFold}
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
              styles['main-wrapper'],

              isFold ? styles['unfold-main'] : styles['fold-main']
            )}
          >
            <p className={styles['title-wrapper']}>
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
                onClick={getCheckResult}
              >
                重新检测
              </p>
            </section>
            <p className={styles['fold-btn']} onClick={handleFold}>
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
  )
}
export default PostAssistant
