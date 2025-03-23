/**
 * 节流函数 - 限制函数在一定时间内只能执行一次
 * @param {Function} func 要执行的函数
 * @param {number} limit 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export const throttle = (func, limit = 200) => {
  let inThrottle
  return function (...args) {
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * 防抖函数 - 延迟执行函数，如果在延迟时间内再次调用则重新计时
 * @param {Function} func 要执行的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay = 300) => {
  let timerId
  return function (...args) {
    const context = this
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

/**
 * 优化主题切换 - 使用 requestAnimationFrame 在下一帧应用变更
 * @param {Function} themeChangeFunc 主题切换函数
 * @returns {Function} 优化后的主题切换函数
 */
export const optimizedThemeToggle = themeChangeFunc => {
  return function (...args) {
    requestAnimationFrame(() => {
      themeChangeFunc.apply(this, args)
    })
  }
}
