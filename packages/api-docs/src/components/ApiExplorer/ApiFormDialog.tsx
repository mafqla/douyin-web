import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { addApi, checkEditorStatus } from '@/utils/api-editor-service'
import { apiRegistry } from '@/data/api-registry'
import type { HttpMethod } from '@/types/api'

interface ApiFormDialogProps {
  /** 默认选中的分类 ID */
  defaultCategoryId?: string
  /** 添加成功后的回调 */
  onSuccess?: () => void
  /** 触发按钮（可选，不传则使用默认按钮） */
  trigger?: React.ReactNode
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

export function ApiFormDialog({ defaultCategoryId, onSuccess, trigger }: ApiFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editorEnabled, setEditorEnabled] = useState(false)

  // 表单状态
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '')
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState<HttpMethod>('GET')

  // 检查编辑功能是否可用
  useEffect(() => {
    checkEditorStatus().then(status => {
      setEditorEnabled(status.enabled)
    })
  }, [])

  // 重置表单
  const resetForm = () => {
    setCategoryId(defaultCategoryId || apiRegistry[0]?.id || '')
    setId('')
    setName('')
    setDescription('')
    setUrl('')
    setMethod('GET')
    setError(null)
  }

  // 打开对话框时重置表单
  useEffect(() => {
    if (open) {
      resetForm()
    }
  }, [open])

  // 根据名称自动生成 ID
  const handleNameChange = (value: string) => {
    setName(value)
    // 自动生成 ID（转换为 kebab-case）
    if (!id || id === nameToId(name)) {
      setId(nameToId(value))
    }
  }

  const nameToId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // 提交表单
  const handleSubmit = async () => {
    // 验证
    if (!categoryId) {
      setError('请选择分类')
      return
    }
    if (!id.trim()) {
      setError('请输入接口 ID')
      return
    }
    if (!name.trim()) {
      setError('请输入接口名称')
      return
    }
    if (!url.trim()) {
      setError('请输入接口 URL')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const result = await addApi(categoryId, {
        id: id.trim(),
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        method,
        params: [],
        responseType: 'object',
        responseFields: []
      })

      if (result.success) {
        setOpen(false)
        onSuccess?.()
        // 刷新页面以加载新数据
        window.location.reload()
      } else {
        setError(result.error || '添加失败')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '添加失败')
    } finally {
      setSaving(false)
    }
  }

  // 如果编辑功能不可用，不渲染按钮
  if (!editorEnabled) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-7 gap-1">
            <Plus className="h-3.5 w-3.5" />
            新增接口
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新增 API 接口</DialogTitle>
          <DialogDescription>
            创建一个新的 API 接口定义，保存后将写入源文件。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 分类选择 */}
          <div className="grid gap-2">
            <Label htmlFor="category">所属分类</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {apiRegistry.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 接口名称 */}
          <div className="grid gap-2">
            <Label htmlFor="name">接口名称</Label>
            <Input
              id="name"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="例如：获取用户信息"
            />
          </div>

          {/* 接口 ID */}
          <div className="grid gap-2">
            <Label htmlFor="id">接口 ID</Label>
            <Input
              id="id"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="例如：get-user-info"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              唯一标识符，用于路由和引用
            </p>
          </div>

          {/* 请求方法和 URL */}
          <div className="grid grid-cols-[100px_1fr] gap-2">
            <div className="grid gap-2">
              <Label>请求方法</Label>
              <Select value={method} onValueChange={(v: HttpMethod) => setMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map(m => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">请求 URL</Label>
              <Input
                id="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="/api/v1/example"
                className="font-mono"
              />
            </div>
          </div>

          {/* 描述 */}
          <div className="grid gap-2">
            <Label htmlFor="description">接口描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="描述该接口的功能和用途"
              rows={2}
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            添加接口
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
