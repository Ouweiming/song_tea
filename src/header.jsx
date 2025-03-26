import {
  Button,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
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

// 导入SVG图标组件
import LogoIcon from './icons/LogoIcon'
import './index.css'
// 使用我们自定义的hooks
import { useLocation, useNavigate } from './router-provider'
// 导入新创建的Zustand store
import useHeaderStore from './stores/headerStore'
import { useTheme } from './useTheme'

// eslint-disable-next-line no-unused-vars
const routerConfig = {}

// 将重复的激活状态判断逻辑提取为共享函数
const isItemActiveCheck = (href, pathname, activeSection) => {
  if (href === '/') {
    return (
      (pathname === '/' || pathname === '/Homepage') &&
      (activeSection === '/' ||
        activeSection === '' ||
        activeSection === '#home-welcome')
    )
  }
  return pathname === href || activeSection === href
}

// 优化导航项组件 - 使用Zustand高效订阅机制
const NavItem = memo(
  ({
    item,
    handleNavigation,
    theme,
    isNavigating,
    isThemeChanging,
    compact = false,
  }) => {
    // 强制监听activeSection变化，不使用React.memo的比较函数
    // 直接从store获取activeSection状态
    const activeSection = useHeaderStore(state => state.activeSection)
    const location = useLocation()

    // 内部计算active状态，使用console标记状态变化
    const isItemActive = useMemo(
      () => isItemActiveCheck(item.href, location.pathname, activeSection),
      [item.href, location.pathname, activeSection]
    )

    const activeIndicatorStyle = useMemo(() => {
      return isItemActive
        ? { opacity: 1 }
        : { opacity: 0, pointerEvents: 'none' }
    }, [isItemActive])

    return (
      <NavbarItem className='px-0.5 md:px-1 lg:px-2'>
        <motion.a
          href={item.href}
          onClick={e => handleNavigation(item.href, e)}
          className={`nav-link-hover relative whitespace-nowrap px-1 py-1 text-sm font-normal tracking-wide sm:px-1 md:px-2 lg:px-3 xl:px-4 ${
            isItemActive
              ? 'font-medium text-emerald-600 dark:text-emerald-300'
              : theme === 'dark'
                ? 'text-gray-100'
                : 'text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-current={isItemActive ? 'page' : undefined}
          role='menuitem'
          style={{ willChange: 'transform' }}
          data-navigating={isNavigating ? 'true' : 'false'}
          data-active={isItemActive ? 'true' : 'false'}
          data-href={item.href}
          data-section={activeSection}
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

          {/* 指示器 - 始终渲染，但通过条件控制可见性，避免动画问题 */}
          {isThemeChanging ? (
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-full ${
                theme === 'dark' ? 'bg-emerald-300' : 'bg-emerald-600'
              }`}
              aria-hidden='true'
              style={{ opacity: isItemActive ? 1 : 0 }}
            />
          ) : (
            <motion.span
              className={`absolute bottom-0 left-0 h-0.5 w-full ${
                theme === 'dark' ? 'bg-emerald-300' : 'bg-emerald-600'
              }`}
              layoutId={`activeIndicator-${item.href.replace('#', '')}`}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: isNavigating ? 0.3 : 0.2, // 增加导航中的动画时间
              }}
              style={activeIndicatorStyle}
              aria-hidden='true'
            />
          )}
        </motion.a>
      </NavbarItem>
    )
  }
)

// 更新NavItem的PropTypes
NavItem.displayName = 'NavItem'
NavItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    shortName: PropTypes.string,
    href: PropTypes.string.isRequired,
    icon: PropTypes.node,
  }).isRequired,
  handleNavigation: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  isNavigating: PropTypes.bool,
  isThemeChanging: PropTypes.bool,
  compact: PropTypes.bool,
}

