/**
 * 性能优化工具
 * 用于监控和减少回流、重绘相关的性能问题
 */

// Web Worker 管理器，减轻主线程负载
let workerInstance = null
let workerTasks = new Map()
let taskIdCounter = 0

// 检测设备性能和功能 - 增强错误处理和健壮性
export function detectDeviceCapabilities() {
  // 定义默认值，确保即使出错也返回有效对象
  const defaultCapabilities = {
    isLowEndDevice: false,
    isReducedMotion: false,
    isTouchDevice: false,
    hardwareConcurrency: 4,
    shouldOptimizeAnimations: false,
    devicePixelRatio: 1,
    deviceMemory: 8,
    connectionType: '4g',
  }

  try {
    // 缓存结果避免重复检测
    if (
      typeof window !== 'undefined' &&
      window.__deviceCapabilities !== undefined
    ) {
      return window.__deviceCapabilities
    }

    const capabilities = {
      isLowEndDevice: false,
      isReducedMotion: false,
      isTouchDevice: false,
      hardwareConcurrency:
        (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ||
        4,
      shouldOptimizeAnimations: false,
      devicePixelRatio:
        typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
      deviceMemory:
        (typeof navigator !== 'undefined' && navigator.deviceMemory) || 8,
      connectionType:
        (typeof navigator !== 'undefined' &&
          navigator.connection &&
          navigator.connection.effectiveType) ||
        '4g',
    }

    // 低端设备检测 - 使用缓存和更快的检测逻辑
    capabilities.isLowEndDevice =
      capabilities.hardwareConcurrency <= 4 ||
      capabilities.deviceMemory < 4 ||
      capabilities.connectionType === 'slow-2g' ||
      capabilities.connectionType === '2g'

    // 减少动画设置 - 使用缓存
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        capabilities.isReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
      } catch (e) {
        console.warn('媒体查询错误:', e)
        capabilities.isReducedMotion = false
      }
    }

    // 触摸设备检测 - 简化
    if (typeof window !== 'undefined') {
      capabilities.isTouchDevice =
        'ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0)
    }

    // 判断是否应该优化动画
    capabilities.shouldOptimizeAnimations =
      capabilities.isLowEndDevice ||
      capabilities.isReducedMotion ||
      capabilities.devicePixelRatio > 2.5 // 高DPI设备也需要优化

    // 缓存结果
    if (typeof window !== 'undefined') {
      window.__deviceCapabilities = capabilities
    }

    return capabilities
  } catch (error) {
    console.error('设备性能检测失败，使用默认配置:', error)
    return defaultCapabilities
  }
}

// 获取优化的动画配置 - 简化实现
export function getOptimizedAnimationProps(shouldOptimize = false) {
  return shouldOptimize
    ? {
        transition: { duration: 0.2, ease: 'easeOut' },
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: 10 },
        viewport: { once: true, margin: '0px' },
      }
    : {
        transition: { duration: 0.5, ease: 'easeOut' },
        animate: { opacity: 1, y: 0, scale: 1 },
        initial: { opacity: 0, y: 30, scale: 0.95 },
        viewport: { once: true, margin: '-50px' },
      }
}

/**
 * 更高效的节流函数 - 优化实现
 */
export function throttle(fn, wait = 100) {
  let lastCall = 0
  let timeout = null

  return function (...args) {
    const now = Date.now()
    const remaining = wait - (now - lastCall)

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastCall = now
      return fn.apply(this, args)
    }

    if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now()
        timeout = null
        fn.apply(this, args)
      }, remaining)
    }
  }
}

// 防抖函数 - 优化实现
export function debounce(func, wait = 200, immediate = false) {
  let timeout

  return function (...args) {
    const context = this
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

// 优化DOM操作批量处理
export function batchDomOperations(operations = []) {
  if (Array.isArray(operations)) {
    // 使用Promise.resolve简化异步操作
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        // 读取阶段
        const results = operations
          .filter(op => typeof op.read === 'function')
          .map(op => ({ id: op.id, result: op.read() }))

        // 写入阶段
        requestAnimationFrame(() => {
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
  } else {
    // 简化对象形式批处理
    const { read, write } = operations

    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const data = read ? read() : null

        requestAnimationFrame(() => {
          if (write) write(data)
          resolve(data)
        })
      })
    })
  }
}

// 安全地读取DOM属性 - 简化实现
export function safelyReadDOM(callback) {
  if (!callback) return Promise.resolve(null)

  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve(callback())
    })
  })
}

// 安全地写入DOM属性 - 简化实现
export function safelyWriteDOM(callback) {
  if (!callback) return Promise.resolve(null)

  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve(callback())
      })
    })
  })
}

// 监控DOM回流 - 只在开发模式启用
export function monitorReflows(enabled = true) {
  // 修复process未定义问题
  const isDev =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.__DEV__ === true)

  if (!enabled || !isDev || typeof window === 'undefined') {
    return { disable: () => {} }
  }

  // 创建性能观察器
  let observer
  try {
    observer = new PerformanceObserver(
      throttle(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && entry.value > 0.05) {
            console.warn('检测到显著的布局偏移:', entry)
          }
        }
      }, 1000)
    )

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

