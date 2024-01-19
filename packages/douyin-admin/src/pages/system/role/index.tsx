import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Table,
  Card,
  PaginationProps,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Message,
  FormInstance,
  Input,
  Select
} from '@arco-design/web-react'
import useLocale from '@/utils/useLocale'
import locale from './locale'
import './mock'
import { getColumns } from './constants'
import { IconDownload, IconPlus } from '@arco-design/web-react/icon'
import styles from './style/index.module.less'
import apis from '@/api/apis'
import { AddRoleParams, EditRoleParams } from '@/api/types'

const { Title } = Typography

function Role() {
  const t = useLocale(locale)

  const tableCallback = async (record, type) => {
    console.log(record, type)
    if (type === 'edit') {
      //编辑
      setEditVisible(true)
      setFormValue({
        editId: record.id,
        editCode: record.code,
        editName: record.name,
        editType: record.type
      })
    } else if (type === 'delete') {
      fetchData()
    }
  }

  const columns = useMemo(() => getColumns(t, tableCallback), [t])

  const [data, setData] = useState([])

  const [pagination, setPatination] = useState<PaginationProps>({
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize])

  async function fetchData() {
    const { current, pageSize } = pagination
    setLoading(true)

    try {
      const res = await apis.getRoleList({
        pageNo: current,
        pageSize
      })

      setData(res.data.list)
      setPatination({
        ...pagination,
        current,
        pageSize,
        total: res.data.total
      })
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  function onChangeTable({ current, pageSize }) {
    setPatination({
      ...pagination,
      current,
      pageSize
    })
  }

  // -----------------添加角色-----------------
  const [visible, setVisible] = useState(false)
  const { useForm } = Form
  const [form] = useForm()

  //添加角色
  const addRole = async (params: AddRoleParams) => {
    try {
      const res = await apis.addRole(params)
      if (res.code === 200) {
        Message.success(res.msg)
        setVisible(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const formRef = useRef<FormInstance>()
  const handleSubmit = () => {
    formRef.current.validate().then((values: AddRoleParams) => {
      addRole(values)
      if (values) {
        //更新数据
        fetchData()
      }
    })
    formRef.current.resetFields()
  }
  //关闭
  const handleCancel = () => {
    formRef.current.resetFields()
    // 清空表单
    setVisible(false)
  }

  // -----------------添加角色-end-----------------

  // -----------------编辑角色-----------------

  const [editVisible, setEditVisible] = useState(false)
  const editFormRef = useRef<FormInstance>()
  //表单的值
  const [formValue, setFormValue] = useState<any>()
  console.log(formValue)

  const editRole = async (params: EditRoleParams) => {
    //编辑
    try {
      const res = await apis.editRole(params)
      if (res.code === 200) {
        Message.success(res.msg)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditOk = () => {
    editFormRef.current.validate().then((values) => {
      editRole({
        id: formValue.id,
        editRole: values
      })
    })
    editFormRef.current.resetFields()

    setEditVisible(false)

    setTimeout(() => {
      fetchData()
    }, 400)
  }

  //关闭
  const handleEditCancel = () => {
    editFormRef.current.resetFields() // 清空表单
    setEditVisible(false)
  }

  return (
    <Card>
      <Title heading={6}>{t['role.list']}</Title>
      <div className={styles['button-group']}>
        <Space>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => setVisible(true)}
          >
            {t['role.operations.add']}
          </Button>

          <Button>{t['role.operations.upload']}</Button>
        </Space>
        <Space>
          <Button icon={<IconDownload />}>
            {t['role.operation.download']}
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />

      <Modal
        title={t['role.operations.add.role']}
        visible={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        autoFocus={false}
        focusLock={true}
        unmountOnExit={true}
      >
        <Form form={form} ref={formRef}>
          <Form.Item
            label={t['role.form.id']}
            field="id"
            rules={[
              {
                required: true,
                type: 'number',
                min: 0
              }
            ]}
          >
            <Input type="number" placeholder={t['role.form.id.placeholder']} />
          </Form.Item>
          <Form.Item
            label={t['role.form.code']}
            field="code"
            rules={[{ required: true, message: t['role.form.code.required'] }]}
          >
            <Input allowClear placeholder={t['role.form.code.placeholder']} />
          </Form.Item>
          <Form.Item
            label={t['role.form.name']}
            field="name"
            rules={[{ required: true, message: t['role.form.name.required'] }]}
          >
            <Input allowClear placeholder={t['role.form.name.placeholder']} />
          </Form.Item>
          <Form.Item
            label={t['role.form.type']}
            field="type"
            rules={[{ required: true, message: t['role.form.type.required'] }]}
          >
            <Select placeholder={t['role.form.type.placeholder']}>
              <Select.Option value={0}>固定角色</Select.Option>
              <Select.Option value={1}>自定义</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={t['role.operations.edit']}
        visible={editVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        autoFocus={false}
        focusLock={true}
        unmountOnExit={true}
      >
        <Form form={form} ref={editFormRef} initialValues={formValue}>
          <Form.Item
            label={t['role.form.id']}
            field="editId"
            rules={[
              {
                required: true,

                type: 'number',
                min: 0
              }
            ]}
          >
            <Input type="number" placeholder={t['role.form.id.placeholder']} />
          </Form.Item>
          <Form.Item
            label={t['role.form.code']}
            field="editCode"
            rules={[{ required: true, message: t['role.form.code.required'] }]}
          >
            <Input allowClear placeholder={t['role.form.code.placeholder']} />
          </Form.Item>
          <Form.Item
            label={t['role.form.name']}
            field="editName"
            rules={[{ required: true, message: t['role.form.name.required'] }]}
          >
            <Input allowClear placeholder={t['role.form.name.placeholder']} />
          </Form.Item>
          <Form.Item
            label={t['role.form.type']}
            field="editType"
            rules={[{ required: true, message: t['role.form.type.required'] }]}
          >
            <Select placeholder={t['role.form.type.placeholder']}>
              <Select.Option value={0}>固定角色</Select.Option>
              <Select.Option value={1}>自定义</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default Role
