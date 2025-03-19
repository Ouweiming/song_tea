import { useEffect, useRef, useState } from 'react'

// 导入默认占位图
import placeholderImg from './assets/placeholder.jpg'
import village1 from './assets/village1.jpg'
import village2 from './assets/village2.jpg'
import village3 from './assets/village3.jpg'
import village4 from './assets/village4.jpg'
import village5 from './assets/village5.jpg'

// 确保创建此文件或修改为已有的图片

function Photowall() {
  const images = [village1, village2, village3, village4, village5]
  const [loaded, setLoaded] = useState(Array(images.length).fill(false))
  const [errors, setErrors] = useState(Array(images.length).fill(false))
  const imageRefs = useRef([])

  useEffect(() => {
    // Store the current refs to use in both setup and cleanup
    const currentRefs = imageRefs.current

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = currentRefs.indexOf(entry.target)
            if (index !== -1) {
              setLoaded(loaded => {
                const newLoaded = [...loaded]
                newLoaded[index] = true
                return newLoaded
              })
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        rootMargin: '100px',
      }
    )

    currentRefs.forEach(img => {
      if (img) observer.observe(img)
    })

    return () => {
      currentRefs.forEach(img => {
        if (img) observer.unobserve(img)
      })
    }
  }, [])

  // 处理图片加载错误
  const handleError = index => {
    setErrors(prev => {
      const newErrors = [...prev]
      newErrors[index] = true
      return newErrors
    })
  }

  return (
    <div className='flex snap-x snap-mandatory flex-row gap-x-4 overflow-x-auto p-4'>
      {images.map((src, index) => (
        <div key={`village-${index}`} className='flex-shrink-0 snap-center'>
          <img
            ref={el => (imageRefs.current[index] = el)}
            src={
              errors[index]
                ? placeholderImg
                : loaded[index]
                  ? src
                  : placeholderImg
            }
            alt={`Village ${index + 1}`}
            className='h-96 w-auto rounded-lg object-cover shadow-lg transition duration-300 hover:scale-105 md:w-64 lg:w-96'
            onError={() => handleError(index)}
          />
        </div>
      ))}
    </div>
  )
}

export default Photowall
