import { useState, useEffect } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteApi, checkEditorStatus } from '@/utils/api-editor-service'

interface DeleteApiDialogProps {
  /** API ID */
  apiId: string
  /** API 名称，用于显示 */
  apiName: string
  /** 删除成功后的回调 */
  onSuccess?: () => void
  /** 触发按钮（可选） */
  trigger?: React.ReactNode
}

export function DeleteApiDialog({ apiId, apiName, onSuccess, trigger }: DeleteApiDialogProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editorEnabled, setEditorEnabled] = useState(false)

  // 检查编辑功能是否可用
  useEffect(() => {
    checkEditorStatus().then(status => {
      setEditorEnabled(status.enabled)
    })
  }, [])

  // 执行删除
  const handleDelete = async () => {
    setDeleting(true)
    setError(null)

    try {
      const result = await deleteApi(apiId)

      if (result.success) {
        setOpen(false)
        onSuccess?.()
        // 跳转到首页
        window.location.href = '/'
      } else {
        setError(result.error || '删除失败')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : '删除失败')
    } finally {
      setDeleting(false)
    }
  }

  // 如果编辑功能不可用，不渲染
  if (!editorEnabled) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            删除
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            确认删除接口
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                你确定要删除接口 <strong className="text-foreground">{apiName}</strong> 吗？
              </p>
              <p className="text-red-600 dark:text-red-400">
                此操作将从源文件中永久删除该接口定义，且无法撤销。
              </p>
              {error && (
                <p className="text-red-600 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded">
                  {error}
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
