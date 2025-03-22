import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { forwardRef, useEffect, useRef, useState } from 'react'

import placeholderImg from '../assets/placeholder.jpg'

/**
 * 优化的图片组件，支持：
 * - 懒加载
 * - 渐进式加载
 * - 响应式图片尺寸
 * - 加载失败回退
 */
const OptimizedImage = forwardRef(
  (
    {
      src,
      alt,
      className = '',
      width,
      height,
      sizes = '100vw',
      priority = false,
      placeholder = placeholderImg,
      loading = 'lazy',
      objectFit = 'cover',
      motionProps = {},
      onLoad,
      onError,
      ...props
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const imgRef = useRef(null)

    // 直接使用导入的图片模块，无需转换路径
    const [imgSrc, setImgSrc] = useState(priority ? src : src)

    // 处理图片加载逻辑
    useEffect(() => {
      if (!priority && imgRef.current) {
        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // 当图片进入视口时，使用RAF设置图片源，减少布局抖动
                requestAnimationFrame(() => {
                  setImgSrc(src)
                })
                observer.disconnect()
              }
            })
          },
          { rootMargin: '200px' } // 提前200px开始加载
        )

        observer.observe(imgRef.current)
        return () => observer.disconnect()
      }
      return undefined
    }, [src, priority])

    // 简化的srcSet生成 - 暂时禁用，使用导入的图片
    const generateSrcSet = () => {
      // 如果使用导入的图片模块，不需要生成srcSet
      return ''
    }

    const handleLoad = e => {
      setIsLoaded(true)
      if (onLoad) onLoad(e)
    }

    const handleError = e => {
      console.error(`图片加载错误: ${src}`, e)
      setHasError(true)
      if (onError) onError(e)
    }

    // 使用motion.img支持动画效果，同时转发ref
    return (
      <motion.img
        ref={node => {
          // 同时处理内部ref和外部传入的ref
          imgRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        src={hasError ? placeholder : imgSrc}
        srcSet={!hasError && isLoaded ? generateSrcSet() : ''}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        style={{
          objectFit,
          ...(!isLoaded && { filter: 'blur(10px)' }),
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...motionProps}
        {...props}
      />
    )
  }
)

// 添加显示名称
OptimizedImage.displayName = 'OptimizedImage'

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sizes: PropTypes.string,
  priority: PropTypes.bool,
  placeholder: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  objectFit: PropTypes.string,
  motionProps: PropTypes.object,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
}

export default OptimizedImage
