import { useEffect, useState } from 'react'

import useHeaderStore from '../stores/headerStore'

/**
 * 性能监控调试工具 - 仅在开发环境使用
 * 使用方法: 在需要监控的组件中导入并添加 <DebugTools />
 */
const DebugTools = () => {
  // 是否在开发环境
  const isDev = import.meta.env.DEV
  const [isVisible, setIsVisible] = useState(false)
  const activeSection = useHeaderStore(state => state.activeSection)
  const perfMetrics = useHeaderStore(state => state.perfMetrics)
  const resetPerfMetrics = useHeaderStore(state => state.resetPerfMetrics)

  // 每秒更新一次性能指标 - 所有hooks必须在条件语句之前调用
  useEffect(() => {
    // 只在开发环境运行更新逻辑
    if (isDev) {
      const timer = setInterval(() => {
        // 模拟重新渲染以获得最新数据
        setIsVisible(prev => prev)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isDev])

  // 切换显示/隐藏
  const toggleVisibility = () => setIsVisible(!isVisible)

  // 重置性能指标
  const handleReset = () => resetPerfMetrics()

  // 不在开发环境时返回null - 这个条件渲染放在所有hooks之后
  if (!isDev) return null

  return (
    <>
      {/* 固定按钮 */}
      <button
        onClick={toggleVisibility}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 9999,
          padding: '4px 8px',
          background: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isVisible ? '隐藏调试' : '显示调试'}
      </button>

      {/* 调试面板 */}
      {isVisible && (
        <div
          style={{
            position: 'fixed',
            bottom: '50px',
            right: '10px',
            zIndex: 9999,
            padding: '10px',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            borderRadius: '6px',
            maxWidth: '300px',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}
        >
          <div style={{ marginBottom: '8px' }}>
            <strong>当前活跃区域:</strong> {activeSection || 'none'}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>滚动事件:</strong> {perfMetrics.scrollEvents}
          </div>

          <div style={{ marginBottom: '8px' }}>
            <strong>状态更新:</strong> {perfMetrics.stateUpdates}
          </div>

          {perfMetrics.lastUpdate && (
            <div style={{ marginBottom: '8px' }}>
              <strong>最后更新:</strong>{' '}
              {new Date(perfMetrics.lastUpdate).toLocaleTimeString()}
            </div>
          )}

          <button
            onClick={handleReset}
            style={{
              marginTop: '8px',
              padding: '4px 8px',
              background: '#d33',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            重置计数器
          </button>
        </div>
      )}
    </>
  )
}

export default DebugTools
