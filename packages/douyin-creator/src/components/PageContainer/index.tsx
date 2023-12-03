import { ReactNode } from 'react'

import styles from './index.module.scss'

const PageTitle: React.FC<{ title: string }> = (props) => (
  <span className={styles['simple-content-title']}>{props.title}</span>
)
interface PageContainerProps {
  children: ReactNode
  title?: string
}
const PageContainer: React.FC<PageContainerProps> = (props) => (
  <div className={styles['simple-wrapper']}>
    <div className={styles['simple-content-wrapper']}>
      <div className={styles['simple-content']}>
        {props.title && (
          <>
            <PageTitle title={props.title} />
          </>
        )}
        <div className={styles['simple-content-tabs']}>{props.children}</div>
      </div>
    </div>
  </div>
)

export default PageContainer
