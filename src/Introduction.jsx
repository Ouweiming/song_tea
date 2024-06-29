import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './index.css'; // 确保包含了 Tailwind CSS

const Introduction = () => {
  const controlsH1 = useAnimation();
  const controlsP = useAnimation();
  const [refH1, inViewH1] = useInView({ triggerOnce: true, threshold: 0.5 });
  const [refP, inViewP] = useInView({ triggerOnce: true, threshold: 0.5 });

  React.useEffect(() => {
    if (inViewH1) {
      controlsH1.start({ opacity: 1, y: 0, scale: 1.1 });
    }
    if (inViewP) {
      controlsP.start({ opacity: 1, x: 0, scale: 1 });
    }
  }, [controlsH1, controlsP, inViewH1, inViewP]);

  // 为<h1>设置的动画配置
  const animationConfigH1 = {
    initial: { opacity: 0, y: -100, scale: 0.9 },
    animate: controlsH1,
    transition: { duration: 0.8, ease: "easeOut" },
  };

  // 为<p>设置的动画配置
  const animationConfigP = {
    initial: { opacity: 0, x: -200, scale: 0.95 },
    animate: controlsP,
    transition: { duration: 0.6, ease: "easeOut" },
  };

  return (
    <div className="container mx-auto py-28 px-9">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 space-y-8"> {/* 修改这里的space-y-4为space-y-8，增加间距 */}
          <motion.h1 
            ref={refH1}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-600"
            {...animationConfigH1}
          >
            后花园村介绍
          </motion.h1>
          <motion.p 
  ref={refP}
  className="text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 text-justify"
  {...animationConfigP}
>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;后花园村坐落于南澳岛中部主峰果老山的北侧，下辖4个自然村，总人口约335人。它以两大产业为主：旅游业与茶产业，其中“宋茶”是后花园村的一大特色名片，可以说“村民即是茶农”。后花园村以其得天独厚的自然条件和深厚的文化底蕴，发展成为一个生态旅游村。村内山林覆盖率高达90%以上，空气中的氧离子含量丰富，被誉为天然“氧吧”。同时，它优越的天然环境也为宋茶的生长提供了良好环境。
</motion.p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;