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
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
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
import { useTheme } from './useTheme'

// 确保React Router知道future标志
// eslint-disable-next-line no-unused-vars
const routerConfig = routerFutureConfig

// 新增: 渐变填充文字动画组件
const AnimatedGradientText = memo(({ text, subText, theme, onNavigate }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, threshold: 0.5 })
  const [animationKey, setAnimationKey] = useState(0)

  // 当组件进入视图时重置动画
  useEffect(() => {
    if (isInView) {
      setAnimationKey(prev => prev + 1)
    }
  }, [isInView])

  // 主标题字符动画配置
  const letterVariants = {
    hidden: {
      opacity: 0.3,
      y: 15,
      scale: 0.9,
    },
    visible: i => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  // 副标题动画配置
  const subTextVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: text.length * 0.05 + 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  // 装饰线动画配置
  const decorLine = {
    hidden: {
      scaleX: 0,
      opacity: 0,
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: text.length * 0.05 + 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className='flex cursor-pointer flex-col justify-center'
      onClick={onNavigate}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className='overflow-hidden'>
        {/* 主标题文字，字符单独动画 */}
        <motion.p
          key={`main-text-${animationKey}`}
          className={`m-0 text-2xl font-bold leading-tight ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-gray-300 via-emerald-300 to-gray-300'
              : 'bg-gradient-to-r from-gray-700 via-emerald-600 to-gray-700'
          } bg-clip-text text-transparent`}
          style={{
            backgroundSize: '300% 100%',
            willChange: 'transform',
          }}
        >
          {Array.from(text).map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              custom={i}
              variants={letterVariants}
              initial='hidden'
              animate={isInView ? 'visible' : 'hidden'}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity',
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </div>

      {/* 装饰线 */}
      <motion.div
        key={`decor-line-${animationKey}`}
        className={`h-0.5 w-full ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-transparent via-emerald-300 to-transparent'
            : 'bg-gradient-to-r from-transparent via-emerald-600 to-transparent'
        }`}
        variants={decorLine}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* 副标题文字 */}
      <motion.p
        key={`sub-text-${animationKey}`}
        className={`m-0 text-sm ${
          theme === 'dark' ? 'text-emerald-300/90' : 'text-emerald-600/90'
        }`}
        variants={subTextVariants}
        initial='hidden'
        animate={isInView ? 'visible' : 'hidden'}
        style={{ willChange: 'transform, opacity' }}
      >
        {subText}
      </motion.p>
    </motion.div>
  )
})

AnimatedGradientText.displayName = 'AnimatedGradientText'
AnimatedGradientText.propTypes = {
  text: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  onNavigate: PropTypes.func.isRequired,
}

// 分离并优化导航项组件
const NavItem = memo(
  ({ item, isActive, handleNavigation, theme, isNavigating }) => {
    // 添加动画控制state
    const [isHovered, setIsHovered] = useState(false)

    return (
      <NavbarItem className='px-0.5 md:px-1 lg:px-2'>
        {' '}
        {/* 添加响应式内边距 */}
        <motion.a
          href={item.href}
          onClick={e => handleNavigation(item.href, e)}
          className={`relative px-1 py-2 text-sm font-medium tracking-wide transition-all duration-300 sm:px-2 md:px-3 lg:px-4 ${
            isActive(item.href)
              ? 'font-semibold text-emerald-600 dark:text-emerald-300'
              : theme === 'dark'
                ? 'text-gray-100'
                : 'text-gray-900'
          }`} // 移除 text-on-transparent 类
          whileHover={{
            scale: 1.05,
            color: theme === 'dark' ? 'rgb(167, 243, 208)' : 'rgb(5, 150, 105)',
          }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          aria-current={isActive(item.href) ? 'page' : undefined}
          role='menuitem'
          style={{ willChange: 'transform, color' }}
        >
          {item.name}

          {/* 活跃状态指示器 - 为每个导航项分配唯一的layoutId以防止动画冲突 */}
          {isActive(item.href) && (
            <motion.span
              className={`absolute bottom-0 left-0 h-0.5 w-full ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-300'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-500'
              }`}
              layoutId={`activeIndicator-${item.href.replace('#', '')}`}
              // 设置更高的过渡动画优先级，防止被滚动检测中断
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                // 在导航过程中加速过渡效果
                duration: isNavigating ? 0.2 : 0.3,
              }}
              style={{ willChange: 'transform' }}
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
                transition: { duration: 0.2 },
              }}
              style={{
                background: `linear-gradient(90deg, 
                ${theme === 'dark' ? '#34D399' : '#059669'} 0%, 
                ${theme === 'dark' ? '#A7F3D0' : '#10B981'} 50%, 
                ${theme === 'dark' ? '#34D399' : '#059669'} 100%)`,
                transformOrigin: 'left',
                willChange: 'transform',
              }}
              // 添加无障碍说明
              aria-hidden='true'
            />
          )}
        </motion.a>
      </NavbarItem>
    )
  }
)

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
  isNavigating: PropTypes.bool,
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

