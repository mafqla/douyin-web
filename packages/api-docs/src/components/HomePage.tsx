import { useEffect, useRef } from 'react'
import { Book, Zap, FileJson, Code2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { apiRegistry, getAllApis } from '@/data/api-registry'

// 动态背景 - 浮动粒子效果
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    // 使用非空的 ctx
    const ctx = context

    // 保存当前尺寸
    let width = window.innerWidth
    let height = window.innerHeight

    // 设置画布大小
    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 粒子接口
    interface ParticleData {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      color: string
    }

    // 创建粒子
    const createParticle = (): ParticleData => {
      const colors = [
        'rgba(59, 130, 246, ', // blue
        'rgba(139, 92, 246, ', // violet
        'rgba(236, 72, 153, ', // pink
        'rgba(34, 197, 94, ',  // green
      ]
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    }

    // 更新粒子位置
    const updateParticle = (p: ParticleData) => {
      p.x += p.speedX
      p.y += p.speedY

      // 边界检测
      if (p.x > width) p.x = 0
      if (p.x < 0) p.x = width
      if (p.y > height) p.y = 0
      if (p.y < 0) p.y = height
    }

    // 绘制粒子
    const drawParticle = (p: ParticleData) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color + p.opacity + ')'
      ctx.fill()
    }

    // 创建粒子数组
    const particles: ParticleData[] = []
    const particleCount = Math.min(80, Math.floor(width * height / 15000))
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle())
    }

    // 绘制连接线
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 150)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // 动画循环
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      // 更新和绘制粒子
      particles.forEach(particle => {
        updateParticle(particle)
        drawParticle(particle)
      })

      // 绘制连接线
      drawConnections()

      animationId = requestAnimationFrame(animate)
    }

    animate()

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

export function HomePage() {
  const allApis = getAllApis()
  const categoryCount = apiRegistry.length
  const apiCount = allApis.length

  // 获取最近的几个 API 作为快速入口
  const recentApis = allApis.slice(0, 6)

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      {/* 动态粒子背景 */}
      <AnimatedBackground />

      {/* 装饰性渐变光圈 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl" />

      {/* Hero 区域 */}
      <div className="container mx-auto px-6 py-16 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          API 文档系统
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          抖音 Web API 文档
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          完整的抖音 Web 接口文档，包含详细的参数说明、响应示例和在线测试功能。
          支持导出为 Postman 和 OpenAPI 格式。
        </p>

        <div className="flex items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link to={`/docs/${recentApis[0]?.id || ''}`}>
              开始浏览
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Code2 className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm border shadow-sm">
            <div className="text-3xl font-bold text-primary mb-1">{categoryCount}</div>
            <div className="text-sm text-muted-foreground">API 分类</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm border shadow-sm">
            <div className="text-3xl font-bold text-primary mb-1">{apiCount}</div>
            <div className="text-sm text-muted-foreground">接口总数</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm border shadow-sm">
            <div className="text-3xl font-bold text-primary mb-1">2</div>
            <div className="text-sm text-muted-foreground">导出格式</div>
          </div>
          <div className="text-center p-6 rounded-xl bg-card/80 backdrop-blur-sm border shadow-sm">
            <div className="text-3xl font-bold text-primary mb-1">100%</div>
            <div className="text-sm text-muted-foreground">在线测试</div>
          </div>
        </div>
      </div>

      {/* 功能特性 */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-8">功能特性</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold mb-2">完整文档</h3>
            <p className="text-sm text-muted-foreground">
              详细的参数说明、类型定义、约束条件和示例值，让你快速了解每个接口的使用方式。
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">在线测试</h3>
            <p className="text-sm text-muted-foreground">
              内置 API 测试面板，填写参数即可发送请求，实时查看响应结果和请求耗时。
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <FileJson className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">导入导出</h3>
            <p className="text-sm text-muted-foreground">
              支持导出为 Postman Collection 和 OpenAPI 3.0 格式，也可导入已有的 API 文档。
            </p>
          </div>
        </div>
      </div>

      {/* API 分类预览 */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-8">API 分类</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apiRegistry.map(category => (
            <Link
              key={category.id}
              to={`/docs/${category.apis[0]?.id || ''}`}
              className="p-4 rounded-lg border bg-card/80 backdrop-blur-sm hover:bg-accent hover:border-primary/50 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {category.apis.length} 个接口
                </span>
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* 快速开始 */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-muted-foreground mb-6">
            选择一个 API 分类，开始探索抖音 Web 接口
          </p>
          <Button asChild size="lg">
            <Link to={`/docs/${recentApis[0]?.id || ''}`}>
              浏览全部 API
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* 底部 */}
      <footer className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground border-t relative z-10">
        <p>抖音 Web API 文档 · 仅供学习研究使用</p>
      </footer>
    </div>
  )
}
