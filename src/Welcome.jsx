import { motion, useAnimation } from 'framer-motion'
import { memo, useEffect, useState, useCallback } from 'react'
// 明确导入React
import { useInView } from 'react-intersection-observer'

// 创建叶子形状的变体
const teaLeafPath =
  'M12 21C7 17 2 13 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3 1 4.5 3C13.5 4 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 4.5-5 8.5-10 12.5z'

// 优化动画变体，使用非连续动画
const leafVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: index => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 10,
      delay: 0.1 + index * 0.05,
    },
  }),
  pulse: index => ({
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      delay: 0.5 + index * 0.2,
      repeat: Infinity,
      repeatDelay: 3,
    },
  }),
  paused: {
    scale: 1,
    opacity: 1,
  },
}

// 提前声明updateSize函数（在useEffect外部）
const calculateSize = () => {
  // 根据窗口宽度计算适当的尺寸
  if (window.innerWidth < 640) {
    return 70
  } else if (window.innerWidth < 768) {
    return 80
  } else if (window.innerWidth < 1024) {
    return 100
  } else {
    return 120
  }
}

// Welcome 组件 - 包含内联的Heart组件
const Welcome = memo(() => {
  // Heart 组件内联到 Welcome 组件中
  const [size, setSize] = useState(120) // 默认尺寸小一些
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: '100px', // 提前开始观察
  })
  const [shouldAnimate, setShouldAnimate] = useState(true)

  // 根据元素是否在视图中来控制动画
  useEffect(() => {
    if (inView) {
      // 先执行一次标准动画
      controls.start('visible').then(() => {
        // 只有允许动画的情况下才启动脉冲动画
        if (shouldAnimate) {
          controls.start('pulse')
        }
      })
    } else {
      controls.stop() // 停止动画以节省资源
    }

    return () => {
      controls.stop()
    }
  }, [controls, inView, shouldAnimate])

  // 减少CPU密集型动画
  useEffect(() => {
    // 检测设备性能
    const checkPerformance = () => {
      // 如果是移动设备，或者是低端设备，减少动画
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const isLowEndDevice =
        navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4

      if (isMobile || isLowEndDevice) {
        setShouldAnimate(false)
      }
    }

    checkPerformance()
  }, [])

  // 优化的resize处理函数
  const handleResize = useCallback(() => {
    // 从全局缓存变量获取尺寸，而不是在每次resize时重新计算
    setSize(calculateSize())
  }, [])

  // 优化ResizeObserver使用
  useEffect(() => {
    // 初始化大小
    setSize(calculateSize())

    if ('ResizeObserver' in window) {
      // 创建ResizeObserver，使用防抖处理
      let rafId = null
      const resizeObserver = new ResizeObserver(() => {
        // 取消之前的帧请求，实现防抖效果
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
        
        // 在下一帧更新大小
        rafId = requestAnimationFrame(handleResize)
      })

      // 只观察根元素
      resizeObserver.observe(document.documentElement)

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
        resizeObserver.disconnect()
      }
    } else {
      // 回退方案
      let rafId = null
      const resizeHandler = () => {
        // 取消之前的帧请求，实现防抖效果
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
        rafId = requestAnimationFrame(handleResize)
      }

      window.addEventListener('resize', resizeHandler, { passive: true })

      return () => {
        if (rafId) {
          cancelAnimationFrame(rafId)
        }
        window.removeEventListener('resize', resizeHandler)
      }
    }
  }, [handleResize])

  // 预定义动画配置，避免每次渲染时重新创建
  const backgroundAnimProps = {
    first: {
      animate: {
        scale: [1, 1.1],
        opacity: [0.2, 0.3],
      },
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
    second: {
      animate: {
        scale: [1, 1.1],
        opacity: [0.15, 0.25],
      },
      transition: {
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 1,
      },
    },
  }

  // 预定义文本动画配置
  const textAnimConfig = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.6 },
  }

  // 渲染Heart SVG的函数
  const renderHeartIcon = () => (
    <div className='flex items-center justify-center py-2' ref={ref}>
      <motion.svg
        width={size}
        height={size}
        viewBox='0 0 24 24'
        initial='hidden'
        animate={controls}
        className='drop-shadow-md filter'
        style={{
          willChange: 'transform, opacity',
        }}
        aria-hidden='true'
      >
        <defs>
          <linearGradient id='teaLeafGradient' x1='0%' y1='0%' x2='100%'>
            <stop offset='0%' stopColor='#4ade80' />
            <stop offset='100%' stopColor='#10b981' />
          </linearGradient>
        </defs>
        <motion.path
          fill='url(#teaLeafGradient)'
          d={teaLeafPath}
          custom={0} // 传递自定义索引
          variants={leafVariants}
          style={{ transformOrigin: 'center' }}
        />
      </motion.svg>
    </div>
  )

  return (
    <div className='relative w-full py-12 overflow-hidden md:py-16 lg:py-20'>
      {/* 背景装饰元素 - 使用预定义的动画配置 */}
      <motion.div
        className='absolute w-48 h-48 rounded-full -left-16 -top-16 bg-gradient-to-br from-emerald-500/5 to-teal-300/5 blur-2xl'
        animate={backgroundAnimProps.first.animate}
        transition={backgroundAnimProps.first.transition}
        aria-hidden='true'
      />

      <motion.div
        className='absolute w-48 h-48 rounded-full -bottom-32 -right-24 bg-gradient-to-tl from-teal-400/5 to-emerald-300/5 blur-2xl'
        animate={backgroundAnimProps.second.animate}
        transition={backgroundAnimProps.second.transition}
        aria-hidden='true'
      />

      <div className='relative max-w-4xl px-6 mx-auto text-center'>
        {/* 装饰元素与描述文本 */}
        <motion.div {...textAnimConfig} className='flex flex-col items-center'>
          {renderHeartIcon()}
        </motion.div>

        {/* 添加 text-center 类 */}
        <p className='max-w-xl mx-auto text-base font-medium leading-relaxed text-center text-gray-700 dark:text-gray-300 sm:max-w-2xl sm:text-lg md:text-xl'>
          传承千年茶韵，体验自然与传统的完美融合
        </p>
      </div>
    </div>
  )
})

// 添加displayName以便于调试
Welcome.displayName = 'Welcome'

// 只导出Welcome组件
export default Welcome