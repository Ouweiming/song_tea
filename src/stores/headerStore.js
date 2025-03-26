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
            // 更新前记录日志
            // console.log(`Setting activeSection: ${activeSection}, previous: ${get().activeSection}`);

            // 使用对象形式更新状态，这样Zustand会自动合并
            set({ activeSection })

            // 记录状态更新
            get().updatePerfMetrics('stateUpdates')
          }
        },
        setIsPageReady: isPageReady => set({ isPageReady }),
        setIsNavigating: isNavigating => set({ isNavigating }),
        setInitialCheckDone: initialCheckDone => set({ initialCheckDone }),

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

        // 滚动处理 - 针对移动端优化
        handleScroll: () => {
          // 严格检查导航状态 - 如果在导航中，完全跳过滚动处理
          if (get().isNavigating) return

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
            // 记录状态更新
            get().updatePerfMetrics('stateUpdates')
          }

          // 如果滚动位置很低，直接设为首页
          if (currentScrollY < 100) {
            // 如果已经有明确的导航意图（activeSection已设置），则不覆盖
            if (get().activeSection === '' || get().activeSection === '/') {
              get().setActiveSection('/')
            }
            return
          }

          // 2. 查找最近的部分 - 移动端更倾向于顶部对齐策略
          const sections = ['tea-story', 'products', 'contact']
          const viewportHeight = window.innerHeight
          let bestSection = null
          let bestScore = -1

          // 判断设备类型
          const screenWidth = window.innerWidth
          const isMobileDevice = screenWidth < 768
          const topWeight = isMobileDevice ? 0.8 : 0.5 // 移动端更重视顶部位置

          // 使用顶部优先的策略
          sections.forEach(id => {
            const element = document.getElementById(id)
            if (!element) return

            const rect = element.getBoundingClientRect()

            // 如果元素顶部在视口中
            if (rect.top < viewportHeight && rect.bottom > 0) {
              // 计算顶部得分 - 顶部接近viewport顶部得分更高
              const topPosition = rect.top
              // 归一化顶部位置: 0表示在viewport顶部，1表示在viewport底部
              const normalizedTopPos = Math.max(
                0,
                Math.min(1, topPosition / viewportHeight)
              )
              // 顶部得分: 顶部接近viewport顶部时分数高
              const topScore = 1 - normalizedTopPos

              // 计算可见面积得分
              const visibleHeight =
                Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
              const visibilityScore = visibleHeight / rect.height

              // 特殊处理: 如果元素顶部刚好在viewport顶部附近，给予额外加分
              const topProximityBonus =
                topPosition > 0 && topPosition < 150 ? 0.3 : 0

              // 总得分: 顶部权重 * 顶部得分 + (1-顶部权重) * 可见面积得分 + 顶部接近加分
              const totalScore =
                topWeight * topScore +
                (1 - topWeight) * visibilityScore +
                topProximityBonus

              // 调试输出
              // console.log(`Section: #${id}, topScore: ${topScore.toFixed(2)},
              //              visibilityScore: ${visibilityScore.toFixed(2)},
              //              totalScore: ${totalScore.toFixed(2)}`);

              // 更新最佳区块
              if (totalScore > bestScore) {
                bestScore = totalScore
                bestSection = `#${id}`
              }
            }
          })

          // 3. 更新激活部分 - 更新阈值针对移动端调整
          // 移动端使用较低的阈值，桌面端保持较高阈值
          const activationThreshold = isMobileDevice ? 0.2 : 0.3

          if (bestSection && bestScore > activationThreshold) {
            get().setActiveSection(bestSection)
          } else if (currentScrollY < 200) {
            // 如果没有找到合适的区块且滚动位置较低
            get().setActiveSection('/')
          }
        },

        // 新增: 性能监控数据收集
        perfMetrics: {
          scrollEvents: 0,
          stateUpdates: 0,
          lastUpdate: null,
        },

        // 更新性能指标
        updatePerfMetrics: metricType => {
          const current = get().perfMetrics
          set({
            perfMetrics: {
              ...current,
              [metricType]: current[metricType] + 1,
              lastUpdate: new Date().getTime(),
            },
          })
        },

        // 重置性能指标
        resetPerfMetrics: () => {
          set({
            perfMetrics: {
              scrollEvents: 0,
              stateUpdates: 0,
              lastUpdate: null,
            },
          })
        },
      }),
      { name: 'header-store' } // devtools名称
    )
  )
)

// 设置滚动监听频率
const SCROLL_UPDATE_INTERVAL = 50 // ms

// 添加全局滚动处理
let lastScrollTime = 0
if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      const now = Date.now()
      if (now - lastScrollTime > SCROLL_UPDATE_INTERVAL) {
        lastScrollTime = now
        const store = useHeaderStore.getState()
        // 严格检查导航状态 - 在导航过程中完全禁用滚动检测
        if (!store.isNavigating) {
          requestAnimationFrame(() => {
            store.handleScroll()
          })
        }
      }
    },
    { passive: true }
  )
}

export default useHeaderStore
