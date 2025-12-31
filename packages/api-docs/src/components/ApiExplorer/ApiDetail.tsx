import { useState, useEffect } from 'react'
import { Download, FileJson, FileCode, AlertTriangle, Lock, Shield } from 'lucide-react'
import { MethodBadge, CopyButton } from '@/components/common'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { EditableParamTable } from './EditableParamTable'
import { EditableResponseSchema } from './EditableResponseSchema'
import { EditableJsonViewer } from './EditableJsonViewer'
import { ExampleViewer } from './ExampleViewer'
import { DeleteApiDialog } from './DeleteApiDialog'
import { exportSingleApi } from '@/utils/api-export'
import { getExampleResponse } from '@/utils/api-editor-service'
import type { ApiDefinition } from '@/types/api'

interface ApiDetailProps {
  api: ApiDefinition
  baseUrl?: string
}

// 根据响应字段生成响应示例
function generateResponseExample(api: ApiDefinition): Record<string, unknown> {
  const generateFieldExample = (fields: typeof api.responseFields): Record<string, unknown> => {
    const result: Record<string, unknown> = {}

    fields.forEach(field => {
      if (field.example !== undefined) {
        result[field.name] = field.example
      } else if (field.children && field.children.length > 0) {
        if (field.type === 'array') {
          result[field.name] = [generateFieldExample(field.children)]
        } else {
          result[field.name] = generateFieldExample(field.children)
        }
      } else {
        // 根据类型生成默认值
        switch (field.type) {
          case 'number':
            result[field.name] = 0
            break
          case 'boolean':
            result[field.name] = true
            break
          case 'array':
            result[field.name] = []
            break
          case 'object':
            result[field.name] = {}
            break
          default:
            result[field.name] = 'string'
        }
      }
    })

    return result
  }

  return generateFieldExample(api.responseFields)
}

export function ApiDetail({ api, baseUrl = 'https://www.douyin.com' }: ApiDetailProps) {
  const [responseExample, setResponseExample] = useState<Record<string, unknown> | null>(null)
  const [exampleLoaded, setExampleLoaded] = useState(false)

  // 加载响应示例
  useEffect(() => {
    setExampleLoaded(false)
    getExampleResponse(api.id).then(result => {
      if (result.success && result.data) {
        setResponseExample(result.data as Record<string, unknown>)
      } else {
        // 如果没有保存的示例，使用自动生成的
        setResponseExample(generateResponseExample(api))
      }
      setExampleLoaded(true)
    })
  }, [api.id])

  const handleExport = (format: 'postman' | 'openapi') => {
    exportSingleApi(api, format, baseUrl)
  }

  // 当响应示例保存成功后更新状态
  const handleExampleSave = (data: unknown) => {
    setResponseExample(data as Record<string, unknown>)
  }

  return (
    <div className="space-y-6">
      {/* 标题区域 */}
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <MethodBadge method={api.method} />
          <h1 className="text-xl font-semibold">{api.name}</h1>

          {/* 标签 */}
          {api.deprecated && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="text-orange-500 border-orange-500">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  已废弃
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {api.deprecatedMessage || '此接口已废弃，请避免使用'}
              </TooltipContent>
            </Tooltip>
          )}

          {api.auth === 'login' && (
            <Badge variant="outline" className="text-blue-500 border-blue-500">
              <Lock className="h-3 w-3 mr-1" />
              需登录
            </Badge>
          )}

          {api.auth === 'admin' && (
            <Badge variant="outline" className="text-purple-500 border-purple-500">
              <Shield className="h-3 w-3 mr-1" />
              管理员
            </Badge>
          )}

          {api.tags?.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-muted-foreground">{api.description}</p>

        {/* 备注 */}
        {api.remark && (
          <div className="mt-3 flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{api.remark}</span>
          </div>
        )}
      </div>

      {/* URL 和操作按钮 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 p-3 rounded-lg bg-muted/50 border font-mono text-sm">
          <MethodBadge method={api.method} className="shrink-0" />
          <code className="flex-1 break-all">{api.url}</code>
          <CopyButton text={api.url} />
        </div>

        {/* 导出按钮 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('postman')}>
              <FileJson className="h-4 w-4 mr-2" />
              导出为 Postman
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('openapi')}>
              <FileCode className="h-4 w-4 mr-2" />
              导出为 OpenAPI
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 删除按钮（仅开发模式显示） */}
        <DeleteApiDialog apiId={api.id} apiName={api.name} />
      </div>

      <Separator />

      {/* 参数、响应和示例 */}
      <Tabs defaultValue="params" className="w-full">
        <TabsList>
          <TabsTrigger value="params">
            请求参数
            {api.params.length > 0 && (
              <span className="ml-1.5 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                {api.params.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="response">
            响应字段
            {api.responseFields.length > 0 && (
              <span className="ml-1.5 text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                {api.responseFields.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="response-example">响应示例</TabsTrigger>
          <TabsTrigger value="example">请求示例</TabsTrigger>
        </TabsList>

        <TabsContent value="params" className="mt-4">
          <div className="rounded-lg border overflow-hidden">
            <EditableParamTable params={api.params} apiId={api.id} />
          </div>
        </TabsContent>

        <TabsContent value="response" className="mt-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b">
              <span className="text-sm text-muted-foreground">响应类型:</span>
              <code className="text-sm font-mono text-primary">{api.responseType}</code>
            </div>
            <EditableResponseSchema fields={api.responseFields} apiId={api.id} />
          </div>
        </TabsContent>

        <TabsContent value="response-example" className="mt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {exampleLoaded ? '响应示例数据（开发模式下可编辑并保存到 JSON 文件）' : '加载中...'}
              </div>
            </div>
            {exampleLoaded && responseExample && (
              <EditableJsonViewer
                data={responseExample}
                apiId={api.id}
                field="examples"
                maxHeight="500px"
                onSave={handleExampleSave}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="example" className="mt-4">
          <ExampleViewer api={api} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
