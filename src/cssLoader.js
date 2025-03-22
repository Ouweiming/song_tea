/**
 * CSS加载优化工具
 *
 * 这个工具帮助我们实现:
 * 1. 关键CSS的内联
 * 2. 非关键CSS的延迟加载
 * 3. 动态CSS加载
 */

// 检查CSS是否已经加载完成
export function isCssLoaded() {
  return window.cssLoaded === true
}

// 动态加载CSS文件
export function loadCss(href, options = {}) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href

    if (options.media) {
      link.media = options.media
    }

    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))

    document.head.appendChild(link)
  })
}

// 按需加载组件CSS
export function loadComponentCss(componentName) {
  // 这里根据组件名称加载对应的CSS
  // 例如: 为'Carousel'组件加载'carousel.css'
  return loadCss(`/assets/components/${componentName.toLowerCase()}.css`)
}

// 优先加载首屏CSS，延迟加载非首屏CSS
export function optimizeCssLoading() {
  // 首屏加载优先级较高的CSS
  const priorityCss = [{ href: '/assets/critical.css', media: 'all' }]

  // 非首屏区域的CSS
  const nonCriticalCss = [
    {
      href: '/assets/non-critical.css',
      media: 'print',
      onload: "this.media='all'",
    },
  ]

  // 加载优先CSS
  const priorityLoads = priorityCss.map(css =>
    loadCss(css.href, { media: css.media })
  )

  // 使用requestIdleCallback延迟加载非关键CSS
  Promise.all(priorityLoads).then(() => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        () => {
          nonCriticalCss.forEach(css => {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = css.href
            link.media = css.media
            if (css.onload) {
              link.onload = new Function(css.onload)
            }
            document.head.appendChild(link)
          })
        },
        { timeout: 2000 }
      ) // 设置超时保证最终会加载
    } else {
      // 回退方案
      setTimeout(() => {
        nonCriticalCss.forEach(css => loadCss(css.href, { media: css.media }))
      }, 200)
    }
  })
}

export default {
  isCssLoaded,
  loadCss,
  loadComponentCss,
  optimizeCssLoading,
}
