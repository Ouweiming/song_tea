import PropTypes from 'prop-types'
import { memo, useEffect, useMemo, useState } from 'react'
import { RingLoader } from 'react-spinners'

// 移除不必要的注释

// 自定义比较函数，提高memo效率
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size && prevProps.color === nextProps.color
  )
}

// 检测系统颜色偏好
const getSystemPrefersDarkMode = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

// 使用memo优化渲染性能
const LoadingSpinner = memo(({ size = 25, color }) => {
  // 直接在组件挂载时确定一次性的主题，不使用动态的useTheme
  const [isDarkMode] = useState(() => {
    // 优先使用localStorage中保存的主题
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      // 其次检测系统主题偏好
      return getSystemPrefersDarkMode()
    }
    return false
  })

  const [mounting, setMounting] = useState(true)

  // 使用useMemo缓存计算值，避免重复计算
  const spinnerStyles = useMemo(() => {
    // 根据初始确定的主题选择颜色
    const defaultColor = isDarkMode ? '#10b981' : '#059669'
    const spinnerColor = color || defaultColor
    const backgroundColor = isDarkMode
      ? 'rgba(31, 41, 55, 0.8)'
      : 'rgba(255, 255, 255, 0.8)'

    return { spinnerColor, backgroundColor }
  }, [isDarkMode, color])

  // 避免SSR水合不匹配问题
  useEffect(() => {
    setMounting(false)
  }, [])

  if (mounting) return null

  return (
    <div
      className='fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center'
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
