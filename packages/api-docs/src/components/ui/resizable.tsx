import { useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ResizablePanelGroupProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
}

interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  className?: string
  id?: string
}

interface ResizableHandleProps {
  className?: string
  withHandle?: boolean
}

// 存储面板尺寸的 key
const STORAGE_KEY = 'api-docs-panel-sizes'

function getPanelSizes(): Record<string, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function savePanelSize(id: string, size: number) {
  try {
    const sizes = getPanelSizes()
    sizes[id] = size
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes))
  } catch {
    // ignore
  }
}

export function ResizablePanelGroup({
  children,
  direction = 'horizontal',
  className
}: ResizablePanelGroupProps) {
  return (
    <div
      className={cn(
        'flex h-full w-full',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
      data-panel-group
      data-direction={direction}
    >
      {children}
    </div>
  )
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  className,
  id
}: ResizablePanelProps) {
  // 从 localStorage 恢复尺寸
  const storedSize = id ? getPanelSizes()[id] : undefined
  const [size, setSize] = useState(storedSize ?? defaultSize)

  // 暴露 setSize 方法给 handle 使用
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panelRef.current) {
      // @ts-expect-error 自定义属性
      panelRef.current._panelInfo = { size, setSize, minSize, maxSize, id }
    }
  }, [size, minSize, maxSize, id])

  // 保存尺寸变化
  useEffect(() => {
    if (id && size !== defaultSize) {
      savePanelSize(id, size)
    }
  }, [id, size, defaultSize])

  return (
    <div
      ref={panelRef}
      className={cn('relative', className)}
      style={{ flex: `${size} 1 0%` }}
      data-panel
    >
      {children}
    </div>
  )
}

export function ResizableHandle({ className, withHandle = true }: ResizableHandleProps) {
  const handleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const handle = handleRef.current
    if (!handle) return

    const group = handle.closest('[data-panel-group]') as HTMLElement
    if (!group) return

    const direction = group.dataset.direction || 'horizontal'
    const panels = Array.from(group.querySelectorAll('[data-panel]')) as HTMLElement[]
    const handleIndex = Array.from(group.children).indexOf(handle)

    // 找到 handle 前后的面板
    const prevPanel = panels.find((_, i) => {
      const panelIndex = Array.from(group.children).indexOf(panels[i])
      return panelIndex < handleIndex && !panels[i + 1] ||
        (panels[i + 1] && Array.from(group.children).indexOf(panels[i + 1]) > handleIndex)
    })
    const nextPanel = panels.find(p => {
      const panelIndex = Array.from(group.children).indexOf(p)
      return panelIndex > handleIndex
    })

    if (!prevPanel || !nextPanel) return

    // @ts-expect-error 自定义属性
    const prevInfo = prevPanel._panelInfo
    // @ts-expect-error 自定义属性
    const nextInfo = nextPanel._panelInfo

    if (!prevInfo || !nextInfo) return

    const groupRect = group.getBoundingClientRect()
    const totalSize = direction === 'horizontal' ? groupRect.width : groupRect.height
    const startPos = direction === 'horizontal' ? e.clientX : e.clientY
    const startPrevSize = prevInfo.size
    const startNextSize = nextInfo.size

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const delta = ((currentPos - startPos) / totalSize) * 100

      let newPrevSize = startPrevSize + delta
      let newNextSize = startNextSize - delta

      // 应用最小/最大限制
      if (newPrevSize < prevInfo.minSize) {
        newPrevSize = prevInfo.minSize
        newNextSize = startPrevSize + startNextSize - newPrevSize
      }
      if (newPrevSize > prevInfo.maxSize) {
        newPrevSize = prevInfo.maxSize
        newNextSize = startPrevSize + startNextSize - newPrevSize
      }
      if (newNextSize < nextInfo.minSize) {
        newNextSize = nextInfo.minSize
        newPrevSize = startPrevSize + startNextSize - newNextSize
      }
      if (newNextSize > nextInfo.maxSize) {
        newNextSize = nextInfo.maxSize
        newPrevSize = startPrevSize + startNextSize - newNextSize
      }

      prevInfo.setSize(newPrevSize)
      nextInfo.setSize(newNextSize)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <div
      ref={handleRef}
      className={cn(
        'relative flex w-px items-center justify-center bg-border',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
        'group cursor-col-resize select-none',
        isDragging && 'bg-primary',
        className
      )}
      onMouseDown={handleMouseDown}
      data-panel-handle
    >
      {withHandle && (
        <div
          className={cn(
            'z-10 flex h-8 w-3 items-center justify-center rounded-sm border bg-border',
            'group-hover:bg-primary/50 transition-colors',
            isDragging && 'bg-primary'
          )}
        >
          <svg
            width="6"
            height="10"
            viewBox="0 0 6 10"
            fill="none"
            className="text-muted-foreground"
          >
            <path
              d="M1 1v8M5 1v8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  )
}
