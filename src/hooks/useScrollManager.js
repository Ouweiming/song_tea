import { useEffect, useState } from 'react'

// 创建单例滚动管理器
const callbacks = {}
let lastScrollY = 0
let ticking = false
let initialized = false
let lastCallbackTime = 0
const THROTTLE_DELAY = 100 // 从16ms增加到100ms

// 注册全局滚动事件（仅一次）
if (typeof window !== 'undefined' && !initialized) {
  lastScrollY = window.scrollY

  window.addEventListener(
    'scroll',
    () => {
      lastScrollY = window.scrollY

      if (!ticking) {
        // 使用requestAnimationFrame批处理所有回调
        requestAnimationFrame(() => {
          const now = Date.now()
          // 只有当上次回调执行后经过足够时间时才执行
          if (now - lastCallbackTime >= THROTTLE_DELAY) {
            // 调用所有注册的回调
            Object.values(callbacks).forEach(callback => {
              if (typeof callback === 'function') {
                callback(lastScrollY)
              }
            })
            lastCallbackTime = now
          }
          ticking = false
        })
        ticking = true
      }
    },
    { passive: true }
  )

  initialized = true
}

// 提供注册回调的方法
export const subscribe = (id, callback) => {
  callbacks[id] = callback
  return () => {
    delete callbacks[id]
  }
}

// React Hook
export const useScrollManager = (id, callback) => {
  const [scrollY, setScrollY] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY : 0
  )

  useEffect(() => {
    if (typeof callback === 'function') {
      callbacks[id] = currentScrollY => {
        setScrollY(currentScrollY)
        callback(currentScrollY)
      }
    } else {
      callbacks[id] = setScrollY
    }

    return () => {
      delete callbacks[id]
    }
  }, [id, callback])

  return scrollY
}
