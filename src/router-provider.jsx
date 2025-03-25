/* eslint-disable react-refresh/only-export-components */
import {
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  createMemoryRouter,
  createRoutesFromElements,
  useRouteError,
} from 'react-router-dom'

import { useLocation, useNavigate } from './router-config'

// 重新导出所有配置和钩子
export {
  UNSAFE_DataRouterContext,
  UNSAFE_DataRouterStateContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  createMemoryRouter,
  createRoutesFromElements,
  useLocation,
  useNavigate,
  useRouteError,
}

// 移除不必要的Children导入和导出
