import Product1 from '../assets/goods1.jpg'
import Product2 from '../assets/goods2.jpg'
import Product3 from '../assets/goods3.jpg'
import Product4 from '../assets/goods4.jpg'
import Product5 from '../assets/goods5.jpg'

// 统一管理产品数据，避免多处重复定义
export const products = [
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

// 获取所有产品分类
export const getAllCategories = () => {
  return ['all', ...new Set(products.map(p => p.category))]
}

// 根据分类筛选产品
export const filterProductsByCategory = category => {
  return category === 'all'
    ? products
    : products.filter(p => p.category === category)
}

// 获取精选产品（用于茶故事页面）
export const getFeaturedProducts = (count = 4) => {
  return products.slice(0, count)
}
