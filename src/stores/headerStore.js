import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// Header组件的状态管理 - 使用增强的中间件组合
const useHeaderStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // 状态
        scrolled: false,
        activeSection: '',
        isPageReady: false,
        isNavigating: false,
        initialCheckDone: false,
        // 添加直接导航到首页的标志
        directToHome: false,
        scrollHandlerRegistered: false,
        intersectionObserver: null,
        // 初始化性能指标对象
        perfMetrics: {
          scrollEvents: 0,
          navigationEvents: 0,
          resizeEvents: 0,
          lastUpdate: Date.now(),
        },
        screenSize: {
          width: typeof window !== 'undefined' ? window.innerWidth : 1200,
          isMobile: false,
          isTablet: false,
          isDesktop: true,
        },

        // 动作
        setScrolled: scrolled => set({ scrolled }),
        setActiveSection: activeSection => {
          // 只在真正需要更新时更新状态，避免不必要的渲染
          if (activeSection !== get().activeSection) {
            // 使用对象形式更新状态，这样Zustand会自动合并
            set({ activeSection })
          }
        },
        setIsPageReady: isPageReady => set({ isPageReady }),
        setIsNavigating: isNavigating => set({ isNavigating }),
        setInitialCheckDone: initialCheckDone => set({ initialCheckDone }),
        // 添加设置直接导航到首页标志的方法
        setDirectToHome: directToHome => set({ directToHome }),

        // 添加注册滚动回调的方法
        registerScrollHandler: async () => {
          // 只在客户端进行注册
          if (typeof window === 'undefined') return

          // 避免重复注册
          if (get().scrollHandlerRegistered) return

          get().setupIntersectionObserver()

          try {
            // 使用ESM动态导入替代require
            const scrollManagerModule = await import(
              '../hooks/useScrollManager'
            )
            scrollManagerModule.subscribe('header', scrollY => {
              const isScrolled = scrollY > 20
              if (isScrolled !== get().scrolled) {
                set({ scrolled: isScrolled })
              }
            })

            set({ scrollHandlerRegistered: true })
          } catch (error) {
            console.error('滚动处理器注册失败:', error)
          }
        },

        // 屏幕尺寸更新
        updateScreenSize: () => {
          const width = window.innerWidth
          set({
            screenSize: {
              width,
              isMobile: width < 768,
              isTablet: width >= 768 && width < 1024,
              isDesktop: width >= 1024,
            },
          })
        },

        // 计算活跃状态链接
        isActive: href => {
          const { activeSection } = get()
          const location = window.location

          // 首页特殊逻辑
          if (href === '/') {
            return (
              (location.pathname === '/' ||
                location.pathname === '/Homepage') &&
              (activeSection === '/' || activeSection === '')
            )
          }

          // 普通链接逻辑
          return location.pathname === href || activeSection === href
        },

        // 滚动处理 - 针对移动端优化和防止闪烁
        handleScroll: () => {
          // 严格检查导航状态和首页导航标志 - 如果在导航中或直接导航到首页，完全跳过滚动处理
          if (get().isNavigating || get().directToHome) return

          // 检查是否在首页
          const location = window.location
          const isHomePage =
            location.pathname === '/' || location.pathname === '/Homepage'
          if (!isHomePage) return

          const currentScrollY = window.scrollY || window.pageYOffset

          // 1. 更新滚动状态 - 批量读取和更新
          const isScrolled = currentScrollY > 20
          if (isScrolled !== get().scrolled) {
            set({ scrolled: isScrolled })
          }

          // 提高顶部检测阈值 - 特别是对移动端
          const screenWidth = window.innerWidth
          const isMobileDevice = screenWidth < 768
          const topThreshold = isMobileDevice ? 300 : 200

          if (currentScrollY < topThreshold) {
            // 明确设置为首页，且优先级高于下方的区块检测
            get().setActiveSection('/')
            return // 提前返回，避免进行下面的区块检测
          }

          // 2. 查找最近的部分 - 优化计算，减少回流
          const sections = ['tea-story', 'products', 'contact']
          const viewportHeight = window.innerHeight
          let bestSection = null
          let bestScore = -1
          const topWeight = isMobileDevice ? 0.9 : 0.6

          // 一次性批量获取所有元素信息，避免循环内多次触发布局计算
          const elementsInfo = sections
            .map(id => {
              const element = document.getElementById(id)
              if (!element) return null
              // 一次性读取所有需要的DOM信息
              const rect = element.getBoundingClientRect()
              return { id, rect }
            })
            .filter(Boolean)

          // 使用纯计算处理得分，不再触发DOM操作
          elementsInfo.forEach(({ id, rect }) => {
            // 只考虑部分在视口中的元素
            if (rect.top < viewportHeight && rect.bottom > 0) {
              // 计算得分 (与原代码相同的计算逻辑)
              const topPosition = rect.top
              const normalizedTopPos = Math.max(
                0,
                Math.min(1, topPosition / viewportHeight)
              )
              const topScore = 1 - normalizedTopPos
              const visibleHeight =
                Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
              const visibilityScore = visibleHeight / rect.height
              const midViewport = viewportHeight / 2
              const topProximityBonus =
                topPosition > 0 && topPosition < midViewport ? 0.4 : 0
              const offScreenPenalty = topPosition < 0 ? 0.3 : 0

              const totalScore =
                topWeight * topScore +
                (1 - topWeight) * visibilityScore +
                topProximityBonus -
                offScreenPenalty

              if (totalScore > bestScore) {
                bestScore = totalScore
                bestSection = `#${id}`
              }
            }
          })

          // 其余部分保持不变
          // 移动端使用较低的阈值，桌面端保持较高阈值
          const activationThreshold = isMobileDevice ? 0.15 : 0.2

          if (bestSection && bestScore > activationThreshold) {
            get().setActiveSection(bestSection)
          } else if (currentScrollY < topThreshold) {
            get().setActiveSection('/')
          }
        },

        // 更新性能指标 - 安全地检查和初始化
        updatePerfMetrics: metricType => {
          // 只在开发环境记录性能指标，使用PROD而不是DEV
          if (import.meta.env.PROD) return

          // 使用函数式更新并确保perfMetrics存在
          set(state => {
            // 确保perfMetrics存在，如果不存在则初始化
            const currentMetrics = state.perfMetrics || {
              scrollEvents: 0,
              navigationEvents: 0,
              resizeEvents: 0,
              lastUpdate: Date.now(),
            }

            return {
              perfMetrics: {
                ...currentMetrics,
                // 安全地递增计数器
                [metricType]: (currentMetrics[metricType] || 0) + 1,
                lastUpdate: Date.now(),
              },
            }
          })
        },

        setupIntersectionObserver: () => {
          // 清理旧观察者
          if (get().intersectionObserver) {
            get().intersectionObserver.disconnect()
          }

          const sections = ['tea-story', 'products', 'contact']
          const observer = new IntersectionObserver(
            entries => {
              if (get().isNavigating || get().directToHome) return

              let bestVisibility = 0
              let bestSection = null

              entries.forEach(entry => {
                if (
                  entry.isIntersecting &&
                  entry.intersectionRatio > bestVisibility
                ) {
                  bestVisibility = entry.intersectionRatio
                  bestSection = entry.target.id
                }
              })

              if (window.scrollY < 200) {
                get().setActiveSection('/')
                return
              }

              if (bestSection && bestVisibility > 0.2) {
                get().setActiveSection(`#${bestSection}`)
              }
            },
            { threshold: [0, 0.1, 0.2, 0.5], rootMargin: '-10% 0px -20% 0px' }
          )

          sections.forEach(id => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
          })

          set({ intersectionObserver: observer })
        },

        cleanupResources: () => {
          if (get().intersectionObserver) {
            get().intersectionObserver.disconnect()
            set({ intersectionObserver: null })
          }
        },
      }),
      { name: 'header-store' } // devtools名称
    )
  )
)

// 使用自定义的滚动管理器，而不是重复添加监听器
if (typeof window !== 'undefined') {
  // 导入模块
  setTimeout(() => {
    // 初始化滚动处理
    useHeaderStore.getState().registerScrollHandler()
  }, 0)
}

export default useHeaderStore
