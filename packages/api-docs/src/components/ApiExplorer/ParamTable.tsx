import { TypeBadge } from '@/components/common'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { AlertTriangle } from 'lucide-react'
import type { ApiParam } from '@/types/api'

interface ParamTableProps {
  params: ApiParam[]
  className?: string
  /** 额外的工具栏元素，显示在表头右侧 */
  toolbarExtra?: React.ReactNode
}

export function ParamTable({ params, className, toolbarExtra }: ParamTableProps) {
  if (params.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground py-8 text-center relative', className)}>
        {toolbarExtra && (
          <div className="absolute right-3 top-3">{toolbarExtra}</div>
        )}
        <div className="text-2xl mb-2">📭</div>
        该接口无需参数
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="text-left py-3 px-4 font-medium w-[180px]">参数名</th>
            <th className="text-left py-3 px-4 font-medium w-[100px]">类型</th>
            <th className="text-left py-3 px-4 font-medium w-[80px]">必填</th>
            <th className="text-left py-3 px-4 font-medium">说明</th>
            <th className="text-left py-3 px-4 font-medium w-[150px]">
              <div className="flex items-center justify-between">
                示例值
                {toolbarExtra}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, index) => (
            <tr
              key={param.name}
              className={cn(
                'border-b hover:bg-muted/30 transition-colors',
                index % 2 === 0 ? 'bg-background' : 'bg-muted/20',
                param.deprecated && 'opacity-60'
              )}
            >
              {/* 参数名 */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <code className={cn(
                    'font-mono text-primary font-medium',
                    param.deprecated && 'line-through'
                  )}>
                    {param.name}
                  </code>
                  {param.deprecated && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-orange-500 border-orange-500 text-[10px] px-1">
                          废弃
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>此参数已废弃，请避免使用</TooltipContent>
                    </Tooltip>
                  )}
                  {param.location && param.location !== 'query' && (
                    <Badge variant="secondary" className="text-[10px] px-1">
                      {param.location}
                    </Badge>
                  )}
                </div>
              </td>

              {/* 类型 */}
              <td className="py-3 px-4">
                <TypeBadge type={param.type} />
              </td>

              {/* 必填 */}
              <td className="py-3 px-4">
                {param.required ? (
                  <span className="text-red-500 font-medium">是</span>
                ) : (
                  <span className="text-muted-foreground">否</span>
                )}
              </td>

              {/* 说明 */}
              <td className="py-3 px-4">
                <div className="space-y-1.5">
                  {/* 主描述 */}
                  <p className="text-foreground">{param.description}</p>

                  {/* 约束条件 */}
                  {(param.minimum !== undefined || param.maximum !== undefined ||
                    param.minLength !== undefined || param.maxLength !== undefined ||
                    param.pattern) && (
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {param.minimum !== undefined && (
                        <Badge variant="outline" className="font-normal">
                          最小值: {param.minimum}
                        </Badge>
                      )}
                      {param.maximum !== undefined && (
                        <Badge variant="outline" className="font-normal">
                          最大值: {param.maximum}
                        </Badge>
                      )}
                      {param.minLength !== undefined && (
                        <Badge variant="outline" className="font-normal">
                          最小长度: {param.minLength}
                        </Badge>
                      )}
                      {param.maxLength !== undefined && (
                        <Badge variant="outline" className="font-normal">
                          最大长度: {param.maxLength}
                        </Badge>
                      )}
                      {param.pattern && (
                        <Badge variant="outline" className="font-mono font-normal">
                          正则: {param.pattern}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* 枚举值 */}
                  {param.enum && param.enum.length > 0 && (
                    <div className="mt-1.5">
                      <div className="text-xs text-muted-foreground mb-1">可选值：</div>
                      <div className="flex flex-wrap gap-1.5">
                        {param.enum.map(item => (
                          <Badge
                            key={String(item.value)}
                            variant="secondary"
                            className="font-mono text-xs"
                          >
                            <span className="text-primary">{item.value}</span>
                            <span className="mx-1 text-muted-foreground">-</span>
                            <span>{item.label}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 默认值 */}
                  {param.defaultValue !== undefined && (
                    <div className="text-xs text-muted-foreground">
                      默认值: <code className="bg-muted px-1 py-0.5 rounded font-mono">
                        {JSON.stringify(param.defaultValue)}
                      </code>
                    </div>
                  )}

                  {/* 备注 */}
                  {param.remark && (
                    <div className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1.5 rounded">
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span>{param.remark}</span>
                    </div>
                  )}
                </div>
              </td>

              {/* 示例值 */}
              <td className="py-3 px-4">
                {param.example ? (
                  <code className="font-mono text-xs bg-muted px-2 py-1 rounded break-all">
                    {param.example}
                  </code>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
