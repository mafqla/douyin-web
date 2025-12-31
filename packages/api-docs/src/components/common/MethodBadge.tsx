import { Badge } from '@/components/ui/badge'
import type { HttpMethod } from '@/types/api'

interface MethodBadgeProps {
  method: HttpMethod
  className?: string
}

const methodVariants: Record<HttpMethod, 'get' | 'post' | 'put' | 'delete' | 'patch'> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch'
}

export function MethodBadge({ method, className }: MethodBadgeProps) {
  return (
    <Badge variant={methodVariants[method]} className={className}>
      {method}
    </Badge>
  )
}
