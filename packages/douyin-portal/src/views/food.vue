<script setup lang="ts">
import { ref, h } from 'vue'
import { Popover } from '@/components/common/popover'
import { Toast, ToastFactory, useToast } from '@/components/common/toast'

// ==================== Popover 相关 ====================

// 受控模式
const popoverVisible = ref(false)
const popoverVisible2 = ref(false)

// Popover 引用
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

// 手动控制方法
const showPopover = () => popoverRef.value?.show()
const hidePopover = () => popoverRef.value?.hide()
const togglePopover = () => popoverRef.value?.toggle()

// ==================== Toast 相关 ====================

// 使用 useToast hook
const toast = useToast()

// 基础类型
const showInfoToast = () => Toast.info('这是一条信息提示')
const showSuccessToast = () => Toast.success('操作成功！')
const showWarningToast = () => Toast.warning('请注意，这是一条警告信息')
const showErrorToast = () => Toast.error('操作失败，请重试')

// 自定义配置
const showCustomToast = () => {
  Toast.info({
    content: '自定义配置的 Toast',
    duration: 5000,
    showClose: true,
    theme: 'light'
  })
}

// 连续弹出
const showMultipleToasts = () => {
  Toast.info('第一条消息')
  setTimeout(() => Toast.success('第二条消息'), 300)
  setTimeout(() => Toast.warning('第三条消息'), 600)
}

// 不自动关闭
const showPersistentToast = () => {
  Toast.info({
    content: '这条消息不会自动关闭，需要手动点击关闭按钮',
    duration: 0,
    showClose: true
  })
}

// 长文本内容
const showLongTextToast = () => {
  Toast.info({
    content: '这是一段很长的文本内容，用于测试 Toast 组件对长文本的处理能力。当文本内容过长时，应该能够正确换行显示，而不是溢出容器。',
    textMaxWidth: 300
  })
}

// 自定义最大宽度
const showWidthToast = () => {
  Toast.success({
    content: '自定义宽度 200px',
    textMaxWidth: 200
  })
}

// 关闭回调
const showCallbackToast = () => {
  Toast.info({
    content: '关闭后会触发回调',
    duration: 2000,
    onClose: () => {
      Toast.success('Toast 已关闭！')
    }
  })
}

// 手动关闭
let currentToastId: number | null = null
const showManualCloseToast = () => {
  currentToastId = Toast.info({
    content: '点击下方按钮手动关闭此 Toast',
    duration: 0,
    showClose: false
  })
}
const closeManualToast = () => {
  if (currentToastId !== null) {
    Toast.close(currentToastId)
    currentToastId = null
  }
}

// 销毁所有
const destroyAllToasts = () => {
  Toast.destroyAll()
}

// 使用 useToast hook
const showHookToast = () => {
  toast.info('通过 useToast hook 调用')
}

// 使用 ToastFactory 创建独立实例
const customToast = ToastFactory.create({
  top: 100,
  theme: 'light',
  duration: 2000
})
const showFactoryToast = () => {
  customToast.success('通过 ToastFactory 创建的独立实例')
}

// 自定义图标（使用 VNode）
const showCustomIconToast = () => {
  Toast.info({
    content: '自定义图标',
    icon: h('span', { style: 'font-size: 18px' }, '🎉')
  })
}

// 无图标
const showNoIconToast = () => {
  Toast.info({
    content: '没有图标的 Toast',
    icon: null
  })
}

// 测试最大数量限制
const testMaxCount = () => {
  for (let i = 1; i <= 8; i++) {
    setTimeout(() => {
      Toast.info(`第 ${i} 条消息`)
    }, i * 100)
  }
}

// Light 主题各类型
const showLightInfo = () => Toast.info({ content: 'Light 主题 Info', theme: 'light' })
const showLightSuccess = () => Toast.success({ content: 'Light 主题 Success', theme: 'light' })
const showLightWarning = () => Toast.warning({ content: 'Light 主题 Warning', theme: 'light' })
const showLightError = () => Toast.error({ content: 'Light 主题 Error', theme: 'light' })
</script>

