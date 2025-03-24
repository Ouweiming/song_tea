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
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  FiHome,
  FiInfo,
  FiMail,
  FiMoon,
  FiShoppingBag,
  FiSun,
} from 'react-icons/fi'

import Logo from './assets/logo.svg'
import './index.css'
// 使用我们自定义的hooks
import { routerFutureConfig } from './router-config'
import { useLocation, useNavigate } from './router-provider'
import { useTheme } from './useTheme'
// 从工具文件导入throttle，但确保在代码中使用它
import { throttle } from './utils/domUtils'

// 确保React Router知道future标志
// eslint-disable-next-line no-unused-vars
const routerConfig = routerFutureConfig

// 分离并优化导航项组件 - 添加下划线悬停效果
const NavItem = memo(
  ({
    item,
    isActive,
    handleNavigation,
    theme,
    isNavigating, // 保留这个参数，用于动画时序调整
    compact = false,
  }) => {
    return (
      <NavbarItem className='px-0.5 md:px-1 lg:px-2'>
        <motion.a
          href={item.href}
          onClick={e => handleNavigation(item.href, e)}
          className={`nav-link-hover relative whitespace-nowrap px-1 py-1 text-sm font-normal tracking-wide sm:px-1 md:px-2 lg:px-3 xl:px-4 ${
            isActive(item.href)
              ? 'font-medium text-emerald-600 dark:text-emerald-300'
              : theme === 'dark'
                ? 'text-gray-100'
                : 'text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }} // 仅保留缩放效果
          whileTap={{ scale: 0.95 }}
          aria-current={isActive(item.href) ? 'page' : undefined}
          role='menuitem'
          style={{ willChange: 'transform' }}
          // 根据导航状态调整动画
          data-navigating={isNavigating ? 'true' : 'false'}
        >
          {/* 在紧凑模式下显示短名称或图标 */}
          {compact ? (
            <span className='flex items-center'>
              {item.icon && (
                <span className='mr-1'>
                  {React.cloneElement(item.icon, { className: '' })}
                </span>
              )}
              <span>{item.shortName || item.name.substring(0, 2)}</span>
            </span>
          ) : (
            item.name
          )}

          {/* 激活状态指示器 - 简化过渡动画 */}
          {isActive(item.href) && (
            <motion.span
              className={`absolute bottom-0 left-0 h-0.5 w-full ${
                theme === 'dark' ? 'bg-emerald-300' : 'bg-emerald-600'
              }`}
              layoutId={`activeIndicator-${item.href.replace('#', '')}`}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: isNavigating ? 0.15 : 0.2, // 使用isNavigating调整动画时长
              }}
              style={{ willChange: 'transform' }}
              aria-hidden='true'
            />
          )}
        </motion.a>
      </NavbarItem>
    )
  }
)

// 更新NavItem的PropTypes，添加compact属性
NavItem.displayName = 'NavItem'
NavItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    href: PropTypes.string.isRequired,
    icon: PropTypes.node,
  }).isRequired,
  isActive: PropTypes.func.isRequired,
  handleNavigation: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  isNavigating: PropTypes.bool,
  compact: PropTypes.bool,
}

// 分离并优化菜单项组件 - 添加下划线悬停效果
const MenuItem = memo(
  ({ item, isActive, handleNavigation, theme: themeMode, index }) => {
    return (
      <NavbarMenuItem>
        <motion.a
          href={item.href}
          onClick={e => handleNavigation(item.href, e)}
          className={`menu-link-hover flex w-full items-center py-3 text-lg ${
            isActive(item.href)
              ? 'font-medium text-emerald-600 dark:text-emerald-300'
              : 'text-gray-700 dark:text-gray-200'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 * index }}
          whileHover={{ x: 5 }} // 仅保留位移效果
          data-theme={themeMode} // 使用主题值作为数据属性，避免未使用警告
        >
          <span className='mr-2'>{item.icon}</span>
          {item.name}
        </motion.a>
      </NavbarMenuItem>
    )
  }
)

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

