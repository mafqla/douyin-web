import { useState, useEffect } from 'react'
import { Play, Loader2, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JsonViewer, MethodBadge } from '@/components/common'
import { useApiRequest } from '@/hooks/useApiRequest'
import { cn } from '@/lib/utils'
import type { ApiDefinition } from '@/types/api'

interface TryItPanelProps {
  api: ApiDefinition
}

const DEFAULT_BASE_URL = 'https://127.0.0.1:3010'

export function TryItPanel({ api }: TryItPanelProps) {
  const [baseUrl, setBaseUrl] = useState(() => {
    return localStorage.getItem('api-docs-base-url') || DEFAULT_BASE_URL
  })
  const [params, setParams] = useState<Record<string, string>>({})
  const { loading, response, execute, reset } = useApiRequest()

  // 当 API 改变时重置参数
  useEffect(() => {
    const initialParams: Record<string, string> = {}
    api.params.forEach(param => {
      initialParams[param.name] = param.example || ''
    })
    setParams(initialParams)
    reset()
  }, [api.id, reset])

  // 保存 baseUrl 到 localStorage
  useEffect(() => {
    localStorage.setItem('api-docs-base-url', baseUrl)
  }, [baseUrl])

  const handleParamChange = (name: string, value: string) => {
    setParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 转换参数类型
    const typedParams: Record<string, unknown> = {}
    api.params.forEach(param => {
      const value = params[param.name]
      if (value === '' || value === undefined) return

      switch (param.type) {
        case 'number':
          typedParams[param.name] = Number(value)
          break
        case 'boolean':
          typedParams[param.name] = value === 'true'
          break
        default:
          typedParams[param.name] = value
      }
    })

    await execute(baseUrl, api, typedParams)
  }

  const handleReset = () => {
    const initialParams: Record<string, string> = {}
    api.params.forEach(param => {
      initialParams[param.name] = param.example || ''
    })
    setParams(initialParams)
    reset()
  }

  return (
    <div className="flex flex-col h-full border-l bg-muted/30">
      {/* 标题 */}
      <div className="p-4 border-b bg-background">
        <h3 className="font-semibold flex items-center gap-2">
          <Play className="h-4 w-4" />
          在线测试
        </h3>
      </div>

      <div className="flex-1 overflow-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Base URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://www.douyin.com"
              className="font-mono text-sm"
            />
          </div>

          {/* 请求 URL 预览 */}
          <div className="p-2 rounded bg-muted text-xs font-mono break-all">
            <MethodBadge method={api.method} className="mr-2 text-[10px]" />
            {baseUrl}{api.url}
          </div>

          <Separator />

          {/* 参数输入 */}
          {api.params.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">请求参数</label>
              {api.params.map(param => (
                <div key={param.name} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-mono">
                      {param.name}
                      {param.required && (
                        <span className="text-red-500 ml-0.5">*</span>
                      )}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {param.type}
                    </span>
                  </div>
                  {param.enum ? (
                    <select
                      value={params[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="">请选择...</option>
                      {param.enum.map(item => (
                        <option key={String(item.value)} value={String(item.value)}>
                          {item.label} ({item.value})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      value={params[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                      placeholder={param.description}
                      className="font-mono text-sm"
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {param.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  请求中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  发送请求
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* 响应结果 */}
        {response && (
          <div className="border-t">
            <Tabs defaultValue="body" className="w-full">
              <div className="px-4 pt-4 flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="body">响应体</TabsTrigger>
                  <TabsTrigger value="headers">响应头</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3 text-sm">
                  {/* 状态码 */}
                  <div className="flex items-center gap-1">
                    {response.status >= 200 && response.status < 300 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={cn(
                        'font-mono font-medium',
                        response.status >= 200 && response.status < 300
                          ? 'text-green-600'
                          : 'text-red-600'
                      )}
                    >
                      {response.status || 'Error'}
                    </span>
                  </div>

                  {/* 耗时 */}
                  <span className="text-muted-foreground">
                    {response.duration}ms
                  </span>
                </div>
              </div>

              <TabsContent value="body" className="p-4 pt-2">
                {response.error ? (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                    {response.error}
                  </div>
                ) : (
                  <JsonViewer data={response.data} maxHeight="calc(100vh - 450px)" />
                )}
              </TabsContent>

              <TabsContent value="headers" className="p-4 pt-2">
                {response.headers ? (
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {Object.entries(response.headers).map(([key, value]) => (
                          <tr key={key} className="border-b last:border-0">
                            <td className="py-2 px-3 font-mono text-primary bg-muted/50 w-1/3">
                              {key}
                            </td>
                            <td className="py-2 px-3 font-mono text-muted-foreground break-all">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    无响应头信息
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
