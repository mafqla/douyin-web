import './style/global.less'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { ConfigProvider } from '@arco-design/web-react'
import zhCN from '@arco-design/web-react/es/locale/zh-CN'
import enUS from '@arco-design/web-react/es/locale/en-US'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import rootReducer from './store'
import PageLayout from './layout'
import { GlobalContext } from './context'
import Login from './pages/login'
import checkLogin from './utils/checkLogin'
import changeTheme from './utils/changeTheme'
import useStorage from './utils/useStorage'
import apis from './api/apis'
// import './mock';

const store = createStore(rootReducer)

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'zh-CN')
  const [theme, setTheme] = useStorage('arco-theme', 'light')

  function getArcoLocale() {
    switch (lang) {
      case 'zh-CN':
        return zhCN
      case 'en-US':
        return enUS
      default:
        return zhCN
    }
  }

  async function fetchUserInfo() {
    store.dispatch({
      type: 'update-userInfo',
      payload: { userLoading: true }
    })

    try {
      const res = await apis.getUserInfo()
      store.dispatch({
        type: 'update-userInfo',
        payload: { userInfo: res.data, userLoading: false }
      })
    } catch (error) {
      console.error(error)
    }
  }


  useEffect(() => {
    if (checkLogin()) {
      fetchUserInfo()
    }
    changeTheme(theme)
  }, [theme])

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme
  }

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={getArcoLocale()}
        componentConfig={{
          Card: {
            bordered: false
          },
          List: {
            bordered: false
          },
          Table: {
            border: false
          }
        }}
      >
        <Provider store={store}>
          <GlobalContext.Provider value={contextValue}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={PageLayout} />
            </Switch>
          </GlobalContext.Provider>
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  )
}

const domNode = document.getElementById('root')
ReactDOM.createRoot(domNode).render(<Index />)
