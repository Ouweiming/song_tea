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
        <div
          key={`village-${index}`}
          className='flex-shrink-0 snap-center'
          // 添加固定宽高比容器，避免布局抖动
          style={{ aspectRatio: '16/9', minWidth: '300px' }}
        >
          <OptimizedImage
            ref={el => (imageRefs.current[index] = el)}
            src={src}
            alt={`Village ${index + 1}`}
            className='h-96 w-auto rounded-lg object-cover shadow-md transition-all duration-300 ease-out will-change-transform hover:translate-y-[-5px] hover:scale-[1.03] hover:shadow-xl active:translate-y-[2px] active:scale-[0.98] md:w-64 lg:w-96'
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
