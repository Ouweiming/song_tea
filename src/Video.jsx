import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { FiPlayCircle } from 'react-icons/fi'

import LoadingSpinner from './LoadingSpinner'
// 使用之前创建的加载组件
import video_mp4 from './assets/video.mp4'
import video_webm from './assets/video.webm'
import video_1_mp4 from './assets/video_1.mp4'
import video_1_webm from './assets/video_1.webm'
import Heart from './heart'

// 仅在需要时动态导入ReactPlayer
const VideoPlayer = ({ url, onReady, onError }) => {
  const PlayerComponent = lazy(() => import('react-player'))

  return (
    <Suspense fallback={<LoadingSpinner size={60} color='#10b981' />}>
      <PlayerComponent
        url={url}
        playing
        controls
        onReady={onReady}
        onError={onError}
      />
    </Suspense>
  )
}

// 添加PropTypes验证
VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  onError: PropTypes.func,
}

// Welcome 组件 - 优化关键渲染路径
const Welcome = () => {
  // 简化动画效果，提高性能
  const titleAnimationProps = {
    initial: { opacity: 0, y: -20 }, // 减小y轴位移以提高渲染性能
    animate: { opacity: 1, y: 0 },
    transition: {
      ease: 'easeOut',
      duration: 0.6, // 减少动画时间
      delay: 0.1, // 添加很小的延迟以便关键元素优先渲染
    },
  }

  return (
    <div className='mt-4 flex w-full flex-col items-center justify-center p-6 lg:p-24'>
      <div className='text-center'>
        <motion.div
          className='flex flex-col items-center justify-center'
          {...titleAnimationProps}
          style={{
            willChange: 'opacity, transform', // 提示浏览器预先做好变换准备
            contentVisibility: 'auto', // 通知浏览器这是重要内容
          }}
        >
          <h1 className='mb-8 bg-clip-text text-3xl font-bold text-emerald-400 md:text-4xl lg:text-6xl'>
            欢迎来到
            {/* 优化 LCP 元素 - 关键性能点 */}
            <span
              className='ml-4 inline-block rounded-xl border border-green-700 bg-customgradient_1 px-4 py-2 font-semibold text-emerald-700 shadow-lg'
              style={{
                contain: 'paint', // 包含绘制操作
                contentVisibility: 'auto',
                containIntrinsicSize: 'auto', // 帮助浏览器计算尺寸
              }}
            >
              后花园庄
            </span>
          </h1>
        </motion.div>
        <Heart className='my-4' />
      </div>
    </div>
  )
}

