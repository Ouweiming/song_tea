import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

const heartVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 10,
      delay: 0.3,
      repeat: Infinity,
      repeatType: 'reverse',
      repeatDelay: 0.8,
    },
  },
}

export default function Heart() {
  const [size, setSize] = useState(150)

  useEffect(() => {
    function handleResize() {
      // 根据窗口宽度调整大小，例如窗口宽度小于768px时，大小为100，否则为150
      setSize(window.innerWidth < 768 ? 100 : 150)
    }

    window.addEventListener('resize', handleResize)
    // 初始化大小
    handleResize()

    // 组件卸载时移除事件监听器
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='flex items-center justify-center'>
      <motion.svg
        width={size} // 使用状态动态调整大小
        height={size} // 使用状态动态调整大小
        viewBox='0 0 24 24'
        initial='hidden'
        animate='visible'
      >
        <motion.path
          fill='#ff0055'
          d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
          variants={heartVariants}
        />
      </motion.svg>
    </div>
  )
}
