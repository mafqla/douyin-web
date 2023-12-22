import { useConfigStore } from '@/store'
import { G2 } from 'bizcharts'
import { useEffect, useState } from 'react'

const defaultDarkTheme = G2.getTheme('dark')

G2.registerTheme('darkTheme', {
  ...defaultDarkTheme,
  background: 'transparent'
})

function useBizTheme() {
  const theme = useConfigStore((state) => state.theme)
  const themeName = theme === 'dark' ? 'darkTheme' : 'light'
  const [themeObj, setThemeObj] = useState(G2.getTheme(themeName))

  useEffect(() => {
    const themeName = theme === 'dark' ? 'darkTheme' : 'light'
    const newTheme = G2.getTheme(themeName)
    setThemeObj(newTheme)
  }, [theme])

  return themeObj
}

export default useBizTheme
