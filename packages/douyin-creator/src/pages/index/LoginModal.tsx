import { useState } from 'react'
import styles from './style/loginModal.module.scss'
import {
  Button,
  Form,
  Radio,
  RadioGroup,
  Select,
  TabPane,
  Tabs,
} from '@douyinfe/semi-ui'

const LoginModal = () => {
  //区号
  const [areaCode, setAreaCode] = useState('+86')
  const [selectedRole, setSelectedRole] = useState('creator') // Default role

  //是否同意协议
  const [agreement, setAgreement] = useState(false)
  //同意图标路径
  const [agreementIcon, setAgreementIcon] = useState(
    '//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator/svgs/uncheck.1809bf04.svg',
  )
  //切换同意图标
  const onanimationcancel = () => {
    if (agreement) {
      setAgreementIcon(
        '//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator/svgs/uncheck.1809bf04.svg',
      )
    } else {
      setAgreementIcon(
        '//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator/svgs/check.90aefaa2.svg',
      )
    }
    setAgreement(!agreement)
  }

  const handleRoleChange = (role) => {
    setSelectedRole(role.target.value)
  }

  //切换区号
  const handleAreaCodeChange = (value) => {
    setAreaCode(value.match(/\+?\d+/))
  }

  //错误提示
  const [err, setErr] = useState('')
  const handleSubmit = () => {
    const isPhoneValid = /^\d{11}$/.test(formData.phone)
    const isCodeValid = /^\d{6}$/.test(formData.code)

    if (!isPhoneValid) return setErr('手机号应为11位数字')
    if (!isCodeValid) return setErr('验证码应为6位数字')
    if (!agreement) return setErr('请勾选同意用户协议和隐私政策')

    console.log(formData, agreement)
    setErr('')
  }

  const [disabled, setDisabled] = useState(true)
  //存储表单数据
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
  })
  const [toggle, setToggle] = useState(false)
  const handleFormChange = (value) => {
    const { phone, code, password } = value.values
    console.log(value.values)
    const isDisabled = !((phone && code) || password)
    setFormData({
      phone,
      code,
      password,
    })

    setDisabled(isDisabled)
  }
  console.log(formData)
  //切换切换密码登录

  const onanimationcancel2 = () => {
    setToggle(!toggle)
  }
  //发送验证码
  const [countdown, setCountdown] = useState(0)
  const [isCounting, setIsCounting] = useState(false)

  const handleSendCode = () => {
    const isPhoneValid = /^\d{11}$/.test(formData.phone)
    console.log(isPhoneValid)
    // 验证手机号码是否有效
    if (!isPhoneValid) {
      setErr('手机号应为11位数字')
      return
    }
    if (isCounting) {
      return
    }

    setErr('')
    setIsCounting(true)
    setCountdown(60)

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1)
    }, 1000)

    setTimeout(() => {
      clearInterval(timer)
      setIsCounting(false)
      setCountdown(0)
    }, 60000)
  }

  return (
    <div className={styles['login-card-wrapper']}>
      <div className={styles['login-card-title']}>登录账号</div>
      <div className={styles['login-card-header']}>
        <div className={styles['login-card-header-title']}>请选择登录角色</div>
        <RadioGroup
          className={styles['login-card-header-radio']}
          defaultValue={selectedRole}
          onChange={handleRoleChange}
        >
          <Radio value="creator">创作者登录</Radio>
          <Radio value="institution">机构登录</Radio>
        </RadioGroup>
      </div>
      <div className={styles['login-card-body']}>
        <Tabs type="line">
          <TabPane tab="扫码登陆" itemKey="1">
            <div className={styles['account-qrcode']}>
              <div className={styles['qrcode-image']}>
                <img src="data:image/png;base64,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" />
                <img
                  className={styles['logo']}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAMAAADwSaEZAAAAq1BMVEVHcEz////////////////////////49PX///////8AAAD/////AE8A9+8A2dLe/v2gADH/gKceIiIaAAj/3ujf399EEB6V/Pn/m7om+fLeA0b/JGg8ABJnAB9B+vRQUFAAfHf/Q33FAD0Avrf/vtK6/fsAZGAAnZhucXGQkZL+ZJMAREFn9vJGPUCAACe/v7/vAEqQCjHv/v7/EFoAi4YwfnsQi4ffUHxAu7c9LFlTAAAACnRSTlMAcGBfed+/+oAgXFJGkAAAAy1JREFUWMPN2Fl3qjAQAGBsj1JDqgh4ZBdQoCJ1aXuX///LLgghARIMy8OdJ6v0O5MhC4wg5LFcSKNivhSqeBWlkSHOkPUmTRBvTUs87RXQI5T9aVvXZuiv6ycYEPuKe81qX9ZL/AAD4wMJS2FefNoqYHAoZXILgdM6rFBEbK3AxKd5rd5RxLTcRAJ7Xq8MM9xH/LVtu103jG0BD7Yu6wyh3P79WmH7Ppjk07BPhHEkRmI6NCkXiCV26oeJ31BtX3AqsX0/LEvNoayEElN6YpIfUGZHiYG+mGa1JwcYikmaOSEmafcJMcqiGYNJqadMh0np+yH2ookwaZ1mm8hUWM6502FZwCCYEIPwf8GO2oTYxtIHYOfoJ45jr4VBSHI8WHRApxEFC2Rro3FjHj7ZaJgMbBNaiZ6X7xl2RlS6W6+zq802BoATQBRdmFdIbkiOo4UBoCKvA4trVAeWh+1cZJmNFdauebsYWPcW9BijsZamwM4tawS2alnDsccgsSVq2UwaiikrsvZHP7/v30OxKB8kOsx8SM7K/tgBJ6ZZD+Z2dxxHHoIpRGIPy7RpWxAfdsaJ6bklq2A45uFbmScmMzZHPiyuRqnlY1RHYVn903JWZJgDxmJEydTRWFhlFgAwtmZhVbM6puB7k/BhPxXWetaPMJatjDsHFuGFqTcyyxftVzVrLjzLiVjl/k1tbJnErHH41maKH6id+iDJG23z7RoufgT+U7cMYm2oXJtjVZg8TudixRZnO540MACcOy1xLEm71eGAzmP0fcIqGe0McMntf2eUlBFKxG6iAt7TKaydJjvXMIw0xLcFMqZshZHP857b1Vbx2YkptFfEOGRbm9y6MJol1JfX3+tOy2Q8GqKXV7H+9a8veiMqga0tk4gteuFvNIE+NYp1tDqtfdU9uDZ+sZMmVxzIbOuRGKNJoprJkRigXh7IAdP66GzfXCD0Ez2LTWKV5/rNYbeWyPYNpbGkyiYk43ZRn7aphAW7TeVUnnm3OVpe8yfNONXOQlV5m3HCC6rzlqdZ0m4CXdH/z+oNzG3/BqbIboeOb60Kwmx80/cFt5CX83HWomhH/wNfVQq5Ea1tuwAAAABJRU5ErkJggg=="
                />
                <div>
                  <img src="//lf-cdn-tos.bytescm.com/obj/static/ies/douyin_creator/svgs/refresh.31a48243.svg" />
                </div>
              </div>
              <p className={styles['error']}>二维码已失效，点击刷新</p>
              <p className="">
                <div className={styles['account-qrcode-desc']}>
                  打开抖音App，在首页左上角
                  <span className={styles['circle-icon']}>
                    <span className={styles['circle-icon-text']}>＋</span>
                  </span>
                  中使用<em>“扫一扫”</em>功能
                </div>
              </p>
            </div>
          </TabPane>
          <TabPane tab="手机号登录" itemKey="2">
            <Form
              className={styles['account-phone']}
              onChange={handleFormChange}
            >
              <Form.Input
                field="phone"
                noLabel
                size="large"
                type="tel"
                placeholder="请输入手机号码"
                prefix={
                  <Select
                    defaultValue={areaCode}
                    value={areaCode}
                    onChange={handleAreaCodeChange}
                  >
                    <Select.Option value="+1">美国+1</Select.Option>
                    <Select.Option value="+852">香港+852</Select.Option>
                    <Select.Option value="+86">中国+86</Select.Option>
                    <Select.Option value="+81">日本+81</Select.Option>
                  </Select>
                }
              ></Form.Input>

              {
                //切换密码登录
                toggle ? (
                  <Form.Input
                    field="password"
                    noLabel
                    size="large"
                    type="password"
                    placeholder="请输入密码"
                    suffix={null}
                  />
                ) : (
                  <Form.Input
                    field="code"
                    noLabel
                    size="large"
                    type="tel"
                    placeholder="请输入验证码"
                    suffix={
                      isCounting ? (
                        <span
                          className={styles['send-code-timer']}
                        >{`${countdown}秒`}</span>
                      ) : (
                        <span onClick={handleSendCode}>发送验证码</span>
                      )
                    }
                  />
                )
              }
              <p className={styles['err']}>{err}</p>
              <div className={styles['toggle']} onClick={onanimationcancel2}>
                <span>{toggle ? '切换为验证码登录' : '切换为密码登录 '}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <g opacity="0.4">
                    <path
                      d="M4 10L8 6L4 2"
                      stroke="black"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </g>
                </svg>
              </div>

              <Button
                type="primary"
                disabled={disabled}
                size="large"
                block
                theme="solid"
                htmlType="submit"
                onClick={handleSubmit}
              >
                登录
              </Button>
              <div className={styles['agreement']}>
                <img src={agreementIcon} onClick={onanimationcancel} />
                <div>登录，即表明你同意我们的</div>
                <a
                  className={styles['link']}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="//www.douyin.com/agreement/"
                >
                  用户协议
                </a>
                和
                <a
                  className={styles['link']}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="//www.douyin.com/privacy"
                >
                  隐私政策
                </a>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    </div>
  )
}

export default LoginModal
