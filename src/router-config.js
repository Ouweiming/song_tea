import { Children } from 'react'
import {
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  createMemoryRouter,
  createRoutesFromElements,
  useLocation as originalUseLocation,
  useNavigate as originalUseNavigate,
  useRouteError,
} from 'react-router-dom'

// 统一的Router配置
export const routerConfig = {
  // Future标志
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true,
  },
  // 基础路径
  basename: '/',
}

// 确保全局 future 标志设置
if (typeof window !== 'undefined') {
  window.__reactRouterFutureFlags = {
    ...(window.__reactRouterFutureFlags || {}),
    ...routerConfig.future,
  }
}

// 导出修改后的hooks的实现逻辑
let isConfigApplied = false

const ensureFutureFlags = () => {
  if (!isConfigApplied && typeof window !== 'undefined') {
    isConfigApplied = true
  }
}

export function useNavigate() {
  ensureFutureFlags()
  return originalUseNavigate()
}

export function useLocation() {
  ensureFutureFlags()
  return originalUseLocation()
}

// 重新导出需要的API
export {
  Children,
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  createMemoryRouter,
  createRoutesFromElements,
  useRouteError,
}
