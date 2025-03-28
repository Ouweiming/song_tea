import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Suspense, lazy, memo, useEffect, useRef, useState } from 'react'
import { FiArrowUp } from 'react-icons/fi'

// 只导入首屏必须的组件
import Header from './header'
import { useTheme } from './useTheme'

// 动态导入优化：移除不必要的Promise和setTimeout包装
// 延迟加载第一屏内容
const Welcome = lazy(() => import('./Welcome'))

// 第二屏内容
const VideoSection = lazy(() => import('./Video'))

// 其他组件使用标准懒加载，移除自定义延迟
const TeaStorySection = lazy(() => import('./TeaStorySection'))
const ShoppingCartList = lazy(() => import('./ShoppingCartList'))
const ContactForm = lazy(() => import('./Contact'))
const Footer = lazy(() => import('./footer'))

// 懒加载时的占位组件，使用memo优化
const LazyLoadPlaceholder = memo(({ height = 'h-screen' }) => (
  <div className={height} />
))

// 添加PropTypes验证修复ESLint错误
LazyLoadPlaceholder.propTypes = {
  height: PropTypes.string,
}

LazyLoadPlaceholder.displayName = 'LazyLoadPlaceholder'

// 创建一个通用的懒加载包装器组件，移除未使用的priority参数
const LazyLoadSection = ({ children, height = 'h-screen' }) => (
  <Suspense fallback={<LazyLoadPlaceholder height={height} />}>
    {children}
  </Suspense>
)

// 更新PropTypes验证，移除未使用的priority
LazyLoadSection.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
}

LazyLoadSection.displayName = 'LazyLoadSection'

export default function Homepage() {
  const { theme } = useTheme()
  const [scrollPosition, setScrollPosition] = useState(0)
  const isFirstRender = useRef(true)
  const isScrollingRef = useRef(false) // 改为 ref 以解决依赖项问题

  // 进一步优化滚动处理，增加事件选项
  useEffect(() => {
    const handleScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true
        requestAnimationFrame(() => {
          setScrollPosition(window.scrollY)
          isScrollingRef.current = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // 不需要依赖项，因为使用了 ref

  // 标记页面已经初次渲染完成 - 仅使用一个效果
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    }
  }, [])

  // 更简化的页面过渡动画，减少样式计算
  const pageVariants = {
    initial: { opacity: 0 },
    enter: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  }

  // 预加载后续组件 - 优化为使用IntersectionObserver
  useEffect(() => {
    // 创建交叉观察器，当用户滚动到页面中部时才加载后续组件
    if ('IntersectionObserver' in window && 'requestIdleCallback' in window) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            // 在空闲时间加载组件
            window.requestIdleCallback(
              () => {
                // 一次只预加载一个模块，减轻网络负担
                import('./TeaStorySection').then(() => {
                  window.requestIdleCallback(
                    () => import('./ShoppingCartList'),
                    { timeout: 1500 }
                  )
                })
              },
              { timeout: 1000 }
            )
            observer.disconnect() // 加载一次后断开观察
          }
        },
        { threshold: 0.1 }
      )

      // 观察页面中部的元素
      setTimeout(() => {
        const target = document.getElementById('home-welcome')
        if (target) observer.observe(target)
      }, 1000)
    }

    return () => {} // 清理函数
  }, [])

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial='initial'
        animate='enter'
        exit='exit'
        variants={pageVariants}
      >
        {/* 增强悬浮按钮，添加桌面端悬停效果和更好的移动端支持 */}
        <motion.div
          className={`fixed bottom-6 right-6 z-50 flex cursor-pointer items-center justify-center rounded-full bg-emerald-100 p-2.5 shadow-lg transition-all duration-300 hover:bg-emerald-200 dark:bg-emerald-700 dark:hover:bg-emerald-600 sm:p-3 md:p-3.5 ${
            scrollPosition > 300
              ? 'opacity-100'
              : 'pointer-events-none opacity-0'
          }`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label='返回顶部'
        >
          <FiArrowUp size={20} className='text-emerald-800 dark:text-white' />
        </motion.div>

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
              <LazyLoadSection height='min-h-[300px]'>
                <Welcome />
              </LazyLoadSection>
            </div>
            <div className='relative flex flex-col flex-1'>
              <LazyLoadSection height='min-h-[400px]'>
                <VideoSection />
              </LazyLoadSection>
            </div>

            {/* 增加顶部间距，确保与上面的元素有明确间隔 */}
            <LazyLoadSection height='h-96'>
              <div className='mt-8 md:mt-16'>
                <TeaStorySection />
              </div>
            </LazyLoadSection>

            <LazyLoadSection height='h-96'>
              <ShoppingCartList />
            </LazyLoadSection>

            <LazyLoadSection height='h-96'>
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
