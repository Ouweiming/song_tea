import { FloatButton } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import 'highlight.js/styles/github.css'
import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

// import NavigationBubble from './NavigationBubble'
import VideoSection from './Video'
import Header from './header'
import { useTheme } from './useTheme'

// 其他组件使用类似的加载策略
const TeaStorySection = lazy(() => import('./TeaStorySection'))
const ShoppingCartList = lazy(() => import('./ShoppingCartList'))
const ContactForm = lazy(() => import('./Contact'))
const Footer = lazy(() => import('./footer'))

export default function Homepage() {
  const { theme } = useTheme()
  const [scrollPosition, setScrollPosition] = useState(0)
  const isFirstRender = useRef(true)

  // 监听滚动位置，但使用节流减少更新频率
  useEffect(() => {
    let lastUpdate = 0
    const handleScroll = () => {
      const now = Date.now()
      if (now - lastUpdate > 100) {
        // 100ms节流
        lastUpdate = now
        setScrollPosition(window.scrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 标记页面已经初次渲染完成
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  // 计算返回顶部按钮的透明度
  const backTopOpacity = scrollPosition > 300 ? 1 : 0

  // 简化页面过渡动画
  const pageVariants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
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
        {/* 返回顶部按钮 - 使用CSS而不是动画来控制显示/隐藏 */}
        <div
          style={{
            opacity: backTopOpacity,
            transition: 'opacity 0.3s ease',
          }}
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
                    duration: 2, // 减少动画频率
                    repeatType: 'loop',
                  },
                }}
              >
                <FiArrowUp size={16} />
              </motion.div>
            }
            className='hover:shadow-lg'
          />
        </div>

        <div>
          <div
            className={`flex min-h-screen flex-col ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-[rgb(15,65,80)] to-[rgb(95,160,110)]'
                : 'bg-gradient-to-r from-[rgb(246,242,233)] to-[rgb(142,212,202)]'
            }`}
          >
            <Header />
            <div className='pt-20'>
              <div className='relative flex flex-1 flex-col'>
                <VideoSection />
              </div>

              <Suspense fallback={<div className='h-screen' />}>
                <TeaStorySection />
              </Suspense>

              <Suspense fallback={<div className='h-screen' />}>
                <ShoppingCartList />
              </Suspense>

              <Suspense fallback={<div className='h-screen' />}>
                <ContactForm />
              </Suspense>

              <Suspense fallback={<div className='h-96' />}>
                <Footer />
              </Suspense>

              {/* <NavigationBubble /> */}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
