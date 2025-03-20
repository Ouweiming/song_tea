import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'

import placeholderImg from '../assets/placeholder.jpg'

/**
 * 优化的图片组件，支持：
 * - 懒加载
 * - 渐进式加载
 * - 响应式图片尺寸
 * - 加载失败回退
 */
const OptimizedImage = ({
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
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef(null)
  // 修改默认图片源为原始图片，不再默认使用占位图
  const [imgSrc, setImgSrc] = useState(priority ? src : src)

  // 处理图片加载逻辑
  useEffect(() => {
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // 直接加载原始图片，不使用生成的路径
              setImgSrc(src)
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

  // 修改 srcSet 生成函数 - 暂时禁用以确保基本功能正常
  const generateSrcSet = () => {
    // 暂时返回空字符串，使用原始图片
    return ''

    /* 
    // 保留原代码注释，当优化图片系统准备好时可以取消注释
    // 提取文件扩展名
    const extension = src.split('.').pop()
    const basePath = src.substring(0, src.lastIndexOf('.'))

    // 为不同尺寸生成图片地址
    const sizes = [320, 640, 960, 1280, 1920]
    const srcSet = sizes.map(size => {
      // 如果是构建后的资源，尝试使用宽度后缀约定
      return `${basePath}-${size}w.${extension} ${size}w`
    })

    return srcSet.join(', ')
    */
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

  // 使用motion.img支持动画效果
  return (
    <motion.img
      ref={imgRef}
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
