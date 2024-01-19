import {
  Form,
  Input,
  Checkbox,
  Link,
  Button,
  Space
} from '@arco-design/web-react'
import { FormInstance } from '@arco-design/web-react/es/Form'
import { IconLock, IconUser } from '@arco-design/web-react/icon'
import React, { useEffect, useRef, useState } from 'react'
import useStorage from '@/utils/useStorage'
import useLocale from '@/utils/useLocale'
import locale from './locale'
import styles from './style/index.module.less'
import apis from '@/api/apis'

export default function LoginForm() {
  const formRef = useRef<FormInstance>()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginParams, setLoginParams, removeLoginParams] =
    useStorage('loginParams')

  const t = useLocale(locale)

  const [rememberPassword, setRememberPassword] = useState(!!loginParams)

  function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      setLoginParams(JSON.stringify(params))
    } else {
      removeLoginParams()
    }
    // 记录登录状态
    localStorage.setItem('userStatus', 'login')
    // 跳转到首页
    window.location.pathname = '/'
  }

  async function login(params) {
    setErrorMessage('')
    setLoading(true)

    try {
      const { code, data, msg } = await apis.login({
        cellPhone: params.userName,
        password: params.password,
        type: 1,
        rememberMe: rememberPassword
      })

      if (code === 200) {
        localStorage.setItem('token', data.token)
        afterLoginSuccess(params)
      } else {
        setErrorMessage(msg || t['login.form.login.errMsg'])
      }
    } catch (error) {
      // console.error(error)
      setErrorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values)
    })
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const rememberPassword = !!loginParams
    setRememberPassword(rememberPassword)
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(loginParams)
      formRef.current.setFieldsValue(parseParams)
    }
  }, [loginParams])

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>{t['login.form.title']}</div>
      <div className={styles['login-form-sub-title']}>
        {t['login.form.title']}
      </div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form
        className={styles['login-form']}
        layout="vertical"
        ref={formRef}
        initialValues={{
          userName: '13567891234',
          password: '123456'
        }}
      >
        <Form.Item
          field="userName"
          rules={[{ required: true, message: t['login.form.userName.errMsg'] }]}
        >
          <Input
            prefix={<IconUser />}
            placeholder={t['login.form.userName.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Form.Item
          field="password"
          rules={[{ required: true, message: t['login.form.password.errMsg'] }]}
        >
          <Input.Password
            prefix={<IconLock />}
            placeholder={t['login.form.password.placeholder']}
            onPressEnter={onSubmitClick}
          />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              {t['login.form.rememberPassword']}
            </Checkbox>
            <Link>{t['login.form.forgetPassword']}</Link>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            {t['login.form.login']}
          </Button>
        </Space>
      </Form>
    </div>
  )
}
