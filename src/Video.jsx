import React, { useState, useRef, lazy, Suspense } from "react";
import { FiPlayCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// 动态导入 ReactPlayer
const ReactPlayer = lazy(() => import("react-player"));

// 新增的 Welcome 组件
const Welcome = () => {
  return (
    <div className="flex items-center justify-center w-full p-16 lg:p-48">
      <div className="text-center text-white">
        <motion.h1
          className="text-2xl md:text-4xl lg:text-7xl font-bold"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-green-400 bg-clip-text">欢迎来到后花园庄</span>
        </motion.h1>
        <motion.p
          className="text-black dark:text-white text-lg md:text-xl lg:text-2xl mt-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          我们致力于为您提供最好的服务
        </motion.p>
      </div>
    </div>
  );
};

const VideoBackground = () => {
  const [showVideo, setShowVideo] = useState(false);
  const videoContainerRef = useRef(null);

  const handleButtonClick = () => {
    setShowVideo(true);
  };

  const handleDeleteButtonClick = () => {
    setShowVideo(false);
  };

  return (
    <>
      <Welcome />
      <div className="relative w-full overflow-hidden">
        <div className="relative w-full overflow-hidden px-12 lg:px-36">
          {/* 增加内边距以增大空白 */}
          {/* 视频容器 */}
          <div className="relative h-0 rounded-xl shadow-lg shadow-emerald-500/50 border-large border-emerald-700 pb-[56.25%] lg:pb-[40%] before:content-[''] before:absolute before:inset-0 before:-m-0.5 before:bg-gradient-to-r before:from-green-400 before:via-emerald-500 before:to-teal-500 before:blur">
            <video
              src="src/assets/video.mp4"
              autoPlay
              muted
              loop
              alt="Background video"
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
              style={{ objectFit: "cover" }} // 确保视频保持正确的比例
            />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full max-w-3xl p-3 rounded-3xl bg-gray-900 bg-opacity-80"
              ref={videoContainerRef}
            >
              <div className="relative w-full h-0 pb-[56.25%]">
                <Suspense fallback={<div>Loading...</div>}>
                  <ReactPlayer
                    url="src/assets/video_1.mp4"
                    playing={true}
                    controls={true}
                    loop={true}
                    muted={true}
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </Suspense>
              </div>

              <button
                onClick={handleDeleteButtonClick}
                className="absolute top-2 right-2 px-3 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none"
              >
                X
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放按钮 - 移动端 */}
      <div className="absolute inset-0 flex items-end justify-center bottom-12 md:hidden">
        <motion.button
          onClick={handleButtonClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-3 bg-transparent hover:bg-emerald-600 text-white border border-white dark:border-white font-semibold rounded-full shadow-lg"
        >
          <FiPlayCircle className="mr-2" size={18} /> 播放完整视频
        </motion.button>
      </div>

      {/* 播放按钮 - 非移动端 */}
      <div className="absolute bottom-20 right-20 hidden md:flex items-center justify-center">
        <motion.button
          onClick={handleButtonClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center px-6 py-3 bg-transparent hover:bg-emerald-600 text-white border border-white dark:border-white font-semibold rounded-full shadow-lg"
        >
          <FiPlayCircle className="mr-2" size={18} /> 播放完整视频
        </motion.button>
      </div>
    </>
  );
};

export default VideoBackground;