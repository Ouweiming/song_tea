/**
 * 性能优化工具
 * 用于监控和减少回流、重绘相关的性能问题
 */
import { throttle } from './domUtils'

// 检测设备性能和功能
export function detectDeviceCapabilities() {
  const capabilities = {
    isLowEndDevice: false,
    isReducedMotion: false,
    isTouchDevice: false,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    shouldOptimizeAnimations: false,
  }

  // 低端设备检测
  capabilities.isLowEndDevice =
    capabilities.hardwareConcurrency <= 4 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )

  // 减少动画设置
  capabilities.isReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  // 触摸设备检测
  capabilities.isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0

  // 判断是否应该优化动画
  capabilities.shouldOptimizeAnimations =
    capabilities.isLowEndDevice || capabilities.isReducedMotion

  return capabilities
}

// 获取优化的动画配置
export function getOptimizedAnimationProps(shouldOptimize = false) {
  if (shouldOptimize) {
    return {
      // 减少动画
      transition: { duration: 0.2, ease: 'easeOut' },
      animate: { opacity: 1, y: 0 }, // 简化动画
      initial: { opacity: 0, y: 10 },
      viewport: { once: true, margin: '0px' },
    }
  }

  return {
    // 标准动画
    transition: { duration: 0.5, ease: 'easeOut' },
    animate: { opacity: 1, y: 0, scale: 1 },
    initial: { opacity: 0, y: 30, scale: 0.95 },
    viewport: { once: true, margin: '-50px' },
  }
}

// 优化DOM操作批量处理
export function batchDomOperations(operations = []) {
  return new Promise(resolve => {
    // 在下一帧执行所有读取操作
    requestAnimationFrame(() => {
      // 读取阶段
      const results = operations
        .filter(op => typeof op.read === 'function')
        .map(op => ({ id: op.id, result: op.read() }))

      // 在再下一帧执行所有写入操作
      requestAnimationFrame(() => {
        // 写入阶段
        operations
          .filter(op => typeof op.write === 'function')
          .forEach(op => {
            const resultData = results.find(r => r.id === op.id)?.result
            op.write(resultData)
          })

        resolve(results)
      })
    })
  })
}

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
