import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'

const AnimatedBlock = ({ delay = 0, direction = 'left', content }) => {
  // 创建ref用于监听
  const ref = useRef(null)
  // 使用 useInView 钩子代替手动的 IntersectionObserver，减少自定义逻辑
  const [inViewRef, inView] = useInView({
    triggerOnce: true, // 只触发一次动画，减少无谓的重复计算
    threshold: 0.1, // 当元素 10% 进入视口时触发
    rootMargin: '-50px 0px', // 提前 50px 触发
  })

  // 使用函数式ref合并两个ref
  const setRefs = node => {
    ref.current = node
    inViewRef(node)
  }

  // 预计算动画属性，而不是在渲染时动态计算
  const xInitial = direction === 'left' ? -30 : 30
  const xEnd = 0

  // 定义animationConfig，避免函数组件内部生成新对象
  const animationConfig = {
    initial: { opacity: 0, x: xInitial, scale: 0.9 },
    animate: inView
      ? {
          opacity: 1,
          x: xEnd,
          scale: 1.05,
        }
      : {
          opacity: 0,
          x: xInitial,
          scale: 0.9,
        },
    transition: {
      duration: 0.6,
      delay,
      ease: 'easeOut',
    },
    whileHover: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 50,
      },
    },
  }

  return (
    <div ref={setRefs} className='flex w-full items-center justify-center py-8'>
      <motion.div
        {...animationConfig}
        className='flex w-full max-w-xs flex-col items-center justify-center rounded-lg bg-white bg-opacity-90 p-4 shadow-lg dark:bg-gray-300 sm:max-w-sm sm:flex-row sm:p-6 md:max-w-md md:p-8 lg:max-w-lg xl:max-w-xl 2xl:max-w-5xl'
      >
        <div className='flex flex-col items-center justify-center overflow-hidden'>
          <h2 className='mb-4 overflow-ellipsis whitespace-nowrap text-start text-xl font-bold text-emerald-500 dark:text-teal-600 sm:text-2xl md:text-3xl'>
            {content.title}
          </h2>
          <p className='overflow-auto text-center text-lg leading-relaxed text-emerald-800 dark:text-emerald-900 sm:text-xl md:text-2xl'>
            {content.paragraph}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

AnimatedBlock.propTypes = {
  delay: PropTypes.number,
  direction: PropTypes.string,
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    paragraph: PropTypes.string.isRequired,
  }).isRequired,
}

const Block = () => {
  const content1 = {
    title: '产品类型：',
    paragraph:
      '主打产品系列（玉兰香、芝兰香、翠玉香、密兰香，不同香型的"宋茶单丛"）衍生产品系列（茶宠盲盒、IP周边原创）',
  }

  const content2 = {
    title: '特色介绍：',
    paragraph:
      '在茶叶生产中，我们致力于让茶叶自然地生长，打造一款品质纯净、健康，安全的有机生态茶叶。在产品推出中，针对用户的不同需求，后花园宋茶推出不同包装规格与包装类型，为用户提供多样化的选择。',
  }

  const content3 = {
    title: '文化价值：',
    paragraph:
      '后花园宋茶的文化价值体现在其药用价值及丰富的历史文化内涵。它不仅与宋朝逃亡故事紧密相关，还因其独特的生长环境和稀有性成为珍贵文化遗产。宋茶的传说增添了其神秘色彩，使其成为不仅具有治疗功效，也承载深厚文化历史价值的符号。',
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-12 bg-inherit p-4 py-24 dark:bg-inherit'>
      <h1 className='mb-4 text-xl font-bold text-emerald-800 dark:text-teal-500 sm:mb-6 sm:text-2xl md:mb-8 md:text-3xl lg:text-4xl xl:text-5xl'>
        茶叶产品：
        <span className='text-green-600 dark:text-emerald-400'>
          岛屿记忆-后花园宋茶
        </span>
      </h1>
      <AnimatedBlock delay={0.1} direction='left' content={content1} />
      <AnimatedBlock delay={0.2} direction='right' content={content2} />
      <AnimatedBlock delay={0.3} direction='left' content={content3} />
    </div>
  )
}

export default Block
