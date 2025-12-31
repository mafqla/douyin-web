import { useState, useCallback, createContext, useContext } from 'react'
import { ChevronRight, ChevronDown, AlertTriangle, Copy, Check, Expand, Shrink } from 'lucide-react'
import { TypeBadge } from '@/components/common'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ResponseField } from '@/types/api'

// 用于控制全局展开/收缩状态的 Context
interface ExpandContextValue {
  expandedKeys: Set<string>
  toggleExpand: (key: string) => void
  setExpandedKeys: (keys: Set<string>) => void
}

const ExpandContext = createContext<ExpandContextValue | null>(null)

interface ResponseSchemaProps {
  fields: ResponseField[]
  className?: string
}

// 递归获取所有有子节点的字段 key
function getAllExpandableKeys(fields: ResponseField[], prefix = ''): string[] {
  const keys: string[] = []
  fields.forEach(field => {
    const key = prefix ? `${prefix}.${field.name}` : field.name
    if (field.children && field.children.length > 0) {
      keys.push(key)
      keys.push(...getAllExpandableKeys(field.children, key))
    }
  })
  return keys
}

// 获取默认展开的 key（前两层）
function getDefaultExpandedKeys(fields: ResponseField[], prefix = '', depth = 0): string[] {
  if (depth >= 2) return []
  const keys: string[] = []
  fields.forEach(field => {
    const key = prefix ? `${prefix}.${field.name}` : field.name
    if (field.children && field.children.length > 0) {
      keys.push(key)
      keys.push(...getDefaultExpandedKeys(field.children, key, depth + 1))
    }
  })
  return keys
}

export function ResponseSchema({ fields, className }: ResponseSchemaProps) {
  // 初始化：默认展开前两层
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(getDefaultExpandedKeys(fields))
  )

  const toggleExpand = useCallback((key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // 全部展开
  const handleExpandAll = useCallback(() => {
    setExpandedKeys(new Set(getAllExpandableKeys(fields)))
  }, [fields])

  // 全部收缩
  const handleCollapseAll = useCallback(() => {
    setExpandedKeys(new Set())
  }, [])

  if (fields.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground py-8 text-center', className)}>
        <div className="text-2xl mb-2">📋</div>
        暂无响应字段说明
      </div>
    )
  }

  // 检查是否有可展开的字段
  const hasExpandableFields = fields.some(f => f.children && f.children.length > 0)
  const allKeys = getAllExpandableKeys(fields)
  const isAllExpanded = allKeys.length > 0 && allKeys.every(k => expandedKeys.has(k))
  const isAllCollapsed = expandedKeys.size === 0

  return (
    <ExpandContext.Provider value={{ expandedKeys, toggleExpand, setExpandedKeys }}>
      <div className={cn('space-y-0.5', className)}>
        {/* 表头 */}
        <div className="flex items-center gap-4 py-2 px-3 bg-muted/50 rounded-t text-xs font-medium text-muted-foreground border-b">
          <div className="w-[200px] shrink-0 flex items-center gap-2">
            字段名
            {hasExpandableFields && (
              <div className="flex items-center gap-1 ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] gap-0.5"
                      onClick={handleExpandAll}
                      disabled={isAllExpanded}
                    >
                      <Expand className="h-3 w-3" />
                      展开
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>全部展开</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1.5 text-[10px] gap-0.5"
                      onClick={handleCollapseAll}
                      disabled={isAllCollapsed}
                    >
                      <Shrink className="h-3 w-3" />
                      收缩
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>全部收缩</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>
          <div className="w-[100px] shrink-0">类型</div>
          <div className="flex-1">描述</div>
          <div className="w-[150px] shrink-0">示例值</div>
        </div>
        {/* 字段列表 */}
        {fields.map(field => (
          <FieldItem key={field.name} field={field} depth={0} fieldKey={field.name} />
        ))}
      </div>
    </ExpandContext.Provider>
  )
}

interface FieldItemProps {
  field: ResponseField
  depth: number
  fieldKey: string
}

function FieldItem({ field, depth, fieldKey }: FieldItemProps) {
  const context = useContext(ExpandContext)
  const [copied, setCopied] = useState(false)
  const hasChildren = field.children && field.children.length > 0

  const isExpanded = context?.expandedKeys.has(fieldKey) ?? depth < 2

  const handleToggle = () => {
    context?.toggleExpand(fieldKey)
  }

  const handleCopyExample = () => {
    if (field.example !== undefined) {
      navigator.clipboard.writeText(JSON.stringify(field.example, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="text-sm">
      <div
        className={cn(
          'flex items-center gap-4 py-2 px-3 rounded hover:bg-muted/50 transition-colors',
          depth > 0 && 'ml-6 border-l-2 border-border',
          field.deprecated && 'opacity-60'
        )}
      >
        {/* 字段名 */}
        <div className="w-[200px] shrink-0 flex items-center gap-2">
          {hasChildren ? (
            <button
              onClick={handleToggle}
              className="p-0.5 hover:bg-accent rounded shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}

          <code className={cn(
            'font-mono text-primary font-medium truncate',
            field.deprecated && 'line-through'
          )}>
            {field.name}
          </code>

          {field.deprecated && (
            <Badge variant="outline" className="text-orange-500 border-orange-500 text-[10px] px-1 shrink-0">
              废弃
            </Badge>
          )}

          {field.nullable && (
            <Badge variant="outline" className="text-[10px] px-1 shrink-0">
              可空
            </Badge>
          )}
        </div>

        {/* 类型 */}
        <div className="w-[100px] shrink-0">
          <TypeBadge type={field.type} className="shrink-0" />
        </div>

        {/* 描述 */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1">
            <span className="text-foreground">
              {field.description}
            </span>

            {/* 备注 */}
            {field.remark && (
              <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                <span>{field.remark}</span>
              </div>
            )}
          </div>
        </div>

        {/* 示例值 */}
        <div className="w-[150px] shrink-0">
          {field.example !== undefined ? (
            <div className="flex items-center gap-1">
              <code className="font-mono text-xs bg-muted px-2 py-1 rounded truncate max-w-[120px]">
                {typeof field.example === 'object'
                  ? JSON.stringify(field.example).slice(0, 20) + '...'
                  : String(field.example)
                }
              </code>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleCopyExample}
                    className="p-1 hover:bg-muted rounded shrink-0"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>复制示例值</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">-</span>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-0.5">
          {field.children!.map(child => (
            <FieldItem
              key={child.name}
              field={child}
              depth={depth + 1}
              fieldKey={`${fieldKey}.${child.name}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
