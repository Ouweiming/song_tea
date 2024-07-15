import { Progress } from '@nextui-org/react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

export default function Loading() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => (v >= 100 ? 0 : v + 10))
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='flex h-screen flex-col items-center justify-center space-y-16 bg-gradient-to-br from-[#73F1CF] to-[#99CCDF]'>
      <motion.div
        className='mb-20 h-40 w-40 bg-white' // 添加了 mt-8 类来增加顶部间距
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 180, 180, 0],
          borderRadius: ['0%', '0%', '50%', '50%', '0%'],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      />

      <Progress
        aria-label='Downloading...'
        size='md'
        value={value}
        label='Loading💤'
        color='success'
        showValueLabel={true}
        className='max-w-md'
      />
    </div>
  )
}
