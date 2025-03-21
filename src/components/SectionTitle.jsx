import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

// 标准化各部分标题样式的组件
const SectionTitle = ({
  title,
  subtitle,
  center = true,
  withDecoration = true,
  withBackground = false,
  animationDelay = 0,
  className = '',
}) => {
  return (
    <motion.div
      className={`relative mb-12 ${center ? 'text-center' : ''} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: animationDelay }}
    >
      {withBackground && (
        <div className='absolute -top-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-400/15 blur-3xl'></div>
      )}

      <h2
        className={`text-high-contrast mb-4 font-serif text-3xl font-bold md:text-4xl ${
          center ? '' : 'text-left'
        }`} // 移除 text-on-gradient 类
      >
        {title}
      </h2>

      {withDecoration && (
        <div
          className={`mb-4 h-1 w-20 rounded bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 ${
            center ? 'mx-auto' : ''
          }`}
        ></div>
      )}

      {subtitle && (
        <p
          className={`text-mid-contrast max-w-2xl ${
            center ? 'mx-auto px-6' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  center: PropTypes.bool,
  withDecoration: PropTypes.bool,
  withBackground: PropTypes.bool,
  animationDelay: PropTypes.number,
  className: PropTypes.string,
}

export default SectionTitle
