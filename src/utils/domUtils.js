/**
 * DOM操作优化工具
 * 帮助避免强制回流和提高渲染性能
 */

// 用于读取DOM属性的安全方法，通过requestAnimationFrame隔离读操作
export function safelyReadDOM(callback) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      const result = callback()
      resolve(result)
    })
  })
}

// 用于写入DOM属性的安全方法，确保在下一帧执行写操作
export function safelyWriteDOM(callback) {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const result = callback()
        resolve(result)
      })
    })
  })
}

// 优化滚动操作的方法
export function smoothScrollToElement(elementId, offset = 0) {
  return new Promise(resolve => {
    // 先读取
    requestAnimationFrame(() => {
      const element = document.getElementById(elementId)
      if (!element) {
        resolve(false)
        return
      }

      const rect = element.getBoundingClientRect()
      const scrollTop = rect.top + window.scrollY - offset

      // 再写入
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        })

        // 监听滚动结束
        let timeout
        const checkScrollEnd = () => {
          timeout = setTimeout(() => {
            if (Math.abs(window.scrollY - scrollTop) < 2) {
              resolve(true)
            } else {
              checkScrollEnd()
            }
          }, 100)
        }

        checkScrollEnd()

        // 3秒后无论如何都resolve
        setTimeout(() => {
          clearTimeout(timeout)
          resolve(true)
        }, 3000)
      })
    })
  })
}

// 节流函数，限制函数调用频率
export function throttle(func, limit) {
  let inThrottle
  let lastFunc
  let lastRan

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      lastRan = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(
        () => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan)
      )
    }
  }
}
