import styles from './style/chapter-addition.module.scss'

const ChapterAddition: React.FC = () => {
  return (
    <div className={styles['container-chapter']}>
      <div className={styles.title}>
        <div className={styles.titleMain}>
          <div className={styles.header}>
            <p className={styles.addChapterText}>添加章节</p>
          </div>
        </div>
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
  )
}

export default ChapterAddition
