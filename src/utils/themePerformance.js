/**
 * Utilities to prevent layout thrashing and optimize animation frames
 * when handling theme changes
 */

// Track pending DOM operations
let pendingReads = []
let pendingWrites = []
let frameRequested = false

/**
 * Schedule DOM reads to avoid interleaving with writes
 * @param {Function} readFn Function that reads from DOM
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
 * Schedule DOM writes to avoid forced reflows
 * @param {Function} writeFn Function that writes to DOM
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
 * Request a render frame if not already requested
 */
const requestRender = () => {
  if (frameRequested) return

  frameRequested = true
  requestAnimationFrame(processFrame)
}

/**
 * Process all queued operations in proper sequence
 */
const processFrame = () => {
  // Process reads first
  const reads = pendingReads
  pendingReads = []

  // Then process writes
  const writes = pendingWrites
  pendingWrites = []

  frameRequested = false

  // Execute operations
  reads.forEach(read => read())
  writes.forEach(write => write())

  // Schedule another frame if needed
  if (pendingReads.length || pendingWrites.length) {
    requestRender()
  }
}

/**
 * Update theme properties efficiently
 * @param {Object} themeChanges Object with CSS variables to update
 */
export const applyThemeChanges = themeChanges => {
  return scheduleWrite(() => {
    Object.entries(themeChanges).forEach(([prop, value]) => {
      document.documentElement.style.setProperty(prop, value)
    })
  })
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} fn Function to throttle
 * @param {number} limit Minimum time between calls in ms
 * @returns {Function} Throttled function
 */
export const throttle = (fn, limit = 16) => {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      return fn.apply(this, args)
    }
  }
}