// 优化长列表渲染 - 使用更简化的实现
export function createVirtualizedRenderer(options = {}) {
  const { itemHeight = 200, overscan = 5 } = options

  return {
    // 计算可见范围
    getVisibleRange: (totalItems, containerRef) => {
      if (!containerRef?.current) return { start: 0, end: 20 }

      // 优化: 缓存DOM查询结果
      const rect = containerRef.current.getBoundingClientRect()
      const viewHeight = window.innerHeight

      // 避免在视口外计算
      if (rect.bottom < 0 || rect.top > viewHeight) {
        return { start: 0, end: 0 }
      }

      // 优化计算
      const scrollY = window.scrollY || window.pageYOffset
      // 移除未使用的变量 startOffset
      // const startOffset = Math.max(0, scrollY + rect.top);
      const start = Math.max(0, Math.floor((scrollY - rect.top) / itemHeight))

      // 改进视口项目计算
      const visibleHeight = Math.min(
        viewHeight,
        rect.bottom - Math.max(0, rect.top)
      )
      const visibleItems = Math.ceil(visibleHeight / itemHeight) + overscan
      const end = Math.min(totalItems, start + visibleItems)

      return { start, end }
    },

    // 创建滚动监听器
    createScrollListener: callback => {
      const handleScroll = throttle(() => {
        requestAnimationFrame(callback)
      }, 100)

      window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    },
  }
}

/**
 * 优化主题切换 - 使用memoization避免重复计算
 */
export function optimizedThemeToggle(themeChangeFunc) {
  let lastExecution = 0
  const THROTTLE_MS = 300 // 避免频繁切换

  return function (...args) {
    const now = Date.now()
    if (now - lastExecution < THROTTLE_MS) return

    lastExecution = now
    requestAnimationFrame(() => {
      themeChangeFunc.apply(this, args)
    })
  }
}

// 创建Web Worker执行计算密集型任务
export function createWorker(workerFunction) {
  // 只创建一次Worker
  if (workerInstance) return workerInstance

  // 将函数转换为字符串
  const workerCode = `
    ${workerFunction.toString()};
    self.onmessage = function(e) {
      const { id, method, params } = e.data;
      if (typeof ${workerFunction.name}[method] === 'function') {
        try {
          const result = ${workerFunction.name}[method](...params);
          self.postMessage({ id, result, error: null });
        } catch (error) {
          self.postMessage({ id, result: null, error: error.message });
        }
      } else {
        self.postMessage({ 
          id, 
          result: null, 
          error: \`Method '\${method}' not found\` 
        });
      }
    };
  `

  // 创建Blob和URL
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)

  // 创建Worker
  try {
    workerInstance = new Worker(url)

    // 设置消息处理
    workerInstance.onmessage = function (e) {
      const { id, result, error } = e.data
      const task = workerTasks.get(id)

      if (task) {
        if (error) {
          task.reject(new Error(error))
        } else {
          task.resolve(result)
        }

        workerTasks.delete(id)
      }
    }

    // 错误处理
    workerInstance.onerror = function (error) {
      console.error('Worker error:', error)
      // 通知所有等待的任务
      workerTasks.forEach(task => {
        task.reject(new Error('Worker error'))
      })
      workerTasks.clear()
    }

    // 在页面卸载时清理
    if (typeof window !== 'undefined') {
      window.addEventListener('unload', () => {
        if (workerInstance) {
          workerInstance.terminate()
          URL.revokeObjectURL(url)
          workerInstance = null
        }
      })
    }

    return workerInstance
  } catch (e) {
    console.error('Failed to create Web Worker:', e)
    URL.revokeObjectURL(url)
    return null
  }
}

// 在Web Worker中执行方法
export function runInWorker(worker, method, ...params) {
  if (!worker) {
    // 如果没有worker，在主线程执行
    return Promise.reject(new Error('Worker not available'))
  }

  return new Promise((resolve, reject) => {
    const id = taskIdCounter++

    workerTasks.set(id, { resolve, reject })
    worker.postMessage({ id, method, params })
  })
}

// 示例Worker函数
export function createComputeWorker() {
  // 这个函数会在Worker中执行
  function ComputeWorker() {
    // 计算密集型操作示例
    function calculateHeavyTask(iterations) {
      let result = 0
      for (let i = 0; i < iterations; i++) {
        result += Math.sqrt(i * Math.sin(i))
      }
      return result
    }

    // 图像处理示例
    function processImageData(imageData) {
      // 在Worker中处理图像数据
      // 这里是示例，实际实现会根据需求变化
      return imageData
    }

    // 公开Worker API
    return {
      calculateHeavyTask,
      processImageData,
    }
  }

  return createWorker(ComputeWorker)
}

export default {
  detectDeviceCapabilities,
  getOptimizedAnimationProps,
  throttle,
  debounce,
  batchDomOperations,
  safelyReadDOM,
  safelyWriteDOM,
  monitorReflows,
  createVirtualizedRenderer,
  optimizedThemeToggle,
  createWorker,
  runInWorker,
  createComputeWorker,
}
