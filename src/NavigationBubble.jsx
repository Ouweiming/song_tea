import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import {
  FiGrid,
  FiHome,
  FiInfo,
  FiMail,
  FiShoppingCart,
  FiX,
} from 'react-icons/fi'

// 使用我们自定义的hooks
import { routerFutureConfig } from './router-config'
import { useLocation, useNavigate } from './router-provider'
import { useTheme } from './theme-provider'

// 确保React Router知道future标志
// eslint-disable-next-line no-unused-vars
const routerConfig = routerFutureConfig

const NavigationBubble = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // 导航项
  const navItems = [
    { icon: <FiHome />, label: '首页', path: '/' },
    { icon: <FiInfo />, label: '茶品故事', path: '#tea-story' }, // 修改为正确的ID
    { icon: <FiShoppingCart />, label: '产品', path: '#products' },
    { icon: <FiMail />, label: '联系', path: '#contact' },
  ]

  // 处理导航跳转
  const handleNavigation = path => {
    setIsOpen(false)

    if (path.startsWith('#')) {
      // 如果在其他页面，需要先返回首页
      if (location.pathname !== '/' && location.pathname !== '/Homepage') {
        navigate('/')
        // 给浏览器时间加载首页后再滚动
        setTimeout(() => {
          document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(path)
    }
  }

  // 容器变体
  const containerVariants = {
    closed: { scale: 1 },
    open: { scale: 1 },
  }

  // 按钮变体
  const buttonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45, transition: { duration: 0.3 } },
  }

  // 菜单项变体
  const itemVariants = {
    closed: i => ({
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        delay: 0.05 * i,
      },
    }),
    open: i => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
        delay: 0.05 * i,
      },
    }),
  }

  // 只在移动视图中显示 - 修改位置和透明度
  return (
    <div className='fixed bottom-6 left-6 z-40 md:hidden'>
      <motion.div
        variants={containerVariants}
        initial='closed'
        animate={isOpen ? 'open' : 'closed'}
        className='relative flex items-center justify-center'
      >
        {/* 菜单项 - 修改位置为左侧展开 */}
        <AnimatePresence>
          {isOpen && (
            <div className='absolute bottom-16 left-0 space-y-3'>
              {navItems.map((item, i) => (
                <motion.button
                  key={i}
                  custom={navItems.length - i}
                  variants={itemVariants}
                  initial='closed'
                  animate='open'
                  exit='closed'
                  onClick={() => handleNavigation(item.path)}
                  className={`flex min-w-[120px] items-center whitespace-nowrap rounded-full px-5 py-3 text-base font-medium ${
                    theme === 'dark'
                      ? 'bg-emerald-800 bg-opacity-80 text-white shadow-emerald-900/20'
                      : 'bg-emerald-50 bg-opacity-85 text-emerald-800 shadow-emerald-200/50'
                  } shadow-lg backdrop-blur-sm`}
                >
                  <span className='mr-3 text-xl'>{item.icon}</span>
                  {item.label}
                </motion.button>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* 主按钮 - 增加尺寸和改进样式 */}
        <motion.button
          variants={buttonVariants}
          initial='closed'
          animate={isOpen ? 'open' : 'closed'}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-14 w-14 items-center justify-center rounded-full text-xl shadow-lg ${
            theme === 'dark'
              ? 'bg-emerald-600 bg-opacity-75 text-white shadow-emerald-800/30'
              : 'bg-emerald-100 bg-opacity-80 text-emerald-800 shadow-emerald-300/40'
          } backdrop-blur-sm transition-all duration-300 hover:bg-opacity-100 hover:shadow-xl`}
        >
          {isOpen ? <FiX /> : <FiGrid />}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NavigationBubble
