/**
 * 初始化性能优化工具
 * 在应用启动时应该尽早调用
 */
import { scheduleRead, scheduleWrite, throttle } from './domOptimizer'
import { batchDomOperations, monitorReflows } from './performanceUtils'

export const initPerformanceOptimizations = () => {
  // 确保即使加载失败也有基本的实现
  const fallbackImplementation = {
    scheduleRead: fn => Promise.resolve(fn()),
    scheduleWrite: fn => Promise.resolve(fn()),
    throttle: (fn, wait) => {
      let lastCall = 0
      return function (...args) {
        const now = Date.now()
        if (now - lastCall < wait) return
        lastCall = now
        return fn.apply(this, args)
      }
    },
  }

  try {
    // 添加到window对象，使其在整个应用中可用
    window.domOptimizer = {
      scheduleRead: scheduleRead || fallbackImplementation.scheduleRead,
      scheduleWrite: scheduleWrite || fallbackImplementation.scheduleWrite,
      throttle: throttle || fallbackImplementation.throttle,
    }
  } catch (error) {
    console.warn('性能优化初始化失败，使用回退实现', error)
    window.domOptimizer = fallbackImplementation
  }

  // 使用更安全的环境检测方法
  const isDevelopment =
    // 方法1: 检查 window 对象上的一个自定义属性
    window.__DEV__ ||
    // 方法2: 使用import.meta.env替代process.env (Vite特有的环境变量)
    (import.meta.env && import.meta.env.DEV) ||
    // 方法3: 检查当前域名是否是开发环境常用域名
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    // 方法4: 默认为false，生产环境更安全
    false

  // 在开发环境中监控回流
  if (isDevelopment) {
    window.reflowMonitor = monitorReflows()

    // 添加回流检测器
    const warned = new Set()
    window.__checkReflow = (id, measureFn) => {
      if (warned.has(id)) return measureFn()

      const startTime = performance.now()
      const result = measureFn()
      const endTime = performance.now()

      if (endTime - startTime > 10) {
        console.warn(
          `[Reflow] ${id} took ${(endTime - startTime).toFixed(2)}ms`
        )
        warned.add(id)
      }

      return result
    }
  }

  // 使用统一的批量DOM更新函数
  window.batchDomUpdates = batchDomOperations

  // 优化视口变化检测的IntersectionObserver配置
  window.optimizedIntersectionConfig = {
    rootMargin: '300px 0px', // 提前加载范围更大
    threshold: [0, 0.1, 0.5, 1], // 常用阈值组
  }

  return {
    cleanup: () => {
      if (window.reflowMonitor) {
        window.reflowMonitor.disable()
      }
      delete window.domOptimizer
      delete window.batchDomUpdates
      delete window.__checkReflow
      delete window.optimizedIntersectionConfig
    },
  }
}

// 确保默认导出并立即初始化
const initResult = initPerformanceOptimizations()
export default initResult