// 优化主题切换按钮动画效果
const ThemeToggleButton = memo(({ theme, handleToggle }) => {
  return (
    <Button
      isIconOnly
      variant='light'
      color='success'
      aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      className='rounded-full p-2 transition-all duration-100 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30'
      onPress={handleToggle} // 改回使用 onPress 而不是 onClick
      data-current-theme={theme}
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

// 主标题栏组件
const Header = () => {
  // 添加forceUpdate函数用于手动刷新组件
  const [, forceUpdate] = useState({})

  // 从store中获取状态和动作
  const {
    isPageReady,
    isNavigating,
    screenSize,
    setIsPageReady,
    setIsNavigating,
    setActiveSection,
    updateScreenSize,
    handleScroll: storeHandleScroll,
    updatePerfMetrics,
    activeSection, // 直接获取activeSection用于监控变化
  } = useHeaderStore()

  const { setTheme, theme, isChangingTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const headerRef = useRef(null)
  const navigationLockTimeRef = useRef(null)
  // 新增滚动节流优化引用
  const scrollThrottleTimerRef = useRef(null)
  const lastScrollTimeRef = useRef(0)

  // 初始化
  useEffect(() => {
    // 立即设置初始滚动状态
    const initialScrollY = window.scrollY || window.pageYOffset
    useHeaderStore.getState().setScrolled(initialScrollY > 20)

    // 初始化屏幕尺寸
    updateScreenSize()

    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [setIsPageReady, updateScreenSize])

  // 优化spring效果，降低渲染负担
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.005,
    mass: 0.5,
  })

  // 创建统一的背景色样式函数
  const getBackgroundColor = useCallback((isDark, transparency) => {
    return isDark
      ? `rgba(31, 41, 55, ${transparency})`
      : `rgba(255, 255, 255, ${transparency})`
  }, [])

  // 修复hooks规则问题：预先创建transform函数
  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.05],
    [
      getBackgroundColor(theme === 'dark', 0),
      getBackgroundColor(theme === 'dark', 0.95),
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

  // 菜单项定义
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

  // 屏幕尺寸响应式管理
  useEffect(() => {
    // 使用防抖函数减少处理频率
    const debounce = (func, wait) => {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    const debouncedUpdateScreenSize = debounce(updateScreenSize, 150)

    // 使用passive标志提高性能
    window.addEventListener('resize', debouncedUpdateScreenSize, {
      passive: true,
    })

    return () => {
      window.removeEventListener('resize', debouncedUpdateScreenSize)
    }
  }, [updateScreenSize])

  // 优化滚动函数，确保元素顶部对齐导航栏底部
  const scrollToElement = useCallback(
    href => {
      if (!href || typeof href !== 'string') return

      const selector = href.startsWith('#')
        ? href
        : `#${href.replace(/^\/+/, '')}`

      try {
        const element = document.querySelector(selector)
        if (!element) return

        const headerHeight = headerRef.current?.offsetHeight || 80
        const elementBox = element.getBoundingClientRect()
        const scrollY = window.scrollY
        const offsetPosition = elementBox.top + scrollY - headerHeight - 10

        requestAnimationFrame(() => {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
          setActiveSection(href)
        })
      } catch (error) {
        console.error('滚动错误:', error)
      }
    },
    [setActiveSection]
  )

  // 优化主题切换
  const handleToggle = useCallback(() => {
    // 移除控制台日志
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  // 优化导航函数 - 通过批处理减少DOM更新并修复闪烁问题
  const handleNavigation = useCallback(
    (href, event) => {
      // 接受NextUI的事件对象或普通事件对象
      if (event && event.preventDefault) {
        event.preventDefault()
        // 防止事件冒泡
        event.stopPropagation && event.stopPropagation()
      }

      // 如果已经在导航中，忽略重复点击
      if (isNavigating) return

      // 立即设置导航状态锁定并更新activeSection
      // 首页需要特殊处理 - 添加明确标记，防止滚动检测干扰
      if (href === '/') {
        setActiveSection('/')
        // 设置直接导航到首页的标志
        useHeaderStore.getState().setDirectToHome(true)
      } else {
        setActiveSection(href)
      }
      setIsNavigating(true)

      // 清除之前的任何导航锁定计时器
      if (navigationLockTimeRef.current) {
        clearTimeout(navigationLockTimeRef.current)
      }

      if (href.startsWith('#')) {
        if (location.pathname !== '/' && location.pathname !== '/Homepage') {
          navigate('/')

          // 当需要先导航到首页时，给予额外时间
          setTimeout(() => {
            scrollToElement(href)

            // 延长导航锁定时间，防止滚动检测干扰指示器
            navigationLockTimeRef.current = setTimeout(() => {
              setIsNavigating(false)
              // 滚动完成后清除直接导航标志
              useHeaderStore.getState().setDirectToHome(false)
            }, 1500) // 增加到1500ms，确保覆盖整个滚动过程
          }, 100)
        } else {
          scrollToElement(href)

          // 设置较长的导航锁定时间
          navigationLockTimeRef.current = setTimeout(() => {
            setIsNavigating(false)
            // 滚动完成后清除直接导航标志
            useHeaderStore.getState().setDirectToHome(false)
          }, 1500) // 增加到1500ms
        }
      } else {
        navigate(href)

        // 使用RAF包装滚动操作，避免强制回流
        requestAnimationFrame(() => {
          window.scrollTo(0, 0)
        })

        // 页面跳转后解除导航锁定
        navigationLockTimeRef.current = setTimeout(() => {
          setIsNavigating(false)
          // 滚动完成后清除直接导航标志
          if (href === '/') {
            // 给予额外时间确保首页导航完成
            setTimeout(() => {
              useHeaderStore.getState().setDirectToHome(false)
            }, 500)
          }
        }, 500) // 增加到500ms，确保有足够时间完成导航
      }
    },
    [
      location.pathname,
      navigate,
      scrollToElement,
      setActiveSection,
      isNavigating,
      setIsNavigating,
    ]
  )

  // 优化移动端按钮点击体验
  const handleMobileNavigation = useCallback(
    (href, event) => {
      // 阻止默认行为
      if (event) {
        event.preventDefault && event.preventDefault()
        event.stopPropagation && event.stopPropagation()
      }

      // 立即调用主导航函数
      handleNavigation(href, event)
    },
    [handleNavigation]
  )

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => {
      if (navigationLockTimeRef.current) {
        clearTimeout(navigationLockTimeRef.current)
      }
    }
  }, [])

  // 完全重写滚动监听逻辑，使用更轻量的节流处理
  useEffect(() => {
    // 使用更轻量的节流函数，减少时间间隔到50ms
    const throttledScroll = () => {
      const now = Date.now()
      // 减少到50ms以增加响应性
      if (now - lastScrollTimeRef.current < 50) {
        if (scrollThrottleTimerRef.current) {
          cancelAnimationFrame(scrollThrottleTimerRef.current)
        }

        scrollThrottleTimerRef.current = requestAnimationFrame(() => {
          // 确保状态更新是在React批处理中进行
          if (!isNavigating && !isChangingTheme) {
            // 批量处理DOM读取和状态更新操作
            storeHandleScroll()
            // 安全地调用updatePerfMetrics
            if (typeof updatePerfMetrics === 'function') {
              updatePerfMetrics('scrollEvents')
            }
          }
          lastScrollTimeRef.current = now
        })
        return
      }

      lastScrollTimeRef.current = now
      // 使用requestAnimationFrame确保DOM操作与渲染同步
      scrollThrottleTimerRef.current = requestAnimationFrame(() => {
        if (!isNavigating && !isChangingTheme) {
          // 直接触发状态更新
          storeHandleScroll()
          // 安全地调用updatePerfMetrics
          if (typeof updatePerfMetrics === 'function') {
            updatePerfMetrics('scrollEvents')
          }
        }
      })
    }

    // 使用passive标志提高性能
    window.addEventListener('scroll', throttledScroll, { passive: true })

    // 初始化时立即执行一次
    throttledScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
      if (scrollThrottleTimerRef.current) {
        cancelAnimationFrame(scrollThrottleTimerRef.current)
      }
    }
  }, [isNavigating, isChangingTheme, storeHandleScroll, updatePerfMetrics])

  // 监听activeSection变化
  useEffect(() => {
    // 当activeSection变化时，强制更新组件
    // console.log('Active section changed:', activeSection);
    forceUpdate({})
  }, [activeSection])

  return isPageReady ? (
    <motion.div
      className='fixed left-0 right-0 top-0 z-50'
      style={{
        backgroundColor: navbarTransforms.background,
        backdropFilter: navbarTransforms.blur,
        willChange: 'backdrop-filter, height',
        transform: 'translateZ(0)', // 添加GPU加速
      }}
      data-theme-switching={isChangingTheme ? 'true' : 'false'}
    >
      {/* 进度指示器 */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-emerald-400 to-teal-500'
        style={{
          scaleX,
          willChange: 'transform',
          opacity: 1, // 移除主题切换时的不透明度变化
        }}
      />

      {/* 外层容器，用于居中整个导航栏 */}
      <div className='container mx-auto px-4'>
        <NextUINavbar
          ref={headerRef}
          shouldHideOnScroll={false}
          isBordered={false}
          maxWidth='xl'
          className='mx-auto bg-transparent'
          style={{ height: navbarTransforms.height }}
          isBlurred={false}
        >
          {/* 移动端导航区域 - 左侧Logo和右侧图标导航 */}
          <NavbarContent
            className='w-[60%] sm:w-[50%] md:w-[40%] lg:hidden'
            justify='start'
          >
            <NavbarBrand className='flex items-center'>
              <div
                className='flex cursor-pointer flex-row items-center'
                onClick={e => handleNavigation('/', e)}
              >
                {/* 替换为SVG图标组件 */}
                <LogoIcon
                  size={56}
                  theme={theme}
                  className='transition-colors duration-300'
                />
              </div>
            </NavbarBrand>
          </NavbarContent>

          {/* 移动端导航图标 - 右侧显示图标菜单 */}
          <NavbarContent className='flex-1 justify-end lg:hidden'>
            <div className='flex items-center justify-end space-x-1 sm:space-x-2'>
              {menuItems.map((item, index) => (
                <MobileNavButton
                  key={`mobile-${index}`}
                  item={item}
                  handleNavigation={handleMobileNavigation} // 使用优化的移动导航处理函数
                  theme={theme}
                />
              ))}
              <ThemeToggleButton theme={theme} handleToggle={handleToggle} />
            </div>
          </NavbarContent>

          {/* 大屏幕Logo - 固定宽度和位置 */}
          <NavbarContent className='hidden w-[25%] lg:flex' justify='start'>
            <NavbarBrand className='flex w-full max-w-[220px] items-center'>
              <div
                className='flex h-full cursor-pointer items-center'
                onClick={e => handleNavigation('/', e)}
              >
                {/* 替换为SVG图标组件 */}
                <LogoIcon
                  size={64}
                  theme={theme}
                  className='mr-6 transition-colors duration-300'
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
                  handleNavigation={handleNavigation}
                  theme={theme}
                  isNavigating={isNavigating}
                  isThemeChanging={isChangingTheme}
                  compact={screenSize.isTablet}
                />
              ))}
            </div>
          </NavbarContent>

          {/* 大屏幕主题切换按钮 */}
          <NavbarContent
            justify='end'
            className='hidden sm:w-[20%] md:w-[20%] lg:flex lg:w-[25%]'
          >
            <NavbarItem className='flex justify-end'>
              <ThemeToggleButton theme={theme} handleToggle={handleToggle} />
            </NavbarItem>
          </NavbarContent>
        </NextUINavbar>
      </div>
    </motion.div>
  ) : null
}

// 优化移动导航按钮组件
const MobileNavButton = memo(({ item, handleNavigation, theme }) => {
  // 直接订阅store中的activeSection状态
  const activeSection = useHeaderStore(state => state.activeSection)
  const location = useLocation()

  // 内部计算active状态 - 与上面保持一致
  const isActive = useMemo(
    () => isItemActiveCheck(item.href, location.pathname, activeSection),
    [item.href, location.pathname, activeSection]
  )

  return (
    <Button
      isIconOnly
      size='sm'
      variant={isActive ? 'solid' : 'light'}
      color={isActive ? 'success' : 'default'}
      aria-label={item.name}
      className='rounded-full'
      data-active={isActive ? 'true' : 'false'} // 添加数据属性以便调试
      data-href={item.href}
      onPress={e => {
        handleNavigation(item.href, e)
      }}
    >
      {React.cloneElement(item.icon, {
        className: isActive
          ? 'text-white'
          : theme === 'dark'
            ? 'text-gray-300'
            : 'text-gray-700',
        size: 18,
      })}
    </Button>
  )
})

MobileNavButton.displayName = 'MobileNavButton'
MobileNavButton.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    icon: PropTypes.node,
  }).isRequired,
  handleNavigation: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
}

Header.displayName = 'Header'
export default Header
