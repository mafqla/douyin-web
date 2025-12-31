import { useState } from 'react'
import { Copy, Check, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { ApiDefinition, ApiExample } from '@/types/api'

interface ExampleViewerProps {
  api: ApiDefinition
  className?: string
}

export function ExampleViewer({ api, className }: ExampleViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  // 生成默认示例
  const defaultExample: ApiExample = {
    name: '默认示例',
    description: '根据参数定义自动生成的请求示例',
    request: generateRequestExample(api)
  }

  const examples = api.examples?.length ? api.examples : [defaultExample]

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {examples.map((example, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          {/* 示例标题 */}
          <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
            <div>
              <h4 className="font-medium text-sm">{example.name}</h4>
              {example.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{example.description}</p>
              )}
            </div>
          </div>

          <Tabs defaultValue="request" className="w-full">
            <div className="px-4 pt-3">
              <TabsList className="h-8">
                <TabsTrigger value="request" className="text-xs h-7">
                  <Code className="h-3 w-3 mr-1" />
                  请求参数
                </TabsTrigger>
                <TabsTrigger value="curl" className="text-xs h-7">
                  cURL
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="request" className="p-4 pt-2">
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">
                  {JSON.stringify(example.request || {}, null, 2)}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 px-2"
                  onClick={() => handleCopy(JSON.stringify(example.request || {}, null, 2), index * 2)}
                >
                  {copiedIndex === index * 2 ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="curl" className="p-4 pt-2">
              <div className="relative">
                <pre className="bg-zinc-950 dark:bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
                  {generateCurlCommand(api, example.request)}
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-7 px-2"
                  onClick={() => handleCopy(generateCurlCommand(api, example.request), index * 2 + 1)}
                >
                  {copiedIndex === index * 2 + 1 ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  )
}

// 根据参数定义生成请求示例
function generateRequestExample(api: ApiDefinition): Record<string, unknown> {
  const example: Record<string, unknown> = {}

  api.params.forEach(param => {
    if (param.example) {
      // 根据类型转换示例值
      switch (param.type) {
        case 'number':
          example[param.name] = Number(param.example)
          break
        case 'boolean':
          example[param.name] = param.example === 'true'
          break
        default:
          example[param.name] = param.example
      }
    } else if (param.defaultValue !== undefined) {
      example[param.name] = param.defaultValue
    } else if (param.enum && param.enum.length > 0) {
      example[param.name] = param.enum[0].value
    } else {
      // 根据类型生成默认值
      switch (param.type) {
        case 'number':
          example[param.name] = 0
          break
        case 'boolean':
          example[param.name] = false
          break
        case 'array':
          example[param.name] = []
          break
        case 'object':
          example[param.name] = {}
          break
        default:
          example[param.name] = ''
      }
    }
  })

  return example
}

// 生成 cURL 命令
function generateCurlCommand(api: ApiDefinition, params?: Record<string, unknown>): string {
  const baseUrl = 'https://www.douyin.com'
  let url = `${baseUrl}${api.url}`

  if (api.method === 'GET' && params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')
    url += `?${queryString}`
  }

  let curl = `curl -X ${api.method} '${url}'`

  // 添加请求头
  curl += ` \\\n  -H 'Content-Type: application/json'`
  curl += ` \\\n  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'`

  if (api.headers) {
    Object.entries(api.headers).forEach(([key, value]) => {
      curl += ` \\\n  -H '${key}: ${value}'`
    })
  }

  // POST 请求添加 body
  if (api.method === 'POST' && params && Object.keys(params).length > 0) {
    curl += ` \\\n  -d '${JSON.stringify(params)}'`
  }

  return curl
}
