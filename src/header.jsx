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

import Logo from './assets/logo.svg'
import './index.css'
// 使用我们自定义的hooks
import { useLocation, useNavigate } from './router-provider'
import { useTheme } from './useTheme'
// 从工具文件导入throttle，但确保在代码中使用它
import { throttle } from './utils/performanceUtils'

// 确保React Router知道future标志
// eslint-disable-next-line no-unused-vars
const routerConfig = {}

// 分离并优化导航项组件 - 添加下划线悬停效果
const NavItem = memo(
  ({
    item,
    isActive,
    handleNavigation,
    theme,
    isNavigating,
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-current={isActive(item.href) ? 'page' : undefined}
          role='menuitem'
          style={{ willChange: 'transform' }}
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
                duration: isNavigating ? 0.15 : 0.2,
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
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isPageReady, setIsPageReady] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const headerRef = useRef(null)
  const navigationLockTimeRef = useRef(null)
  const initialCheckDoneRef = useRef(false)
  // 移除未使用的ThemeReady状态

  // 立即检查初始滚动位置
  useEffect(() => {
    // 立即设置初始滚动状态，不等待setTimeout
    const initialScrollY = window.scrollY || window.pageYOffset
    setScrolled(initialScrollY > 20)

    const timer = setTimeout(() => {
      setIsPageReady(true)
    }, 300) // 从500ms减至300ms以提高响应性

    return () => clearTimeout(timer)
  }, [])

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

  // 更新屏幕尺寸检测，优化使用防抖函数减少布局计算
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

    const checkScreenSize = debounce(() => {
      const width = window.innerWidth
      setScreenSize({
        width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      })
    }, 150) // 使用150ms的防抖

    // 初始检查
    checkScreenSize()

    // 使用passive标志提高性能
    window.addEventListener('resize', checkScreenSize, { passive: true })

    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // 封装滚动函数减少代码重复
  const scrollToElement = useCallback(href => {
    // 确保href是一个有效的选择器
    if (!href || typeof href !== 'string') return

    // 如果是锚点但没有#前缀，添加前缀
    const selector = href.startsWith('#')
      ? href
      : `#${href.replace(/^\/+/, '')}`

    try {
      const element = document.querySelector(selector)
      if (element) {
        // 使用requestAnimationFrame优化性能
        requestAnimationFrame(() => {
          const headerHeight = headerRef.current?.offsetHeight || 80
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY
          const offsetPosition = elementPosition - headerHeight

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          })
        })
      }
    } catch (error) {
      console.error('Failed to scroll to element', selector, error)
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
      // 接受NextUI的事件对象或普通事件对象
      if (event && event.preventDefault) {
        event.preventDefault()
        // 防止事件冒泡
        event.stopPropagation && event.stopPropagation()
      }

      // 如果已经在导航中，忽略重复点击
      if (isNavigating) return

      // 设置导航状态锁定
      setIsNavigating(true)
      console.log('导航到:', href) // 调试用

      // 清除之前的任何导航锁定计时器
      if (navigationLockTimeRef.current) {
        clearTimeout(navigationLockTimeRef.current)
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

    // 初始化滚动状态检查
    const initialCheck = () => {
      if (initialCheckDoneRef.current) return

      // 找到初始活动区域更高效的滚动处理函数 - 增加节流时间从100ms到150ms
      const currentScrollY = window.scrollY || window.pageYOffset
      setScrolled(currentScrollY > 20)

      if (currentScrollY < 100) {
        setActiveSection('/')
      } else {
        // 检查哪个区域在视口中
        let foundSection = false
        for (const [id, element] of Object.entries(sectionRefs)) {
          const rect = element.getBoundingClientRect()
          if (
            rect.top < viewportHeight * 0.75 &&
            rect.bottom > viewportHeight * 0.25
          ) {
            setActiveSection(`#${id}`)
            foundSection = true
            break
          }
        }

        if (!foundSection) {
          setActiveSection('/')
        }
      }

      initialCheckDoneRef.current = true
    }

    // 页面加载后立即执行初始检查
    requestAnimationFrame(() => {
      initialCheck()
    })

    // 更高效的滚动处理函数 - 增加节流时间从100ms到150ms
    const handleScroll = throttle(() => {
      // 防止在导航期间处理滚动
      if (isNavigating) return

      // 立即更新滚动状态 - 这是高优先项
      const currentScrollY = window.scrollY
      if (currentScrollY > 20 !== scrolled) {
        setScrolled(currentScrollY > 20)
      }

      // 只在需要时更新activeSection
      let nearestSection = null // 在handleScroll作用域中声明nearestSection

      // 使用rAF确保在下一帧处理布局计算
      requestAnimationFrame(() => {
        // 批量读取所有DOM信息，避免引起多次回流
        const measurements = {}
        for (const [id, element] of Object.entries(sectionRefs)) {
          measurements[id] = element.getBoundingClientRect()
        }

        // 现在一次性计算最近的区域
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
    }, 150)

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 组件挂载后执行一次初始检查
    setTimeout(() => requestAnimationFrame(handleScroll), 100)

    return () => {
      // 清理计时器
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
          (activeSection === '/' || activeSection === '')
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

  return isPageReady ? (
    <motion.div
      className='fixed left-0 right-0 top-0 z-50'
      style={{
        backgroundColor: navbarTransforms.background,
        backdropFilter: navbarTransforms.blur,
        willChange: 'backdrop-filter, height',
        transform: 'translateZ(0)', // 添加GPU加速
      }}
    >
      {/* 进度指示器 */}
      <motion.div
        className='absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r from-emerald-400 to-teal-500'
        style={{ scaleX, willChange: 'transform' }}
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
                <img
                  src={Logo}
                  alt='后花园庄宋茶'
                  className={`h-10 w-10 sm:h-12 sm:w-12 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                />
                <div
                  className={
                    theme === 'dark'
                      ? 'ml-2 flex items-center text-emerald-300'
                      : 'ml-2 flex items-center text-emerald-600'
                  }
                >
                  <span className='text-base font-bold sm:text-lg'>
                    后花园庄
                  </span>
                  <span className='ml-1 text-xs'>宋茶</span>
                </div>
              </div>
            </NavbarBrand>
          </NavbarContent>

          {/* 移动端导航图标 - 右侧显示图标菜单 */}
          <NavbarContent className='flex-1 justify-end lg:hidden'>
            <div className='flex items-center justify-end space-x-1 sm:space-x-2'>
              {menuItems.map((item, index) => (
                <Button
                  key={`mobile-${index}`}
                  isIconOnly
                  size='sm'
                  variant={isActive(item.href) ? 'solid' : 'light'}
                  color={isActive(item.href) ? 'success' : 'default'}
                  aria-label={item.name}
                  className='rounded-full'
                  onClick={e => {
                    // 使用onClick而不是onPress以确保兼容性
                    e.preventDefault()
                    e.stopPropagation()
                    handleNavigation(item.href, e)
                  }}
                >
                  {React.cloneElement(item.icon, {
                    className: isActive(item.href)
                      ? 'text-white'
                      : theme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700',
                    size: 18,
                  })}
                </Button>
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
                <img
                  src={Logo}
                  alt='后花园庄宋茶'
                  className={`mr-6 h-14 w-14 transition-opacity duration-300 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
                />
                <div
                  className={
                    theme === 'dark'
                      ? 'ml-2 flex items-center text-emerald-300'
                      : 'ml-2 flex items-center text-emerald-600'
                  }
                >
                  <span className='text-base font-bold sm:text-lg'>
                    后花园庄
                  </span>
                  <span className='ml-1 text-xs'>宋茶</span>
                </div>
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

Header.displayName = 'Header'
export default Header
