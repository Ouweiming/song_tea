/**
 * 计算密集型任务的Web Worker
 * 用于在后台执行可能阻塞主线程的计算
 */

// 图像处理函数
function processImage(imageData, options = {}) {
  const { width, height, data } = imageData
  const { contrast = 0, brightness = 0, saturation = 0 } = options

  // 创建新的像素数据
  const newData = new Uint8ClampedArray(data.length)

  // 处理每个像素
  for (let i = 0; i < data.length; i += 4) {
    // 应用亮度
    let r = data[i] + brightness
    let g = data[i + 1] + brightness
    let b = data[i + 2] + brightness

    // 应用对比度
    if (contrast !== 0) {
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))
      r = factor * (r - 128) + 128
      g = factor * (g - 128) + 128
      b = factor * (b - 128) + 128
    }

    // 应用饱和度
    if (saturation !== 0) {
      const gray = 0.2989 * r + 0.587 * g + 0.114 * b
      r = gray + saturation * (r - gray)
      g = gray + saturation * (g - gray)
      b = gray + saturation * (b - gray)
    }

    // 限制在0-255范围内
    newData[i] = Math.max(0, Math.min(255, r))
    newData[i + 1] = Math.max(0, Math.min(255, g))
    newData[i + 2] = Math.max(0, Math.min(255, b))
    newData[i + 3] = data[i + 3] // 保持透明度不变
  }

  return { width, height, data: newData }
}

// 大型数据处理
function processBigData(data, options = {}) {
  const { operation = 'sum', chunk = 1000 } = options
  let result

  switch (operation) {
    case 'sum':
      result = data.reduce((sum, value) => sum + value, 0)
      break
    case 'average':
      result = data.reduce((sum, value) => sum + value, 0) / data.length
      break
    case 'max':
      result = Math.max(...data)
      break
    case 'min':
      result = Math.min(...data)
      break
    case 'filter':
      // 模拟一个耗时的筛选操作
      result = []
      for (let i = 0; i < data.length; i += chunk) {
        const chunkData = data.slice(i, i + chunk)
        // 假设这里有复杂的筛选逻辑
        result.push(...chunkData.filter(item => item % 2 === 0))
      }
      break
    default:
      result = data
  }

  return result
}

// 监听主线程消息
self.onmessage = function (e) {
  const { id, task, data, options } = e.data

  try {
    let result

    switch (task) {
      case 'processImage':
        result = processImage(data, options)
        break
      case 'processBigData':
        result = processBigData(data, options)
        break
      default:
        throw new Error(`Unknown task: ${task}`)
    }

    // 返回结果给主线程
    self.postMessage({ id, result, error: null })
  } catch (error) {
    // 返回错误给主线程
    self.postMessage({ id, result: null, error: error.message })
  }
}

// 通知主线程worker已就绪
self.postMessage({ type: 'ready' })
