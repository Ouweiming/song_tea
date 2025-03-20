import { motion, useAnimation } from 'framer-motion'
import { memo, useEffect, useState } from 'react'
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

  // 使用防抖优化resize事件
  useEffect(() => {
    let resizeTimeout

    function handleResize() {
      // 清除之前的计时器
      clearTimeout(resizeTimeout)

      // 设置新的计时器，防抖处理
      resizeTimeout = setTimeout(() => {
        // 更加精细的响应式大小调整
        if (window.innerWidth < 640) {
          setSize(70)
        } else if (window.innerWidth < 768) {
          setSize(80)
        } else if (window.innerWidth < 1024) {
          setSize(100)
        } else {
          setSize(120)
        }
      }, 200) // 增加防抖延迟
    }

    window.addEventListener('resize', handleResize)
    // 初始化大小
    handleResize()

    // 组件卸载时移除事件监听器和清除计时器
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

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
