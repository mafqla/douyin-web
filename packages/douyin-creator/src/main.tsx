import './style/global.scss'

import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { GlobalContext } from './context'
import rootReducer from './store'
// import axios from 'axios'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN'
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US'
import { LocaleProvider } from '@douyinfe/semi-ui'
import checkLogin from './utils/checkLogin'
import changeTheme from './utils/changeTheme'
import useStorage from './utils/useStorage'

import './mock'

const store = createStore(rootReducer)
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
  // function fetchUserInfo() {
  //   store.dispatch({
  //     type: 'update-userInfo',
  //     payload: { userLoading: true },
  //   })
  //   axios.get('/api/user/userInfo').then((res) => {
  //     store.dispatch({
  //       type: 'update-userInfo',
  //       payload: { userInfo: res.data, userLoading: false },
  //     })
  //   })
  // }

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
      <Provider store={store}>
        <GlobalContext.Provider value={contextValue}>
          <RouterProvider router={routes} />
        </GlobalContext.Provider>
      </Provider>
    </LocaleProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Index />)
