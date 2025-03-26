import { FloatButton } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import 'highlight.js/styles/github.css'
import PropTypes from 'prop-types'
import { Suspense, lazy, memo, useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

import VideoSection from './Video'
import Welcome from './Welcome'
import Header from './header'
import { useTheme } from './useTheme'

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

// 创建一个通用的懒加载包装器组件
const LazyLoadSection = ({ children, height = 'h-screen' }) => (
  <Suspense fallback={<LazyLoadPlaceholder height={height} />}>
    {children}
  </Suspense>
)

// 添加缺失的 PropTypes 验证
LazyLoadSection.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string
}

LazyLoadSection.displayName = 'LazyLoadSection'

export default function Homepage() {
  const { theme } = useTheme()
  const [scrollPosition, setScrollPosition] = useState(0)
  const isFirstRender = useRef(true)

  // 进一步优化滚动处理，增加事件选项
  useEffect(() => {
    // 移除throttle，使用简单的函数
    const handleScroll = () => {
      // 只有在第一渲染后才更新状态，避免不必要的重渲染
      if (!isFirstRender.current) {
        setScrollPosition(window.scrollY)
      }
    }

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
            className='hover:shadow-sm'
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
          {/* 增加顶部内边距，确保足够的空间将Welcome与其他区域分开 */}
          <div className='pt-28 md:pt-36 lg:pt-44'>
            {/* 为Welcome组件添加一个明确的id，便于导航识别 */}
            <div id='home-welcome' className='pb-16 md:pb-24'>
              <Welcome />
            </div>
            <div className='relative flex flex-col flex-1'>
              <VideoSection />
            </div>

            {/* 增加顶部间距，确保与上面的元素有明确间隔 */}
            <LazyLoadSection>
              <div className='mt-8 md:mt-16'>
                <TeaStorySection />
              </div>
            </LazyLoadSection>

            <LazyLoadSection>
              <ShoppingCartList />
            </LazyLoadSection>

            <LazyLoadSection>
              <ContactForm />
            </LazyLoadSection>

            <LazyLoadSection height='h-96'>
              <Footer />
            </LazyLoadSection>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
