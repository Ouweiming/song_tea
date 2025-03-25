import { FloatButton } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import 'highlight.js/styles/github.css'
import PropTypes from 'prop-types'
import { Suspense, lazy, memo, useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

import VideoSection from './Video'
import Header from './header'
import { useTheme } from './useTheme'
import { throttle } from './utils/performanceUtils'

// 使用更精细的代码分割
const TeaStorySection = lazy(() =>
  import('./TeaStorySection').then(module => ({
    default: module.default,
  }))
)
const ShoppingCartList = lazy(() =>
  import('./ShoppingCartList').then(module => ({
    default: module.default,
  }))
)
const ContactForm = lazy(() =>
  import('./Contact').then(module => ({
    default: module.default,
  }))
)
const Footer = lazy(() =>
  import('./footer').then(module => ({
    default: module.default,
  }))
)

// 懒加载时的占位组件，使用memo优化
const LazyLoadPlaceholder = memo(({ height = 'h-screen' }) => (
  <div className={height} />
))

// 添加PropTypes验证修复ESLint错误
LazyLoadPlaceholder.propTypes = {
  height: PropTypes.string,
}

LazyLoadPlaceholder.displayName = 'LazyLoadPlaceholder'

export default function Homepage() {
  const { theme } = useTheme()
  const [scrollPosition, setScrollPosition] = useState(0)
  const isFirstRender = useRef(true)

  // 进一步优化滚动处理，增加事件选项
  useEffect(() => {
    const handleScroll = throttle(() => {
      // 只有在第一渲染后才更新状态，避免不必要的重渲染
      if (!isFirstRender.current) {
        setScrollPosition(window.scrollY)
      }
    }, 150) // 进一步增加节流时间，减少触发频率

    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: false,
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 标记页面已经初次渲染完成 - 仅使用一个效果
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  // 简化透明度计算，避免每次渲染重计算
  const backTopOpacity = scrollPosition > 300 ? 1 : 0

  // 更简化的页面过渡动画，减少样式计算
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  return (
    <AnimatePresence presenceAffectsLayout={false} mode='wait'>
      <motion.div
        initial='initial'
        animate='enter'
        exit='exit'
        variants={pageVariants}
      >
        {/* 返回顶部按钮 - 通过CSS控制显示，避免动画计算 */}
        <div
          className='fixed z-50 bottom-6 right-6'
          style={{
            opacity: backTopOpacity,
            transition: 'opacity 0.3s ease',
            visibility: backTopOpacity === 0 ? 'hidden' : 'visible',
            willChange: 'opacity, visibility',
          }}
        >
          <FloatButton.BackTop
            visibilityHeight={300}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                theme === 'dark'
                  ? 'rgba(5, 150, 105, 0.75)'
                  : 'rgba(209, 250, 229, 0.8)',
              color: theme === 'dark' ? '#ffffff' : '#065f46',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              backdropFilter: 'blur(4px)',
            }}
            icon={<FiArrowUp size={16} />}
            className='hover:shadow-lg'
          />
        </div>

        <div
          className={`flex min-h-screen flex-col ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-[rgb(15,65,80)] to-[rgb(95,160,110)]'
              : 'bg-gradient-to-r from-[rgb(246,242,233)] to-[rgb(142,212,202)]'
          }`}
        >
          <Header />
          <div className='pt-20'>
            <div className='relative flex flex-col flex-1'>
              <VideoSection />
            </div>

            <Suspense fallback={<LazyLoadPlaceholder />}>
              <TeaStorySection />
            </Suspense>

            <Suspense fallback={<LazyLoadPlaceholder />}>
              <ShoppingCartList />
            </Suspense>

            <Suspense fallback={<LazyLoadPlaceholder />}>
              <ContactForm />
            </Suspense>

            <Suspense fallback={<LazyLoadPlaceholder height='h-96' />}>
              <Footer />
            </Suspense>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
