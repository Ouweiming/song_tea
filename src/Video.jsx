import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { FiPlayCircle, FiX } from 'react-icons/fi'

// 优先使用MP4格式作为最广泛支持的格式
import video_mp4 from './assets/video.mp4'
import video_1_mp4 from './assets/video_1.mp4'
import useVideoStore from './stores/videoStore'

// 延迟加载播放器组件
const ReactPlayer = lazy(() => import('react-player/lazy'))

// 简化VideoPlayer组件
const VideoPlayer = memo(({ url, onReady, onError, onClose }) => {
  const [playerError, setPlayerError] = useState(null)
  const [hasStarted, setHasStarted] = useState(false)

  const handlePlayerReady = useCallback(() => {
    setHasStarted(true)
    if (onReady) onReady()
  }, [onReady])

  const handleVideoError = useCallback(
    error => {
      setPlayerError(error)
      if (onError) onError(error)
    },
    [onError]
  )

  return (
    <Suspense fallback={null}>
      <div className='relative h-full w-full'>
        <ReactPlayer
          url={url}
          width='100%'
          height='100%'
          controls={true}
          playing={hasStarted}
          playsinline
          onReady={handlePlayerReady}
          onError={handleVideoError}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
                preload: 'auto',
              },
              forceVideo: true,
            },
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />

        {playerError && (
          <div
            className='absolute inset-0 z-20 flex items-center justify-center bg-black/75 text-white backdrop-blur-sm'
            onClick={e => {
              e.stopPropagation()
              if (onClose) onClose()
            }}
          >
            <p>视频播放出错，请刷新页面重试</p>
          </div>
        )}
      </div>
    </Suspense>
  )
})

VideoPlayer.displayName = 'VideoPlayer'

VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
}

// 提取PlayButton作为独立组件
const PlayButton = memo(({ onClick }) => (
  <motion.button
    onClick={onClick}
    className='group absolute bottom-4 right-4 flex items-center overflow-hidden rounded-full border-none bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-white shadow-lg sm:bottom-6 sm:right-6 sm:px-5 sm:py-4'
    aria-label='播放完整视频'
    whileHover={{ scale: 1.05 }}
  >
    <FiPlayCircle className='relative z-10 mr-2 text-2xl text-white sm:text-3xl' />
    <span className='relative z-10 text-sm font-medium tracking-wide sm:text-base'>
      <span className='hidden sm:inline'>播放完整视频</span>
      <span className='sm:hidden'>播放</span>
    </span>
  </motion.button>
))

PlayButton.displayName = 'PlayButton'
PlayButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

// 优化VideoBackground组件
const VideoBackground = () => {
  const backgroundVideoRef = useRef(null)

  const {
    showVideo,
    selectedVideo,
    videoError,
    openVideo,
    closeVideo,
    setSelectedVideo,
    setVideoError,
    setIsVideoLoaded,
  } = useVideoStore()

  // 简化视频源配置
  const videoSource = { src: video_mp4, type: 'video/mp4' }

  // 优化点击处理函数
  const handleButtonClick = useCallback(
    e => {
      e.stopPropagation()
      openVideo()
    },
    [openVideo]
  )

  const handleDeleteButtonClick = useCallback(
    e => {
      if (e) e.stopPropagation()
      closeVideo()
    },
    [closeVideo]
  )

  const handleVideoReady = useCallback(() => {
    setIsVideoLoaded(true)
  }, [setIsVideoLoaded])

  const handleVideoError = useCallback(() => {
    setVideoError(true)
  }, [setVideoError])

  const handleBackgroundVideoLoadedData = useCallback(() => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.playbackRate = 0.8
    }
  }, [])

  // 默认选择MP4格式
  useEffect(() => {
    setSelectedVideo(video_1_mp4)
  }, [setSelectedVideo])

  return (
    <>
      <div className='relative w-full overflow-hidden px-4 lg:px-20'>
        {/* 简化背景元素 */}
        <motion.div
          className='absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-400/10 blur-3xl'
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 4 }}
          aria-hidden='true'
        />

        <div
          className='mx-auto rounded-xl border-4 border-emerald-600 p-0 shadow-xl lg:mx-0'
          style={{
            boxShadow:
              '0 20px 30px rgba(0, 0, 0, 0.07), 0 0 30px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div className='relative w-full overflow-hidden'>
            <div className='relative h-0 pb-[60%] lg:pb-[52%]'>
              {videoError ? (
                <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900/90 text-center'>
                  <FiX className='text-4xl text-red-400' />
                  <p className='text-xl font-medium text-white'>视频加载失败</p>
                  <p className='text-sm text-gray-300'>
                    请稍后再试或联系管理员
                  </p>
                </div>
              ) : (
                <>
                  <div className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent'></div>

                  <video
                    ref={backgroundVideoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload='metadata'
                    className='absolute left-0 top-0 z-0 h-full w-full object-cover'
                    onError={handleVideoError}
                    onLoadedData={handleBackgroundVideoLoadedData}
                    aria-hidden='true'
                  >
                    <source src={videoSource.src} type={videoSource.type} />
                    您的浏览器不支持视频标签
                  </video>

                  <PlayButton onClick={handleButtonClick} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md'
            onClick={handleDeleteButtonClick}
            role='dialog'
            aria-modal='true'
            aria-labelledby='video-title'
          >
            {/* 优化提示动画 - 使用transform避免回流且预先分配空间 */}
            <motion.div
              className='pointer-events-none fixed left-0 right-0 top-6 h-10 text-center'
              initial={{ opacity: 0.8, y: 0 }}
              animate={{ opacity: 0, y: -10 }}
              transition={{
                opacity: { duration: 2, delay: 1 },
                y: { duration: 1.5, delay: 1.5 },
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              <div className='inline-block rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm'>
                点击视频外区域关闭视频
              </div>
            </motion.div>

            <motion.button
              className='absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:right-6 sm:top-6 md:right-8 md:top-8'
              onClick={handleDeleteButtonClick}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              aria-label='关闭视频'
            >
              <FiX size={24} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.97, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='relative mx-auto flex h-auto max-h-[85vh] w-full max-w-[90vw] flex-col justify-center rounded-xl bg-transparent md:max-w-[85vw] lg:max-w-[80vw]'
              onClick={e => e.stopPropagation()}
              style={{ willChange: 'transform' }}
            >
              <h2 id='video-title' className='sr-only'>
                宋茶宣传视频
              </h2>

              <div
                className='relative aspect-video w-full overflow-hidden rounded-xl border-4 border-emerald-500/30 bg-black/80 shadow-2xl dark:border-emerald-400/20'
                style={{
                  boxShadow:
                    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.1)',
                }}
              >
                <Suspense fallback={null}>
                  {selectedVideo && (
                    <VideoPlayer
                      url={selectedVideo}
                      onReady={handleVideoReady}
                      onError={handleVideoError}
                      onClose={handleDeleteButtonClick}
                    />
                  )}
                </Suspense>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VideoBackground
