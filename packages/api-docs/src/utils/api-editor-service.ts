/**
 * API 编辑服务 - 仅在开发模式下可用
 */

interface EditorStatus {
  enabled: boolean
  mode: string
  message: string
}

interface SaveResult {
  success: boolean
  message?: string
  error?: string
}

interface ApiData {
  id: string
  name: string
  description: string
  url: string
  method: string
  params: unknown[]
  responseType: string
  responseFields: unknown[]
}

// 检查编辑功能是否可用
export async function checkEditorStatus(): Promise<EditorStatus> {
  try {
    const res = await fetch('/__api-editor/status')
    if (res.ok) {
      return await res.json()
    }
    return { enabled: false, mode: 'production', message: '编辑功能不可用' }
  } catch {
    return { enabled: false, mode: 'production', message: '编辑功能不可用' }
  }
}

// 保存 API 修改
export async function saveApiChanges(
  apiId: string,
  field: 'params' | 'responseFields' | 'examples' | 'all',
  data: unknown
): Promise<SaveResult> {
  try {
    const res = await fetch('/__api-editor/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiId, field, data })
    })

    const result = await res.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '保存失败'
    }
  }
}

// 新增 API
export async function addApi(categoryId: string, api: ApiData): Promise<SaveResult> {
  try {
    const res = await fetch('/__api-editor/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categoryId, api })
    })

    const result = await res.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '新增失败'
    }
  }
}

// 删除 API
export async function deleteApi(apiId: string): Promise<SaveResult> {
  try {
    const res = await fetch('/__api-editor/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiId })
    })

    const result = await res.json()
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '删除失败'
    }
  }
}

// 获取响应示例
export async function getExampleResponse(apiId: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(`/__api-editor/example/${apiId}`)
    if (res.ok) {
      return await res.json()
    }
    return { success: false, error: '获取示例失败' }
  } catch {
    return { success: false, error: '获取示例失败' }
  }
}
