import apis from './apis'

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
let isRefresh = false
let success = false
export async function tryRefreshToken() {
  if (isRefresh) {
    while (isRefresh) {
      await sleep(10)
    }
    return success
  }
  isRefresh = true
  // 尝试刷新token
  const resp = await apis.refreshToken()
  if (resp.status === 200 && resp.data.code === 200) {
    localStorage.setItem('token', resp.data.data)
    success = true
  } else {
    localStorage.removeItem('token')
    window.location.pathname = '/login'
    success = false
  }
  isRefresh = false
  return success
}
