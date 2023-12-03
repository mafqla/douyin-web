import styles from '@/style/layout.module.scss'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Sider from './components/Sider'

const PageLayout = () => {
  return (
    <div className={styles.container}>
      <div
        className={styles['header-wrapper']}
        style={{ backgroundColor: 'rgba(var(--semi-grey-0),0)' }}
      >
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.sider}>
          <Sider />
        </div>
        <div className={styles['micro-wrapper']}>
          <div className={styles.micro}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageLayout
