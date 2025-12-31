import { useState, useCallback } from 'react'
import type { ApiResponse, ApiDefinition } from '@/types/api'

interface UseApiRequestReturn {
  loading: boolean
  response: ApiResponse | null
  error: string | null
  execute: (baseUrl: string, api: ApiDefinition, params: Record<string, unknown>) => Promise<void>
  reset: () => void
}

export function useApiRequest(): UseApiRequestReturn {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (
    baseUrl: string,
    api: ApiDefinition,
    params: Record<string, unknown>
  ) => {
    setLoading(true)
    setError(null)
    const startTime = Date.now()

    try {
      // 构建 URL
      const url = new URL(api.url, baseUrl)

      // GET 请求将参数添加到 URL
      if (api.method === 'GET') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== null) {
            url.searchParams.append(key, String(value))
          }
        })
      }

      // 发送请求
      const fetchOptions: RequestInit = {
        method: api.method,
        headers: {
          'Content-Type': 'application/json',
        },
        // POST 请求将参数放在 body
        ...(api.method === 'POST' && {
          body: JSON.stringify(params)
        })
      }

      const res = await fetch(url.toString(), fetchOptions)
      const duration = Date.now() - startTime

      // 尝试解析 JSON
      let data: unknown
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        data = await res.json()
      } else {
        data = await res.text()
      }

      // 获取响应头
      const headers: Record<string, string> = {}
      res.headers.forEach((value, key) => {
        headers[key] = value
      })

      setResponse({
        status: res.status,
        duration,
        data,
        headers
      })
    } catch (err) {
      const duration = Date.now() - startTime
      const errorMessage = err instanceof Error ? err.message : String(err)

      setError(errorMessage)
      setResponse({
        status: 0,
        duration,
        error: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResponse(null)
    setError(null)
  }, [])

  return { loading, response, error, execute, reset }
}
