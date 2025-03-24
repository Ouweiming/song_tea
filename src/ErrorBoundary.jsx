import PropTypes from 'prop-types'
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // 可以在这里添加错误报告逻辑
    console.error('组件渲染错误:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 针对移动设备的特殊回退UI
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

      return (
        <div className='error-container p-4'>
          <h2 className='text-xl font-bold text-red-600'>
            {isMobile ? '移动设备显示问题' : '出现了一个问题'}
          </h2>
          <p className='mb-4'>
            {isMobile
              ? '我们注意到在某些移动设备上可能无法正常显示内容。我们正在努力修复这个问题。'
              : '页面渲染时发生错误，我们正在修复。'}
          </p>

          {/* 为移动用户提供一个简化版本的内容 */}
          {isMobile && this.props.fallbackContent && (
            <div className='mobile-fallback mt-4'>
              {this.props.fallbackContent}
            </div>
          )}

          <button
            onClick={() => this.setState({ hasError: false })}
            className='rounded-md bg-emerald-600 px-4 py-2 text-white'
          >
            尝试重新加载
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// 添加 PropTypes 验证
ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallbackContent: PropTypes.node,
}

export default ErrorBoundary