// 简化主题切换按钮，解决卡顿问题
const ThemeToggleButton = memo(({ theme, handleToggle }) => {
  return (
    <Button
      isIconOnly
      variant='light'
      color='success'
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      className='rounded-full p-2 transition-all duration-200 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30'
      onPress={() => {
        // 直接调用切换逻辑，移除额外检查
        handleToggle()
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{
          duration: 0.3, // 减少动画时长
          type: 'spring',
          stiffness: 150,
          damping: 15,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'dark' ? (
          <FiSun className='text-emerald-300' size={24} />
        ) : (
          <FiMoon className='text-emerald-800' size={24} />
        )}
      </motion.div>
    </Button>
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
  const [isNavigating, setIsNavigating] = useState(false) // 添加导航状态锁定
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const headerRef = useRef(null)
  const menuToggleRef = useRef(null)
  const menuClickedRef = useRef(false)
  const menuActionTimeRef = useRef(Date.now()) // 记录最近一次菜单操作的时间
  const prevScrollY = useRef(0) // 用于存储上一次滚动位置
  const navigationLockTimeRef = useRef(null) // 用于跟踪导航锁定时间

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
    stiffness: 50, // 降低刚度值
    damping: 20, // 调整阻尼
    restDelta: 0.005,
    mass: 0.5, // 降低质量，使动画更轻盈
  })

  // 修复hooks规则问题：预先创建transform函数
  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.05],
    [
      theme === 'dark' ? 'rgba(31, 41, 55, 0)' : 'rgba(255, 255, 255, 0)',
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
    ['blur(0px)', 'blur(8px)'] // 从0开始，减少初始模糊
  )

  // 使用已创建的transform函数
  const navbarTransforms = useMemo(() => {
    return {
      background: backgroundTransform,
      height: heightTransform,
      blur: blurTransform,
    }
  }, [backgroundTransform, heightTransform, blurTransform])

  // 使用useMemo缓存菜单项，移除隐藏选项
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
      {
        name: '联系我们',
        href: '#contact',
        icon: <FiMail className='mr-2' />,
      },
    ],
    []
  )

  // 检测屏幕尺寸变化，动态调整布局 - 移除未使用的状态
  useEffect(() => {
    const checkScreenSize = () => {
      // 可以在这里添加其他响应式逻辑，但不再设置未使用的状态
      // 现在这个effect是一个预留的hook，可以在将来添加响应式逻辑
    }

    // 初始检查
    checkScreenSize()

    // 添加resize监听
    window.addEventListener('resize', checkScreenSize)

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

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
    // 保存当前路径
    const currentPath = location.pathname

    // 简化主题切换，移除锁定机制
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

    // 如果在首页，更新导航项状态
    if (currentPath === '/' || currentPath === '/Homepage') {
      // 先重置，触发状态变化
      setActiveSection('')

      // 延迟更新当前section
      setTimeout(() => {
        const sections = ['tea-story', 'products', 'village', 'contact']
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (
              rect.top < window.innerHeight * 0.7 &&
              rect.bottom > window.innerHeight * 0.3
            ) {
              setActiveSection(`#${section}`)
              break
            }
          }
        }
      }, 50) // 减少延迟时间
    }
  }, [setTheme, location.pathname, setActiveSection])

  // 优化导航函数 - 添加导航锁定机制
  const handleNavigation = useCallback(
    (href, event) => {
      if (event) event.preventDefault()

      // 如果已经在导航中，忽略重复点击
      if (isNavigating) return

      // 设置导航状态锁定
      setIsNavigating(true)

      // 清除之前的任何导航锁定计时器
      if (navigationLockTimeRef.current) {
        clearTimeout(navigationLockTimeRef.current)
      }

      if (isMenuOpen) {
        setIsMenuOpen(false)
      }

      if (href.startsWith('#')) {
        // 立即更新活跃状态以响应用户点击
        setActiveSection(href)

        if (location.pathname !== '/' && location.pathname !== '/Homepage') {
          navigate('/')

          // 当需要先导航到首页时，给予额外时间
          setTimeout(() => {
            scrollToElement(href)

            // 延长导航锁定时间，防止滚动检测干扰指示器
            navigationLockTimeRef.current = setTimeout(() => {
              setIsNavigating(false)
            }, 800) // 给予足够时间完成滚动和动画
          }, 100)
        } else {
          scrollToElement(href)

          // 设置较短的导航锁定时间
          navigationLockTimeRef.current = setTimeout(() => {
            setIsNavigating(false)
          }, 600) // 给予足够时间完成滚动和动画
        }
      } else {
        navigate(href)
        setActiveSection(href)
        window.scrollTo(0, 0)

        // 页面跳转后解除导航锁定
        navigationLockTimeRef.current = setTimeout(() => {
          setIsNavigating(false)
        }, 300)
      }
    },
    [
      isMenuOpen,
      location.pathname,
      navigate,
      scrollToElement,
      setActiveSection,
      isNavigating,
    ]
  )

  // 优化滚动检测，使用节流减少触发频率并添加方向检测
  useEffect(() => {
    // 预先缓存部分选择器和常量，避免在滚动函数中重复创建
    const isHomePage =
      location.pathname === '/' || location.pathname === '/Homepage'
    const viewportHeight = window.innerHeight
    const sections = ['tea-story', 'products', 'village', 'contact']
    const sectionElements = sections
      .map(section => ({
        id: section,
        element: document.getElementById(section),
      }))
      .filter(item => item.element) // 过滤掉未找到的元素

    // 只在首页才进行区域检测
    if (!isHomePage || sectionElements.length === 0) return

    const checkSections = () => {
      // 如果当前正在进行导航操作，跳过滚动检测
      if (isNavigating) return

      if (isHomePage) {
        let currentSection = ''
        let minDistance = Infinity

        // 仅在滚动方向改变或滚动量足够大时才重新计算
        const currentScrollY = window.scrollY
        const isScrollingDown = currentScrollY > prevScrollY.current
        const scrollDelta = Math.abs(currentScrollY - prevScrollY.current)
        prevScrollY.current = currentScrollY

        // 通过增加滚动变化阈值，显著减少检测频率
        if (
          scrollDelta < 20 &&
          ((isScrollingDown && scrollYProgress.get() > 0.1) ||
            (!isScrollingDown && scrollYProgress.get() < 0.9))
        ) {
          return
        }

        // 使用缓存的元素列表，避免在滚动时频繁调用 document.getElementById
        for (const { id, element } of sectionElements) {
          if (element) {
            const rect = element.getBoundingClientRect()
            // 使用视窗中点作为参考点，更准确地判断用户关注区域
            const absMidDistance = Math.abs(
              rect.top + rect.height / 2 - viewportHeight / 2
            )

            if (absMidDistance < minDistance) {
              minDistance = absMidDistance
              // 增加激活区域的阈值，减少边界抖动问题
              if (
                rect.top < viewportHeight * 0.75 &&
                rect.bottom > viewportHeight * 0.25
              ) {
                currentSection = `#${id}`
              }
            }
          }
        }

        // 只在新区域与当前活跃区域不同时更新状态，减少不必要的渲染
        if (currentSection && currentSection !== activeSection) {
          setActiveSection(currentSection)
        } else if (!currentSection && scrollYProgress.get() < 0.15) {
          // 增加顶部区域的判定阈值，提供更平滑的首页激活体验
          setActiveSection('/')
        }
      }
    }

    // 利用 requestAnimationFrame 保证视觉更新与浏览器渲染周期同步
    let ticking = false
    let scrollTimeout
    let rafId

    const handleScroll = () => {
      // 快速更新滚动状态，这是视觉上高优先级的更新
      if (window.scrollY > 20 !== scrolled) {
        setScrolled(window.scrollY > 20)
      }

      // 取消任何待执行的区域检测，以实现更高效的防抖
      clearTimeout(scrollTimeout)

      // 延长防抖时间，大幅减少运算频率
      scrollTimeout = setTimeout(() => {
        if (!ticking) {
          // 使用 requestAnimationFrame 确保在下一帧绘制前计算，优化性能
          rafId = window.requestAnimationFrame(() => {
            checkSections()
            ticking = false
          })
          ticking = true
        }
      }, 150) // 增加到150ms，在保持响应性的同时大幅减少计算频率
    }

    // 使用 passive 选项提高滚动性能
    window.addEventListener('scroll', handleScroll, { passive: true })

    // 组件挂载后进行一次初始检查
    if (isHomePage) {
      // 延迟初始检查，确保所有元素都已正确渲染和定位
      setTimeout(checkSections, 200)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [
    location.pathname,
    activeSection,
    scrollYProgress,
    scrolled,
    isNavigating,
  ]) // 添加isNavigating作为依赖

  // 使用记忆化优化isActive函数，减少不必要的重新计算
  const isActive = useCallback(
    href => {
      // 首页特殊逻辑优化
      if (href === '/') {
        return (
          (location.pathname === '/' || location.pathname === '/Homepage') &&
          (activeSection === '/' || !activeSection)
        )
      }

      // 直接比较路径和活跃区域，实现O(1)时间复杂度
      return location.pathname === href || activeSection === href
    },
    [location.pathname, activeSection]
  )

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (navigationLockTimeRef.current) {
        clearTimeout(navigationLockTimeRef.current)
      }
    }
  }, [])

  // 移除header整体的whileHover效果
  return (
    <motion.div
      ref={headerRef}
      style={{
        backgroundColor: navbarTransforms.background,
        backdropFilter: navbarTransforms.blur,
        willChange: 'backdrop-filter, height',
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
    >
      {/* 保留进度指示器，但也移除它的悬浮效果 */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-emerald-400 to-teal-500'
        style={{ scaleX, willChange: 'transform' }}
      />

      {/* 添加外层容器，用于居中整个导航栏 */}
      <div className='container mx-auto px-4'>
        <NextUINavbar
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={handleNextUIMenuChange}
          shouldHideOnScroll={false}
          isBordered={false}
          maxWidth='xl'
          className='mx-auto bg-transparent'
          style={{ height: navbarTransforms.height }}
          isBlurred={false}
        >
          {/* 移动端布局改进 - 左侧菜单按钮 */}
          <NavbarContent className='w-1/3 lg:hidden' justify='start'>
            <div
              ref={menuToggleRef}
              onClick={isPageReady ? handleMenuToggle : undefined}
              className={`cursor-pointer p-2 ${isPageReady ? '' : 'pointer-events-none'}`}
            >
              <NavbarMenuToggle
                aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
                className={
                  theme === 'dark' ? 'text-emerald-300' : 'text-emerald-600'
                }
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                isselected={isMenuOpen ? 'true' : 'false'}
              />
            </div>
          </NavbarContent>

          {/* 移动端布局改进 - 中间Logo居中 */}
          <NavbarContent className='w-1/3 lg:hidden' justify='center'>
            <NavbarBrand className='flex items-center justify-center'>
              <motion.img
                src={Logo}
                alt='后花园庄宋茶'
                className={`h-10 w-10 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
              />
              {/* 移动端使用简化版动画标题 */}
              <motion.p
                className={
                  theme === 'dark'
                    ? 'text-lg font-bold text-emerald-300'
                    : 'text-lg font-bold text-emerald-600'
                }
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                后花园庄<span className='ml-1 align-top text-xs'>宋茶</span>
              </motion.p>
            </NavbarBrand>
          </NavbarContent>

          {/* 大屏幕左侧品牌标识 - 使用新的动画文字组件 */}
          <NavbarContent className='hidden lg:flex' justify='start'>
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
                className='flex h-full items-center' // 添加 h-full
                style={{ cursor: 'pointer' }}
              >
                <motion.img
                  src={Logo}
                  alt='后花园庄宋茶'
                  className={`mr-3 h-10 w-10 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                  onClick={e => handleNavigation('/', e)}
                  whileHover={{ scale: 1.05, rotate: 10 }}
                  whileTap={{ scale: 0.95 }}
                />
                {/* 添加 my-auto 以实现垂直居中 */}
                <div className='my-auto'>
                  <AnimatedGradientText
                    text='后花园庄'
                    subText='岛屿记忆·宋茶'
                    theme={theme}
                    onNavigate={e => handleNavigation('/', e)}
                  />
                </div>
              </motion.div>
            </NavbarBrand>
          </NavbarContent>

          {/* 导航链接部分 - 使用flex-auto确保自适应填充可用空间 */}
          <NavbarContent
            className='hidden justify-center lg:flex lg:flex-auto'
            justify='center'
          >
            <div className='flex items-center justify-center space-x-1 xl:space-x-2'>
              {menuItems.map((item, index) => (
                <NavItem
                  key={`${index}-${theme}`}
                  item={item}
                  isActive={isActive}
                  handleNavigation={handleNavigation}
                  theme={theme}
                  isNavigating={isNavigating}
                />
              ))}
            </div>
          </NavbarContent>

          {/* 主题切换按钮 - 在所有屏幕尺寸下都显示 */}
          <NavbarContent justify='end' className='w-auto'>
            <NavbarItem>
              <ThemeToggleButton theme={theme} handleToggle={handleToggle} />
            </NavbarItem>
          </NavbarContent>

          {/* 改进的移动端菜单 - 优化性能，修复卡顿问题 */}
          <NavbarMenu
            className={
              theme === 'dark'
                ? 'bg-gray-900/95 pt-6 backdrop-blur-xl'
                : 'bg-white/95 pt-6 backdrop-blur-xl'
            }
            // 预加载菜单以避免首次点击卡顿
            style={{
              opacity: isMenuOpen ? 1 : 0,
              visibility: isMenuOpen ? 'visible' : 'hidden',
              // 使用硬件加速
              willChange: 'opacity, transform',
              // 使用硬件加速的CSS属性
              transform: isMenuOpen
                ? 'translateY(0)'
                : 'translateY(-10px) translateZ(0)',
              transition:
                'opacity 250ms ease, transform 250ms ease, visibility 250ms ease',
              pointerEvents: isMenuOpen ? 'auto' : 'none',
            }}
          >
            <div className='container mx-auto px-4 pt-4'>
              {/* 添加菜单标题增强用户体验 */}
              <motion.h3
                className={`mb-6 text-lg font-medium ${
                  theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'
                }`} // 移除 text-on-transparent 类
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  x: isMenuOpen ? 0 : -20,
                }}
                transition={{ delay: 0.05 }} // 减少延迟时间
              >
                导航菜单
              </motion.h3>

              <div className='grid gap-2'>
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
              </div>

              {/* 添加品牌信息到菜单底部 */}
              <motion.div
                className={`mt-8 border-t ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                } pt-4 text-sm opacity-80`}
                initial={{ opacity: 0 }}
                animate={{ opacity: isMenuOpen ? 0.8 : 0 }}
                transition={{ delay: 0.2 }} // 减少延迟时间
              >
                <p
                  className={
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }
                >
                  © 2024 醉茶小皇帝
                </p>
              </motion.div>
            </div>
          </NavbarMenu>
        </NextUINavbar>
      </div>
    </motion.div>
  )
}

Header.displayName = 'Header'
export default Header
