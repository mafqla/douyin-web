import { useState, useCallback, useEffect } from 'react'
import { Edit3, Save, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JsonViewer } from '@/components/common'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { saveApiChanges, checkEditorStatus } from '@/utils/api-editor-service'

interface EditableJsonViewerProps {
  data: unknown
  apiId: string
  field: 'params' | 'responseFields' | 'examples'
  onSave?: (data: unknown) => void
  className?: string
  maxHeight?: string
}

export function EditableJsonViewer({
  data,
  apiId,
  field,
  onSave,
  className,
  maxHeight = '400px'
}: EditableJsonViewerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editorEnabled, setEditorEnabled] = useState(false)

  // 检查编辑功能是否可用
  useEffect(() => {
    checkEditorStatus().then(status => {
      setEditorEnabled(status.enabled)
    })
  }, [])

  // 进入编辑模式
  const handleEdit = useCallback(() => {
    setEditValue(JSON.stringify(data, null, 2))
    setError(null)
    setIsEditing(true)
  }, [data])

  // 取消编辑
  const handleCancel = useCallback(() => {
    setIsEditing(false)
    setError(null)
  }, [])

  // 保存修改
  const handleSave = useCallback(async () => {
    try {
      // 验证 JSON 格式
      const parsedData = JSON.parse(editValue)
      setError(null)
      setSaving(true)

      // 调用保存服务
      const result = await saveApiChanges(apiId, field, parsedData)

      if (result.success) {
        setIsEditing(false)
        onSave?.(parsedData)
      } else {
        setError(result.error || '保存失败')
      }
    } catch (e) {
      setError('JSON 格式错误: ' + (e instanceof Error ? e.message : String(e)))
    } finally {
      setSaving(false)
    }
  }, [editValue, apiId, field, onSave])

  if (isEditing) {
    return (
      <div className={cn('rounded-lg border bg-muted/50', className)}>
        {/* 工具栏 */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <span className="text-sm font-medium">编辑响应示例</span>
          <div className="flex items-center gap-1">
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

        {/* 编辑区域 */}
        <div className="p-4">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={cn(
              'w-full font-mono text-sm bg-background border rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary',
              error && 'border-red-500 focus:ring-red-500'
            )}
            style={{ minHeight: maxHeight }}
            spellCheck={false}
          />
          {error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }

  // 编辑按钮元素
  const editButton = editorEnabled ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
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
  ) : null

  return (
    <div className={className}>
      <JsonViewer data={data} maxHeight={maxHeight} toolbarExtra={editButton} />
    </div>
  )
}
