import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'

import Photowall from './Photowall'
import village1Avif from './assets/village1.avif'
import village1 from './assets/village1.jpg'
import village1Webp from './assets/village1.webp'
import village2Avif from './assets/village2.avif'
import village2 from './assets/village2.jpg'
import village2Webp from './assets/village2.webp'
import AnimatedImage from './components/AnimatedImage'
import OptimizedImage from './components/OptimizedImage'
import SectionTitle from './components/SectionTitle'
import { useTheme } from './useTheme'
import { detectDeviceCapabilities } from './utils/performanceUtils'

// 封装动画配置为纯对象，避免重渲染时重新创建
const ANIMATION_PRESETS = {
  none: {
    initial: {},
    whileInView: {},
    viewport: { once: true },
  },
  default: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, ease: 'easeOut' },
  },
  card: {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const TeaStorySection = () => {
  useTheme()
  const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false)

  // 使用回调优化设备性能检测 - 增加安全访问和默认值
  const checkDevicePerformance = useCallback(() => {
    try {
      // 安全访问capabilities属性，提供默认值避免undefined错误
      const capabilities = detectDeviceCapabilities() || {
        isLowEndDevice: false,
        isReducedMotion: false,
        shouldOptimizeAnimations: false,
      }

      // 使用逻辑OR确保即使属性未定义也不会出错
      return Boolean(
        capabilities.isLowEndDevice || capabilities.isReducedMotion
      )
    } catch (error) {
      console.warn('设备性能检测失败:', error)
      // 发生错误时返回默认值false
      return false
    }
  }, [])

  // 减少useEffect依赖，避免重新计算
  useEffect(() => {
    // 添加try-catch以确保即使发生错误也不会使组件崩溃
    try {
      setIsLowPerformanceDevice(checkDevicePerformance())
    } catch (error) {
      console.error('性能设置错误:', error)
      setIsLowPerformanceDevice(false)
    }
  }, [checkDevicePerformance])

  // 根据设备性能选择动画配置，使用缓存避免重复创建
  const sectionAnimation = useMemo(
    () =>
      isLowPerformanceDevice
        ? ANIMATION_PRESETS.none
        : ANIMATION_PRESETS.default,
    [isLowPerformanceDevice]
  )

  // 同样缓存卡片动画配置
  const cardAnimation = useMemo(
    () =>
      isLowPerformanceDevice ? ANIMATION_PRESETS.none : ANIMATION_PRESETS.card,
    [isLowPerformanceDevice]
  )

  return (
    <section id='tea-story' className='py-16 overflow-hidden md:py-24'>
      <SectionTitle
        title='宋茶的世界'
        subtitle='探索千年茶文化，体验自然与工艺的完美融合'
        withBackground
        className='mb-16'
      />
      <div className='container px-4 mx-auto md:px-6'>
        <motion.section
          className='mb-24'
          {...sectionAnimation}
          // 添加will-change属性优化GPU提前准备渲染
          style={{ willChange: 'opacity, transform' }}
        >
          {/* 内容保持不变 */}
          <div className='grid items-center gap-12 md:grid-cols-2'>
            <div className='order-2 prose max-w-none md:order-1'>
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
            <div className='order-1 overflow-hidden shadow-xl rounded-2xl dark:shadow-emerald-900/10 md:order-2'>
              <div className='overflow-hidden bg-gray-100 h-72 dark:bg-gray-800 md:h-80 lg:h-96'>
                <AnimatedImage
                  src={village1}
                  avifSrc={village1Avif}
                  webpSrc={village1Webp}
                  alt='古代茶文化'
                  isLowPerformance={isLowPerformanceDevice}
                  scale={1.03}
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* 其余部分保持类似优化，添加will-change和重用动画配置 */}
        <motion.section
          className='mb-24'
          {...sectionAnimation}
          style={{ willChange: 'opacity, transform' }}
        >
          {/* ... 后花园宋茶的故事部分保持不变 ... */}
          <div className='grid items-center gap-12 md:grid-cols-2'>
            <div className='overflow-hidden shadow-xl rounded-2xl dark:shadow-emerald-900/10'>
              <div className='overflow-hidden bg-gray-100 h-72 dark:bg-gray-800 md:h-80 lg:h-96'>
                <motion.div
                  className='w-full h-full'
                  whileHover={isLowPerformanceDevice ? {} : { scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  style={{ willChange: 'transform' }}
                >
                  <OptimizedImage
                    src={village2}
                    avifSrc={village2Avif}
                    webpSrc={village2Webp}
                    alt='后花园村茶园'
                    className='object-cover w-full h-full'
                    sizes='(max-width: 768px) 100vw, 50vw'
                  />
                </motion.div>
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

        <motion.section
          className='mb-24'
          {...sectionAnimation}
          style={{ willChange: 'opacity, transform' }}
        >
          {/* 制茶工艺部分 */}
          <SectionTitle
            title='传统与现代的融合：制茶工艺'
            withDecoration
            className='mb-10'
          />
          <div className='grid gap-6 md:grid-cols-3'>
            {/* 优化卡片渲染，减少动画属性计算 */}
            {[
              {
                icon: (
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
                ),
                title: '采摘',
                desc: '遵循一芽一叶或一芽二叶的采摘标准，只在清晨采摘，保留茶叶最佳鲜度和营养成分。',
              },
              {
                icon: (
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
                ),
                title: '萎凋与杀青',
                desc: '采用传统手工结合现代技术，控制温度与湿度，确保茶叶内含物质的转化达到最佳状态。',
              },
              {
                icon: (
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
                ),
                title: '发酵与烘焙',
                desc: '根据不同茶类采用不同发酵工艺，烘焙过程精确控温，保留茶叶独特风味与香气。',
              },
            ].map((card, index) => (
              <motion.div
                key={`card-${index}`}
                whileHover={isLowPerformanceDevice ? {} : { y: -5 }}
                transition={{ duration: 0.25 }}
                className='p-8 border border-gray-200 shadow-lg rounded-xl bg-white/90 dark:border-gray-700 dark:bg-gray-800/90'
                {...cardAnimation}
                style={{
                  willChange: isLowPerformanceDevice
                    ? 'auto'
                    : 'transform, opacity',
                  transform: 'translateZ(0)',
                }}
              >
                <div className='inline-flex items-center justify-center mb-4 rounded-full h-14 w-14 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'>
                  {card.icon}
                </div>
                <h4 className='mb-4 font-serif text-xl font-semibold text-emerald-800 dark:text-emerald-300 md:text-2xl'>
                  {card.title}
                </h4>
                <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-200'>
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className='mb-24'
          {...sectionAnimation}
          style={{ willChange: 'opacity, transform' }}
        >
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
