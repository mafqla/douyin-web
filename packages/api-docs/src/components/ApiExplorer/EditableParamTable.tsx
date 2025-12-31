import { useState, useCallback, useEffect } from 'react'
import { Edit3, Save, X, Plus, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ParamTable } from './ParamTable'
import { saveApiChanges, checkEditorStatus } from '@/utils/api-editor-service'
import type { ApiParam } from '@/types/api'

interface EditableParamTableProps {
  params: ApiParam[]
  apiId: string
  onSave?: (params: ApiParam[]) => void
  className?: string
}

const PARAM_TYPES = ['string', 'number', 'boolean', 'array', 'object'] as const

export function EditableParamTable({
  params,
  apiId,
  onSave,
  className
}: EditableParamTableProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editParams, setEditParams] = useState<ApiParam[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editorEnabled, setEditorEnabled] = useState(false)

  // 检查编辑功能是否可用
  useEffect(() => {
    checkEditorStatus().then(status => {
      setEditorEnabled(status.enabled)
    })
  }, [])

  // 进入编辑模式
  const handleEdit = useCallback(() => {
    setEditParams(JSON.parse(JSON.stringify(params)))
    setError(null)
    setIsEditing(true)
  }, [params])

  // 取消编辑
  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setError(null)
  }, [])

  // 保存修改
  const handleSave = useCallback(async () => {
    setSaving(true)
    setError(null)

    try {
      const result = await saveApiChanges(apiId, 'params', editParams)

      if (result.success) {
        setIsEditing(false)
        onSave?.(editParams)
      } else {
        setError(result.error || '保存失败')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }, [editParams, apiId, onSave])

  // 更新参数字段
  const updateParam = (index: number, field: keyof ApiParam, value: unknown) => {
    setEditParams(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  // 添加新参数
  const addParam = () => {
    setEditParams(prev => [
      ...prev,
      {
        name: '',
        type: 'string',
        required: false,
        description: ''
      }
    ])
  }

  // 删除参数
  const removeParam = (index: number) => {
    setEditParams(prev => prev.filter((_, i) => i !== index))
  }

  if (isEditing) {
    return (
      <div className={cn('rounded-lg border', className)}>
        {/* 工具栏 */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <div className="text-sm font-medium">编辑请求参数</div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={addParam}
            >
              <Plus className="h-3 w-3" />
              添加参数
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 text-green-600 hover:text-green-700"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Save className="h-3 w-3" />
              )}
              保存
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 text-red-600 hover:text-red-700"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="h-3 w-3" />
              取消
            </Button>
          </div>
        </div>

        {error && (
          <div className="mx-3 mt-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* 编辑表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left py-2 px-3 font-medium w-[150px]">参数名</th>
                <th className="text-left py-2 px-3 font-medium w-[100px]">类型</th>
                <th className="text-left py-2 px-3 font-medium w-[60px]">必填</th>
                <th className="text-left py-2 px-3 font-medium">说明</th>
                <th className="text-left py-2 px-3 font-medium w-[120px]">示例值</th>
                <th className="w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {editParams.map((param, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 px-3">
                    <Input
                      value={param.name}
                      onChange={(e) => updateParam(index, 'name', e.target.value)}
                      className="h-8 text-xs font-mono"
                      placeholder="参数名"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <select
                      value={param.type}
                      onChange={(e) => updateParam(index, 'type', e.target.value)}
                      className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs"
                    >
                      {PARAM_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={param.required}
                      onChange={(e) => updateParam(index, 'required', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      value={param.description}
                      onChange={(e) => updateParam(index, 'description', e.target.value)}
                      className="h-8 text-xs"
                      placeholder="参数说明"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      value={param.example || ''}
                      onChange={(e) => updateParam(index, 'example', e.target.value)}
                      className="h-8 text-xs font-mono"
                      placeholder="示例"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-700"
                      onClick={() => removeParam(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {editParams.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    暂无参数，点击"添加参数"添加
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 编辑按钮元素
  const editButton = editorEnabled ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs gap-1"
          onClick={handleEdit}
        >
          <Edit3 className="h-3 w-3" />
          编辑
        </Button>
      </TooltipTrigger>
      <TooltipContent>编辑并保存到文件（开发模式）</TooltipContent>
    </Tooltip>
  ) : undefined

  return (
    <div className={className}>
      <ParamTable params={params} toolbarExtra={editButton} />
    </div>
  )
}
