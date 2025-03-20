import { useRef } from 'react'

// 导入优化的图片组件
import placeholderImg from './assets/placeholder.jpg'
import village1 from './assets/village1.jpg'
import village2 from './assets/village2.jpg'
import village3 from './assets/village3.jpg'
import village4 from './assets/village4.jpg'
import village5 from './assets/village5.jpg'
import OptimizedImage from './components/OptimizedImage'

function Photowall() {
  const images = [village1, village2, village3, village4, village5]
  const imageRefs = useRef([])

  return (
    <div className='flex snap-x snap-mandatory flex-row gap-x-4 overflow-x-auto p-4'>
      {images.map((src, index) => (
        <div key={`village-${index}`} className='flex-shrink-0 snap-center'>
          {/* 使用已修改为支持ref转发的OptimizedImage组件 */}
          <OptimizedImage
            ref={el => (imageRefs.current[index] = el)}
            src={src}
            alt={`Village ${index + 1}`}
            className='h-96 w-auto rounded-lg object-cover shadow-md will-change-transform 
                      transition-all duration-300 ease-out hover:shadow-xl 
                      hover:translate-y-[-5px] hover:scale-[1.03] 
                      active:scale-[0.98] active:translate-y-[2px]
                      md:w-64 lg:w-96'
            placeholder={placeholderImg}
            loading='lazy'
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>
      ))}
    </div>
  )
}

export default Photowall