// 简化主题切换按钮动画效果
const ThemeToggleButton = memo(({ theme, handleToggle }) => {
  return (
    <Button
      isIconOnly
      variant='light'
      color='success'
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      className='rounded-full p-2 transition-all duration-100 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30'
      onPress={handleToggle}
    >
      {theme === 'dark' ? (
        <FiSun className='text-emerald-300' size={24} />
      ) : (
        <FiMoon className='text-emerald-800' size={24} />
      )}
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
  const { setTheme, theme, isChangingTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isPageReady, setIsPageReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const headerRef = useRef(null)
  const menuToggleRef = useRef(null)
  const menuClickedRef = useRef(false)
  const menuActionTimeRef = useRef(Date.now())
  const navigationLockTimeRef = useRef(null)

  // 添加页面加载完成后的准备状态
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 500)

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
    }, 500)
  }, [])

  // 强制同步外部菜单状态和内部实现
  const handleNextUIMenuChange = useCallback(
    open => {
      if (!menuClickedRef.current && isPageReady) {
        setTimeout(() => {
          setIsMenuOpen(open)
        }, 50)
      }
    },
    [isPageReady]
  )

  // 优化spring效果，降低渲染负担
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.005,
    mass: 0.5,
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
    ['blur(0px)', 'blur(8px)']
  )

  // 使用已创建的transform函数
  const navbarTransforms = useMemo(() => {
    return {
      background: backgroundTransform,
      height: heightTransform,
      blur: blurTransform,
    }
  }, [backgroundTransform, heightTransform, blurTransform])

  // 添加屏幕尺寸状态
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  })

  // 修改缓存菜单项，将"首页"改为"茶韵主页"或其他四字选项
  const menuItems = useMemo(
    () => [
      { name: '茶韵主页', shortName: '主页', href: '/', icon: <FiHome /> },
      {
        name: '茶品故事',
        shortName: '故事',
        href: '#tea-story',
        icon: <FiInfo />,
      },
      {
        name: '产品展示',
        shortName: '产品',
        href: '#products',
        icon: <FiShoppingBag />,
      },
      {
        name: '联系我们',
        shortName: '联系',
        href: '#contact',
        icon: <FiMail />,
      },
    ],
    []
  )

  // 更新屏幕尺寸检测，为不同尺寸设置状态
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setScreenSize({
        width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      })
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

    // 如果正在切换中，直接返回防止连续操作
    if (isChangingTheme) return

    // 切换主题
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

    // 使用rAF延迟非关键更新，减轻主线程负担
    if (currentPath === '/' || currentPath === '/Homepage') {
      // 先重置，减少不必要的渲染
      requestAnimationFrame(() => {
        // 使用更轻量的检测方法
        const detectVisibleSection = () => {
          // 只检查关键部分，避免重复查询DOM
          let currentSection = ''
          const sections = ['tea-story', 'products', 'contact']

          for (const section of sections) {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              if (
                rect.top < window.innerHeight * 0.7 &&
                rect.bottom > window.innerHeight * 0.3
              ) {
                currentSection = `#${section}`
                break
              }
            }
          }

          // 只有当有变化时才更新状态
          if (currentSection && currentSection !== activeSection) {
            setActiveSection(currentSection)
          } else if (!currentSection && scrollYProgress.get() < 0.15) {
            setActiveSection('/')
          }
        }

        // 延迟执行，给主题切换足够时间完成
        setTimeout(detectVisibleSection, 150)
      })
    }
  }, [
    setTheme,
    location.pathname,
    setActiveSection,
    activeSection,
    scrollYProgress,
    isChangingTheme,
  ])

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
            }, 800)
          }, 100)
        } else {
          scrollToElement(href)

          // 设置较短的导航锁定时间
          navigationLockTimeRef.current = setTimeout(() => {
            setIsNavigating(false)
          }, 600)
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
    const sections = ['tea-story', 'products', 'contact']

    // 只在首页才进行区域检测
    if (!isHomePage) return

    // 预先获取所有区域元素，避免重复查询DOM
    const sectionRefs = {}
    const viewportHeight = window.innerHeight

    // 一次性获取并缓存所有元素引用
    sections.forEach(id => {
      const element = document.getElementById(id)
      if (element) sectionRefs[id] = element
    })

    // 如果没有找到任何元素，则不继续
    if (Object.keys(sectionRefs).length === 0) return

    // 更高效的滚动处理函数
    const handleScroll = throttle(() => {
      // 防止在导航期间处理滚动
      if (isNavigating) return

      // 立即更新滚动状态 - 这是高优先项
      const currentScrollY = window.scrollY
      if (currentScrollY > 20 !== scrolled) {
        setScrolled(currentScrollY > 20)
      }

      // 使用rAF确保在下一帧处理布局计算
      requestAnimationFrame(() => {
        // 批量读取所有DOM信息，避免引起多次回流
        const measurements = {}
        for (const [id, element] of Object.entries(sectionRefs)) {
          measurements[id] = element.getBoundingClientRect()
        }

        // 现在一次性计算最近的区域
        let nearestSection = null
        let minDistance = Infinity

        for (const [id, rect] of Object.entries(measurements)) {
          const midpoint = rect.top + rect.height / 2
          const distance = Math.abs(midpoint - viewportHeight / 2)

          if (
            distance < minDistance &&
            rect.top < viewportHeight * 0.75 &&
            rect.bottom > viewportHeight * 0.25
          ) {
            minDistance = distance
            nearestSection = `#${id}`
          }
        }

        // 只在需要时更新activeSection
        if (nearestSection && nearestSection !== activeSection) {
          setActiveSection(nearestSection)
        } else if (
          !nearestSection &&
          scrollYProgress.get() < 0.15 &&
          currentScrollY < 100
        ) {
          setActiveSection('/')
        }
      })
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 组件挂载后执行一次初始检查
    setTimeout(() => requestAnimationFrame(handleScroll), 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    location.pathname,
    activeSection,
    scrollYProgress,
    scrolled,
    isNavigating,
  ])

  // 改进 isActive 函数，确保正确处理首页状态
  const isActive = useCallback(
    href => {
      // 首页特殊逻辑优化
      if (href === '/') {
        return (
          (location.pathname === '/' || location.pathname === '/Homepage') &&
          (activeSection === '/' || activeSection === '') // 只有当activeSection真的是首页或未设置时才激活
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
          {/* 移动端布局 - 仅在小屏幕显示 */}
          <NavbarContent
            className='sm:w-[15%] md:w-[20%] lg:hidden'
            justify='start'
          >
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

          {/* 移动端Logo - 居中显示 - 修改文字居中问题 */}
          <NavbarContent
            className='flex-1 justify-center lg:hidden'
            justify='center'
          >
            <NavbarBrand className='mx-auto flex w-full items-center justify-center'>
              <div className='flex flex-row items-center justify-center'>
                <img
                  src={Logo}
                  alt='后花园庄宋茶'
                  className={`h-12 w-12 md:h-14 md:w-14 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                />
                <div
                  className={
                    theme === 'dark'
                      ? 'ml-2 flex items-center text-emerald-300'
                      : 'ml-2 flex items-center text-emerald-600'
                  }
                >
                  <span className='text-lg font-bold md:text-xl'>后花园庄</span>
                  <span className='ml-1 text-xs'>宋茶</span>
                </div>
              </div>
            </NavbarBrand>
          </NavbarContent>

          {/* 大屏幕Logo - 固定宽度和位置 */}
          <NavbarContent className='hidden w-[25%] lg:flex' justify='start'>
            <NavbarBrand className='flex w-full max-w-[220px] items-center'>
              <div
                className='flex h-full cursor-pointer items-center'
                onClick={e => handleNavigation('/', e)}
              >
                <img
                  src={Logo}
                  alt='后花园庄宋茶'
                  className={`mr-6 h-14 w-14 transition-opacity duration-300 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                />
              </div>
            </NavbarBrand>
          </NavbarContent>

          {/* 导航菜单 - 中心区域 */}
          <NavbarContent
            className='hidden md:w-[60%] lg:flex lg:w-[50%]'
            justify='center'
          >
            <div className='flex w-full items-center justify-center space-x-1 whitespace-nowrap xl:space-x-3'>
              {menuItems.map((item, index) => (
                <NavItem
                  key={`${index}-${theme}`}
                  item={item}
                  isActive={isActive}
                  handleNavigation={handleNavigation}
                  theme={theme}
                  isNavigating={isNavigating}
                  compact={screenSize.isTablet} // 平板使用紧凑模式
                />
              ))}
            </div>
          </NavbarContent>

          {/* 主题切换按钮 */}
          <NavbarContent
            justify='end'
            className='sm:w-[20%] md:w-[20%] lg:w-[25%]'
          >
            <NavbarItem className='flex justify-end'>
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
              // 优化性能的CSS属性
              transform: isMenuOpen
                ? 'translateY(0) translateZ(0)' // 添加translateZ(0)开启GPU加速
                : 'translateY(-10px) translateZ(0)',
              // 指定只改变这两个属性，避免重绘其他属性
              transition:
                'opacity 250ms ease, transform 250ms ease, visibility 250ms ease',
            }}
          >
            <div className='container mx-auto px-4 pt-4'>
              {/* 添加菜单标题增强用户体验 */}
              <motion.h3
                className={`mb-6 text-lg font-medium ${
                  theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  x: isMenuOpen ? 0 : -20,
                }}
                transition={{ delay: 0.05 }}
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
                transition={{ delay: 0.2 }}
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
