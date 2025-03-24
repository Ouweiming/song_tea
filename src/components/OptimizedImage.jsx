import PropTypes from 'prop-types'
import { forwardRef } from 'react'

/**
 * 优化的图片组件，提供多格式支持和懒加载
 * 自动使用最佳格式 (AVIF > WebP > JPEG/PNG)
 *
 * 使用方法:
 * <OptimizedImage
 *   src="/path/to/image.jpg"
 *   avifSrc="/path/to/image.avif"  // 可选，未提供时会基于原始src自动生成路径
 *   webpSrc="/path/to/image.webp"  // 可选，未提供时会基于原始src自动生成路径
 *   alt="图片描述"
 *   className="your-classes"
 * />
 */
const OptimizedImage = forwardRef(
  (
    {
      src,
      avifSrc,
      webpSrc,
      alt,
      className = '',
      width,
      height,
      loading = 'lazy',
      sizes = '100vw',
      style = {},
      onLoad,
      onClick,
      ...props
    },
    ref
  ) => {
    // 获取实际的图片URL（处理Vite的资源导入对象）
    const getActualSrc = imgSrc => {
      // 如果是对象且有src属性（Vite导入的图片），返回src
      if (imgSrc && typeof imgSrc === 'object' && imgSrc.src) {
        return imgSrc.src
      }
      // 否则返回原值
      return imgSrc
    }

    // 获取原始图片的实际URL
    const actualSrc = getActualSrc(src)

    // 如果提供了avifSrc或webpSrc，使用它们；否则基于原始路径生成
    const getImagePath = (originalPath, format) => {
      if (format === 'avif' && avifSrc) return getActualSrc(avifSrc)
      if (format === 'webp' && webpSrc) return getActualSrc(webpSrc)

      // 处理已经有扩展名的情况
      const basePath = originalPath.replace(/\.(jpe?g|png|gif|webp|avif)$/i, '')
      return `${basePath}.${format}`
    }

    // 计算avif和webp路径
    const avifPath = getImagePath(actualSrc, 'avif')
    const webpPath = getImagePath(actualSrc, 'webp')

    return (
      <picture>
        <source srcSet={avifPath} type='image/avif' />
        <source srcSet={webpPath} type='image/webp' />
        <img
          ref={ref}
          src={actualSrc}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={loading}
          sizes={sizes}
          style={style}
          onLoad={onLoad}
          onClick={onClick}
          {...props}
        />
      </picture>
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  avifSrc: PropTypes.string,
  webpSrc: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.oneOf(['lazy', 'eager', 'auto']),
  sizes: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
  onClick: PropTypes.func,
}

export default OptimizedImage
