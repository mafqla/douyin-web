import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ParamType } from '@/types/api'

interface TypeBadgeProps {
  type: ParamType | string
  className?: string
}

const typeColors: Record<string, string> = {
  string: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  number: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  boolean: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  object: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  array: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const colorClass = typeColors[type] || typeColors.string

  return (
    <Badge
      variant="outline"
      className={cn('font-mono text-xs', colorClass, className)}
    >
      {type}
    </Badge>
  )
}
