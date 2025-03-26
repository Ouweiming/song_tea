// 创建共享的动画配置预设
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  fadeInUpDelayed: (delay = 0.2) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  pulseAnimation: {
    animate: {
      scale: [1, 1.03, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  },
}

// 针对低性能设备的简化动画
export const LIGHTWEIGHT_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  fadeInUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  // 移除或简化复杂动画
  pulseAnimation: {},
}

// 设备性能检测
export const detectLowPerformanceDevice = () => {
  if (typeof window === 'undefined') return true

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isLowEndDevice =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4

  return isMobile || isLowEndDevice
}
