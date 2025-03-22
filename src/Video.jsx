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

import LoadingSpinner from './LoadingSpinner'
// 使用之前创建的加载组件
import video_mp4 from './assets/video.mp4'
import video_webm from './assets/video.webm'
import video_1_mp4 from './assets/video_1.mp4'
import video_1_webm from './assets/video_1.webm'
import Heart from './heart'

// 添加统一的主题色变量，方便色彩管理
const THEME = {
  primary: '#10b981', // 主色调 - emerald-500
  primaryLight: '#34d399', // 浅色 - emerald-400
  primaryDark: '#059669', // 深色 - emerald-600
  primaryGlow: 'rgba(16, 185, 129, 0.2)', // 光晕效果
  textLight: '#ffffff',
  textDark: '#0f172a',
  gradientLight: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  gradientDark: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
}

// 仅在需要时动态导入ReactPlayer
const ReactPlayer = lazy(() =>
  import(/* webpackChunkName: "react-player" */ 'react-player').then(module => {
    // 给浏览器一些呼吸时间
    return new Promise(resolve => {
      // 延迟100ms以避免主线程阻塞
      setTimeout(() => resolve(module), 100)
    })
  })
)

// 使用 memo 优化 VideoPlayer 组件，防止不必要的重渲染
const VideoPlayer = memo(({ url, onReady, onError }) => {
  const playerRef = useRef(null)
  const [playerError, setPlayerError] = useState(null)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  // 处理播放器准备完成
  const handlePlayerReady = useCallback(() => {
    console.log('视频播放器已就绪')
    setIsPlayerReady(true)
    // 延迟一下再开始播放，让控件有时间正确初始化
    setTimeout(() => {
      setHasStarted(true)
      if (onReady) onReady()
    }, 300)
  }, [onReady])

  // 处理播放器错误
  const handlePlayerError = useCallback(
    error => {
      console.error('视频播放错误:', error)
      setPlayerError(error)
      if (onError) onError(error)
    },
    [onError]
  )

  // 处理进度更新，用于调试
  const handleProgress = useCallback(state => {
    // 观察进度更新是否正常
    if (state.loaded !== state.loadedSeconds) {
      console.log(
        `视频进度: ${state.played.toFixed(2)}, 已加载: ${state.loaded.toFixed(2)}`
      )
    }
  }, [])

  // 处理播放/暂停状态变化
  const handlePlayPause = useCallback(playing => {
    console.log('播放状态变更:', playing ? '播放' : '暂停')
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner size={60} color={THEME.primary} />}>
      <div className='relative h-full w-full'>
        <ReactPlayer
          ref={playerRef}
          url={url}
          width='100%'
          height='100%'
          controls={true}
          playing={hasStarted} // 只有在就绪且启动后才播放
          playsinline
          onReady={handlePlayerReady}
          onError={handlePlayerError}
          onPlay={() => handlePlayPause(true)}
          onPause={() => handlePlayPause(false)}
          onProgress={handleProgress}
          progressInterval={1000} // 降低进度更新频率
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: true,
                preload: 'auto', // 确保预加载视频
              },
              forceVideo: true,
              forceDASH: false,
              forceHLS: false,
            },
          }}
        />

        {/* 透明覆盖层，用于调试或防止意外点击 */}
        {!isPlayerReady && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-black/40'>
            <LoadingSpinner size={60} color={THEME.primary} />
          </div>
        )}

        {playerError && (
          <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white'>
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
}

// 优化VideoBackground组件 - 删除Welcome组件的引用
const VideoBackground = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')
  const [videoError, setVideoError] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoContainerRef = useRef(null)
  const backgroundVideoRef = useRef(null)
  const isVideoOpenedRef = useRef(false)

  const videoSources = [
    { src: video_mp4, type: 'video/mp4' },
    { src: video_webm, type: 'video/webm' },
  ]

  // 优化按钮点击处理函数 - 修复ESLint警告
  const handleButtonClick = useCallback(e => {
    e.stopPropagation()
    if (!isVideoOpenedRef.current) {
      isVideoOpenedRef.current = true
      setShowVideo(true)
    }
  }, [])

  // 优化关闭按钮点击
  const handleDeleteButtonClick = useCallback(e => {
    if (e) e.stopPropagation()
    setShowVideo(false)
    isVideoOpenedRef.current = false
    setIsVideoLoaded(false)
  }, [])

  // 处理视频加载完成
  const handleVideoReady = useCallback(() => {
    setIsVideoLoaded(true)
  }, [])

  // 处理视频加载错误
  const handleVideoError = useCallback(error => {
    console.error('视频加载失败:', error)
    setVideoError(true)
  }, [])

  // 优化背景视频加载函数
  const handleBackgroundVideoLoadedData = useCallback(() => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.playbackRate = 0.8
    }
  }, [])

  // 检测浏览器对视频格式的支持并选择视频源
  useEffect(() => {
    let isMounted = true

    const detectVideoSupport = async () => {
      const video = document.createElement('video')
      const canPlayWebm = video.canPlayType('video/webm; codecs="vp8, vorbis"')

      if (isMounted) {
        if (canPlayWebm !== '') {
          setSelectedVideo(video_1_webm)
        } else {
          setSelectedVideo(video_1_mp4)
        }
      }

      video.remove()
    }

    detectVideoSupport()

    return () => {
      isMounted = false
    }
  }, [])

  // 美化的播放按钮组件
  const PlayButton = memo(() => (
    <motion.button
      onClick={handleButtonClick}
      className='group absolute bottom-4 right-4 flex items-center overflow-hidden rounded-full border-none bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-white shadow-lg sm:bottom-6 sm:right-6 sm:px-5 sm:py-4 md:bottom-8 md:right-8'
      aria-label='播放完整视频'
      whileHover={{
        scale: 1.05,
        background: THEME.gradientLight,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        willChange: 'transform',
        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
      }}
    >
      <span className='relative flex items-center justify-center'>
        {/* 增强的多层动画效果 */}
        <motion.span
          className='absolute -inset-3 rounded-full bg-emerald-400 opacity-20 dark:bg-emerald-300 dark:opacity-30'
          animate={{
            scale: [1.2, 4.6, 1.2], // 缩小最大缩放比例
            opacity: [0.2, 0.3, 0.2], // 稍微降低不透明度
          }}
          transition={{
            duration: 4.5, // 稍微缩短动画周期
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />

        <FiPlayCircle className='relative z-10 mr-2 text-2xl text-white sm:text-3xl md:text-4xl' />
      </span>
      <span className='relative z-10 text-sm font-medium tracking-wide sm:text-base md:text-lg'>
        <span className='hidden sm:inline'>播放完整视频</span>
        <span className='sm:hidden'>播放</span>
      </span>
    </motion.button>
  ))

  PlayButton.displayName = 'PlayButton'

  return (
    <>
      {/* 简化的标题区域 - 使用更轻量级的结构替代Welcome组件 */}
      <div className='relative py-10 md:py-14'>
        <div className='mx-auto max-w-5xl px-4 text-center'>
          {/* 标题 */}
          <h1 className='mb-4 text-3xl font-semibold text-gray-800 dark:text-gray-200 sm:text-4xl md:text-5xl'>
            欢迎来到后花园庄
          </h1>

          {/* Heart 图标 */}
          <Heart className='mx-auto mb-5 text-3xl text-emerald-500 dark:text-emerald-400' />

          {/* 描述文字 */}
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
            传承千年茶韵，体验自然与传统的完美融合。在这里，您可以品味到最纯正的茶香，
            感受大自然的宁静与美好。
          </p>
        </div>
      </div>

      <div className='relative w-full overflow-hidden px-4 lg:px-20'>
        {/* 简化装饰性背景元素动画 */}
        <motion.div
          className='absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-400/10 blur-3xl'
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10, // 增加动画周期，减少重绘频率
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ willChange: 'transform, opacity' }} // 告知浏览器提前优化
          aria-hidden='true'
        />

        <div
          className='mx-auto rounded-xl border-4 border-emerald-600 p-0 shadow-xl lg:mx-0'
          style={{
            boxShadow:
              '0 20px 30px rgba(0, 0, 0, 0.07), 0 0 30px rgba(16, 185, 129, 0.15)',
            willChange: 'transform', // 提示浏览器可能的变化
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
                    alt='Background video'
                    className='absolute left-0 top-0 z-0 h-full w-full object-cover'
                    style={{
                      maxWidth: '100%',
                      willChange: 'transform',
                    }}
                    onError={handleVideoError}
                    onLoadedData={handleBackgroundVideoLoadedData}
                    aria-hidden='true'
                  >
                    {videoSources.map((source, index) => (
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
            transition={{ duration: 0.25 }} // 减少动画时间
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md'
            onClick={handleDeleteButtonClick}
            role='dialog'
            aria-modal='true'
            aria-labelledby='video-title'
          >
            {/* 简化提示动画 */}
            <motion.div
              className='pointer-events-none absolute left-0 right-0 top-6 text-center'
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{
                duration: 2,
                delay: 1.5,
              }}
            >
              <div className='inline-block rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur-sm'>
                点击视频外区域关闭视频
              </div>
            </motion.div>

            {/* 优化关闭按钮 */}
            <motion.button
              className='absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:right-6 sm:top-6 md:right-8 md:top-8'
              onClick={handleDeleteButtonClick}
              initial={{ opacity: 0.8, scale: 1 }} // 直接显示，无隐藏动画
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
              initial={{ scale: 0.97, opacity: 0.5 }} // 减小初始缩放和透明度差异
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='relative mx-auto flex h-auto max-h-[85vh] w-full max-w-[90vw] flex-col justify-center rounded-xl bg-transparent md:max-w-[85vw] lg:max-w-[80vw]'
              ref={videoContainerRef}
              onClick={e => e.stopPropagation()}
            >
              <h2 id='video-title' className='sr-only'>
                宋茶宣传视频
              </h2>

              {/* 视频纵横比容器 - 美化边框和阴影 */}
              <div
                className='relative aspect-video w-full overflow-hidden rounded-xl border-4 border-emerald-500/30 bg-black/80 shadow-2xl dark:border-emerald-400/20'
                style={{
                  boxShadow:
                    '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.1)',
                }}
              >
                {/* 加载状态指示器 */}
                {!isVideoLoaded && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <LoadingSpinner size={60} color={THEME.primary} />
                  </div>
                )}

                {/* 视频播放器 - 仅当selectedVideo有值时才渲染 */}
                <Suspense
                  fallback={
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <LoadingSpinner size={60} color={THEME.primary} />
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VideoBackground
