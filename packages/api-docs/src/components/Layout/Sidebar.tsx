import { useState, useMemo, useEffect } from 'react'
import {
  Home,
  Search,
  Video,
  User,
  FileVideo,
  Bookmark,
  History,
  MoreHorizontal,
  ChevronRight,
  FolderOpen,
  Plus
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { MethodBadge } from '@/components/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { apiRegistry } from '@/data/api-registry'
import { ApiFormDialog } from '@/components/ApiExplorer/ApiFormDialog'
import type { ApiCategory, ApiDefinition } from '@/types/api'

interface SidebarProps {
  categories?: ApiCategory[]
  selectedApiId: string | null
  onSelectApi: (api: ApiDefinition) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Search,
  Video,
  User,
  FileVideo,
  Bookmark,
  History,
  MoreHorizontal,
  FolderOpen
}

export function Sidebar({ categories, selectedApiId, onSelectApi }: SidebarProps) {
  // 使用传入的 categories 或默认的 apiRegistry
  const allCategories = categories || apiRegistry

  const [searchKeyword, setSearchKeyword] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(allCategories.map(c => c.id))
  )

  // 当 categories 变化时，展开所有分类
  useEffect(() => {
    setExpandedCategories(new Set(allCategories.map(c => c.id)))
  }, [allCategories])

  // 过滤 API
  const filteredRegistry = useMemo(() => {
    if (!searchKeyword.trim()) return allCategories

    const keyword = searchKeyword.toLowerCase()
    return allCategories
      .map(category => ({
        ...category,
        apis: category.apis.filter(
          api =>
            api.name.toLowerCase().includes(keyword) ||
            api.description.toLowerCase().includes(keyword) ||
            api.url.toLowerCase().includes(keyword)
        )
      }))
      .filter(category => category.apis.length > 0)
  }, [searchKeyword, allCategories])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  // 计算总 API 数量
  const totalApis = allCategories.reduce((acc, c) => acc + c.apis.length, 0)

  return (
    <div className="flex flex-col h-full border-r bg-background">
      {/* 搜索框和新增按钮 */}
      <div className="p-3 border-b space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="筛选 API..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="h-8 text-sm flex-1"
          />
          <ApiFormDialog
            trigger={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>新增接口（开发模式）</TooltipContent>
              </Tooltip>
            }
          />
        </div>
      </div>

      {/* API 列表 */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredRegistry.map(category => (
            <CategoryItem
              key={category.id}
              category={category}
              expanded={expandedCategories.has(category.id)}
              selectedApiId={selectedApiId}
              onToggle={() => toggleCategory(category.id)}
              onSelectApi={onSelectApi}
              isImported={category.id.startsWith('imported-')}
            />
          ))}

          {filteredRegistry.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-sm">
              未找到匹配的 API
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部统计 */}
      <div className="p-3 border-t text-xs text-muted-foreground">
        共 {totalApis} 个 API
      </div>
    </div>
  )
}

interface CategoryItemProps {
  category: ApiCategory
  expanded: boolean
  selectedApiId: string | null
  onToggle: () => void
  onSelectApi: (api: ApiDefinition) => void
  isImported?: boolean
}

function CategoryItem({
  category,
  expanded,
  selectedApiId,
  onToggle,
  onSelectApi,
  isImported
}: CategoryItemProps) {
  const Icon = iconMap[category.icon || (isImported ? 'FolderOpen' : 'MoreHorizontal')] || MoreHorizontal

  return (
    <div className="mb-1">
      {/* 分类标题 */}
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm font-medium',
          'hover:bg-accent transition-colors',
          'text-left'
        )}
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform',
            expanded && 'rotate-90'
          )}
        />
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 truncate">{category.name}</span>
        {isImported && (
          <Badge variant="secondary" className="text-[10px] px-1 py-0">
            导入
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {category.apis.length}
        </span>
      </button>

      {/* API 列表 */}
      {expanded && (
        <div className="ml-4 mt-1 space-y-0.5">
          {category.apis.map(api => (
            <button
              key={api.id}
              onClick={() => onSelectApi(api)}
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm',
                'hover:bg-accent transition-colors text-left',
                selectedApiId === api.id && 'bg-accent',
                api.deprecated && 'opacity-60'
              )}
            >
              <MethodBadge method={api.method} className="shrink-0 text-[10px] px-1.5" />
              <span className={cn('truncate flex-1', api.deprecated && 'line-through')}>
                {api.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
