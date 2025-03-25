/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy, useEffect, useState } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import LoadingSpinner from './LoadingSpinner'
import { routerConfig } from './router-config'

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
        loader={() => Promise.resolve({})}
      />
      <Route path='/Homepage' element={<HomePage />} />
    </>
  ),
  {
    // 使用统一的配置
    future: routerConfig.future,
    basename: routerConfig.basename,
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
        fallbackElement={<LoadingSpinner size={40} />}
      />
    </Suspense>
  )
}

export default Router
