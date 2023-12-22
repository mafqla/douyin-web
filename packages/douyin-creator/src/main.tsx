import './style/global.scss'

import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { GlobalContext } from './context'
// import axios from 'axios'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN'
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US'
import { LocaleProvider } from '@douyinfe/semi-ui'
import checkLogin from './utils/checkLogin'
import changeTheme from './utils/changeTheme'
import useStorage from './utils/useStorage'
// import  useStore  from './store'

import './mock'

export const Index = () => {
  const [lang, setLang] = useStorage('semi-lang', 'zh-CN')
  const [theme, setTheme] = useStorage('semi-theme', 'light')

  const getLocale = () => {
    switch (lang) {
      case 'zh-CN':
        return zh_CN
      case 'en-US':
        return en_US
      default:
        return zh_CN
    }
  }
  useEffect(() => {
    if (checkLogin()) {
      // fetchUserInfo()
    } else if (window.location.pathname.replace(/\//g, '') !== '/') {
      // window.location.pathname = '/'
    }
  }, [])

  useEffect(() => {
    changeTheme(theme)
  }, [theme])
  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme
  }
  return (
    <LocaleProvider locale={getLocale()}>
      <GlobalContext.Provider value={contextValue}>
        <RouterProvider router={routes} />
      </GlobalContext.Provider>
    </LocaleProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Index />)
