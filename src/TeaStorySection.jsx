import { motion } from 'framer-motion'

import Photowall from './Photowall'
// 导入优化的图片组件
import village1 from './assets/village1.jpg'
import village2 from './assets/village2.jpg'
import OptimizedImage from './components/OptimizedImage'
import SectionTitle from './components/SectionTitle'
import { useTheme } from './useTheme'

const TeaStorySection = () => {
  useTheme()

  // 获取精选产品

  // 优化动画配置
  const sectionAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, ease: 'easeOut' },
  }

  // 卡片动画配置
  const cardAnimation = {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.5, ease: 'easeOut' },
  }

  // 滚动到产品区

  return (
    <section id='tea-story' className='overflow-hidden py-16 md:py-24'>
      {/* 使用通用标题组件 */}
      <SectionTitle
        title='宋茶的世界'
        subtitle='探索千年茶文化，体验自然与工艺的完美融合'
        withBackground
        className='mb-16'
      />
      <div className='container mx-auto px-4 md:px-6'>
        <motion.section className='mb-24' {...sectionAnimation}>
          <div className='grid items-center gap-12 md:grid-cols-2'>
            {/* 茶的起源与文化 */}
            <div className='prose order-2 max-w-none md:order-1'>
              <h3 className='mb-6 font-serif text-2xl font-semibold text-emerald-800 dark:text-emerald-300 md:text-3xl lg:text-4xl'>
                茶，这种神奇的植物，在中国已有数千年的历史
              </h3>
              <div className='mb-5 h-0.5 w-16 rounded bg-emerald-500/40'></div>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200 md:text-xl'>
                相传神农尝百草时发现茶叶，从此茶便成为了中国人生活中不可或缺的一部分。唐代陆羽的《茶经》奠定了中国茶文化的基础，宋代时茶文化达到鼎盛，出现了斗茶、分茶等茶艺活动。
              </p>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200 md:text-xl'>
                茶文化传递的不仅是一种饮品，更是一种生活哲学。茶道代表着和、敬、清、寂的精神境界，告诉人们如何在平凡中寻找美好，在忙碌中保持宁静。
              </p>
            </div>
            <div className='order-1 overflow-hidden rounded-2xl shadow-xl dark:shadow-emerald-900/10 md:order-2'>
              <div className='h-72 overflow-hidden bg-gray-100 dark:bg-gray-800 md:h-80 lg:h-96'>
                {/* 替换为优化的图片组件 */}
                <OptimizedImage
                  src={village1}
                  alt='古代茶文化'
                  className='h-full w-full object-cover'
                  motionProps={{
                    whileHover: { scale: 1.05 },
                    transition: { duration: 0.5 },
                  }}
                />
              </div>
            </div>
          </div>
        </motion.section>
        <motion.section className='mb-24' {...sectionAnimation}>
          {/* 后花园宋茶的故事 */}
          <div className='grid items-center gap-12 md:grid-cols-2'>
            <div className='overflow-hidden rounded-2xl shadow-xl dark:shadow-emerald-900/10'>
              <div className='h-72 overflow-hidden bg-gray-100 dark:bg-gray-800 md:h-80 lg:h-96'>
                {/* 替换为优化的图片组件 */}
                <OptimizedImage
                  src={village2}
                  alt='后花园村茶园'
                  className='h-full w-full object-cover'
                  motionProps={{
                    whileHover: { scale: 1.05 },
                    transition: { duration: 0.5 },
                  }}
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              </div>
            </div>
            <div className='prose max-w-none'>
              <h3 className='mb-6 font-serif text-2xl font-semibold text-emerald-800 dark:text-emerald-300 md:text-3xl lg:text-4xl'>
                后花园宋茶的故事
              </h3>
              <div className='mb-5 h-0.5 w-16 rounded bg-emerald-500/40'></div>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200 md:text-xl'>
                后花园宋茶的故事始于南澳岛的绿色山脉。在果老山北侧，后花园村的茶农们世代守护着祖传的茶园和制茶工艺。这里的宋茶不仅是一种饮品，更是村民们的生活方式和精神寄托。
              </p>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200 md:text-xl'>
                在海岛独特的微气候条件下，后花园宋茶形成了与众不同的特性——浓郁的香气中带有淡淡的海洋气息，滋味醇厚而回甘持久，让人回味无穷。
              </p>
            </div>
          </div>
        </motion.section>
        <motion.section className='mb-24' {...sectionAnimation}>
          {/* 制茶工艺 */}
          <SectionTitle
            title='传统与现代的融合：制茶工艺'
            withDecoration
            className='mb-10'
          />
          <div className='grid gap-6 md:grid-cols-3'>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='rounded-xl border border-gray-200 bg-white/90 p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/90'
              {...cardAnimation}
              style={{
                willChange: 'transform, box-shadow',
                transform: 'translateZ(0)', // 开启GPU加速，减少重排
              }}
            >
              <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' />
                </svg>
              </div>
              <h4 className='mb-4 font-serif text-xl font-semibold text-emerald-800 dark:text-emerald-300 md:text-2xl'>
                采摘
              </h4>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200'>
                遵循&quot;一芽一叶&quot;或&quot;一芽二叶&quot;的采摘标准，只在清晨采摘，保留茶叶最佳鲜度和营养成分。
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='rounded-xl border border-gray-100 bg-white/90 p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/80'
              {...cardAnimation}
              style={{
                willChange: 'transform, box-shadow',
                transform: 'translateZ(0)', // 开启GPU加速，减少重排
              }}
            >
              <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' />
                </svg>
              </div>
              <h4 className='mb-4 font-serif text-xl font-semibold text-emerald-800 dark:text-emerald-300 md:text-2xl'>
                萎凋与杀青
              </h4>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200'>
                采用传统手工结合现代技术，控制温度与湿度，确保茶叶内含物质的转化达到最佳状态。
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='rounded-xl border border-gray-100 bg-white/90 p-8 shadow-lg transition-all hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/80'
              {...cardAnimation}
              style={{
                willChange: 'transform, box-shadow',
                transform: 'translateZ(0)', // 开启GPU加速，减少重排
              }}
            >
              <div className='mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-7 w-7'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
              <h4 className='mb-4 font-serif text-xl font-semibold text-emerald-800 dark:text-emerald-300 md:text-2xl'>
                发酵与烘焙
              </h4>
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200'>
                根据不同茶类采用不同发酵工艺，烘焙过程精确控温，保留茶叶独特风味与香气。
              </p>
            </motion.div>
          </div>
        </motion.section>
        <motion.section className='mb-24' {...sectionAnimation}>
          {/* 照片墙 */}
          <SectionTitle
            title='茶乡映像'
            subtitle='茶园风光，记录南澳岛后花园的美丽与匠心'
            className='mb-10'
          />
          <Photowall />
        </motion.section>

      </div>
    </section>
  )
}

export default TeaStorySection
