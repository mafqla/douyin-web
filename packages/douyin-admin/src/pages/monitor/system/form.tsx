import React, { useContext } from 'react'
import dayjs from 'dayjs'
import { Form, DatePicker, Button, Grid } from '@arco-design/web-react'
import { GlobalContext } from '@/context'
import locale from './locale'
import useLocale from '@/utils/useLocale'
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon'
import styles from './style/index.module.less'

const { Row, Col } = Grid
const { useForm } = Form

function SystemForm(props: {
  onSearch: (values: Record<string, any>) => void
}) {
  const { lang } = useContext(GlobalContext)

  const t = useLocale(locale)
  const [form] = useForm()

  const handleSubmit = () => {
    const values = form.getFieldsValue()
    props.onSearch(values)
  }

  const handleReset = () => {
    form.resetFields()
    props.onSearch({})
  }

  const colSpan = lang === 'zh-CN' ? 8 : 12

  return (
    <div className={styles['search-form-wrapper']}>
      <Form
        form={form}
        className={styles['search-form']}
        labelAlign="left"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
      >
        <Row gutter={24}>
          <Col span={colSpan}>
            <Form.Item label={t['system.columns.time']} field="time">
              <DatePicker.RangePicker
                allowClear
                style={{ width: '100%' }}
                disabledDate={(date) => dayjs(date).isAfter(dayjs())}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className={styles['right-button']}>
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          {t['system.form.search']}
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          {t['system.form.reset']}
        </Button>
      </div>
    </div>
  )
}

export default SystemForm
