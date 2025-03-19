import { motion } from 'framer-motion'
import { useState } from 'react'
import { FiFilter } from 'react-icons/fi'

import ShoppingCart from './ShoppingCart'
import Product1 from './assets/goods1.jpg'
import Product2 from './assets/goods2.jpg'
import Product3 from './assets/goods3.jpg'
import Product4 from './assets/goods4.jpg'
import Product5 from './assets/goods5.jpg'

const ShoppingCartList = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  // 修改产品数据，移除details字段
  const products = [
    {
      id: 1,
      image: Product1,
      name: '宋茶·墨玉',
      description: '采自高山云雾中的茶叶，滋味醇厚回甘',
      category: '绿茶',
    },
    {
      id: 2,
      image: Product2,
      name: '宋茶·碧螺春',
      description: '香气清新持久，滋味鲜爽回甘',
      category: '绿茶',
    },
    {
      id: 3,
      image: Product3,
      name: '宋茶·红韵',
      description: '色泽红亮，香气高扬，滋味醇厚',
      category: '红茶',
    },
    {
      id: 4,
      image: Product4,
      name: '宋茶·白露',
      description: '口感清淡甘醇，回甘持久',
      category: '白茶',
    },
    {
      id: 5,
      image: Product5,
      name: '宋茶·岩韵',
      description: '香气清幽持久，滋味甘醇',
      category: '乌龙茶',
    },
  ]

  // 提取所有分类
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // 根据分类过滤产品
  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

  return (
    <section id='products' className='bg-gray-50 py-16 dark:bg-gray-900/30'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='mb-12 text-center'
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='mb-4 text-4xl font-bold text-emerald-600 dark:text-emerald-400'>
            匠心茗茶
          </h2>
          <p className='mx-auto max-w-2xl text-gray-600 dark:text-gray-300'>
            每一款宋茶，都凝聚着后花园村茶农的心血与工艺，带给您纯正自然的口感体验。
          </p>
        </motion.div>

        {/* 分类筛选 - 修复按钮标签结构 */}
        <div className='mb-10 flex flex-wrap items-center justify-center gap-3'>
          <FiFilter className='mr-2 text-emerald-600' />
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>

        {/* 产品网格 */}
        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ShoppingCart product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className='py-10 text-center text-gray-500 dark:text-gray-400'>
            该分类下暂无产品
          </p>
        )}
      </div>
    </section>
  )
}

export default ShoppingCartList