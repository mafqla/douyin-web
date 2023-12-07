import styles from '@/style/layout.module.scss'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Sider from './components/Sider'
import cs from 'classnames'
import { useEffect, useState } from 'react'
const PageLayout = () => {
  //获取当前路由
  const location = useLocation()
  const [isShow, setIsShonw] = useState(false)
  //如果当前路由包含home，就不显示头部
  useEffect(() => {
    if (location.pathname.includes('home')) {
      setIsShonw(true)
    } else {
      setIsShonw(false)
    }
  }, [location])
  return (
    <div className={styles.container}>
      <div
        className={styles['header-wrapper']}
        style={{ backgroundColor: 'rgba(var(--semi-grey-0),0)' }}
      >
        <Header />
      </div>
      <div className={cs(styles.content, isShow && styles['creator-content'])}>
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
