/**
 * DOM操作优化工具
 * 用于分离DOM读取和写入操作，避免强制回流
 */

// 跟踪待处理的DOM操作
let pendingReads = []
let pendingWrites = []
let frameRequested = false

/**
 * 调度DOM读取操作，避免与写入操作交错
 * @param {Function} readFn 读取DOM的函数
 * @returns {Promise}
 */
export const scheduleRead = readFn => {
  return new Promise(resolve => {
    pendingReads.push(() => {
      const result = readFn()
      resolve(result)
    })
    requestRender()
  })
}

/**
 * 调度DOM写入操作，避免强制回流
 * @param {Function} writeFn 写入DOM的函数
 * @returns {Promise}
 */
export const scheduleWrite = writeFn => {
  return new Promise(resolve => {
    pendingWrites.push(() => {
      writeFn()
      resolve()
    })
    requestRender()
  })
}

/**
 * 请求渲染帧(如果尚未请求)
 */
const requestRender = () => {
  if (frameRequested) return

  frameRequested = true
  requestAnimationFrame(processFrame)
}

/**
 * 处理所有排队的操作
 */
const processFrame = () => {
  // 先处理读取操作
  const reads = pendingReads
  pendingReads = []

  // 然后处理写入操作
  const writes = pendingWrites
  pendingWrites = []

  frameRequested = false

  // 执行操作
  reads.forEach(read => read())
  writes.forEach(write => write())

  // 如果需要，继续调度下一帧
  if (pendingReads.length || pendingWrites.length) {
    requestRender()
  }
}

/**
 * 更高效的节流函数
 * @param {Function} fn 要节流的函数
 * @param {number} wait 等待时间(毫秒)
 * @returns {Function} 节流后的函数
 */
export const betterThrottle = (fn, wait = 100) => {
  let lastCall = 0
  let timeout = null
  let lastArgs = null
  let lastThis = null

  const later = () => {
    lastCall = Date.now()
    timeout = null
    fn.apply(lastThis, lastArgs)
  }

  return function (...args) {
    const now = Date.now()
    const remaining = wait - (now - lastCall)

    lastArgs = args
    lastThis = this

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      lastCall = now
      fn.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
  }
}
