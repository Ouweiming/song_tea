import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AnimatedBlock = ({ delay = 0, direction = 'left', content }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const xInitial = direction === 'left' ? -30 : 30;
  const xEnd = 0;

  const animationConfig = {
    initial: { opacity: 0, x: xInitial, scale: 0.9 },
    animate: { opacity: inView ? 1 : 0, x: inView ? xEnd : xInitial, scale: inView ? 1.05 : 0.9 },
    transition: { duration: 0.6, delay, ease: "easeOut" }
  };

  return (
    <div ref={ref} className="py-8 flex justify-center items-center w-full">
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
    className="flex flex-col sm:flex-row items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-5xl bg-white dark:bg-gray-300 bg-opacity-90 shadow-lg rounded-lg p-4 sm:p-6 md:p-8"
      >
<div className="flex flex-col items-center justify-center overflow-hidden">
  <h2 className="text-emerald-500 dark:text-teal-600 text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-start overflow-ellipsis whitespace-nowrap">{content.title}</h2>
  <p className="text-emerald-800 dark:text-emerald-900 text-center text-lg sm:text-xl md:text-2xl leading-relaxed overflow-auto">{content.paragraph}</p>
</div>
      </motion.div>
    </div>
  );
};

const Block = () => {
  const content1 = {
    title: "产品类型：",
    paragraph: "主打产品系列（玉兰香、芝兰香、翠玉香、密兰香，不同香型的“宋茶单丛”）衍生产品系列（茶宠盲盒、IP周边原创）"
  };

  const content2 = {
    title: "特色介绍：",
    paragraph: "在茶叶生产中，我们致力于让茶叶自然地生长，打造一款品质纯净、健康，安全的有机生态茶叶。在产品推出中，针对用户的不同需求，后花园宋茶推出不同包装规格与包装类型，为用户提供多样化的选择。"
  };

  const content3 = {
    title: "文化价值：",
    paragraph: "后花园宋茶的文化价值体现在其药用价值及丰富的历史文化内涵。它不仅与宋朝逃亡故事紧密相关，还因其独特的生长环境和稀有性成为珍贵文化遗产。宋茶的传说增添了其神秘色彩，使其成为不仅具有治疗功效，也承载深厚文化历史价值的符号。"
  };

  return (
    <div className="flex gap-12 flex-col p-4 items-center justify-center min-h-screen py-24 bg-inherit dark:bg-inherit">
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-emerald-800 dark:text-teal-500">
  茶叶产品：
  <span className="text-green-600 dark:text-emerald-400">
    岛屿记忆-后花园宋茶
  </span>
</h1>
      <AnimatedBlock delay={0.1} direction="left" content={content1} />
      <AnimatedBlock delay={0.2} direction="right" content={content2} />
      <AnimatedBlock delay={0.3} direction="left" content={content3} />
    </div>
  );
};

export default Block;
