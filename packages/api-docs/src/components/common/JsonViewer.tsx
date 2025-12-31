import { useState, useMemo, useCallback, createContext, useContext } from 'react'
import { ChevronRight, ChevronDown, Expand, Shrink } from 'lucide-react'
import { CopyButton } from './CopyButton'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// 展开状态 Context
interface ExpandContextValue {
  expandAll: boolean | null // null 表示使用默认行为，true 全部展开，false 全部收缩
  setExpandAll: (value: boolean | null) => void
}

const ExpandContext = createContext<ExpandContextValue | null>(null)

interface JsonViewerProps {
  data: unknown
  className?: string
  initialExpanded?: boolean
  maxHeight?: string
  /** 额外的工具栏元素，显示在展开/收缩按钮之前 */
  toolbarExtra?: React.ReactNode
}

// 检查数据是否有可展开的节点
function hasExpandableNodes(data: unknown): boolean {
  if (Array.isArray(data)) {
    return data.length > 0
  }
  if (data !== null && typeof data === 'object') {
    return Object.keys(data as object).length > 0
  }
  return false
}

export function JsonViewer({ data, className, initialExpanded = true, maxHeight = '400px', toolbarExtra }: JsonViewerProps) {
  const [expandAll, setExpandAll] = useState<boolean | null>(null)

  const jsonString = useMemo(() => {
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }, [data])

  const handleExpandAll = useCallback(() => {
    setExpandAll(true)
  }, [])

  const handleCollapseAll = useCallback(() => {
    setExpandAll(false)
  }, [])

  const isExpandable = hasExpandableNodes(data)

  return (
    <ExpandContext.Provider value={{ expandAll, setExpandAll }}>
      <div className={cn('relative rounded-lg border bg-muted/50', className)}>
        {/* 工具栏 */}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
          {toolbarExtra}
          {isExpandable && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs gap-1"
                    onClick={handleExpandAll}
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
                    className="h-6 px-2 text-xs gap-1"
                    onClick={handleCollapseAll}
                  >
                    <Shrink className="h-3 w-3" />
                    收缩
                  </Button>
                </TooltipTrigger>
                <TooltipContent>全部收缩</TooltipContent>
              </Tooltip>
            </>
          )}
          <CopyButton text={jsonString} />
        </div>
        <div
          className="overflow-auto p-4 font-mono text-sm"
          style={{ maxHeight }}
        >
          <JsonNode data={data} initialExpanded={initialExpanded} />
        </div>
      </div>
    </ExpandContext.Provider>
  )
}

interface JsonNodeProps {
  data: unknown
  initialExpanded?: boolean
  depth?: number
  keyName?: string
}

function JsonNode({ data, initialExpanded = true, depth = 0, keyName }: JsonNodeProps) {
  const context = useContext(ExpandContext)
  const [localExpanded, setLocalExpanded] = useState(initialExpanded && depth < 2)

  // 根据全局展开状态和本地状态决定是否展开
  const expanded = context?.expandAll !== null && context?.expandAll !== undefined
    ? context.expandAll
    : localExpanded

  const handleToggle = () => {
    // 重置全局状态，使用本地状态
    context?.setExpandAll(null)
    setLocalExpanded(!localExpanded)
  }

  if (data === null) {
    return (
      <span className="json-null">
        {keyName && <span className="json-key">"{keyName}"</span>}
        {keyName && ': '}
        null
      </span>
    )
  }

  if (typeof data === 'boolean') {
    return (
      <span>
        {keyName && <span className="json-key">"{keyName}"</span>}
        {keyName && ': '}
        <span className="json-boolean">{String(data)}</span>
      </span>
    )
  }

  if (typeof data === 'number') {
    return (
      <span>
        {keyName && <span className="json-key">"{keyName}"</span>}
        {keyName && ': '}
        <span className="json-number">{data}</span>
      </span>
    )
  }

  if (typeof data === 'string') {
    return (
      <span>
        {keyName && <span className="json-key">"{keyName}"</span>}
        {keyName && ': '}
        <span className="json-string">"{data}"</span>
      </span>
    )
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <span>
          {keyName && <span className="json-key">"{keyName}"</span>}
          {keyName && ': '}
          []
        </span>
      )
    }

    return (
      <div className="inline">
        <button
          onClick={handleToggle}
          className="inline-flex items-center hover:bg-accent rounded px-1 -ml-1"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          {keyName && <span className="json-key">"{keyName}"</span>}
          {keyName && ': '}
          <span className="text-muted-foreground">
            [{expanded ? '' : `${data.length} items`}
          </span>
        </button>
        {expanded && (
          <div className="ml-4 border-l border-border pl-2">
            {data.map((item, index) => (
              <div key={index}>
                <JsonNode data={item} depth={depth + 1} />
                {index < data.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
        {expanded && <span>]</span>}
        {!expanded && <span className="text-muted-foreground">]</span>}
      </div>
    )
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    if (entries.length === 0) {
      return (
        <span>
          {keyName && <span className="json-key">"{keyName}"</span>}
          {keyName && ': '}
          {'{}'}
        </span>
      )
    }

    return (
      <div className="inline">
        <button
          onClick={handleToggle}
          className="inline-flex items-center hover:bg-accent rounded px-1 -ml-1"
        >
          {expanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          {keyName && <span className="json-key">"{keyName}"</span>}
          {keyName && ': '}
          <span className="text-muted-foreground">
            {'{'}{expanded ? '' : `${entries.length} keys`}
          </span>
        </button>
        {expanded && (
          <div className="ml-4 border-l border-border pl-2">
            {entries.map(([key, value], index) => (
              <div key={key}>
                <JsonNode data={value} keyName={key} depth={depth + 1} />
                {index < entries.length - 1 && ','}
              </div>
            ))}
          </div>
        )}
        {expanded && <span>{'}'}</span>}
        {!expanded && <span className="text-muted-foreground">{'}'}</span>}
      </div>
    )
  }

  return <span>{String(data)}</span>
}
