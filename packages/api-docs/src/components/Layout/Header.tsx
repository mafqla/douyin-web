import { useState, useRef } from 'react'
import { Moon, Sun, Search, Github, Download, Upload, FileJson, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { exportAllApis, importFromPostman, importFromOpenAPI } from '@/utils/api-export'
import type { ApiCategory } from '@/types/api'

interface HeaderProps {
  onSearch?: (keyword: string) => void
  onImport?: (categories: ApiCategory[]) => void
}

export function Header({ onSearch, onImport }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })
  const [searchValue, setSearchValue] = useState('')
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchValue)
  }

  const handleExport = (format: 'postman' | 'openapi') => {
    const baseUrl = localStorage.getItem('api-docs-base-url') || 'https://www.douyin.com'
    exportAllApis(format, baseUrl)
  }

  const handleImportClick = () => {
    setImportError(null)
    setImportDialogOpen(true)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const content = await file.text()
      const json = JSON.parse(content)

      let categories: ApiCategory[]

      // 判断是 Postman 还是 OpenAPI 格式
      if (json.info?.schema?.includes('postman')) {
        categories = importFromPostman(json)
      } else if (json.openapi) {
        categories = importFromOpenAPI(json)
      } else {
        throw new Error('无法识别的文件格式，请上传 Postman Collection 或 OpenAPI 规范文件')
      }

      onImport?.(categories)
      setImportDialogOpen(false)
      setImportError(null)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : '导入失败，请检查文件格式')
    }

    // 清空文件输入，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            D
          </div>
          <span className="font-semibold text-lg hidden sm:inline-block">
            抖音 API 文档
          </span>
        </div>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索 API..."
              className="pl-8 w-full"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </form>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2">
          {/* 导入按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleImportClick}
            title="导入接口"
          >
            <Upload className="h-5 w-5" />
          </Button>

          {/* 导出下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="导出全部接口">
                <Download className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('postman')}>
                <FileJson className="h-4 w-4 mr-2" />
                导出为 Postman Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('openapi')}>
                <FileCode className="h-4 w-4 mr-2" />
                导出为 OpenAPI 3.0
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenuSeparator className="h-6 w-px bg-border mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDark ? '切换到浅色模式' : '切换到深色模式'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      {/* 导入对话框 */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>导入接口文档</DialogTitle>
            <DialogDescription>
              支持导入 Postman Collection 或 OpenAPI 3.0 规范文件
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                点击选择文件或拖放到此处
              </p>
              <p className="text-xs text-muted-foreground">
                支持 .json 格式的 Postman Collection 或 OpenAPI 文件
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {importError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                {importError}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
