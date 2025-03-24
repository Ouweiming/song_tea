import { motion, useAnimation } from 'framer-motion'
import { memo, useEffect, useMemo, useState } from 'react'
// 明确导入React
import { useInView } from 'react-intersection-observer'

// 添加throttle函数导入
import { throttle } from './utils/domUtils'

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

// 使用memo优化组件
const Heart = memo(() => {
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

  // 使用useMemo缓存节流函数
  const throttledResizeHandler = useMemo(() => {
    return throttle(() => {
      // 避免在回调内调用setState，使用函数式更新
      setSize(calculateSize())
    }, 200)
  }, [])

  // 优化ResizeObserver使用
  useEffect(() => {
    if ('ResizeObserver' in window) {
      // 初始化大小
      setSize(calculateSize())

      // 创建ResizeObserver
      const resizeObserver = new ResizeObserver(() => {
        // 使用requestAnimationFrame确保在下一帧渲染前更新
        requestAnimationFrame(throttledResizeHandler)
      })

      // 只观察根元素
      resizeObserver.observe(document.documentElement)

      return () => resizeObserver.disconnect()
    } else {
      // 回退方案
      const resizeHandler = () => {
        requestAnimationFrame(throttledResizeHandler)
      }

      window.addEventListener('resize', resizeHandler)
      setSize(calculateSize())

      return () => {
        window.removeEventListener('resize', resizeHandler)
      }
    }
  }, [throttledResizeHandler])

  return (
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
          contain: 'strict', // 优化渲染
          contentVisibility: 'auto',
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
})

Heart.displayName = 'Heart'
export default Heart
