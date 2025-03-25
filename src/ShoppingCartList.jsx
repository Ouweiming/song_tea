import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { memo, useCallback, useMemo, useState } from 'react'
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
  <div className='flex items-center px-4 py-2 bg-white rounded-full shadow-md dark:bg-gray-800'>
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
    <section id='products' className='py-16 bg-gray-50 dark:bg-gray-900/30'>
      <div className='container px-4 mx-auto'>
        {/* 使用通用标题组件 */}
        <SectionTitle
          title='匠心茗茶'
          subtitle='每一款宋茶，都凝聚着后花园村茶农的心血与工艺，带给您纯正自然的口感体验。'
          withBackground
        />

        {/* 分类筛选 */}
        <motion.div
          className='flex flex-wrap items-center justify-center gap-3 mb-10'
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
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant='full'
              delay={Math.min(index, 5) * 0.1} // 最多延迟5个产品的动画
              index={index}
            />
          ))}
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
