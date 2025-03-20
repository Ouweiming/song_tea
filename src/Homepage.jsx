import { FloatButton } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import 'highlight.js/styles/github.css'
import { Suspense, lazy, useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

// import Block from './Block'
import LoadingSpinner from './LoadingSpinner'
import NavigationBubble from './NavigationBubble'
import VideoSection from './Video'
import Header from './header'
import { useTheme } from './theme-provider'

// 懒加载非首屏组件
const Introduction = lazy(() => import('./Introduction'))
const TeaStorySection = lazy(() => import('./TeaStorySection'))
const Photowall = lazy(() => import('./Photowall'))
const ShoppingCartList = lazy(() => import('./ShoppingCartList'))
const ContactForm = lazy(() => import('./Contact'))
const Footer = lazy(() => import('./footer'))

export default function Homepage() {
  const { theme } = useTheme()
  const [scrollPosition, setScrollPosition] = useState(0)

  // 监听滚动位置
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 计算返回顶部按钮的透明度
  const backTopOpacity = scrollPosition > 300 ? 1 : 0

  // 简化后的MainContent组件 - 已移除侧边栏相关代码
  const MainContent = () => {
    return (
      <main className='container flex-auto'>{/* 侧边栏相关代码已移除 */}</main>
    )
  }

  // 页面过渡动画
  const pageVariants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial='initial'
        animate='enter'
        exit='exit'
        variants={pageVariants}
      >
        {/* 返回顶部按钮 - 添加浮动动画 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: backTopOpacity }}
          transition={{ duration: 0.3 }}
        >
          <FloatButton.BackTop
            visibilityHeight={300}
            style={{
              bottom: 24,
              right: 24,
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
              fontSize: '16px',
              transition: 'all 0.3s ease',
            }}
            icon={
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    repeatType: 'loop',
                  },
                }}
              >
                <FiArrowUp size={16} />
              </motion.div>
            }
            className='hover:shadow-lg'
          />
        </motion.div>

        <div>
          <div
            className={`flex min-h-screen flex-col ${theme === 'dark' ? 'bg-gradient-to-r from-customgradient2 to-customgradient_2' : 'bg-gradient-to-r from-customgradient1 to-customgradient_1'}`}
          >
            <Header />
            <div className='pt-20'>
              <div className='relative flex flex-1 flex-col'>
                <VideoSection />
              </div>
              <MainContent />
              <Suspense fallback={<LoadingSpinner size={60} />}>
                <Introduction />
                <TeaStorySection />
                <Photowall />
                <ShoppingCartList />
                <ContactForm />
                <Footer />
              </Suspense>
              <NavigationBubble />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
