import { useRef } from 'react'

// 导入优化的图片组件和所有格式的图片
import village1Avif from './assets/village1.avif'
import village1 from './assets/village1.jpg'
import village1Webp from './assets/village1.webp'
import village2Avif from './assets/village2.avif'
import village2 from './assets/village2.jpg'
import village2Webp from './assets/village2.webp'
import village3Avif from './assets/village3.avif'
import village3 from './assets/village3.jpg'
import village3Webp from './assets/village3.webp'
import village4Avif from './assets/village4.avif'
import village4 from './assets/village4.jpg'
import village4Webp from './assets/village4.webp'
import village5Avif from './assets/village5.avif'
import village5 from './assets/village5.jpg'
import village5Webp from './assets/village5.webp'
import OptimizedImage from './components/OptimizedImage'

function Photowall() {
  // 创建带有所有格式的图片数组
  const images = [
    { src: village1, avif: village1Avif, webp: village1Webp },
    { src: village2, avif: village2Avif, webp: village2Webp },
    { src: village3, avif: village3Avif, webp: village3Webp },
    { src: village4, avif: village4Avif, webp: village4Webp },
    { src: village5, avif: village5Avif, webp: village5Webp },
  ]
  const imageRefs = useRef([])

  return (
    <div className='flex snap-x snap-mandatory flex-row gap-x-4 overflow-x-auto p-4'>
      {images.map((image, index) => (
        <div
          key={`village-${index}`}
          className='flex-shrink-0 snap-center'
          // 添加固定宽高比容器，避免布局抖动
          style={{ aspectRatio: '16/9', minWidth: '300px' }}
        >
          <OptimizedImage
            ref={el => (imageRefs.current[index] = el)}
            src={image.src}
            avifSrc={image.avif}
            webpSrc={image.webp}
            alt={`茶园风光 ${index + 1}`}
            className='h-96 w-auto rounded-lg object-cover shadow-md transition-all duration-300 ease-out will-change-transform hover:translate-y-[-5px] hover:scale-[1.03] hover:shadow-xl active:translate-y-[2px] active:scale-[0.98] md:w-64 lg:w-96'
            loading='lazy'
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>
      ))}
    </div>
  )
}

export default Photowall
