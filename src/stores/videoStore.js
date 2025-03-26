import { create } from 'zustand'

import video_mp4 from '../assets/video.mp4'
import video_webm from '../assets/video.webm'
import video_1_mp4 from '../assets/video_1.mp4'
import video_1_webm from '../assets/video_1.webm'

const detectVideoSupport = () => {
  if (typeof window === 'undefined') return { canPlayWebm: false }
  const video = document.createElement('video')
  const canPlayWebm =
    video.canPlayType('video/webm; codecs="vp8, vorbis"') !== ''
  video.remove()
  return { canPlayWebm }
}

const useVideoStore = create((set, get) => ({
  showVideo: false,
  isVideoLoaded: false,
  videoError: false,
  selectedVideo: '',
  isPreferWebm: detectVideoSupport().canPlayWebm,
  isPlayerReady: false,
  videoSources: {
    background: [
      { src: video_webm, type: 'video/webm' },
      { src: video_mp4, type: 'video/mp4' },
    ],
    main: [
      { src: video_1_webm, type: 'video/webm' },
      { src: video_1_mp4, type: 'video/mp4' },
    ],
  },
  setShowVideo: value => set({ showVideo: value }),
  setIsVideoLoaded: value => set({ isVideoLoaded: value }),
  setVideoError: value => set({ videoError: value }),
  setSelectedVideo: value => set({ selectedVideo: value }),
  setIsPlayerReady: value => set({ isPlayerReady: value }),
  initializeVideo: async () => {
    const { isPreferWebm } = get()
    const mainVideos = get().videoSources.main
    if (isPreferWebm) {
      set({ selectedVideo: mainVideos[0].src })
    } else {
      set({ selectedVideo: mainVideos[1].src })
    }
  },
  handleOpenVideo: () => {
    set({ showVideo: true })
    if (!get().selectedVideo) {
      get().initializeVideo()
    }
  },
  handleCloseVideo: () => {
    set({ showVideo: false, isVideoLoaded: false })
  },
  handleVideoError: () => {
    // 移除错误对象输出，避免暴露敏感信息
    set({ videoError: true })
  },
  handleVideoReady: () => {
    set({ isVideoLoaded: true, isPlayerReady: true })
  },
}))

export default useVideoStore
