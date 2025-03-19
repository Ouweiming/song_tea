import { animated, useSpring } from '@react-spring/web'
import { FloatButton } from 'antd'
import { motion } from 'framer-motion'
import 'highlight.js/styles/github.css'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

// import Block from './Block'
import ContactForm from './Contact'
import Introduction from './Introduction'
import NavigationBubble from './NavigationBubble'
import Photowall from './Photowall'
import ShoppingCartList from './ShoppingCartList'
import TeaStorySection from './TeaStorySection'
import VideoSection from './Video'
import pig from './assets/pig.png'
import Footer from './footer'
import Header from './header'
import { useTheme } from './theme-provider'

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

  const MainContent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isFloatButtonRotated, setIsFloatButtonRotated] = useState(false)

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
      setIsFloatButtonRotated(!isFloatButtonRotated)
    }

    // 添加悬浮按钮的动画效果
    const floatButtonAnimation = useSpring({
      transform: isFloatButtonRotated
        ? 'rotate(180deg) scale(1.1)'
        : 'rotate(0deg) scale(1)',
      config: { tension: 300, friction: 10 },
    })

    return (
      <main className='container flex-auto'>
        <button onClick={toggleSidebar} className='focus:outline-none'>
          <animated.div
            style={floatButtonAnimation}
            className='fixed top-1/2 z-30 transform-gpu transition-transform duration-500'
          >
            <FloatButton
              icon={
                <div>
                  <img
                    src={pig}
                    alt='svg'
                    className='transition-transform duration-300 hover:rotate-12'
                  />
                </div>
              }
            />
          </animated.div>
        </button>

        <Sidebar isOpen={isSidebarOpen} />
      </main>
    )
  }

  const Sidebar = ({ isOpen }) => {
    const sidebarAnimation = useSpring({
      transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
      opacity: isOpen ? 1 : 0,
      config: { tension: 200, friction: 20 },
      willChange: 'transform, opacity',
    })

    return (
      <animated.aside
        className='fixed right-16 top-1/2 z-50 flex max-h-full overflow-y-auto rounded-3xl bg-white bg-opacity-65 shadow-lg backdrop-blur-md dark:bg-gray-800/40 dark:shadow-emerald-900/20'
        style={sidebarAnimation}
      >
        <div className='flex h-full flex-col flex-wrap items-center justify-center px-6 py-4'>
          <p className='flex justify-center text-lg font-bold text-cyan-700 dark:text-cyan-400'>
            其余板块正在努力开发中~
          </p>
        </div>
      </animated.aside>
    )
  }

  Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
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
            <Introduction />

            {/* 添加茶品故事区块 */}
            <TeaStorySection />

            <Photowall />
            {/* <Block /> */}
            <ShoppingCartList />
            <ContactForm />
            <Footer />
            <NavigationBubble />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
