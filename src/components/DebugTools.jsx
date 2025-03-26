import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiSettings } from 'react-icons/fi'

const DebugTools = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDev, setIsDev] = useState(false)

  useEffect(() => {
    // 检查环境变量
    setIsDev(!import.meta.env.PROD)
  }, [])

  if (!isDev) return null

  return (
    <div className='fixed z-50 bottom-4 right-4'>
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className='flex items-center justify-center w-12 h-12 text-white bg-blue-600 rounded-full shadow-lg'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FiSettings size={24} />
      </motion.button>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className='p-4 mt-2 bg-white rounded-lg shadow-lg'
        >
          <h3 className='mb-2 text-lg font-semibold'>Debug Tools</h3>
          <p>Here you can add your debug tools and information.</p>
        </motion.div>
      )}
    </div>
  )
}

export default DebugTools
