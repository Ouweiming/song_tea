import { Tooltip } from '@nextui-org/react'
import PropTypes from 'prop-types'
import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'

import OptimizedImage from './OptimizedImage'

// 可复用的产品卡片组件，优化DOM结构
const ProductCard = ({ product, variant = 'full' }) => {
  // 简化组件结构，减少DOM嵌套
  return (
    <div
      className={`group overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-lg transition-all dark:border-gray-700 dark:bg-gray-800/90 ${
        variant === 'compact' ? 'h-full' : ''
      }`}
    >
      {/* 图片容器 - 保持必要的层级 */}
      <div
        className={`relative ${variant === 'compact' ? 'h-44' : 'h-56'} overflow-hidden bg-gray-100 dark:bg-gray-700`}
      >
        <OptimizedImage
          src={product.image}
          avifSrc={product.avifImage}
          webpSrc={product.webpImage}
          alt={product.name}
          className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
          sizes={
            variant === 'compact'
              ? '(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          }
          loading='lazy'
        />
        {/* 使用类名代替内联样式实现hover效果 */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
      </div>

      {/* 内容区域 - 简化结构 */}
      <div className='p-6'>
        <h4 className='mb-2 text-xl font-bold text-emerald-800 dark:text-emerald-300 md:text-2xl'>
          {product.name}
        </h4>
        <p className='mb-4 text-base text-gray-800 dark:text-gray-300 md:text-lg'>
          {product.description}
        </p>

        {/* 分类标签 - 保持精简 */}
        <span className='inline-block rounded-full bg-emerald-100 px-3 py-1 text-base font-medium text-emerald-800 dark:bg-emerald-800/50 dark:text-emerald-200'>
          {product.category}
        </span>
      </div>

      {/* 购买按钮 - 仅在full模式显示，优化嵌套 */}
      {variant === 'full' && (
        <div className='border-t border-gray-200 px-6 py-4 dark:border-gray-700'>
          <Tooltip
            content='暂时无法购买，即将上线'
            color='warning'
            placement='bottom'
          >
            <button
              disabled
              className='flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 text-base font-bold text-white opacity-70 transition-colors duration-200 dark:bg-emerald-600 dark:text-white md:text-lg'
              aria-label={`购买${product.name}，暂未上线`}
            >
              <FaShoppingCart className='mr-2' /> Taobao
              <span className='ml-2 rounded-full bg-yellow-500 px-2 py-1 text-xs text-white md:text-sm'>
                敬请期待
              </span>
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    avifImage: PropTypes.string, // 添加avifImage验证
    webpImage: PropTypes.string, // 添加webpImage验证
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  variant: PropTypes.oneOf(['full', 'compact', 'preview']),
  delay: PropTypes.number,
}

// 添加自定义比较函数，避免不必要的重新渲染
const areEqual = (prevProps, nextProps) => {
  // 只有在关键属性变化时才重新渲染
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.delay === nextProps.delay
  )
}

// 使用React.memo包装组件，避免不必要的重新渲染
export default React.memo(ProductCard, areEqual)
