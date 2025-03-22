/**
 * 性能优化工具
 * 用于监控和减少回流、重绘相关的性能问题
 */
// 导入节流函数
import { throttle } from './domUtils'

// 检测是否支持性能API
const hasPerformanceAPI =
  typeof window !== 'undefined' &&
  window.performance &&
  window.performance.mark &&
  window.performance.measure

// 监控DOM回流
export function monitorReflows(enabled = true) {
  if (!hasPerformanceAPI || !enabled) return { disable: () => {} }

  // 创建PerformanceObserver来检测布局相关操作
  let observer
  try {
    observer = new PerformanceObserver(
      throttle(list => {
        for (const entry of list.getEntries()) {
          // 回流和布局操作通常会显示为'layout-shift'或特定的浏览器事件
          if (entry.entryType === 'layout-shift' && entry.value > 0.05) {
            console.warn('检测到显著的布局偏移:', entry)
          }
        }
      }, 1000)
    )

    // 观察布局偏移
    observer.observe({ entryTypes: ['layout-shift'] })
  } catch (e) {
    console.error('性能监控API不可用:', e)
  }

  return {
    disable: () => {
      if (observer) observer.disconnect()
    },
  }
}

// 优化长列表渲染
export function createVirtualizedRenderer(options = {}) {
  const {
    itemHeight = 200, // 每项的估计高度
    overscan = 5, // 缓冲区项目数
    container = null, // 容器元素
  } = options

  let scrollContainer = container || window

  return {
    // 计算可见范围
    getVisibleRange: (totalItems, containerRef) => {
      if (!containerRef.current) return { start: 0, end: 20 }

      const rect = containerRef.current.getBoundingClientRect()
      const viewHeight = window.innerHeight

      if (rect.bottom < 0 || rect.top > viewHeight) {
        return { start: 0, end: 0 } // 不可见
      }

      const start = Math.max(
        0,
        Math.floor((window.scrollY - rect.top) / itemHeight)
      )
      const visibleItems = Math.ceil(viewHeight / itemHeight) + overscan
      const end = Math.min(totalItems, start + visibleItems)

      return { start, end }
    },

    // 创建滚动监听器
    createScrollListener: callback => {
      const handleScroll = throttle(() => {
        requestAnimationFrame(callback)
      }, 100)

      scrollContainer.addEventListener('scroll', handleScroll, {
        passive: true,
      })

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    },
  }
}
