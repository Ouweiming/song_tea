/**
 * 简化版DOM工具，不依赖全局状态
 * 这个文件提供了基本的DOM读写分离功能，避免强制回流
 */

/**
 * 安全地读取DOM属性
 * @param {Function} readFn 读取DOM的函数
 * @returns {Promise<any>} 读取结果
 */
export const safeRead = readFn => {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      resolve(readFn())
    })
  })
}

/**
 * 安全地写入DOM
 * @param {Function} writeFn 写入DOM的函数
 * @returns {Promise<void>}
 */
export const safeWrite = writeFn => {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      writeFn()
      resolve()
    })
  })
}

/**
 * 批量处理DOM操作，先读后写
 * @param {Object} operations 包含read和write函数的对象
 * @returns {Promise<any>} 处理结果
 */
export const batchDomOps = operations => {
  const { read, write } = operations

  return new Promise(resolve => {
    requestAnimationFrame(() => {
      // 读取阶段
      const data = read ? read() : null

      // 写入阶段
      requestAnimationFrame(() => {
        if (write) {
          write(data)
        }
        resolve(data)
      })
    })
  })
}

/**
 * 节流函数，限制函数调用频率
 * @param {Function} fn 要节流的函数
 * @param {number} wait 等待时间(毫秒)
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, wait = 200) => {
  let lastCall = 0

  return function (...args) {
    const now = Date.now()
    if (now - lastCall < wait) return

    lastCall = now
    return fn.apply(this, args)
  }
}
