/* eslint-disable react-refresh/only-export-components */
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

import { routerFutureConfig } from './router-config'

// 全局应用future标志
if (typeof window !== 'undefined') {
  // 使用纯对象而不是扩展运算符以提高性能
  window.__reactRouterFutureFlags = Object.assign(
    {},
    window.__reactRouterFutureFlags || {},
    routerFutureConfig
  )
}

// 优化导出的hooks，避免重复检查
let isConfigApplied = false

// 确保future标志仅被应用一次
const ensureFutureFlags = () => {
  if (!isConfigApplied && typeof window !== 'undefined') {
    isConfigApplied = true
  }
}

// 导出修改后的hooks，确保它们使用相同的future标志
export function useNavigate() {
  ensureFutureFlags()
  return originalUseNavigate()
}

export function useLocation() {
  ensureFutureFlags()
  return originalUseLocation()
}

// 重新导出其他需要的API
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
