import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { memo } from 'react'

import OptimizedImage from './OptimizedImage'

/**
 * 动画优化图片组件
 * 自动应用过渡动画和悬停效果，同时保持高性能
 */
const AnimatedImage = memo(
  ({
    src,
    avifSrc,
    webpSrc,
    alt,
    className = 'object-cover w-full h-full',
    scale = 1.05,
    isLowPerformance = false,
    ...props
  }) => {
    // 根据设备性能决定是否使用悬停动画
    const hoverAnimation = isLowPerformance ? {} : { scale: scale }

    // 优化GPU加速
    const motionStyles = {
      willChange: isLowPerformance ? 'auto' : 'transform',
      transform: 'translateZ(0)',
    }

    return (
      <motion.div
        className='h-full w-full'
        whileHover={hoverAnimation}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={motionStyles}
      >
        <OptimizedImage
          src={src}
          avifSrc={avifSrc}
          webpSrc={webpSrc}
          alt={alt}
          className={className}
          loading='lazy'
          decoding='async'
          {...props}
        />
      </motion.div>
    )
  }
)

// 添加组件名称，便于调试
AnimatedImage.displayName = 'AnimatedImage'

AnimatedImage.propTypes = {
  src: PropTypes.string.isRequired,
  avifSrc: PropTypes.string,
  webpSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  scale: PropTypes.number,
  isLowPerformance: PropTypes.bool,
}

export default AnimatedImage
