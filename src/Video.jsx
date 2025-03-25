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
const ReactPlayer = lazy(() => import('react-player'))

// 使用 memo 优化 VideoPlayer 组件，防止不必要的重渲染
const VideoPlayer = memo(({ url, onReady, onError, onClose }) => {
  const playerRef = useRef(null)
  const [playerError, setPlayerError] = useState(null)
  const [, setIsPlayerReady] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [, setIsBuffering] = useState(false)
  const [duration, setDuration] = useState(0)

  // 处理播放器准备完成
  const handlePlayerReady = useCallback(() => {
    console.log('视频播放器已就绪')
    setIsPlayerReady(true)

    // 确保获取到正确的持续时间
    if (playerRef.current) {
      const currentDuration = playerRef.current.getDuration()
      console.log('视频时长:', currentDuration)
      setDuration(currentDuration)
    }

    // 延迟一下再开始播放，让控件有时间正确初始化
    setTimeout(() => {
      setHasStarted(true)
      if (onReady) onReady()
    }, 500) // 增加延迟时间，确保完全加载
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

  // 获取视频时长
  const handleDuration = useCallback(duration => {
    console.log('获取到视频时长:', duration)
    setDuration(duration > 0 ? duration : 0)
  }, [])

  // 处理视频缓冲状态
  const handleBuffer = useCallback(() => {
    console.log('视频正在缓冲')
    setIsBuffering(true)
  }, [])

  // 处理视频缓冲结束
  const handleBufferEnd = useCallback(() => {
    console.log('视频缓冲结束')
    setIsBuffering(false)
  }, [])

  // 处理进度更新，用于调试
  const handleProgress = useCallback(state => {
    // 观察进度更新是否正常
    if (state.loaded < 0.97) {
      // 不处理接近完全加载的状态
      console.log(
        `视频进度: ${state.played.toFixed(2)}, 已加载: ${state.loaded.toFixed(2)}, 缓冲到: ${state.loadedSeconds.toFixed(2)}s`
      )
    }
  }, [])

  // 处理播放/暂停状态变化
  const handlePlayPause = useCallback(playing => {
    console.log('播放状态变更:', playing ? '播放' : '暂停')
  }, [])

  // 当用户拖动进度条时
  const handleSeek = useCallback(seconds => {
    console.log('用户跳转到:', seconds)
  }, [])

  // 可以添加一个渲染视频时长的逻辑，比如在调试模式下
  // 这将消除 duration 未使用的警告
  useEffect(() => {
    if (duration > 0) {
      console.log('视频时长已更新:', duration.toFixed(2), '秒')
    }
  }, [duration])

  return (
    <Suspense fallback={null}>
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
          onDuration={handleDuration}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onSeek={handleSeek}
          onPlay={() => handlePlayPause(true)}
          onPause={() => handlePlayPause(false)}
          onProgress={handleProgress}
          progressInterval={1000} // 降低进度更新频率
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
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />

        {/* 仅保留错误信息提示，删除加载指示器 */}
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

// 添加显示名称以提高调试体验
VideoPlayer.displayName = 'VideoPlayer'

// 添加PropTypes验证
VideoPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  onClose: PropTypes.func,
}

// Welcome 组件 - 使用memo优化性能并简化实现
const Welcome = memo(() => {
  // 预定义动画配置，避免每次渲染时重新创建
  const backgroundAnimProps = {
    first: {
      animate: {
        scale: [1, 1.1],
        opacity: [0.2, 0.3],
      },
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
    second: {
      animate: {
        scale: [1, 1.1],
        opacity: [0.15, 0.25],
      },
      transition: {
        duration: 12,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: 1,
      },
    },
  }

  // 预定义文本动画配置
  const textAnimConfig = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.6 },
  }

  return (
    <div className='relative w-full overflow-hidden py-12 md:py-16 lg:py-20'>
      {/* 背景装饰元素 - 使用预定义的动画配置 */}
      <motion.div
        className='absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-emerald-500/5 to-teal-300/5 blur-2xl'
        animate={backgroundAnimProps.first.animate}
        transition={backgroundAnimProps.first.transition}
        aria-hidden='true'
      />

      <motion.div
        className='absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-tl from-teal-400/5 to-emerald-300/5 blur-2xl'
        animate={backgroundAnimProps.second.animate}
        transition={backgroundAnimProps.second.transition}
        aria-hidden='true'
      />

      <div className='relative mx-auto max-w-4xl px-6 text-center'>
        {/* 装饰元素与描述文本 */}
        <motion.div {...textAnimConfig} className='flex flex-col items-center'>
          <Heart className='mb-3 text-2xl text-emerald-500 dark:text-emerald-400 sm:mb-4 sm:text-3xl md:text-4xl' />

          <p className='max-w-xl text-base font-medium leading-relaxed text-gray-700 dark:text-gray-300 sm:max-w-2xl sm:text-lg md:text-xl'>
            传承千年茶韵，体验自然与传统的完美融合
          </p>
        </motion.div>
      </div>
    </div>
  )
})

// 添加displayName以便于调试
Welcome.displayName = 'Welcome'

// 优化VideoBackground组件
const VideoBackground = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState('')
  const [videoError, setVideoError] = useState(false)
  const [, setIsVideoLoaded] = useState(false)
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
    console.log('全屏视频加载完成')
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

      // 为确保兼容性，先检查视频文件是否可访问
      try {
        if (isMounted) {
          if (canPlayWebm !== '') {
            // 预加载视频以检查其可访问性
            const preloadVideo = new Image()
            preloadVideo.src = video_1_webm
            preloadVideo.onload = () => setSelectedVideo(video_1_webm)
            preloadVideo.onerror = () => setSelectedVideo(video_1_mp4)
            // 设置默认值以防onload/onerror不触发
            setTimeout(() => {
              if (isMounted && !selectedVideo) {
                setSelectedVideo(video_1_mp4)
              }
            }, 1000)
          } else {
            setSelectedVideo(video_1_mp4)
          }
        }
      } catch (err) {
        console.error('视频资源检查失败:', err)
        if (isMounted) {
          setSelectedVideo(video_1_mp4) // 默认使用MP4
        }
      }

      video.remove()
    }

    detectVideoSupport()

    return () => {
      isMounted = false
    }
  }, [selectedVideo])

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
  ))

  PlayButton.displayName = 'PlayButton'

  return (
    <>
      <Welcome />
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
                {/* 移除加载状态指示器 */}

                {/* 视频播放器 - 仅当selectedVideo有值时才渲染 */}
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
