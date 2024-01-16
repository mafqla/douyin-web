import React, { useEffect } from 'react'
import Footer from '@/components/Footer'
import LoginForm from './form'
import styles from './style/index.module.less'

function Login() {
  useEffect(() => {
    document.body.setAttribute('arco-theme', 'light')
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <video
          src="https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_home_web/medias/banner_video2.27b8eb28.mp4"
          muted
          autoPlay
          loop
        />
      </div>
      <div className={styles.content}>
        <div className={styles['content-inner']}>
          <LoginForm />
        </div>
        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </div>
  )
}
Login.displayName = 'LoginPage'

export default Login