// 优化VideoBackground组件
const VideoBackground = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')
  const [videoError, setVideoError] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false) // 添加视频加载状态
  const videoContainerRef = useRef(null)
  const backgroundVideoRef = useRef(null) // 添加背景视频引用

  const videoSources = [
    { src: video_mp4, type: 'video/mp4' },
    { src: video_webm, type: 'video/webm' },
  ]

  // 使用 useCallback 优化事件处理函数
  const handleButtonClick = useCallback(() => {
    setShowVideo(true)
  }, [])

  const handleDeleteButtonClick = useCallback(() => setShowVideo(false), [])

  // 处理视频加载完成
  const handleVideoReady = useCallback(() => {
    setIsVideoLoaded(true)
  }, [])

  // 处理视频加载错误
  const handleVideoError = useCallback(() => {
    setVideoError(true)
  }, [])

  // 优化视频加载
  const handleBackgroundVideoLoadedData = useCallback(() => {
    if (backgroundVideoRef.current) {
      // 视频已加载，可以设置播放速度
      backgroundVideoRef.current.playbackRate = 0.8 // 稍微减慢播放速度
    }
  }, [])

  useEffect(() => {
    // 检测浏览器对视频格式的支持并选择视频源
    const video = document.createElement('video')
    const canPlayWebm = video.canPlayType('video/webm; codecs="vp8, vorbis"')

    // 使用Promise确保处理完成
    Promise.resolve().then(() => {
      if (canPlayWebm !== '') {
        setSelectedVideo(video_1_webm)
      } else {
        setSelectedVideo(video_1_mp4)
      }
    })

    // 清理函数
    return () => {
      video.remove()
    }
  }, [])

  // 减少动画效果复杂度，提高性能
  const buttonAnimationProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: 'spring', stiffness: 250, damping: 20 }, // 降低stiffness提高性能
  }

  return (
    <>
      <Welcome />
      <div className='relative w-full overflow-hidden'>
        <div className='mx-4 rounded-lg border-4 border-emerald-600 p-0 shadow-lg lg:mx-20'>
          <div className='relative w-full overflow-hidden'>
            <div className='relative h-0 pb-[60%] lg:pb-[52%]'>
              {videoError ? (
                <div className='absolute inset-0 flex items-center justify-center bg-black'>
                  <p className='text-white'>视频加载失败</p>
                </div>
              ) : (
                <>
                  <video
                    ref={backgroundVideoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload='metadata' // 改为metadata以提升性能
                    alt='Background video'
                    className='absolute left-0 top-0 z-0 h-full w-full object-cover'
                    style={{
                      maxWidth: '100%',
                      willChange: 'transform', // 提高动画性能
                    }}
                    onError={handleVideoError}
                    onLoadedData={handleBackgroundVideoLoadedData}
                    aria-hidden='true' // 背景视频不需要屏幕阅读器读取
                  >
                    {videoSources.map((source, index) => (
                      <source key={index} src={source.src} type={source.type} />
                    ))}
                    您的浏览器不支持视频标签
                  </video>

                  {/* 整合新的响应式播放按钮 - 简化动画效果 */}
                  <motion.button
                    onClick={handleButtonClick}
                    {...buttonAnimationProps}
                    className='absolute bottom-4 right-4 flex items-center justify-center rounded-full border-2 border-green-300 bg-transparent px-3 py-3 text-base font-semibold text-yellow-500 shadow-lg hover:bg-emerald-600 dark:border-green-500 dark:text-yellow-500 sm:bottom-6 sm:right-6 sm:py-4 sm:text-lg md:bottom-8 md:right-8 md:py-5 md:text-xl'
                    aria-label='播放完整视频'
                  >
                    <FiPlayCircle className='mr-2 text-3xl sm:text-3xl md:text-5xl' />
                    <span className='hidden sm:inline'>播放完整视频</span>
                    <span className='sm:hidden'>播放</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 点击后显示的视频容器 - 使用Portal优化性能 */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'
            role='dialog'
            aria-modal='true'
            aria-labelledby='video-title'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className='relative w-full max-w-4xl rounded-3xl bg-emerald-300 bg-opacity-80 p-3 dark:bg-emerald-700'
              ref={videoContainerRef}
            >
              <h2 id='video-title' className='sr-only'>
                宋茶宣传视频
              </h2>
              <div className='relative h-0 w-full pb-[56.25%]'>
                {/* 添加加载状态展示 */}
                {!isVideoLoaded && (
                  <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50'>
                    <LoadingSpinner size={60} color='#10b981' />
                  </div>
                )}
                <Suspense
                  fallback={
                    <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center'>
                      <LoadingSpinner size={60} color='#10b981' />
                    </div>
                  }
                >
                  {selectedVideo && (
                    <VideoPlayer
                      url={selectedVideo}
                      onReady={handleVideoReady}
                      onError={handleVideoError}
                    />
                  )}
                </Suspense>
              </div>

              <button
                onClick={handleDeleteButtonClick}
                className='absolute right-3 top-3 z-10 rounded-full bg-red-600 bg-opacity-80 px-4 py-2 text-white transition-colors hover:bg-red-700 focus:outline-none'
                aria-label='关闭视频'
              >
                关闭
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VideoBackground
