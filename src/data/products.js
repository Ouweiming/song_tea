import Product1Avif from '../assets/goods1.avif'
import Product1 from '../assets/goods1.jpg'
import Product1Webp from '../assets/goods1.webp'
import Product2Avif from '../assets/goods2.avif'
import Product2 from '../assets/goods2.jpg'
import Product2Webp from '../assets/goods2.webp'
import Product3Avif from '../assets/goods3.avif'
import Product3 from '../assets/goods3.jpg'
import Product3Webp from '../assets/goods3.webp'
import Product4Avif from '../assets/goods4.avif'
import Product4 from '../assets/goods4.jpg'
import Product4Webp from '../assets/goods4.webp'
import Product5Avif from '../assets/goods5.avif'
import Product5 from '../assets/goods5.jpg'
import Product5Webp from '../assets/goods5.webp'

// 统一管理产品数据，避免多处重复定义
export const products = [
  {
    id: 1,
    image: Product1,
    avifImage: Product1Avif,
    webpImage: Product1Webp,
    name: '宋茶·墨玉',
    description: '采自高山云雾中的茶叶，滋味醇厚回甘',
    category: '绿茶',
  },
  {
    id: 2,
    image: Product2,
    avifImage: Product2Avif,
    webpImage: Product2Webp,
    name: '宋茶·碧螺春',
    description: '香气清新持久，滋味鲜爽回甘',
    category: '绿茶',
  },
  {
    id: 3,
    image: Product3,
    avifImage: Product3Avif,
    webpImage: Product3Webp,
    name: '宋茶·红韵',
    description: '色泽红亮，香气高扬，滋味醇厚',
    category: '红茶',
  },
  {
    id: 4,
    image: Product4,
    avifImage: Product4Avif,
    webpImage: Product4Webp,
    name: '宋茶·白露',
    description: '口感清淡甘醇，回甘持久',
    category: '白茶',
  },
  {
    id: 5,
    image: Product5,
    avifImage: Product5Avif,
    webpImage: Product5Webp,
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
