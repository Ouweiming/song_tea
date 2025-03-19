import PropTypes from 'prop-types'

/**
 * 自定义按钮组件，确保整个应用中的按钮样式一致
 */
const CustomButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  rounded = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  icon = null,
  iconPosition = 'left',
}) => {
  // 基础样式：所有按钮共享
  const baseStyle =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  // 按钮大小
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  }

  // 按钮类型
  const variantClasses = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-700',
    secondary:
      'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
    outline:
      'border border-emerald-600 bg-transparent text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400 disabled:border-emerald-300 disabled:text-emerald-300 dark:border-emerald-500 dark:text-emerald-400 dark:hover:bg-emerald-900/30',
    ghost:
      'bg-transparent text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400 disabled:text-emerald-300 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
    link: 'bg-transparent p-0 text-emerald-600 underline hover:text-emerald-700 focus:ring-0 disabled:text-emerald-400 dark:text-emerald-400 dark:hover:text-emerald-300',
  }

  // 圆角样式
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  // 组合所有样式
  const buttonStyles = `
    ${baseStyle}
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    ${roundedClasses[rounded] || roundedClasses.md}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'cursor-not-allowed opacity-70' : ''}
    ${className}
  `.trim()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonStyles}
    >
      {icon && iconPosition === 'left' && <span className='mr-2'>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className='ml-2'>{icon}</span>}
    </button>
  )
}

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'ghost',
    'link',
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', 'full']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
}

export default CustomButton
