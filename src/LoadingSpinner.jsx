import PropTypes from 'prop-types'
import { memo, useEffect, useMemo, useState } from 'react'
import { RingLoader } from 'react-spinners'

// 引入PacmanLoader组件

import { useTheme } from './useTheme'

// 自定义比较函数，提高memo效率
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size && prevProps.color === nextProps.color
  )
}

// 使用memo优化渲染性能
const LoadingSpinner = memo(({ size = 25, color }) => {
  const { theme } = useTheme()
  const [mounting, setMounting] = useState(true)

  // 使用useMemo缓存计算值，避免重复计算
  const spinnerStyles = useMemo(() => {
    // 根据主题选择默认颜色
    const defaultColor = theme === 'dark' ? '#10b981' : '#059669'
    const spinnerColor = color || defaultColor
    const backgroundColor =
      theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)'

    return { spinnerColor, backgroundColor }
  }, [theme, color])

  // 避免SSR水合不匹配问题
  useEffect(() => {
    setMounting(false)
  }, [])

  if (mounting) return null

  return (
    <div
      className='fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full'
      style={{
        backgroundColor: spinnerStyles.backgroundColor,
      }}
    >
      <RingLoader
        color={spinnerStyles.spinnerColor}
        loading={true}
        size={size}
        aria-label='加载中'
        speedMultiplier={1.2} // 稍微提高速度使加载感觉更快
      />
      <span className='sr-only'>正在加载，请稍候...</span>
    </div>
  )
}, areEqual)

// 添加显示名称和PropTypes验证
LoadingSpinner.displayName = 'LoadingSpinner'
LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
}

export default LoadingSpinner
