import {
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from '@nextui-org/react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import PropTypes from 'prop-types'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  FiHome,
  FiInfo,
  FiMail,
  FiMoon,
  FiShoppingBag,
  FiSun,
  FiUsers,
} from 'react-icons/fi'

import Logo from './assets/logo.svg'
import './index.css'
// 使用我们自定义的hooks
import { routerFutureConfig } from './router-config'
import { useLocation, useNavigate } from './router-provider'
import { useTheme } from './theme-provider'

// 确保React Router知道future标志
// eslint-disable-next-line no-unused-vars
const routerConfig = routerFutureConfig

// 分离并优化导航项组件
const NavItem = memo(({ item, isActive, handleNavigation, theme }) => {
  // 添加动画控制state
  const [isHovered, setIsHovered] = useState(false)

  return (
    <NavbarItem>
      <motion.a
        href={item.href}
        onClick={e => handleNavigation(item.href, e)}
        className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
          isActive(item.href)
            ? `font-semibold text-emerald-500 dark:text-emerald-300`
            : `${
                theme === 'dark'
                  ? 'text-gray-100 dark:text-opacity-90'
                  : 'text-gray-700'
              }`
        }`}
        whileHover={{
          scale: 1.05,
          color: theme === 'dark' ? 'rgb(167, 243, 208)' : 'rgb(5, 150, 105)',
          textShadow:
            theme === 'dark' ? '0 0 8px rgba(16, 185, 129, 0.3)' : 'none',
        }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        // 添加无障碍属性
        aria-current={isActive(item.href) ? 'page' : undefined}
        role='menuitem'
      >
        {item.name}

        {/* 活跃状态指示器 - 改进暗模式样式 */}
        {isActive(item.href) && (
          <motion.span
            className={`absolute bottom-0 left-0 h-0.5 w-full ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                : 'bg-emerald-500'
            }`}
            layoutId='activeIndicator'
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            // 添加无障碍说明
            aria-hidden='true'
          />
        )}

        {/* 添加悬浮时的加载动画 - 优化性能 */}
        {isHovered && !isActive(item.href) && (
          <motion.span
            className='absolute bottom-0 left-0 h-0.5 w-full'
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: 1,
              transition: { duration: 0.3 },
            }}
            style={{
              background: `linear-gradient(90deg, 
                ${theme === 'dark' ? '#34D399' : '#34D399'} 0%, 
                ${theme === 'dark' ? '#A7F3D0' : '#059669'} 50%, 
                ${theme === 'dark' ? '#34D399' : '#34D399'} 100%)`,
              transformOrigin: 'left',
              // 减少不必要的阴影效果提高性能
              boxShadow:
                theme === 'dark' ? '0 0 6px rgba(167, 243, 208, 0.5)' : 'none',
            }}
            // 添加无障碍说明
            aria-hidden='true'
          />
        )}
      </motion.a>
    </NavbarItem>
  )
})

// 添加显示名称和PropTypes
NavItem.displayName = 'NavItem'
NavItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.node,
  }).isRequired,
  isActive: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
}

// 分离并优化菜单项组件
const MenuItem = memo(({ item, isActive, handleNavigation, theme, index }) => {
  return (
    <NavbarMenuItem>
      <motion.a
        href={item.href}
        onClick={e => handleNavigation(item.href, e)}
        className={`flex w-full items-center py-3 text-lg ${
          isActive(item.href)
            ? 'font-semibold text-emerald-600 dark:text-emerald-300'
            : 'text-gray-700 dark:text-gray-200'
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05 * index }}
        whileHover={{
          x: 5,
          color: theme === 'dark' ? '#A7F3D0' : '#059669',
          textShadow:
            theme === 'dark' ? '0 0 8px rgba(16, 185, 129, 0.3)' : 'none',
        }}
      >
        {/* 改进图标在暗模式下的视觉效果 */}
        <span
          className={`mr-2 ${isActive(item.href) && theme === 'dark' ? 'text-emerald-300' : ''}`}
        >
          {item.icon}
        </span>
        {item.name}
      </motion.a>
    </NavbarMenuItem>
  )
})

