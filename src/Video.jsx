import { AnimatePresence, motion } from 'framer-motion'
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react'
// 添加 useEffect 导入
import { FiPlayCircle } from 'react-icons/fi'

import video_mp4 from './assets/video.mp4'
import video_webm from './assets/video.webm'
import video_1_mp4 from './assets/video_1.mp4'
import video_1_webm from './assets/video_1.webm'
import Heart from './heart'

// 动态导入 ReactPlayer
const ReactPlayer = lazy(() => import('react-player'))

// 新增的 Welcome 组件
const Welcome = () => {
  return (
    <div className='p-18 mt-8 flex w-full flex-col items-center justify-center lg:p-48'>
      <div className='text-center'>
        <motion.div
          className='flex flex-col items-center justify-center'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: 'easeOut', duration: 1 }}
        >
          <h1 className='mb-12 bg-clip-text text-3xl font-bold text-emerald-400 md:text-4xl lg:text-7xl'>
            欢迎来到
            <span className='ml-4 inline-block rounded-xl border border-green-700 bg-customgradient_1 px-4 py-2 font-semibold text-emerald-700 shadow-large'>
              后花园庄
            </span>
          </h1>
        </motion.div>
        <Heart className='my-6' />{' '}
        {/* 假设 Heart 组件可以接受 className 作为 prop */}
      </div>
    </div>
  )
}

const VideoBackground = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('') // 添加 selectedVideo 状态
  const videoContainerRef = useRef(null)

  const handleButtonClick = () => {
    setShowVideo(true)
  }

  const handleDeleteButtonClick = () => {
    setShowVideo(false)
  }

  const videoSources = [
    { src: video_mp4, type: 'video/mp4' },
    { src: video_webm, type: 'video/webm' },
    // 添加其他格式的视频源
  ]

  useEffect(() => {
    // 检测浏览器对视频格式的支持并选择视频源
    const canPlayWebm = document
      .createElement('video')
      .canPlayType('video/webm; codecs="vp8, vorbis"')
    if (canPlayWebm) {
      setSelectedVideo(video_1_webm)
    } else {
      setSelectedVideo(video_1_mp4)
    }
  }, [])

  return (
    <>
      <Welcome />
      <div className='relative w-full overflow-hidden'>
        <div
          className='ml-20 mr-20 rounded-lg border-4 border-emerald-600 p-0 shadow-lg'
          style={{ boxSizing: 'border-box' }}
        >
          <div className='relative w-full overflow-hidden'>
            <div className='relative h-0 pb-[60%] lg:pb-[52%]'>
              <video
                autoPlay
                muted
                loop
                preload='auto'
                alt='Background video'
                className='absolute left-0 top-0 z-0 h-full w-full object-cover'
                style={{ maxWidth: '100%' }}
              >
                {videoSources.map((source, index) => (
                  <source key={index} src={source.src} type={source.type} />
                ))}
              </video>
            </div>
          </div>
        </div>
      </div>

      {/* 点击后显示的视频容器 */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className='relative w-full max-w-3xl rounded-3xl bg-emerald-300 bg-opacity-80 p-3 dark:bg-emerald-700'
              ref={videoContainerRef}
            >
              <div className='relative h-0 w-full pb-[56.25%]'>
                <Suspense fallback={<div>Loading...</div>}>
                  <ReactPlayer
                    url={selectedVideo}
                    playing={true}
                    controls={true}
                    loop={true}
                    muted={true}
                    width='100%'
                    height='100%'
                    className='absolute left-0 top-0 h-full w-full object-cover'
                    ref={videoContainerRef}
                  />
                </Suspense>
              </div>

              <button
                onClick={handleDeleteButtonClick}
                className='absolute right-3 top-3 rounded-full bg-gray-700 bg-opacity-20 px-4 py-2 text-white hover:bg-emerald-800 focus:outline-none'
              >
                X
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放按钮 - 移动端 */}
      <div className='absolute inset-0 bottom-12 flex items-end justify-center md:hidden'>
        <motion.button
          onClick={handleButtonClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center rounded-full border-large border-green-300 bg-transparent px-6 py-3 font-semibold text-white shadow-lg hover:bg-emerald-600 dark:border-green-300 dark:text-white'
        >
          <FiPlayCircle className='mr-2' size={28} /> 播放完整视频
        </motion.button>
      </div>

      {/* 播放按钮 - 非移动端，响应式设计调整为容器右下角 */}
      <div className='absolute bottom-0 right-0 hidden items-center justify-center md:bottom-16 md:right-48 md:flex'>
        <motion.button
          onClick={handleButtonClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='flex items-center rounded-full border-large border-green-300 bg-transparent px-6 py-3 text-2xl font-semibold text-white shadow-lg hover:bg-emerald-600 dark:border-green-500 dark:text-white dark:hover:text-sky-300'
        >
          <FiPlayCircle className='mr-2' size={36} /> 播放完整视频
        </motion.button>
      </div>
    </>
  )
}

export default VideoBackground
