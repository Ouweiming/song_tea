/**
 * 统一的React Router配置
 * 这个文件集中管理所有React Router的future标志，以确保一致性
 */

// 导出统一的future标志配置
export const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
  v7_normalizeFormMethod: true,
}

// 导出统一的basename配置
export const routerBasename = '/'
