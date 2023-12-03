function changeTheme(theme) {
  const body = document.body
  if (theme === 'dark') {
    body.setAttribute('theme-mode', 'dark')
  } else {
    body.removeAttribute('theme-mode')
  }

}

export default changeTheme
