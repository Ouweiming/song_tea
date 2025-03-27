import { create } from 'zustand'

const useVideoStore = create(set => ({
  showVideo: false,
  selectedVideo: '',
  videoError: false,
  isVideoLoaded: false,

  setShowVideo: value => set({ showVideo: value }),
  setSelectedVideo: url => set({ selectedVideo: url }),
  setVideoError: hasError => set({ videoError: hasError }),
  setIsVideoLoaded: isLoaded => set({ isVideoLoaded: isLoaded }),

  // 组合操作
  openVideo: () => set({ showVideo: true }),
  closeVideo: () => set({ showVideo: false, isVideoLoaded: false }),
}))

export default useVideoStore
