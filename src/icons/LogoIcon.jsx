import PropTypes from 'prop-types'
import React from 'react'
import { RiLeafLine } from 'react-icons/ri'

const LogoIcon = ({ size = 48, className = '', theme = 'light' }) => {
  const color = theme === 'dark' ? '#6ee7b7' : '#34d399' // 根据主题设置颜色

  return (
    <RiLeafLine
      size={size}
      className={className}
      color={color}
      aria-label="后花园庄宋茶 logo"
      role="img"
    />
  )
}

LogoIcon.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
}

export default React.memo(LogoIcon)