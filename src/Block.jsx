import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedBlock = ({ delay = 0, direction = 'left' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const xInitial = direction === 'left' ? -200 : 200;
  const xEnd = 0;

  const animationConfig = {
    initial: { opacity: 0, x: xInitial, scale: 0.9 },
    animate: { opacity: inView ? 1 : 0, x: inView ? xEnd : xInitial, scale: inView ? 1.05 : 0.9 },
    transition: { duration: 0.6, delay, ease: "easeOut" }
  };

  return (
    <div ref={ref} className="py-16 flex justify-center items-center align-middle "> {/* 修改这里 */}
      <motion.div
        {...animationConfig}
        whileHover={{
          scale: 1.1,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 50,
          }
        }}
        className="flex items-center justify-center align-middle w-5/6 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-5/6 h-auto bg-white shadow-lg rounded-lg p-6"
      >
<h2 className="text-black dark:text-emerald-700 text-xl font-bold mb-4 text-center">Animated Block</h2>
<p className="text-black dark:text-emerald-300 text-center leading-relaxed">This block animates when it enters the viewport. Scroll down to see the effect.</p>
      </motion.div>
    </div>
  );
};

// 使用示例
const block = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-100 dark:bg-inherit">
      <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">Scroll-triggered Animations</h1>
      <AnimatedBlock delay={0.1} direction="left" />
      <AnimatedBlock delay={0.2} direction="right" />
      <AnimatedBlock delay={0.3} direction="left" />
    </div>
  );
};

export default block;