<template>
  <div class="food-demo">
    <h2>组件测试实例</h2>

    <!-- ==================== Popover 测试区域 ==================== -->
    <section class="demo-section">
      <h3>Popover 气泡卡片 - 触发方式</h3>
      <div class="demo-row">
        <Popover content="这是 hover 触发的提示内容">
          <button class="demo-btn">Hover 触发</button>
        </Popover>

        <Popover trigger="click" content="点击触发的内容，点击外部关闭">
          <button class="demo-btn">Click 触发</button>
        </Popover>

        <Popover trigger="focus" content="获取焦点时显示">
          <input class="demo-input" placeholder="Focus 触发" />
        </Popover>

        <Popover trigger="custom" v-model:visible="popoverVisible" content="受控模式内容">
          <button class="demo-btn" @click="popoverVisible = !popoverVisible">
            Custom 触发 {{ popoverVisible ? '(显示)' : '(隐藏)' }}
          </button>
        </Popover>
      </div>
    </section>

    <section class="demo-section">
      <h3>Popover - 弹出位置</h3>
      <div class="demo-row">
        <Popover position="top" content="顶部弹出">
          <button class="demo-btn">Top</button>
        </Popover>
        <Popover position="topLeft" content="顶部左对齐">
          <button class="demo-btn">TopLeft</button>
        </Popover>
        <Popover position="topRight" content="顶部右对齐">
          <button class="demo-btn">TopRight</button>
        </Popover>
      </div>
      <div class="demo-row">
        <Popover position="bottom" content="底部弹出">
          <button class="demo-btn">Bottom</button>
        </Popover>
        <Popover position="bottomLeft" content="底部左对齐">
          <button class="demo-btn">BottomLeft</button>
        </Popover>
        <Popover position="bottomRight" content="底部右对齐">
          <button class="demo-btn">BottomRight</button>
        </Popover>
      </div>
      <div class="demo-row">
        <Popover position="left" content="左侧弹出">
          <button class="demo-btn">Left</button>
        </Popover>
        <Popover position="leftTop" content="左侧顶部对齐">
          <button class="demo-btn">LeftTop</button>
        </Popover>
        <Popover position="leftBottom" content="左侧底部对齐">
          <button class="demo-btn">LeftBottom</button>
        </Popover>
      </div>
      <div class="demo-row">
        <Popover position="right" content="右侧弹出">
          <button class="demo-btn">Right</button>
        </Popover>
        <Popover position="rightTop" content="右侧顶部对齐">
          <button class="demo-btn">RightTop</button>
        </Popover>
        <Popover position="rightBottom" content="右侧底部对齐">
          <button class="demo-btn">RightBottom</button>
        </Popover>
      </div>
    </section>

    <section class="demo-section">
      <h3>Popover - 主题与箭头</h3>
      <div class="demo-row">
        <Popover content="深色主题（默认）" theme="dark">
          <button class="demo-btn">Dark 主题</button>
        </Popover>
        <Popover content="浅色主题" theme="light">
          <button class="demo-btn">Light 主题</button>
        </Popover>
        <Popover content="带箭头 - 深色" :show-arrow="true" theme="dark">
          <button class="demo-btn">Dark + 箭头</button>
        </Popover>
        <Popover content="带箭头 - 浅色" :show-arrow="true" theme="light">
          <button class="demo-btn">Light + 箭头</button>
        </Popover>
      </div>
      <div class="demo-row">
        <Popover position="top" content="顶部箭头" :show-arrow="true">
          <button class="demo-btn">Top 箭头</button>
        </Popover>
        <Popover position="bottom" content="底部箭头" :show-arrow="true">
          <button class="demo-btn">Bottom 箭头</button>
        </Popover>
        <Popover position="left" content="左侧箭头" :show-arrow="true">
          <button class="demo-btn">Left 箭头</button>
        </Popover>
        <Popover position="right" content="右侧箭头" :show-arrow="true">
          <button class="demo-btn">Right 箭头</button>
        </Popover>
      </div>
    </section>

    <section class="demo-section">
      <h3>Popover - 高级功能</h3>
      <div class="demo-row">
        <!-- 自定义间距 -->
        <Popover content="间距 4px" :spacing="4">
          <button class="demo-btn">间距 4px</button>
        </Popover>
        <Popover content="间距 16px" :spacing="16">
          <button class="demo-btn">间距 16px</button>
        </Popover>
        <Popover content="间距 24px" :spacing="24">
          <button class="demo-btn">间距 24px</button>
        </Popover>
      </div>
      <div class="demo-row">
        <!-- 延迟显示/隐藏 -->
        <Popover content="延迟 500ms 显示" :mouse-enter-delay="500">
          <button class="demo-btn">延迟显示</button>
        </Popover>
        <Popover content="延迟 500ms 隐藏" :mouse-leave-delay="500">
          <button class="demo-btn">延迟隐藏</button>
        </Popover>
        <!-- 禁用状态 -->
        <Popover content="这个不会显示" :disabled="true">
          <button class="demo-btn demo-btn--disabled">禁用状态</button>
        </Popover>
      </div>
      <div class="demo-row">
        <!-- 关闭时销毁 -->
        <Popover trigger="click" content="关闭时销毁内容" :destroy-on-close="true">
          <button class="demo-btn">destroyOnClose</button>
        </Popover>
        <!-- 自动调整位置 -->
        <Popover position="bottom" content="自动调整位置（默认开启）" :auto-adjust-overflow="true">
          <button class="demo-btn">autoAdjustOverflow</button>
        </Popover>
        <!-- 默认显示 -->
        <Popover content="默认显示的气泡" :default-visible="true">
          <button class="demo-btn">默认显示</button>
        </Popover>
      </div>
    </section>

    <section class="demo-section">
      <h3>Popover - 自定义内容</h3>
      <div class="demo-row">
        <!-- 菜单 -->
        <Popover trigger="click" position="bottomLeft">
          <template #content>
            <div class="popover-menu">
              <div class="popover-menu-item">📝 编辑</div>
              <div class="popover-menu-item">📋 复制</div>
              <div class="popover-menu-item">🗑️ 删除</div>
            </div>
          </template>
          <button class="demo-btn">下拉菜单</button>
        </Popover>

        <!-- 用户卡片 -->
        <Popover position="bottom">
          <template #content>
            <div class="user-card">
              <div class="user-card__avatar">👤</div>
              <div class="user-card__info">
                <div class="user-card__name">张三</div>
                <div class="user-card__desc">前端开发工程师</div>
              </div>
            </div>
          </template>
          <button class="demo-btn">用户卡片</button>
        </Popover>

        <!-- 确认框 -->
        <Popover trigger="click" position="bottom" v-model:visible="popoverVisible2">
          <template #content>
            <div class="confirm-box">
              <div class="confirm-box__text">确定要删除吗？</div>
              <div class="confirm-box__actions">
                <button class="confirm-box__btn" @click="popoverVisible2 = false">取消</button>
                <button class="confirm-box__btn confirm-box__btn--primary" @click="popoverVisible2 = false">确定</button>
              </div>
            </div>
          </template>
          <button class="demo-btn demo-btn--error">确认删除</button>
        </Popover>
      </div>
    </section>

    <section class="demo-section">
      <h3>Popover - 手动控制</h3>
      <div class="demo-row">
        <Popover ref="popoverRef" trigger="custom" content="通过 ref 手动控制">
          <button class="demo-btn">目标元素</button>
        </Popover>
        <button class="demo-btn" @click="showPopover">show()</button>
        <button class="demo-btn" @click="hidePopover">hide()</button>
        <button class="demo-btn" @click="togglePopover">toggle()</button>
      </div>
    </section>

    <!-- ==================== Toast 测试区域 ==================== -->
    <section class="demo-section">
      <h3>Toast - 基础类型</h3>
      <div class="demo-row">
        <button class="demo-btn" @click="showInfoToast">Info</button>
        <button class="demo-btn demo-btn--success" @click="showSuccessToast">Success</button>
        <button class="demo-btn demo-btn--warning" @click="showWarningToast">Warning</button>
        <button class="demo-btn demo-btn--error" @click="showErrorToast">Error</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>Toast - Light 主题</h3>
      <div class="demo-row">
        <button class="demo-btn" @click="showLightInfo">Light Info</button>
        <button class="demo-btn demo-btn--success" @click="showLightSuccess">Light Success</button>
        <button class="demo-btn demo-btn--warning" @click="showLightWarning">Light Warning</button>
        <button class="demo-btn demo-btn--error" @click="showLightError">Light Error</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>Toast - 持续时间</h3>
      <div class="demo-row">
        <button class="demo-btn" @click="showCustomToast">5秒后关闭</button>
        <button class="demo-btn" @click="showPersistentToast">不自动关闭</button>
        <button class="demo-btn" @click="showCallbackToast">关闭回调</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>Toast - 内容与宽度</h3>
      <div class="demo-row">
        <button class="demo-btn" @click="showLongTextToast">长文本</button>
        <button class="demo-btn" @click="showWidthToast">自定义宽度</button>
        <button class="demo-btn" @click="showCustomIconToast">自定义图标</button>
        <button class="demo-btn" @click="showNoIconToast">无图标</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>Toast - 手动控制</h3>
      <div class="demo-row">
        <button class="demo-btn" @click="showManualCloseToast">显示（无关闭按钮）</button>
        <button class="demo-btn" @click="closeManualToast">手动关闭</button>
        <button class="demo-btn demo-btn--error" @click="destroyAllToasts">销毁所有</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>Toast - 高级功能</h3>
      <div class="demo-row">
        <button class="demo-btn" @click="showMultipleToasts">连续弹出</button>
        <button class="demo-btn" @click="testMaxCount">测试最大数量(8条)</button>
        <button class="demo-btn" @click="showHookToast">useToast Hook</button>
        <button class="demo-btn" @click="showFactoryToast">ToastFactory</button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.food-demo {
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
  overflow: auto;

  h2 {
    color: var(--color-text-t1);
    margin-bottom: 24px;
  }

  h3 {
    color: var(--color-text-t2);
    margin-bottom: 16px;
    font-size: 16px;
  }
}

