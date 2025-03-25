import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiFilter } from 'react-icons/fi'

import ProductCard from './components/ProductCard'
import SectionTitle from './components/SectionTitle'
import { filterProductsByCategory, getAllCategories } from './data/products'
import { createVirtualizedRenderer, throttle } from './utils/performanceUtils'

// 使用memo优化重复列表项渲染
const CategoryButton = memo(({ category, isActive, onClick }) => (
  <button
    onClick={() => onClick(category)}
    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
        : 'bg-white text-gray-700 hover:bg-emerald-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
    }`}
    aria-pressed={isActive}
  >
    {category === 'all' ? '全部' : category}
  </button>
))

// 添加缺失的PropTypes验证
CategoryButton.propTypes = {
  category: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

CategoryButton.displayName = 'CategoryButton'

// 使用memo优化筛选器显示
const FilterIndicator = memo(() => (
  <div className='flex items-center rounded-full bg-white px-4 py-2 shadow-md dark:bg-gray-800'>
    <FiFilter className='mr-2 text-emerald-600 dark:text-emerald-400' />
    <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
      筛选：
    </span>
  </div>
))

FilterIndicator.displayName = 'FilterIndicator'

// 主商品列表组件
const ShoppingCartList = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const initialRenderDone = useRef(false)

  // 使用useMemo缓存分类和筛选结果
  const categories = useMemo(() => getAllCategories(), [])
  const filteredProducts = useMemo(
    () => filterProductsByCategory(activeCategory),
    [activeCategory]
  )

  const listRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })
  const previousRangeRef = useRef({ start: 0, end: 20 })

  // 是否需要虚拟滚动
  const needsVirtualScroll = useMemo(
    () => filteredProducts.length > 12, // 降低虚拟滚动阈值，提高性能
    [filteredProducts.length]
  )

  // 创建虚拟化渲染器，使用更大的itemHeight以减少重排
  const virtualizer = useMemo(
    () => createVirtualizedRenderer({ itemHeight: 300, overscan: 3 }),
    []
  )

  // 优化可见项目更新逻辑
  const updateVisibleItems = useCallback(() => {
    if (!listRef.current || !needsVirtualScroll) return

    const range = virtualizer.getVisibleRange(filteredProducts.length, listRef)
    const prev = previousRangeRef.current

    // 只在范围有足够变化时更新状态，避免微小变化触发更新
    if (
      Math.abs(prev.start - range.start) >= 2 ||
      Math.abs(prev.end - range.end) >= 2
    ) {
      previousRangeRef.current = range
      setVisibleRange(range)
    }
  }, [filteredProducts.length, needsVirtualScroll, virtualizer])

  // 优化滚动监听
  useEffect(() => {
    if (!needsVirtualScroll) return

    // 使用更长的节流间隔
    const throttledUpdate = throttle(updateVisibleItems, 150)

    window.addEventListener('scroll', throttledUpdate, { passive: true })
    window.addEventListener('resize', throttledUpdate, { passive: true })

    // 初始计算
    if (!initialRenderDone.current) {
      requestAnimationFrame(() => {
        updateVisibleItems()
        initialRenderDone.current = true
      })
    }

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      window.removeEventListener('resize', throttledUpdate)
    }
  }, [updateVisibleItems, needsVirtualScroll])

  // 优化渲染可见项目逻辑
  const visibleProducts = useMemo(
    () =>
      needsVirtualScroll
        ? filteredProducts.slice(visibleRange.start, visibleRange.end)
        : filteredProducts,
    [filteredProducts, visibleRange.start, visibleRange.end, needsVirtualScroll]
  )

  // 优化分类点击处理函数
  const handleCategoryClick = useCallback(
    category => {
      if (category === activeCategory) return

      setActiveCategory(category)
      // 重置可见范围
      previousRangeRef.current = { start: 0, end: 20 }
      setVisibleRange({ start: 0, end: 20 })

      // 平滑滚动到产品区域顶部
      const productsEl = document.getElementById('products')
      if (productsEl) {
        productsEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    },
    [activeCategory]
  )

  // 计算占位高度，保持滚动条的稳定
  const placeholderHeight = useMemo(() => {
    if (!needsVirtualScroll) return 0
    // 使用固定高度计算，避免高度不一致引起跳动
    return Math.max(0, filteredProducts.length - visibleProducts.length) * 300
  }, [filteredProducts.length, visibleProducts.length, needsVirtualScroll])

  // 计算可见产品索引
  const getVisibleIndex = useCallback(
    index => visibleRange.start + index,
    [visibleRange.start]
  )

  // 简化的动画配置，减少重绘
  const fadeInAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  }

  return (
    <section id='products' className='bg-gray-50 py-16 dark:bg-gray-900/30'>
      <div className='container mx-auto px-4'>
        {/* 使用通用标题组件 */}
        <SectionTitle
          title='匠心茗茶'
          subtitle='每一款宋茶，都凝聚着后花园村茶农的心血与工艺，带给您纯正自然的口感体验。'
          withBackground
        />

        {/* 分类筛选 */}
        <motion.div
          className='mb-10 flex flex-wrap items-center justify-center gap-3'
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <FilterIndicator />

          {categories.map(category => (
            <CategoryButton
              key={category}
              category={category}
              isActive={activeCategory === category}
              onClick={handleCategoryClick}
            />
          ))}
        </motion.div>

        {/* 产品网格 - 使用CSS containment优化渲染 */}
        <div
          className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'
          ref={listRef}
          style={{
            contain: 'content',
            minHeight: needsVirtualScroll ? '500px' : 'auto',
          }}
        >
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={`${product.id}-${getVisibleIndex(index)}`}
              product={product}
              variant='full'
              delay={Math.min(index, 5) * 0.1} // 最多延迟5个产品的动画
              index={getVisibleIndex(index)}
            />
          ))}

          {/* 占位元素，保持滚动条稳定 */}
          {placeholderHeight > 0 && (
            <div
              style={{
                height: placeholderHeight,
                gridColumn: '1 / -1',
                contain: 'strict',
              }}
              aria-hidden='true'
            />
          )}
        </div>

        {filteredProducts.length === 0 && (
          <motion.p
            className='py-10 text-center text-gray-500 dark:text-gray-400'
            {...fadeInAnimation}
          >
            该分类下暂无产品
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default ShoppingCartList
