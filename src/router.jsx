import { Suspense, lazy } from 'react'
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

// 懒加载组件
const Home = lazy(() => import('./Homepage'))
const Introduction = lazy(() => import('./Introduction'))

// 创建router配置，使用统一的配置文件
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Home />} />
      <Route path='/Homepage' element={<Home />} />
      <Route path='/Introduction' element={<Introduction />} />
    </>
  ),
  {
    // 使用统一的future标志配置
    future: routerFutureConfig,
    // 使用统一的basename
    basename: routerBasename,
  }
)

// 确保RouterProvider独立使用
const Router = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router