.demo-section {
  margin-bottom: 32px;
  padding: 20px;
  background: var(--color-bg-b2);
  border-radius: 12px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
}

.demo-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: var(--color-bg-b3);
  color: var(--color-text-t1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-bg-b4);
  }

  &--success {
    background: #52c41a;
    color: #fff;

    &:hover {
      background: #73d13d;
    }
  }

  &--warning {
    background: #faad14;
    color: #fff;

    &:hover {
      background: #ffc53d;
    }
  }

  &--error {
    background: #ff4d4f;
    color: #fff;

    &:hover {
      background: #ff7875;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.demo-input {
  padding: 8px 12px;
  border: 1px solid var(--color-line-l2);
  border-radius: 8px;
  background: var(--color-bg-b1);
  color: var(--color-text-t1);
  outline: none;

  &:focus {
    border-color: var(--color-primary);
  }
}

// Popover 自定义内容样式
.popover-menu {
  min-width: 120px;
}

.popover-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

// 用户卡片
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px;

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-bg-b3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
  }

  &__desc {
    font-size: 12px;
    opacity: 0.7;
  }
}

// 确认框
.confirm-box {
  padding: 4px;

  &__text {
    margin-bottom: 12px;
    font-size: 14px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  &__btn {
    padding: 4px 12px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: 13px;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &--primary {
      background: var(--color-primary);
      color: #fff;

      &:hover {
        background: var(--color-primary-hover, #ff4d6a);
      }
    }
  }
}
</style>
