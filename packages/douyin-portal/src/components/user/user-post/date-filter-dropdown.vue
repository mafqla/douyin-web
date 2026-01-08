<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  // 时间列表，格式如 ["2025·12", "2025·11", ...]
  timeList: string[]
  // 当前选中的时间
  modelValue: string
  // 是否禁用（搜索时禁用）
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  showDisabledTip: []
}>()

// 下拉框是否显示
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// 解析时间列表，提取年份和月份
const parsedTimeData = computed(() => {
  const yearsSet = new Set<string>()
  const monthsByYear: Record<string, string[]> = {}

  props.timeList.forEach((time) => {
    const [year, month] = time.split('·')
    yearsSet.add(year)
    if (!monthsByYear[year]) {
      monthsByYear[year] = []
    }
    monthsByYear[year].push(month)
  })

  // 按年份降序排列
  const years = Array.from(yearsSet).sort((a, b) => Number(b) - Number(a))

  // 月份按降序排列
  Object.keys(monthsByYear).forEach((year) => {
    monthsByYear[year].sort((a, b) => Number(b) - Number(a))
  })

  return { years, monthsByYear }
})

// 当前悬停的年份（用于显示对应月份）
const hoveredYear = ref<string>('')
// 当前选中的年份
const selectedYear = ref<string>('')
// 当前选中的月份
const selectedMonth = ref<string>('')

// 初始化选中状态
const initSelection = () => {
  if (props.modelValue && props.modelValue !== '') {
    const [year, month] = props.modelValue.split('·')
    selectedYear.value = year
    selectedMonth.value = month
    hoveredYear.value = year
  } else {
    selectedYear.value = ''
    selectedMonth.value = ''
    hoveredYear.value = ''
  }
}

watch(() => props.modelValue, initSelection, { immediate: true })

// 当前显示的月份列表（根据悬停的年份，全部时不显示）
const displayMonths = computed(() => {
  const year = hoveredYear.value
  if (!year || year === '') {
    return []
  }
  return parsedTimeData.value.monthsByYear[year] || []
})

// 显示文本
const displayText = computed(() => {
  if (!props.modelValue || props.modelValue === '') {
    return '日期筛选'
  }
  const [year, month] = props.modelValue.split('·')
  return `${year}年${month}月`
})

// 是否已筛选
const isFiltered = computed(() => {
  return props.modelValue && props.modelValue !== ''
})

// 悬停年份时更新月份列表
const handleYearHover = (year: string) => {
  hoveredYear.value = year
}

// 点击年份：选择该年份的第一个月份
const handleYearClick = (year: string) => {
  if (year === '') {
    // 选择"全部"，清除筛选
    selectedYear.value = ''
    selectedMonth.value = ''
    hoveredYear.value = ''
    emit('update:modelValue', '')
    emit('change', '')
    isOpen.value = false
    return
  }

  selectedYear.value = year
  // 自动选择该年份的第一个月份
  const months = parsedTimeData.value.monthsByYear[year]
  if (months && months.length > 0) {
    const firstMonth = months[0]
    selectedMonth.value = firstMonth
    const value = `${year}·${firstMonth}`
    emit('update:modelValue', value)
    emit('change', value)
    isOpen.value = false
  }
}

