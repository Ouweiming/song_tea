import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Suspense, lazy, memo, useCallback, useEffect, useRef } from 'react'
import { FiPlayCircle, FiX } from 'react-icons/fi'

// 导入 Zustand store

// 导入从heart.jsx中分离的Welcome组件

import useVideoStore from './stores/videoStore'

// 仅在需要时动态导入ReactPlayer
const ReactPlayer = lazy(() => import('react-player'))

// 将频繁创建的样式对象提取出来
const VIDEO_CONTAINER_STYLE = {
  contain: 'content',
}

const VIDEO_BORDER_STYLE = {
  boxShadow:
    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.1)',
  contain: 'layout',
}

// 使用 memo 优化 VideoPlayer 组件，防止不必要的重渲染
const VideoPlayer = memo(({ url, onReady, onError, onClose }) => {
  const playerRef = useRef(null)
  const videoStore = useVideoStore()

  const handlePlayerReady = useCallback(() => {
    videoStore.handleVideoReady()
    if (onReady) onReady()
  }, [onReady, videoStore])

  const handlePlayerError = useCallback(
    error => {
      videoStore.handleVideoError(error)
      if (onError) onError(error)
    },
    [onError, videoStore]
  )

  return (
    <Suspense fallback={null}>
      <div className='relative h-full w-full'>
        <ReactPlayer
          ref={playerRef}
          url={url}
          width='100%'
          height='100%'
          controls={true}
          playing={videoStore.isPlayerReady}
          playsinline
          onReady={handlePlayerReady}
          onError={handlePlayerError}
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
            willChange: 'transform',
          }}
        />
        {videoStore.videoError && (
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

// 添加显示名称以提高调试体验
VideoPlayer.displayName = 'VideoPlayer'

// 添加PropTypes验证
VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
}

// 美化的播放按钮组件
const PlayButton = memo(() => {
  const { handleOpenVideo } = useVideoStore()

  return (
    <motion.button
      onClick={handleOpenVideo}
      className='group absolute bottom-4 right-4 flex items-center overflow-hidden rounded-full border-none bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-white shadow-lg sm:bottom-6 sm:right-6 sm:px-5 sm:py-4 md:bottom-8 md:right-8'
      aria-label='播放完整视频'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        willChange: 'transform',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
      }}
    >
      <span className='relative flex items-center justify-center'>
        <FiPlayCircle className='relative z-10 mr-2 text-2xl text-white sm:text-3xl md:text-4xl' />
      </span>
      <span className='relative z-10 text-sm font-medium tracking-wide sm:text-base md:text-lg'>
        <span className='hidden sm:inline'>播放完整视频</span>
        <span className='sm:hidden'>播放</span>
      </span>
    </motion.button>
  )
})

PlayButton.displayName = 'PlayButton'

// 优化VideoBackground组件
const VideoBackground = () => {
  const backgroundVideoRef = useRef(null)
  const videoContainerRef = useRef(null)

  const {
    showVideo,
    videoError,
    selectedVideo,
    videoSources,
    handleCloseVideo,
    handleVideoReady,
    handleVideoError,
    initializeVideo,
  } = useVideoStore()

  const handleBackgroundVideoLoadedData = useCallback(() => {
    requestAnimationFrame(() => {
      if (
        backgroundVideoRef.current &&
        !backgroundVideoRef.current.dataset.initialized
      ) {
        backgroundVideoRef.current.playbackRate = 0.8
        backgroundVideoRef.current.dataset.initialized = 'true'
      }
    })
  }, [])

  useEffect(() => {
    initializeVideo()
  }, [initializeVideo])

  return (
    <>
      <div className='relative w-full overflow-hidden px-4 lg:px-20'>
        {/* 简化装饰性背景元素动画 */}
        <motion.div
          className='absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-400/10 blur-3xl'
          animate={{
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ willChange: 'opacity', contain: 'paint' }}
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
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FiX className='text-4xl text-red-400' />
                  </motion.div>
                  <p className='text-xl font-medium text-white'>视频加载失败</p>
                  <p className='text-sm text-gray-300'>
                    请稍后再试或联系管理员
                  </p>
                </div>
              ) : (
                <>
                  {/* 添加渐变遮罩层，增强视频层次感 */}
                  <div className='pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/20 to-transparent'></div>

                  <video
                    ref={backgroundVideoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload='metadata'
                    className='absolute left-0 top-0 z-0 h-full w-full object-cover'
                    style={{
                      maxWidth: '100%',
                      willChange: 'transform',
                      contain: 'content',
                    }}
                    onError={handleVideoError}
                    onLoadedData={handleBackgroundVideoLoadedData}
                    aria-hidden='true'
                  >
                    {videoSources.background.map((source, index) => (
                      <source key={index} src={source.src} type={source.type} />
                    ))}
                    您的浏览器不支持视频标签
                  </video>

                  {/* 使用优化后的播放按钮 */}
                  <PlayButton />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 点击后显示的视频弹窗 - 增强视觉效果和交互体验 */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md'
            onClick={handleCloseVideo}
            role='dialog'
            aria-modal='true'
            aria-labelledby='video-title'
            style={{ willChange: 'opacity', contain: 'layout paint' }}
          >
            {/* 简化提示动画 */}
            <motion.div
              className='pointer-events-none absolute left-0 right-0 top-6 text-center'
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: 2,
                delay: 1,
              }}
            >
              <div className='inline-block rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm'>
                点击视频外区域关闭视频
              </div>
            </motion.div>

            {/* 优化关闭按钮 */}
            <motion.button
              className='absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:right-6 sm:top-6 md:right-8 md:top-8'
              onClick={handleCloseVideo}
              initial={{ opacity: 0.8, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              aria-label='关闭视频'
            >
              <FiX size={24} />
            </motion.button>

            {/* 优化视频容器动画 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='relative mx-auto flex h-auto max-h-[85vh] w-full max-w-[90vw] flex-col justify-center rounded-xl bg-transparent md:max-w-[85vw] lg:max-w-[80vw]'
              ref={videoContainerRef}
              onClick={e => e.stopPropagation()}
              style={VIDEO_CONTAINER_STYLE}
            >
              <h2 id='video-title' className='sr-only'>
                宋茶宣传视频
              </h2>

              {/* 视频纵横比容器 - 美化边框和阴影 */}
              <div
                className='relative aspect-video w-full overflow-hidden rounded-xl border-4 border-emerald-500/30 bg-black/80 shadow-2xl dark:border-emerald-400/20'
                style={VIDEO_BORDER_STYLE}
              >
                {/* 视频播放器 - 仅当selectedVideo有值时才渲染 */}
                <Suspense fallback={null}>
                  {selectedVideo && (
                    <VideoPlayer
                      url={selectedVideo}
                      onReady={handleVideoReady}
                      onError={handleVideoError}
                      onClose={handleCloseVideo}
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
