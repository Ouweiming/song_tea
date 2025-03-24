/**
 * 全局性能管理器
 * 集中处理性能优化策略和设备适配
 */
import { throttle } from './utils/domUtils'
import {
  detectDeviceCapabilities,
  getOptimizedAnimationProps,
} from './utils/performanceUtils'

// 创建性能管理器单例
class PerformanceManager {
  constructor() {
    // 设备能力
    this.capabilities = detectDeviceCapabilities()

    // 全局性能标志
    this.flags = {
      enableHeavyAnimations: !this.capabilities.shouldOptimizeAnimations,
      enableParallaxEffects: !this.capabilities.isLowEndDevice,
      optimizeScrollHandlers: true,
      useVirtualization: this.capabilities.isLowEndDevice,
    }

    // 初始化性能监视器
    this.initializeMonitors()

    // 缓存优化后的动画配置
    this.animationPresets = {
      minimal: getOptimizedAnimationProps(true),
      standard: getOptimizedAnimationProps(false),
    }
  }

  // 初始化性能监视器
  initializeMonitors() {
    // 使用更安全的环境检测方法
    const isDevelopment =
      // Vite特有的环境变量
      (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.DEV) ||
      // 检查当前域名是否是开发环境常用域名
      (typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1'))

    if (isDevelopment) {
      // 只在开发环境监视性能问题
      this.monitors = {
        domMutations: this.setupDOMMutationMonitor(),
        longTasks: this.setupLongTaskMonitor(),
      }
    }
  }

  // 监控DOM突变
  setupDOMMutationMonitor() {
    try {
      const observer = new MutationObserver(mutations => {
        if (mutations.length > 100) {
          console.warn(`[性能警告] 检测到大量DOM变更: ${mutations.length}次`)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
      })

      return observer
    } catch (e) {
      return null
    }
  }

  // 监控长任务
  setupLongTaskMonitor() {
    try {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(list => {
          list.getEntries().forEach(entry => {
            if (entry.duration > 50) {
              console.warn(
                `[性能警告] 长任务: ${entry.duration.toFixed(0)}ms`,
                entry
              )
            }
          })
        })

        observer.observe({ entryTypes: ['longtask'] })
        return observer
      }
    } catch (e) {
      return null
    }

    return null
  }

  // 获取适合当前设备的动画预设
  getAnimationPreset(presetName = 'auto') {
    if (presetName === 'auto') {
      return this.capabilities.shouldOptimizeAnimations
        ? this.animationPresets.minimal
        : this.animationPresets.standard
    }

    return this.animationPresets[presetName] || this.animationPresets.standard
  }

  // 优化滚动处理器
  optimizeScrollHandler(handler, options = {}) {
    const { wait = 100, passive = true } = options

    // 在低端设备上使用更高的节流阈值
    const throttleWait = this.capabilities.isLowEndDevice
      ? Math.max(wait, 150)
      : wait

    // 使用节流优化处理函数
    const optimizedHandler = throttle(handler, throttleWait)

    // 返回绑定和解绑函数
    return {
      bind: (element = window) => {
        element.addEventListener('scroll', optimizedHandler, { passive })
      },
      unbind: (element = window) => {
        element.removeEventListener('scroll', optimizedHandler)
      },
    }
  }

  // 释放性能监视器资源
  cleanup() {
    if (this.monitors) {
      Object.values(this.monitors).forEach(monitor => {
        if (monitor && monitor.disconnect) {
          monitor.disconnect()
        }
      })
    }
  }
}

// 创建并导出单例
export const performanceManager = new PerformanceManager()
export default performanceManager