// 点击月份
const handleMonthClick = (month: string) => {
  const year = hoveredYear.value || selectedYear.value
  if (!year) return

  selectedYear.value = year
  selectedMonth.value = month
  const value = `${year}·${month}`
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

// 鼠标进入触发区域
const handleMouseEnter = () => {
  if (props.disabled) {
    return
  }
  isOpen.value = true
  // 如果已选中年份，悬停状态保持为选中的年份
  if (selectedYear.value) {
    hoveredYear.value = selectedYear.value
  } else {
    hoveredYear.value = ''
  }
}

// 鼠标离开下拉框区域
const handleMouseLeave = () => {
  isOpen.value = false
}

// 点击禁用状态时显示提示
const handleDisabledClick = () => {
  if (props.disabled) {
    emit('showDisabledTip')
  }
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    class="date-filter-dropdown"
    ref="dropdownRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="date-filter-trigger"
      :class="{ disabled: disabled }"
      @click="handleDisabledClick"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        focusable="false"
        class="icon"
      >
        <path
          d="M6.00195 2.51221C6.33319 2.51221 6.60135 2.78063 6.60156 3.11182V3.28857H9.40332V3.12061C9.40353 2.78945 9.67272 2.52008 10.0039 2.52002C10.335 2.52021 10.6033 2.78953 10.6035 3.12061V3.28857H11C12.4359 3.28857 13.5996 4.45224 13.5996 5.88818V10.8882C13.5995 12.324 12.4358 13.4878 11 13.4878H5C3.56433 13.4876 2.40054 12.3239 2.40039 10.8882V5.88818C2.40039 4.45237 3.56424 3.28879 5 3.28857H5.40234V3.11182C5.40255 2.78066 5.67076 2.51227 6.00195 2.51221ZM5 4.48779C4.22698 4.488 3.59961 5.11512 3.59961 5.88818V10.8882C3.59976 11.6611 4.22707 12.2884 5 12.2886H11C11.7731 12.2886 12.4002 11.6613 12.4004 10.8882V5.88818C12.4004 5.11498 11.7732 4.48779 11 4.48779H10.6035V4.62061C10.6033 4.95168 10.335 5.22003 10.0039 5.22021C9.67272 5.22015 9.40353 4.95176 9.40332 4.62061V4.48779H6.60156V4.61182C6.60156 4.94319 6.33332 5.21143 6.00195 5.21143C5.67063 5.21136 5.40234 4.94315 5.40234 4.61182V4.48779H5ZM10.1113 9.02783C10.3848 9.08367 10.5907 9.32578 10.5908 9.61572C10.5908 9.90576 10.3849 10.1478 10.1113 10.2036L9.99023 10.2153H6.00195C5.67067 10.2152 5.40234 9.94703 5.40234 9.61572C5.40245 9.28451 5.67074 9.01622 6.00195 9.01611H9.99023L10.1113 9.02783ZM10.1113 6.6333C10.3848 6.68914 10.5907 6.93125 10.5908 7.22119C10.5908 7.51123 10.3849 7.75323 10.1113 7.80908L9.99023 7.8208H6.00195C5.67067 7.8207 5.40234 7.5525 5.40234 7.22119C5.40245 6.88998 5.67074 6.62168 6.00195 6.62158H9.99023L10.1113 6.6333Z"
          fill="currentColor"
        ></path>
      </svg>
      <div class="date-filter-text" :class="{ filtered: isFiltered }">
        {{ displayText }}
      </div>
      <svg-icon icon="down" class="icon down" :class="{ open: isOpen }" />
    </div>

    <!-- 下拉面板 -->
    <Transition name="dropdown">
      <div v-if="isOpen && !disabled" class="date-filter-panel">
        <div class="panel-content">
          <!-- 年份列 -->
          <div class="year-column">
            <div
              class="year-item"
              :class="{ active: selectedYear === '' }"
              @mouseenter="handleYearHover('')"
              @click="handleYearClick('')"
            >
              全部
            </div>
            <div
              v-for="year in parsedTimeData.years"
              :key="year"
              class="year-item"
              :class="{
                active: selectedYear === year,
                hovered: hoveredYear === year && hoveredYear !== selectedYear
              }"
              @mouseenter="handleYearHover(year)"
              @click="handleYearClick(year)"
            >
              {{ year }}年
            </div>
          </div>
          <!-- 列分隔符 -->
          <div class="column-separator"></div>
          <!-- 月份列（始终显示，悬停全部或未悬停时为空） -->
          <div class="month-column">
            <div
              v-for="month in displayMonths"
              :key="month"
              class="month-item"
              :class="{
                active: selectedMonth === month && hoveredYear === selectedYear
              }"
              @click="handleMonthClick(month)"
            >
              {{ month }}月
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.date-filter-dropdown {
  position: relative;
  margin-left: 16px;
}

.date-filter-trigger {
  cursor: pointer;
  align-items: center;
  display: flex;
  user-select: none;

  &:hover {
    .date-filter-text,
    .icon {
      color: var(--color-text-t0);
    }
  }

  &.disabled {
    cursor: pointer;
    opacity: 0.5;

    &:hover {
      .date-filter-text,
      .icon {
        color: var(--color-text-t3);
      }
    }
  }

  .icon {
    color: var(--color-text-t3);
    font-size: 16px;

    &.down {
      margin-top: 1px;
      margin-left: 2px;
      transition: transform 0.2s;

      &.open {
        transform: rotate(180deg);
      }
    }
  }

  .date-filter-text {
    color: var(--color-text-t3);
    margin-top: 2px;
    font-size: 12px;
    font-weight: 400;
    line-height: 21px;

    &.filtered {
      color: var(--color-text-t1);
    }
  }
}

.disabled-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  line-height: 22px;
  color: #fff;
  white-space: nowrap;
}

.date-filter-panel {
  height: 292px;
  background-color: var(--color-bg-b1);
  box-shadow: var(--shadow-1);
  z-index: 11;
  border-radius: 12px;
  display: flex;
  position: absolute;
  top: 33px;
  right: 35px;

  .panel-content {
    display: flex;
  }

  .year-column,
  .month-column {
    width: 112px;
    height: 100%;
    padding: 8px;
    overflow: scroll;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-text-t4);
      border-radius: 2px;
    }
  }

  .year-column {
    min-width: 100px;
  }

  .column-separato {
    height: 100%;
    width: 1px;
    background-color: var(--color-line-l3);
  }
  .month-column {
    min-width: 70px;
  }

  .year-item,
  .month-item {
    width: 100%;
    height: 46px;
    color: var(--color-text-t3);
    cursor: pointer;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    display: flex;

    &:hover {
      background-color: var(--color-fill-hover);
      color: var(--color-text-t0);
    }

    &.active {
      color: var(--color-primary);
    }

    &.hovered {
      background-color: var(--color-fill-hover);
    }
  }
}

// 下拉动画
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// 提示动画
.tip-enter-active,
.tip-leave-active {
  transition: all 0.2s ease;
}

.tip-enter-from,
.tip-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
