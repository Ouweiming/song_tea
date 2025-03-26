import { useEffect, useState } from 'react'

import useHeaderStore from '../stores/headerStore'

/**
 * 区块调试视觉辅助组件 - 显示每个锚点区块的位置和状态
 */
const DebugSection = () => {
  const isDev = import.meta.env.DEV
  const [isVisible, setIsVisible] = useState(true)
  const activeSection = useHeaderStore(state => state.activeSection)

  // 获取所有可能的区块
  const sections = ['tea-story', 'products', 'contact']

  // 添加滚动检测逻辑相关信息显示
  const [scrollInfo, setScrollInfo] = useState({
    scrollY: 0,
    isMobile: false,
    topThreshold: 0,
  })

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'd' && e.altKey) {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // 监听滚动以更新信息
  useEffect(() => {
    if (!isDev || !isVisible) return

    const handleScroll = () => {
      setScrollInfo({
        scrollY: window.scrollY,
        isMobile: window.innerWidth < 768,
        topThreshold: window.innerWidth < 768 ? 0.2 : 0.3,
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 初始化

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDev, isVisible])

  // 不在开发环境时返回null
  if (!isDev || !isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        background: 'rgba(0,0,0,0.8)',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        color: 'white',
      }}
    >
      <div style={{ marginBottom: '5px', textAlign: 'center' }}>
        <strong>当前区块: </strong>
        <span style={{ color: '#4ade80' }}>{activeSection || '/'}</span>
      </div>

      <div
        style={{
          fontSize: '10px',
          marginBottom: '8px',
          padding: '4px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '2px',
        }}
      >
        <div>ScrollY: {scrollInfo.scrollY}px</div>
        <div>设备: {scrollInfo.isMobile ? '移动' : '桌面'}</div>
        <div>激活阈值: {scrollInfo.topThreshold}</div>
      </div>

      {sections.map(section => {
        const element = document.getElementById(section)
        const isActive = activeSection === `#${section}`

        let posInfo = 'Not found'
        if (element) {
          const rect = element.getBoundingClientRect()
          const viewportHeight = window.innerHeight

          const top = Math.round(rect.top)
          const bottom = Math.round(rect.bottom)
          const height = Math.round(rect.height)
          const visibleHeight =
            Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
          const visiblePercent = Math.round((visibleHeight / height) * 100)

          posInfo = `Top: ${top}px | Bottom: ${bottom}px | Visible: ${visiblePercent}%`
        }

        return (
          <div
            key={section}
            style={{
              padding: '4px 8px',
              borderLeft: `3px solid ${isActive ? '#4ade80' : '#888'}`,
              background: isActive ? 'rgba(74, 222, 128, 0.2)' : 'transparent',
            }}
          >
            <div>
              <strong>#{section}</strong>
            </div>
            <div style={{ fontSize: '10px', color: '#aaa' }}>{posInfo}</div>
            {element && (
              <div
                style={{
                  fontSize: '9px',
                  color:
                    element.getBoundingClientRect().top < 50
                      ? '#ffa500'
                      : '#aaa',
                  fontWeight:
                    element.getBoundingClientRect().top < 50
                      ? 'bold'
                      : 'normal',
                }}
              >
                顶部触发:{' '}
                {element.getBoundingClientRect().top < 50 ? '是' : '否'}
              </div>
            )}
          </div>
        )
      })}

      <div
        style={{
          fontSize: '10px',
          textAlign: 'center',
          marginTop: '5px',
          color: '#999',
        }}
      >
        Alt+D 切换显示
      </div>
    </div>
  )
}

export default DebugSection
