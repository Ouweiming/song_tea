import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { FiFilter } from 'react-icons/fi'

import ProductCard from './components/ProductCard'
import SectionTitle from './components/SectionTitle'
import { filterProductsByCategory, getAllCategories } from './data/products'
import { useTheme } from './useTheme'
import { throttle } from './utils/domUtils'

const ShoppingCartList = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const { theme } = useTheme()

  // 使用统一的数据管理函数
  const categories = getAllCategories()
  const filteredProducts = filterProductsByCategory(activeCategory)

  const listRef = useRef(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 })

  // 仅当滚动到可视区域时才渲染，减少DOM元素数量
  useEffect(() => {
    if (filteredProducts.length > 20) {
      const updateVisibleItems = throttle(() => {
        if (!listRef.current) return

        // 使用requestAnimationFrame批量读取DOM，避免强制回流
        requestAnimationFrame(() => {
          const containerRect = listRef.current.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const scrollY = window.scrollY

          // 计算新的可见范围
          if (containerRect.top < viewportHeight && containerRect.bottom > 0) {
            // 存储计算所需的所有值
            const topOffset = containerRect.top
            const itemHeight = 280 // 这个值应根据实际项目高度调整

            // 基于缓存的值计算可见范围
            const visibleStart = Math.max(
              0,
              Math.floor((scrollY - topOffset) / itemHeight)
            )
            const visibleEnd = Math.min(
              filteredProducts.length,
              Math.ceil((scrollY + viewportHeight - topOffset) / itemHeight) + 5
            )

            // 一次性设置状态更新
            setVisibleRange({ start: visibleStart, end: visibleEnd })
          }
        })
      }, 200)

      window.addEventListener('scroll', updateVisibleItems, { passive: true })
      updateVisibleItems()

      return () => window.removeEventListener('scroll', updateVisibleItems)
    }
  }, [filteredProducts.length])

  // 渲染可见项目
  const visibleProducts =
    filteredProducts.length > 20
      ? filteredProducts.slice(visibleRange.start, visibleRange.end)
      : filteredProducts

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
          transition={{ duration: 0.5 }}
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
              onClick={() => setActiveCategory(category)}
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
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard
                product={product}
                variant='full'
                delay={index}
                theme={theme}
              />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <motion.p
            className='py-10 text-center text-gray-500 dark:text-gray-400'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            该分类下暂无产品
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default ShoppingCartList
