/**
 * Worker管理器
 * 用于在应用中便捷地使用Web Workers
 */

// 任务计数器和任务映射
let taskIdCounter = 0
const tasks = new Map()

// 存储已创建的workers
const workers = {}

/**
 * 创建或获取指定类型的Worker
 * @param {string} type Worker类型
 * @returns {Worker} Worker实例
 */
export function getWorker(type = 'compute') {
  if (workers[type]) {
    return workers[type]
  }

  try {
    let workerUrl

    switch (type) {
      case 'compute':
        workerUrl = new URL('../workers/computeWorker.js', import.meta.url)
        break
      // 可以添加更多类型的Worker
      default:
        throw new Error(`未知的Worker类型: ${type}`)
    }

    const worker = new Worker(workerUrl, { type: 'module' })

    // 设置消息处理
    worker.onmessage = function (e) {
      // 处理Worker就绪消息
      if (e.data.type === 'ready') {
        console.log(`${type} Worker已就绪`)
        return
      }

      // 处理任务完成消息
      const { id, result, error } = e.data
      const task = tasks.get(id)

      if (task) {
        if (error) {
          task.reject(new Error(error))
        } else {
          task.resolve(result)
        }

        tasks.delete(id)
      }
    }

    // 处理错误
    worker.onerror = function (error) {
      console.error(`${type} Worker错误:`, error)

      // 通知所有等待中的任务
      tasks.forEach(task => {
        task.reject(new Error('Worker执行错误'))
      })
      tasks.clear()
    }

    workers[type] = worker
    return worker
  } catch (e) {
    console.error(`创建 ${type} Worker失败:`, e)
    return null
  }
}

/**
 * 在Worker中执行任务
 * @param {string} type Worker类型
 * @param {string} task 任务名称
 * @param {any} data 要处理的数据
 * @param {object} options 任务选项
 * @returns {Promise<any>} 任务结果
 */
export function runTask(type, task, data, options = {}) {
  const worker = getWorker(type)

  if (!worker) {
    return Promise.reject(new Error('Worker不可用'))
  }

  return new Promise((resolve, reject) => {
    const id = taskIdCounter++

    tasks.set(id, { resolve, reject })
    worker.postMessage({ id, task, data, options })
  })
}

/**
 * 终止并清理所有Workers
 */
export function terminateAllWorkers() {
  Object.entries(workers).forEach(([type, worker]) => {
    console.log(`终止 ${type} Worker`)
    worker.terminate()
    delete workers[type]
  })

  // 清理所有未完成的任务
  tasks.forEach(task => {
    task.reject(new Error('Worker已终止'))
  })
  tasks.clear()
}

/**
 * 在页面卸载时自动清理Workers
 */
if (typeof window !== 'undefined') {
  window.addEventListener('unload', terminateAllWorkers)
}

export default {
  getWorker,
  runTask,
  terminateAllWorkers,
}
