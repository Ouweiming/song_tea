import { motion } from 'framer-motion'
import { useCallback } from 'react'

import { useTheme } from './theme-provider'

const TeaStorySection = () => {
  const { theme } = useTheme()

  // 区块动画配置
  const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.8 },
  }

  // 卡片动画配置
  const cardAnimation = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.5 },
  }

  // 添加滚动到产品展示区的处理函数
  const scrollToProducts = useCallback(() => {
    const productsSection = document.getElementById('products')
    if (productsSection) {
      // 获取导航栏高度，避免导航栏遮挡内容
      const headerHeight =
        document.querySelector('[ref="headerRef"]')?.offsetHeight || 80
      const elementPosition =
        productsSection.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  return (
    <section id='tea-story' className='overflow-hidden py-20'>
      {/* 茶品故事标题 */}
      <motion.div
        className='mb-16 text-center'
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='mb-4 text-4xl font-bold text-emerald-700 dark:text-emerald-300'>
          宋茶的世界
        </h2>
        <p className='mx-auto max-w-3xl text-lg font-medium text-gray-700 dark:text-gray-200'>
          探索千年茶文化，体验自然与工艺的完美融合
        </p>
      </motion.div>

      <div className='container mx-auto px-6'>
        {/* 茶的起源与文化 */}
        <motion.section className='mb-20' {...sectionAnimation}>
          <div className='grid items-center gap-8 md:grid-cols-2'>
            <div className='prose order-2 max-w-none text-gray-800 dark:text-gray-200 md:order-1'>
              <h3 className='mb-6 text-2xl font-bold text-emerald-700 dark:text-emerald-300'>
                茶的起源与文化
              </h3>
              <p className='text-base leading-relaxed'>
                茶，这种神奇的植物，在中国已有数千年的历史。相传神农尝百草时发现茶叶，从此茶便成为了中国人生活中不可或缺的一部分。唐代陆羽的《茶经》奠定了中国茶文化的基础，宋代时茶文化达到鼎盛，出现了斗茶、分茶等茶艺活动。
              </p>
              <p className='text-base leading-relaxed'>
                茶文化传递的不仅是一种饮品，更是一种生活哲学。&apos;茶道&lsquo;代表着和、敬、清、寂的精神境界，告诉人们如何在平凡中寻找美好，在忙碌中保持宁静。
              </p>
            </div>
            <div className='order-1 overflow-hidden rounded-lg shadow-xl dark:shadow-emerald-900/10 md:order-2'>
              <div className='h-72 overflow-hidden bg-gray-100 dark:bg-gray-800'>
                <motion.img
                  src='/src/assets/village1.jpg'
                  alt='古代茶文化'
                  className='h-full w-full object-cover'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* 后花园宋茶的故事 */}
        <motion.section className='mb-20' {...sectionAnimation}>
          <div className='grid items-center gap-8 md:grid-cols-2'>
            <div className='overflow-hidden rounded-lg shadow-xl dark:shadow-emerald-900/10'>
              <div className='h-72 overflow-hidden bg-gray-100 dark:bg-gray-800'>
                <motion.img
                  src='/src/assets/village2.jpg'
                  alt='后花园村茶园'
                  className='h-full w-full object-cover'
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            <div className='prose max-w-none text-gray-800 dark:text-gray-200'>
              <h3 className='mb-6 text-2xl font-bold text-emerald-700 dark:text-emerald-300'>
                后花园宋茶的故事
              </h3>
              <p className='text-base leading-relaxed'>
                后花园宋茶的故事始于南澳岛的绿色山脉。在果老山北侧，后花园村的茶农们世代守护着祖传的茶园和制茶工艺。这里的宋茶不仅是一种饮品，更是村民们的生活方式和精神寄托。
              </p>
              <p className='text-base leading-relaxed'>
                在海岛独特的微气候条件下，后花园宋茶形成了与众不同的特性——浓郁的香气中带有淡淡的海洋气息，滋味醇厚而回甘持久，让人回味无穷。
              </p>
            </div>
          </div>
        </motion.section>

        {/* 制茶工艺 */}
        <motion.section className='mb-20' {...sectionAnimation}>
          <h3 className='mb-8 text-center text-2xl font-bold text-emerald-700 dark:text-emerald-300'>
            传统与现代的融合：制茶工艺
          </h3>
          <div className='grid gap-6 md:grid-cols-3'>
            <motion.div
              className='rounded-lg border border-gray-100 bg-white/90 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800/80'
              {...cardAnimation}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className='mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-emerald-800 dark:border-gray-700 dark:text-emerald-300'>
                采摘
              </h4>
              <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
                遵循&apos;一芽一叶&apos;或&apos;一芽二叶&apos;的采摘标准，只在清晨采摘，保留茶叶最佳鲜度和营养成分。
              </p>
            </motion.div>
            <motion.div
              className='rounded-lg border border-gray-100 bg-white/90 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800/80'
              {...cardAnimation}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className='mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-emerald-800 dark:border-gray-700 dark:text-emerald-300'>
                萎凋与杀青
              </h4>
              <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
                采用传统手工结合现代技术，控制温度与湿度，确保茶叶内含物质的转化达到最佳状态。
              </p>
            </motion.div>
            <motion.div
              className='rounded-lg border border-gray-100 bg-white/90 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800/80'
              {...cardAnimation}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h4 className='mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-emerald-800 dark:border-gray-700 dark:text-emerald-300'>
                发酵与烘焙
              </h4>
              <p className='leading-relaxed text-gray-700 dark:text-gray-300'>
                根据不同茶类采用不同发酵工艺，烘焙过程精确控温，保留茶叶独特风味与香气。
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* 茶品系列 */}
        <motion.section {...sectionAnimation}>
          <h3 className='mb-8 text-center text-2xl font-bold text-emerald-700 dark:text-emerald-300'>
            精选宋茶
          </h3>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {[
              {
                img: '/src/assets/goods1.jpg',
                title: '宋茶·墨玉',
                desc: '高山云雾茶，滋味醇厚回甘',
              },
              {
                img: '/src/assets/goods2.jpg',
                title: '宋茶·碧螺春',
                desc: '香气清新持久，滋味鲜爽',
              },
              {
                img: '/src/assets/goods3.jpg',
                title: '宋茶·红韵',
                desc: '色泽红亮，香气高扬',
              },
              {
                img: '/src/assets/goods4.jpg',
                title: '宋茶·白露',
                desc: '口感清淡甘醇，回甘持久',
              },
            ].map((tea, index) => (
              <motion.div
                key={index}
                className='overflow-hidden rounded-lg border border-gray-100 bg-white/90 shadow-lg dark:border-gray-700 dark:bg-gray-800/80'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow:
                    theme === 'dark'
                      ? '0 20px 25px -5px rgba(16, 185, 129, 0.1)'
                      : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  transition: { duration: 0.3 },
                }}
              >
                <div className='h-48 overflow-hidden bg-gray-100 dark:bg-gray-700'>
                  <motion.img
                    src={tea.img}
                    alt={tea.title}
                    className='h-full w-full object-cover'
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className='p-4'>
                  <h4 className='text-lg font-bold text-emerald-700 dark:text-emerald-300'>
                    {tea.title}
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {tea.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className='mt-10 text-center'>
            <motion.button
              onClick={scrollToProducts} // 添加点击事件处理
              className='rounded-full bg-emerald-600 px-8 py-3 font-medium text-white shadow-md transition-colors duration-300 hover:bg-emerald-700 hover:shadow-lg dark:bg-emerald-700 dark:hover:bg-emerald-600'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              探索更多茶品
            </motion.button>
          </div>
        </motion.section>
      </div>
    </section>
  )
}

export default TeaStorySection
