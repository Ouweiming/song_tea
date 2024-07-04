import React, { useEffect, useState, useRef } from 'react'
import village1 from './assets/village1.jpg'
import village2 from './assets/village2.jpg'
import village3 from './assets/village3.jpg'
import village4 from './assets/village4.jpg'
import village5 from './assets/village5.jpg'

function Photowall() {
  const images = [village1, village2, village3, village4, village5]
  const [loaded, setLoaded] = useState(Array(images.length).fill(false))
  const imageRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target)
            setLoaded(loaded => {
              const newLoaded = [...loaded]
              newLoaded[index] = true
              return newLoaded
            })
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '100px',
      }
    )

    imageRefs.current.forEach(img => {
      if (img) observer.observe(img)
    })

    return () => {
      imageRefs.current.forEach(img => {
        if (img) observer.unobserve(img)
      })
    }
  }, [])

  return (
    <div className='flex flex-row overflow-x-auto snap-x snap-mandatory gap-x-4 p-4'>
      {images.map((src, index) => (
        <div key={src} className='snap-center flex-shrink-0'>
          <img
            ref={el => (imageRefs.current[index] = el)}
            src={loaded[index] ? src : undefined}
            alt={`Village ${index + 1}`}
            className='w-auto md:w-64 lg:w-96 h-96 object-cover rounded-lg shadow-lg transition duration-300 hover:scale-105'
          />
        </div>
      ))}
    </div>
  )
}

export default Photowall
