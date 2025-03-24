import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiFilter } from 'react-icons/fi'

import ProductCard from './components/ProductCard'
import SectionTitle from './components/SectionTitle'
import { filterProductsByCategory, getAllCategories } from './data/products'
import { throttle } from './utils/domUtils'

const ShoppingCartList = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  // 使用useMemo缓存分类和筛选结果，避免不必要的重新计算
  const categories = useMemo(() => getAllCategories(), [])
  const filteredProducts = useMemo(
    () => filterProductsByCategory(activeCategory),
    [activeCategory]
  )

  const listRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  // 是否需要虚拟滚动
  const needsVirtualScroll = useMemo(
    () => filteredProducts.length > 20,
    [filteredProducts.length]
  )

  // 优化虚拟滚动逻辑，减少主线程负担
  const updateVisibleItems = useCallback(() => {
    if (!listRef.current || !needsVirtualScroll) return

    // 使用更高效的读写分离和性能优化
    requestAnimationFrame(() => {
      // 批量读取DOM信息 - 避免强制回流
      const containerRect = listRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY
      const itemHeight = 280 // 使用固定高度避免实时计算

      // 只有当容器在视口中才计算可见区域
      if (
        containerRect.bottom < 0 ||
        containerRect.top > viewportHeight + 500
      ) {
        return // 完全不在视口，跳过计算
      }

      // 计算可见项目的范围
      const topOffset = Math.max(0, containerRect.top)
      const buffer = 3 // 缓冲项数量

      const start = Math.max(
        0,
        Math.floor((scrollY + topOffset - containerRect.top) / itemHeight) -
          buffer
      )

      const end = Math.min(
        filteredProducts.length,
        Math.ceil((scrollY + viewportHeight - containerRect.top) / itemHeight) +
          buffer
      )

      // 只有当范围变化时才更新状态
      requestAnimationFrame(() => {
        setVisibleRange(prev => {
          if (prev.start === start && prev.end === end) {
            return prev // 避免不必要的状态更新
          }
          return { start, end }
        })
      })
    })
  }, [filteredProducts.length, needsVirtualScroll])

  // 使用性能管理器优化节流函数
  useEffect(() => {
    if (!needsVirtualScroll) return

    const throttledUpdate = throttle(updateVisibleItems, 100)

    // 使用passive标志提高滚动性能
    window.addEventListener('scroll', throttledUpdate, { passive: true })
    window.addEventListener('resize', throttledUpdate, { passive: true })

    // 初始计算
    updateVisibleItems()

    return () => {
      window.removeEventListener('scroll', throttledUpdate)
      window.removeEventListener('resize', throttledUpdate)
    }
  }, [updateVisibleItems, needsVirtualScroll])

  // 渲染可见项目
  const visibleProducts = useMemo(
    () =>
      needsVirtualScroll
        ? filteredProducts.slice(visibleRange.start, visibleRange.end)
        : filteredProducts,
    [filteredProducts, visibleRange.start, visibleRange.end, needsVirtualScroll]
  )

  // 点击筛选按钮的处理函数
  const handleCategoryClick = useCallback(
    category => {
      if (category === activeCategory) return // 如果点击当前分类，不做任何处理

      setActiveCategory(category)
      // 重置可见范围并滚动到顶部
      setVisibleRange({ start: 0, end: 20 })
      // 滚动到产品区域顶部
      document
        .getElementById('products')
        ?.scrollIntoView({ behavior: 'smooth' })
    },
    [activeCategory]
  )

  // 计算占位高度，保持滚动条的稳定
  const placeholderHeight = useMemo(() => {
    if (!needsVirtualScroll) return 0
    return Math.max(0, filteredProducts.length - visibleProducts.length) * 280
  }, [filteredProducts.length, visibleProducts.length, needsVirtualScroll])

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
          <div className='flex items-center rounded-full bg-white px-4 py-2 shadow-md dark:bg-gray-800'>
            <FiFilter className='mr-2 text-emerald-600 dark:text-emerald-400' />
            <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              筛选：
            </span>
          </div>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </motion.div>

        {/* 产品网格 */}
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3' ref={listRef}>
          {visibleProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='full'
              delay={index}
            />
          ))}

          {/* 占位元素，保持滚动条稳定 */}
          {placeholderHeight > 0 && (
            <div
              style={{ height: placeholderHeight, gridColumn: '1 / -1' }}
              aria-hidden='true'
            />
          )}
        </div>

        {filteredProducts.length === 0 && (
          <motion.p
            className='py-10 text-center text-gray-500 dark:text-gray-400'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            该分类下暂无产品
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default ShoppingCartList
