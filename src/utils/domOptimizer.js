/**
 * DOM操作优化工具
 * 用于分离DOM读取和写入操作，避免强制回流
 */

// 跟踪待处理的DOM操作
let pendingReads = []
let pendingWrites = []
let frameRequested = false

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
 * 调度读取操作
 * @param {Function} fn 读取操作函数
 */
export const scheduleRead = fn => {
  pendingReads.push(fn)
  requestRender()
  return Promise.resolve()
}

/**
 * 调度写入操作
 * @param {Function} fn 写入操作函数
 */
export const scheduleWrite = fn => {
  pendingWrites.push(fn)
  requestRender()
  return Promise.resolve()
}

// 导出其他函数，但指向性能工具中统一的实现
export { batchDomOperations, debounce, throttle } from './performanceUtils'
