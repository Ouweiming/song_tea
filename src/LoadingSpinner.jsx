import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

import { useTheme } from './theme-provider'

const LoadingSpinner = ({ size = 40, color }) => {
  const { theme } = useTheme()

  // 根据主题自动选择颜色（如果没有传入自定义颜色）
  const spinnerColor = color || (theme === 'dark' ? '#10b981' : '#059669')
  const secondaryColor = theme === 'dark' ? '#064e3b' : '#d1fae5'

  // 茶叶飘动动画
  const leafAnimation = {
    y: [0, -5, 0],
    rotate: [0, 10, 0],
    scale: [1, 1.05, 1],
  }

  // 茶叶飘动时间控制
  const leafTransition = {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }

  // 圆环旋转动画
  const circleTransition = {
    rotate: 360,
    transition: {
      repeat: Infinity,
      ease: 'linear',
      duration: 1.5,
    },
  }

  return (
    <div
      className='relative flex items-center justify-center p-4'
      aria-live='polite'
    >
      {/* 背景圆环 */}
      <motion.div
        className='absolute rounded-full'
        style={{
          width: size * 1.2,
          height: size * 1.2,
          border: `${size / 16}px solid ${secondaryColor}`,
          opacity: 0.5,
        }}
        initial={{ opacity: 0.2 }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 旋转圆环 */}
      <motion.div
        className='absolute rounded-full'
        style={{
          width: size,
          height: size,
          borderWidth: size / 10,
          borderColor: `${spinnerColor} transparent`,
          borderStyle: 'solid',
          borderRadius: '50%',
        }}
        animate={circleTransition}
      />

      {/* 茶叶SVG */}
      <motion.svg
        width={size * 0.5}
        height={size * 0.5}
        viewBox='0 0 24 24'
        fill='none'
        animate={leafAnimation}
        transition={leafTransition}
      >
        <motion.path
          d='M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z'
          fill={secondaryColor}
        />
        <motion.path
          d='M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z'
          fill={spinnerColor}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d='M12 8V12L15 15'
          stroke={secondaryColor}
          strokeWidth='2'
          strokeLinecap='round'
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.svg>

      <span className='sr-only'>正在加载,请稍候...</span>
    </div>
  )
}

// 添加 PropTypes 验证
LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
}

export default LoadingSpinner
