import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiFilter } from 'react-icons/fi'

import ProductCard from './components/ProductCard'
import SectionTitle from './components/SectionTitle'
import { filterProductsByCategory, getAllCategories } from './data/products'

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

// 优化的分类按钮组，减少DOM元素数量
const CategoryButtonGroup = memo(({ categories, activeCategory, onClick }) => (
  <div className='flex flex-wrap items-center justify-center gap-3'>
    {categories.map(category => (
      <CategoryButton
        key={category}
        category={category}
        isActive={activeCategory === category}
        onClick={onClick}
      />
    ))}
  </div>
))

CategoryButtonGroup.propTypes = {
  categories: PropTypes.array.isRequired,
  activeCategory: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

CategoryButtonGroup.displayName = 'CategoryButtonGroup'

// 虚拟化列表组件，只渲染可见部分
const VirtualizedProductList = memo(({ products }) => {
  const [visibleItems, setVisibleItems] = useState([])
  const containerRef = useRef(null)
  const observerRef = useRef(null)
  const itemsRendered = useRef(new Set()).current

  // 初始只渲染前6个产品（或更少）
  useEffect(() => {
    const initialItems = products.slice(0, Math.min(6, products.length))
    setVisibleItems(initialItems)
    itemsRendered.clear()
    initialItems.forEach(item => itemsRendered.add(item.id))
  }, [products, itemsRendered])

  // 设置交叉观察器来实现按需渲染
  useEffect(() => {
    if (containerRef.current) {
      // 清理旧的观察器
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      const handleIntersection = entries => {
        if (
          entries[0].isIntersecting &&
          visibleItems.length < products.length
        ) {
          // 当容器可见且还有更多产品时，增加渲染的产品数量
          const nextBatch = products
            .filter(item => !itemsRendered.has(item.id))
            .slice(0, 3)
          if (nextBatch.length > 0) {
            nextBatch.forEach(item => itemsRendered.add(item.id))
            setVisibleItems(prev => [...prev, ...nextBatch])
          }
        }
      }

      observerRef.current = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '100px', // 预加载区域
        threshold: 0.1,
      })

      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [products, visibleItems, itemsRendered])

  return (
    <div
      ref={containerRef}
      className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'
    >
      {visibleItems.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          variant='full'
          delay={Math.min(index, 5) * 0.1}
        />
      ))}

      {/* 加载指示器，只在还有更多产品时显示 */}
      {visibleItems.length < products.length && (
        <div className='col-span-full flex justify-center py-4'>
          <span className='text-emerald-600 dark:text-emerald-400'>
            加载更多产品...
          </span>
        </div>
      )}
    </div>
  )
})

VirtualizedProductList.propTypes = {
  products: PropTypes.array.isRequired,
}

VirtualizedProductList.displayName = 'VirtualizedProductList'

// 主商品列表组件
const ShoppingCartList = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  // 使用useMemo缓存分类和筛选结果
  const categories = useMemo(() => getAllCategories(), [])
  const filteredProducts = useMemo(
    () => filterProductsByCategory(activeCategory),
    [activeCategory]
  )

  // 优化分类点击处理函数
  const handleCategoryClick = useCallback(
    category => {
      if (category === activeCategory) return

      setActiveCategory(category)

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

        {/* 优化的分类筛选 - 合并为单个动画容器 */}
        <motion.div
          className='mb-10'
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <div className='mb-4 flex items-center justify-center'>
            <FilterIndicator />
          </div>

          <CategoryButtonGroup
            categories={categories}
            activeCategory={activeCategory}
            onClick={handleCategoryClick}
          />
        </motion.div>

        {/* 使用虚拟列表代替直接渲染所有产品 */}
        {filteredProducts.length > 0 ? (
          <VirtualizedProductList products={filteredProducts} />
        ) : (
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
