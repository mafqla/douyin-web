import { useState, useCallback, useEffect } from 'react'
import { Edit3, Save, X, Plus, Trash2, Loader2, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ResponseSchema } from './ResponseSchema'
import { saveApiChanges, checkEditorStatus } from '@/utils/api-editor-service'
import type { ResponseField } from '@/types/api'

interface EditableResponseSchemaProps {
  fields: ResponseField[]
  apiId: string
  onSave?: (fields: ResponseField[]) => void
  className?: string
}

const FIELD_TYPES = ['string', 'number', 'boolean', 'array', 'object'] as const

interface FieldEditorProps {
  field: ResponseField
  depth: number
  onChange: (field: ResponseField) => void
  onRemove: () => void
}

function FieldEditor({ field, depth, onChange, onRemove }: FieldEditorProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = field.children && field.children.length > 0
  const canHaveChildren = field.type === 'object' || field.type === 'array'

  const updateField = (key: keyof ResponseField, value: unknown) => {
    onChange({ ...field, [key]: value })
  }

  const updateChild = (index: number, childField: ResponseField) => {
    const newChildren = [...(field.children || [])]
    newChildren[index] = childField
    onChange({ ...field, children: newChildren })
  }

  const removeChild = (index: number) => {
    const newChildren = (field.children || []).filter((_, i) => i !== index)
    onChange({ ...field, children: newChildren })
  }

  const addChild = () => {
    const newChild: ResponseField = {
      name: '',
      type: 'string',
      description: ''
    }
    onChange({ ...field, children: [...(field.children || []), newChild] })
  }

  return (
    <div className={cn('border-l-2 border-border', depth > 0 && 'ml-4 mt-1')}>
      <div className="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded">
        {/* 展开/收缩 */}
        {canHaveChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 hover:bg-accent rounded shrink-0"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {/* 字段名 */}
        <Input
          value={field.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="h-7 w-[120px] text-xs font-mono"
          placeholder="字段名"
        />

        {/* 类型 */}
        <select
          value={field.type}
          onChange={(e) => updateField('type', e.target.value)}
          className="h-7 w-[80px] rounded-md border border-input bg-transparent px-2 text-xs"
        >
          {FIELD_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* 描述 */}
        <Input
          value={field.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="h-7 flex-1 text-xs"
          placeholder="描述"
        />

        {/* 示例值 */}
        <Input
          value={field.example !== undefined ? String(field.example) : ''}
          onChange={(e) => {
            const val = e.target.value
            let parsed: unknown = val
            if (field.type === 'number') {
              parsed = val === '' ? undefined : Number(val)
            } else if (field.type === 'boolean') {
              parsed = val === 'true'
            }
            updateField('example', parsed)
          }}
          className="h-7 w-[100px] text-xs font-mono"
          placeholder="示例"
        />

        {/* 可空 */}
        <label className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
          <input
            type="checkbox"
            checked={field.nullable || false}
            onChange={(e) => updateField('nullable', e.target.checked)}
            className="h-3.5 w-3.5 rounded"
          />
          可空
        </label>

        {/* 操作按钮 */}
        {canHaveChildren && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={addChild}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>添加子字段</TooltipContent>
          </Tooltip>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-500 hover:text-red-700"
          onClick={onRemove}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* 子字段 */}
      {canHaveChildren && expanded && hasChildren && (
        <div className="pl-2">
          {field.children!.map((child, index) => (
            <FieldEditor
              key={index}
              field={child}
              depth={depth + 1}
              onChange={(f) => updateChild(index, f)}
              onRemove={() => removeChild(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function EditableResponseSchema({
  fields,
  apiId,
  onSave,
  className
}: EditableResponseSchemaProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editFields, setEditFields] = useState<ResponseField[]>([])
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
    setEditFields(JSON.parse(JSON.stringify(fields)))
    setError(null)
    setIsEditing(true)
  }, [fields])

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
      const result = await saveApiChanges(apiId, 'responseFields', editFields)

      if (result.success) {
        setIsEditing(false)
        onSave?.(editFields)
      } else {
        setError(result.error || '保存失败')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }, [editFields, apiId, onSave])

  // 更新字段
  const updateField = (index: number, field: ResponseField) => {
    setEditFields(prev => {
      const next = [...prev]
      next[index] = field
      return next
    })
  }

  // 删除字段
  const removeField = (index: number) => {
    setEditFields(prev => prev.filter((_, i) => i !== index))
  }

  // 添加字段
  const addField = () => {
    setEditFields(prev => [
      ...prev,
      {
        name: '',
        type: 'string',
        description: ''
      }
    ])
  }

  if (isEditing) {
    return (
      <div className={cn('rounded-lg border', className)}>
        {/* 工具栏 */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <div className="text-sm font-medium">编辑响应字段</div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1"
              onClick={addField}
            >
              <Plus className="h-3 w-3" />
              添加字段
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

        {/* 编辑区域 */}
        <div className="p-3 max-h-[500px] overflow-auto">
          {editFields.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              暂无响应字段，点击"添加字段"添加
            </div>
          ) : (
            editFields.map((field, index) => (
              <FieldEditor
                key={index}
                field={field}
                depth={0}
                onChange={(f) => updateField(index, f)}
                onRemove={() => removeField(index)}
              />
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* 编辑按钮 - 仅在开发模式显示 */}
      {editorEnabled && (
        <div className="absolute right-3 top-1 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs gap-1"
                onClick={handleEdit}
              >
                <Edit3 className="h-3 w-3" />
                编辑字段
              </Button>
            </TooltipTrigger>
            <TooltipContent>编辑并保存到文件（开发模式）</TooltipContent>
          </Tooltip>
        </div>
      )}
      <ResponseSchema fields={fields} />
    </div>
  )
}
