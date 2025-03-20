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
import { FiPlayCircle } from 'react-icons/fi'

import LoadingSpinner from './LoadingSpinner'
// 使用之前创建的加载组件
import video_mp4 from './assets/video.mp4'
import video_webm from './assets/video.webm'
import video_1_mp4 from './assets/video_1.mp4'
import video_1_webm from './assets/video_1.webm'
import Heart from './heart'

// 仅在需要时动态导入ReactPlayer
const ReactPlayer = lazy(() => import('react-player'))

// 使用 memo 优化 VideoPlayer 组件，防止不必要的重渲染
const VideoPlayer = memo(({ url, onReady, onError }) => {
  const playerRef = useRef(null)
  const progressRef = useRef(0) // 存储播放进度
  const [isPlaying, setIsPlaying] = useState(true) // 控制播放状态
  // 移除未使用的状态，只保留 ref
  const playerReadyRef = useRef(false) // 使用ref跟踪状态，避免闭包问题

  // 定义更稳定的事件处理函数
  const handlePlayerReady = useCallback(
    event => {
      playerReadyRef.current = true

      // 视频准备好后，如果有存储的进度则恢复
      if (progressRef.current > 0 && playerRef.current) {
        playerRef.current.seekTo(progressRef.current, 'seconds')
      }
      if (onReady) onReady(event)
    },
    [onReady]
  )

  const handlePlayerError = useCallback(
    error => {
      console.error('视频播放错误:', error)
      if (onError) onError(error)
    },
    [onError]
  )

  const handleProgress = useCallback(progress => {
    // 只在播放器就绪时更新进度
    if (playerReadyRef.current) {
      progressRef.current = progress.playedSeconds
    }
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  return (
    <Suspense fallback={<LoadingSpinner size={60} color='#10b981' />}>
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls
        onReady={handlePlayerReady}
        onError={handlePlayerError}
        width='100%'
        height='100%'
        style={{ position: 'absolute', top: 0, left: 0 }}
        // 降低进度更新频率，减少重渲染
        progressInterval={1000}
        onProgress={handleProgress}
        onPause={handlePause}
        onPlay={handlePlay}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              disablePictureInPicture: true,
              style: {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              },
            },
            forceVideo: true,
            forceHLS: false,
            forceDASH: false,
          },
        }}
      />
    </Suspense>
  )
})

// 添加显示名称以提高调试体验
VideoPlayer.displayName = 'VideoPlayer'

// 实现防抖函数

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
  const isVideoOpenedRef = useRef(false) // 跟踪视频是否已打开，防止重复操作

  const videoSources = [
    { src: video_mp4, type: 'video/mp4' },
    { src: video_webm, type: 'video/webm' },
  ]

  // 优化按钮点击处理函数
  const handleButtonClick = useCallback(e => {
    e.stopPropagation() // 阻止事件冒泡
    if (!isVideoOpenedRef.current) {
      isVideoOpenedRef.current = true
      setShowVideo(true)
    }
  }, [])

  // 优化关闭按钮点击
  const handleDeleteButtonClick = useCallback(e => {
    if (e) e.stopPropagation() // 阻止事件冒泡
    setShowVideo(false)
    isVideoOpenedRef.current = false
    // 重置加载状态
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
      // 视频已加载，可以设置播放速度
      backgroundVideoRef.current.playbackRate = 0.8 // 稍微减慢播放速度
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

  // 优化的播放按钮组件
  const PlayButton = memo(() => (
    <motion.button
      onClick={handleButtonClick}
      className='group absolute bottom-4 right-4 flex items-center overflow-hidden rounded-full border-none bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3 text-white shadow-lg transition-all hover:from-emerald-500 hover:to-emerald-400 dark:from-emerald-500 dark:to-emerald-400 dark:hover:from-emerald-400 dark:hover:to-emerald-300 sm:bottom-6 sm:right-6 sm:px-5 sm:py-4 md:bottom-8 md:right-8'
      aria-label='播放完整视频'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        delay: 0.2,
      }}
    >
      <span className='relative flex items-center justify-center'>
        <span className='absolute -inset-3 animate-ping rounded-full bg-emerald-400 opacity-20 dark:bg-emerald-300 dark:opacity-30'></span>
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

                  {/* 使用优化后的播放按钮 */}
                  <PlayButton />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 点击后显示的视频弹窗 - 使用事件捕获阶段阻止事件冒泡 */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md'
            onClick={handleDeleteButtonClick} // 点击背景关闭视频
            role='dialog'
            aria-modal='true'
            aria-labelledby='video-title'
          >
            {/* 点击空白区域关闭提示 - 初始显示后淡出 */}
            <motion.div
              className='pointer-events-none absolute left-0 right-0 top-6 text-center'
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{
                duration: 2.5,
                times: [0, 0.7, 1], // 保持显示一段时间后才淡出
                ease: 'easeOut',
              }}
            >
              <div className='inline-block rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur-sm'>
                点击视频外区域关闭视频
              </div>
            </motion.div>

            {/* 视频容器 - 阻止事件冒泡 */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className='relative mx-auto flex h-auto max-h-[85vh] w-full max-w-[90vw] flex-col justify-center rounded-xl bg-transparent md:max-w-[85vw] lg:max-w-[80vw]'
              ref={videoContainerRef}
              onClick={e => e.stopPropagation()} // 阻止点击视频区域时关闭
            >
              <h2 id='video-title' className='sr-only'>
                宋茶宣传视频
              </h2>

              {/* 视频纵横比容器 - 添加美化边框 */}
              <div className='relative aspect-video w-full overflow-hidden rounded-xl border-4 border-emerald-500/30 bg-black/80 shadow-2xl dark:border-emerald-400/20'>
                {/* 加载状态指示器 */}
                {!isVideoLoaded && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <LoadingSpinner size={60} color='#10b981' />
                  </div>
                )}

                {/* 视频播放器 - 仅当selectedVideo有值时才渲染 */}
                <Suspense
                  fallback={
                    <div className='absolute inset-0 flex items-center justify-center'>
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VideoBackground
