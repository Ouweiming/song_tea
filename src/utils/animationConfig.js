/**
 * 全局动画配置
 * 提供一致的动画体验并根据设备性能自动调整
 */
import { detectDeviceCapabilities } from './performanceUtils'

// 检测设备性能
const capabilities =
  typeof window !== 'undefined'
    ? detectDeviceCapabilities()
    : { shouldOptimizeAnimations: false }

// 卡片动画配置
export const cardAnimation = {
  // 低性能设备的简化动画
  low: {
    initial: {},
    whileInView: {},
    viewport: { once: true },
  },
  // 标准动画
  standard: {
    initial: { opacity: 0, scale: 0.95 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  // 自动选择适当的配置
  auto: capabilities.shouldOptimizeAnimations ? 'low' : 'standard',
}

// 区块/章节动画配置
export const sectionAnimation = {
  low: {
    initial: {},
    whileInView: {},
    viewport: { once: true },
  },
  standard: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, ease: 'easeOut' },
  },
  auto: capabilities.shouldOptimizeAnimations ? 'low' : 'standard',
}

// 获取适当的动画配置
export function getAnimationConfig(type = 'section', preset = 'auto') {
  const config = type === 'card' ? cardAnimation : sectionAnimation

  if (preset === 'auto') {
    return config[config.auto]
  }

  return config[preset] || config.standard
}

export default {
  cardAnimation,
  sectionAnimation,
  getAnimationConfig,
}