// 添加显示名称和PropTypes
MenuItem.displayName = 'MenuItem'
MenuItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
  }).isRequired,
  isActive: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
}

// 为主题切换按钮也添加悬浮加载动画
const ThemeToggleButton = memo(({ theme, handleToggle }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className='relative'>
      <Button
        isIconOnly
        variant='light'
        color='success'
        className='rounded-full p-2 transition-all duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
        onPress={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 180 : 0 }}
          transition={{
            duration: 0.5,
            type: 'spring',
            stiffness: 180,
            damping: 15,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='flex items-center justify-center'
        >
          {theme === 'dark' ? (
            <FiSun className='text-emerald-300' size={24} />
          ) : (
            <FiMoon className='text-emerald-700' size={24} />
          )}
        </motion.div>
      </Button>

      {/* 悬浮时的环形加载动画 - 使用will-change优化性能 */}
      {isHovered && (
        <motion.div
          className='absolute -inset-1 rounded-full'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            boxShadow: `0 0 10px 2px ${theme === 'dark' ? 'rgba(110, 231, 183, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
          }}
          transition={{ duration: 0.3 }}
          style={{
            willChange: 'opacity, box-shadow', // 提示浏览器优化性能
          }}
          // 避免无障碍工具读取装饰性元素
          aria-hidden='true'
        >
          <motion.div
            className='absolute inset-0 rounded-full'
            initial={{ borderWidth: '0px' }}
            animate={{
              borderWidth: '2px',
              borderColor:
                theme === 'dark'
                  ? 'rgba(110, 231, 183, 0.5)'
                  : 'rgba(16, 185, 129, 0.5)',
              borderStyle: 'solid',
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}
    </div>
  )
})

ThemeToggleButton.displayName = 'ThemeToggleButton'
ThemeToggleButton.propTypes = {
  theme: PropTypes.string.isRequired,
  handleToggle: PropTypes.func.isRequired,
}

// 主标题栏组件，使用memo优化
const Header = () => {
  const { setTheme, theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isPageReady, setIsPageReady] = useState(false) // 添加页面准备状态标志
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const headerRef = useRef(null)
  const menuToggleRef = useRef(null)
  const menuClickedRef = useRef(false)
  const menuActionTimeRef = useRef(Date.now()) // 记录最近一次菜单操作的时间

  // 添加页面加载完成后的准备状态
  useEffect(() => {
    // 页面加载后延迟设置准备状态，给组件完全渲染留出时间
    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 500) // 500ms的防抖保护期

    return () => clearTimeout(timer)
  }, [])

  // 添加专门的菜单切换处理函数，修复点击收缩问题
  const handleMenuToggle = useCallback(event => {
    // 防止事件冒泡和默认行为
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // 处理快速连续点击保护
    const now = Date.now()
    if (now - menuActionTimeRef.current < 300) {
      // 如果间隔太短，不处理此次点击
      return
    }
    menuActionTimeRef.current = now

    // 标记已点击，防止NextUI内部状态冲突
    menuClickedRef.current = true

    // 设置菜单状态
    setIsMenuOpen(prev => !prev)

    // 延迟清除点击标记
    setTimeout(() => {
      menuClickedRef.current = false
    }, 500) // 增加时间到500ms，确保有足够时间处理状态变化
  }, [])

  // 强制同步外部菜单状态和内部实现
  const handleNextUIMenuChange = useCallback(
    open => {
      // 只有当不是来自我们的点击事件和页面准备好后才处理NextUI的回调
      if (!menuClickedRef.current && isPageReady) {
        // 使用更长的延迟来确保状态同步
        setTimeout(() => {
          setIsMenuOpen(open)
        }, 50)
      }
    },
    [isPageReady]
  )

  // 优化spring效果，降低渲染负担
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 60, // 降低刚度值
    damping: 25, // 调整阻尼
    restDelta: 0.003,
  })

  // 修复hooks规则问题：预先创建transform函数
  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.05],
    [
      theme === 'dark' ? 'rgba(31, 41, 55, 0.1)' : 'rgba(255, 255, 255, 0.1)',
      theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    ]
  )

  const heightTransform = useTransform(
    scrollYProgress,
    [0, 0.05],
    ['5rem', '4rem']
  )

  const blurTransform = useTransform(
    scrollYProgress,
    [0, 0.05],
    ['blur(3px)', 'blur(8px)'] // 降低模糊度提高性能
  )

  // 使用已创建的transform函数
  const navbarTransforms = useMemo(() => {
    return {
      background: backgroundTransform,
      height: heightTransform,
      blur: blurTransform,
    }
  }, [backgroundTransform, heightTransform, blurTransform])

  // 使用useMemo缓存菜单项
  const menuItems = useMemo(
    () => [
      { name: '首页', href: '/', icon: <FiHome className='mr-2' /> },
      {
        name: '后花园庄',
        href: '#village',
        icon: <FiUsers className='mr-2' />,
      },
      {
        name: '茶品故事',
        href: '#tea-story',
        icon: <FiInfo className='mr-2' />,
      },
      {
        name: '产品展示',
        href: '#products',
        icon: <FiShoppingBag className='mr-2' />,
      },
      { name: '联系我们', href: '#contact', icon: <FiMail className='mr-2' /> },
    ],
    []
  )

  // 封装滚动函数减少代码重复
  const scrollToElement = useCallback(href => {
    const element = document.querySelector(href)
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 80
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }, [])

  // 优化主题切换
  const handleToggle = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  // 优化导航函数 - 添加缺失依赖
  const handleNavigation = useCallback(
    (href, event) => {
      if (event) event.preventDefault()

      if (isMenuOpen) {
        setIsMenuOpen(false)
      }

      if (href.startsWith('#')) {
        if (location.pathname !== '/' && location.pathname !== '/Homepage') {
          navigate('/')
          setActiveSection(href)

          setTimeout(() => {
            scrollToElement(href)
          }, 100)
        } else {
          scrollToElement(href)
          setActiveSection(href)
        }
      } else {
        navigate(href)
        setActiveSection(href)
        window.scrollTo(0, 0)
      }
    },
    [isMenuOpen, location.pathname, navigate, scrollToElement, setActiveSection]
  )

  // 优化滚动检测，使用节流减少触发频率
  useEffect(() => {
    const checkSections = () => {
      if (location.pathname === '/' || location.pathname === '/Homepage') {
        const sections = ['tea-story', 'products', 'village', 'contact']
        let currentSection = ''
        let minDistance = Infinity

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            const absMidDistance = Math.abs(
              rect.top + rect.height / 2 - window.innerHeight / 2
            )

            if (absMidDistance < minDistance) {
              minDistance = absMidDistance
              if (
                rect.top < window.innerHeight * 0.7 &&
                rect.bottom > window.innerHeight * 0.3
              ) {
                currentSection = `#${section}`
              }
            }
          }
        }

        if (currentSection && currentSection !== activeSection) {
          setActiveSection(currentSection)
        } else if (!currentSection && scrollYProgress.get() < 0.1) {
          setActiveSection('/')
        }
      }
    }

    // 优化滚动处理防抖间隔
    let ticking = false
    let scrollTimeout
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            checkSections()
            ticking = false
          })
          ticking = true
        }
      }, 50) // 添加50ms防抖延迟
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [location.pathname, activeSection, scrollYProgress])

  // 优化activeLink检查
  const isActive = useCallback(
    href => {
      if (href === '/') {
        return (
          (location.pathname === '/' || location.pathname === '/Homepage') &&
          activeSection === '/'
        )
      }
      return location.pathname === href || activeSection === href
    },
    [location.pathname, activeSection]
  )

  // 移除header整体的whileHover效果
  return (
    <motion.div
      ref={headerRef}
      style={{
        backgroundColor: navbarTransforms.background,
        backdropFilter: navbarTransforms.blur,
      }}
      className={`fixed left-0 right-0 top-0 z-50 ${
        scrolled ? 'shadow-lg dark:shadow-gray-900/20' : ''
      } transition-shadow duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 50,
        damping: 15,
      }}
      // 移除整个whileHover属性
    >
      {/* 保留进度指示器，但也移除它的悬浮效果 */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-emerald-400 to-teal-500'
        style={{ scaleX }}
        // 移除whileHover效果
      />

      <NextUINavbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={handleNextUIMenuChange}
        shouldHideOnScroll={false}
        isBordered={false}
        maxWidth='xl'
        className='bg-transparent'
        style={{ height: navbarTransforms.height }}
      >
        {/* 移动端Logo和菜单切换 - 移除悬浮效果 */}
        <NavbarContent className='sm:hidden' justify='start'>
          <div
            ref={menuToggleRef}
            onClick={isPageReady ? handleMenuToggle : undefined}
            className={`cursor-pointer p-2 ${isPageReady ? '' : 'pointer-events-none'}`}
          >
            <NavbarMenuToggle
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
              className='text-emerald-600 dark:text-emerald-300'
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
              }}
              // 重命名属性为小写，避免React警告
              isselected={isMenuOpen ? 'true' : 'false'}
            />
          </div>

          <NavbarBrand className='flex items-center'>
            <motion.img
              src={Logo}
              alt='后花园庄宋茶'
              className={`h-10 w-10 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              // 移除whileHover和whileTap
            />
            <motion.p
              className={`text-lg font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              后花园庄<span className='ml-1 align-top text-xs'>宋茶</span>
            </motion.p>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className='hidden sm:flex' justify='start'>
          <NavbarBrand className='flex items-center'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 12,
                duration: 0.6,
              }}
              className='flex items-center'
              onClick={e => handleNavigation('/', e)}
              style={{ cursor: 'pointer' }}
              // 移除whileHover
            >
              <motion.img
                src={Logo}
                alt='后花园庄宋茶'
                className={`mr-4 h-14 w-14 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                // 移除whileHover和whileTap
              />
              <motion.div className='flex flex-col'>
                <motion.p
                  className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}`}
                  // 移除whileHover
                >
                  后花园庄
                </motion.p>
                <motion.p
                  className='text-sm text-emerald-600/90 dark:text-emerald-300/90'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  // 移除whileHover
                >
                  岛屿记忆·宋茶
                </motion.p>
              </motion.div>
            </motion.div>
          </NavbarBrand>
        </NavbarContent>

        {/* 桌面端导航链接 - 保留NavItem组件的悬浮效果 */}
        <NavbarContent className='hidden md:flex' justify='center'>
          {menuItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              isActive={isActive}
              handleNavigation={handleNavigation}
              theme={theme}
            />
          ))}
        </NavbarContent>

        {/* 移除ThemeToggleButton的悬浮效果 */}
        <NavbarContent justify='end'>
          <NavbarItem>
            <Button
              isIconOnly
              variant='light'
              color='success'
              className='rounded-full p-2 transition-all duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
              onPress={handleToggle}
              aria-label={
                theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'
              }
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 180,
                  damping: 15,
                }}
                // 移除whileHover和whileTap
                className='flex items-center justify-center'
              >
                {theme === 'dark' ? (
                  <FiSun className='text-emerald-300' size={24} />
                ) : (
                  <FiMoon className='text-emerald-700' size={24} />
                )}
              </motion.div>
            </Button>
          </NavbarItem>
        </NavbarContent>

        {/* 移动端菜单 - 保留MenuItem组件的悬浮效果 */}
        <NavbarMenu
          className='bg-white/80 pt-6 backdrop-blur-xl dark:bg-gray-900/90'
          style={{
            transition:
              'opacity 300ms ease, transform 300ms ease, visibility 300ms ease',
            opacity: isMenuOpen ? 1 : 0,
            visibility: isMenuOpen ? 'visible' : 'hidden',
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
            pointerEvents: isMenuOpen ? 'auto' : 'none',
          }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              item={item}
              isActive={isActive}
              handleNavigation={handleNavigation}
              theme={theme}
              index={isMenuOpen ? index : 0}
            />
          ))}
        </NavbarMenu>
      </NextUINavbar>
    </motion.div>
  )
}

Header.displayName = 'Header'
export default Header
