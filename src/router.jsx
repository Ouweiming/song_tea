import { Suspense, lazy, useEffect, useState } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import LoadingSpinner from './LoadingSpinner'
import { routerBasename, routerFutureConfig } from './router-config'

// 确保全局 future 标志设置
if (typeof window !== 'undefined') {
  window.__reactRouterFutureFlags = {
    ...(window.__reactRouterFutureFlags || {}),
    ...routerFutureConfig,
  }
}

// 预加载关键组件
const HomePage = lazy(() => import('./Homepage'))

// 主动预加载其他页面组件
const preloadComponents = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // 静默预加载，但不阻塞主线程
      import('./Homepage')
    })
  }
}

// 创建优化版的router配置
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path='/'
        element={<HomePage />}
        // 添加数据预加载选项减少等待
        loader={() => {
          // 标记为低优先级预加载
          return Promise.resolve({})
        }}
      />
      <Route path='/Homepage' element={<HomePage />} />
    </>
  ),
  {
    // 使用统一的future标志配置
    future: {
      ...routerFutureConfig,
      // 启用额外的优化选项
      v7_normalizeFormMethod: true,
    },
    // 使用统一的basename
    basename: routerBasename,
  }
)

// 优化RouterProvider组件
const Router = () => {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // 组件挂载后预加载其他页面
  useEffect(() => {
    preloadComponents()

    // 初始加载完成后标记
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner size={isInitialLoad ? 60 : 40} />}>
      <RouterProvider
        router={router}
        // 使用更快速的回退UI
        fallbackElement={<LoadingSpinner size={40} />}
      />
    </Suspense>
  )
}

export default Router
