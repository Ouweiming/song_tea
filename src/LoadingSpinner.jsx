import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const spinTransition = {
  repeat: Infinity,
  ease: 'linear',
  duration: 1,
}

const LoadingSpinner = ({ size = 40, color = '#10b981' }) => {
  return (
    <div className='flex items-center justify-center'>
      <motion.span
        className='block rounded-full'
        style={{
          width: size,
          height: size,
          borderWidth: size / 8,
          borderColor: `${color} transparent ${color} transparent`,
          borderStyle: 'solid',
        }}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      <span className='sr-only'>加载中...</span>
    </div>
  )
}

// 添加 PropTypes 验证
LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
}

// 使用 React.memo 优化性能
export default LoadingSpinner
