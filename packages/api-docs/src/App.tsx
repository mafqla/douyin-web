import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'
import { Header, Sidebar } from '@/components/Layout'
import { ApiDetail, TryItPanel } from '@/components/ApiExplorer'
import { HomePage } from '@/components/HomePage'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { apiRegistry, findApiById } from '@/data/api-registry'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { ApiDefinition, ApiCategory } from '@/types/api'

// API 详情页面组件
function ApiPage() {
  const { apiId } = useParams<{ apiId: string }>()
  const navigate = useNavigate()
  const [customCategories, setCustomCategories] = useState<ApiCategory[]>([])
  const baseUrl = localStorage.getItem('api-docs-base-url') || 'https://127.0.0.1:3010'

  // 合并内置和导入的 API
  const allCategories = [...apiRegistry, ...customCategories]

  // 根据 URL 参数查找 API
  const selectedApi = apiId ? findApiInCategories(apiId, allCategories) : null

  const handleSelectApi = (api: ApiDefinition) => {
    navigate(`/docs/${api.id}`)
  }

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return

    const lowerKeyword = keyword.toLowerCase()
    for (const category of allCategories) {
      const api = category.apis.find(
        a =>
          a.name.toLowerCase().includes(lowerKeyword) ||
          a.description.toLowerCase().includes(lowerKeyword) ||
          a.url.toLowerCase().includes(lowerKeyword)
      )
      if (api) {
        handleSelectApi(api)
        break
      }
    }
  }

  const handleImport = (categories: ApiCategory[]) => {
    setCustomCategories(prev => [...prev, ...categories])
    // 选中导入的第一个 API
    if (categories.length > 0 && categories[0].apis.length > 0) {
      handleSelectApi(categories[0].apis[0])
    }
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航 */}
      <Header onSearch={handleSearch} onImport={handleImport} />

      {/* 主体区域 - 可拖动调整 */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* 左侧边栏 */}
          <ResizablePanel
            defaultSize={18}
            minSize={15}
            maxSize={30}
            id="sidebar"
            className="hidden md:block"
          >
            <Sidebar
              categories={allCategories}
              selectedApiId={selectedApi?.id || null}
              onSelectApi={handleSelectApi}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="hidden md:flex" />

          {/* 中间内容区 */}
          <ResizablePanel defaultSize={50} minSize={30} id="content">
            <main className="h-full overflow-auto p-6">
              {selectedApi ? (
                <ApiDetail api={selectedApi} baseUrl={baseUrl} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  请从左侧选择一个 API
                </div>
              )}
            </main>
          </ResizablePanel>

          <ResizableHandle withHandle className="hidden lg:flex" />

          {/* 右侧测试面板 */}
          <ResizablePanel
            defaultSize={32}
            minSize={25}
            maxSize={50}
            id="tryit"
            className="hidden lg:block"
          >
            {selectedApi && <TryItPanel api={selectedApi} />}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

// 在所有分类中查找 API
function findApiInCategories(apiId: string, categories: ApiCategory[]): ApiDefinition | null {
  // 先在内置 API 中查找
  let api = findApiById(apiId)
  // 再在导入的 API 中查找
  if (!api) {
    for (const category of categories) {
      api = category.apis.find(a => a.id === apiId) || null
      if (api) break
    }
  }
  return api
}

function App() {
  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs/:apiId" element={<ApiPage />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
