import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './index.css' // 确保包含了 Tailwind CSS

const Introduction = () => {
  // 第一个组件的动画控制器和可视区域检测
  const controlsH1First = useAnimation()
  const controlsPFirst = useAnimation()
  const [refH1First, inViewH1First] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })
  const [refPFirst, inViewPFirst] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  // 第二个组件的动画控制器和可视区域检测
  const controlsH1Second = useAnimation()
  const controlsPSecond = useAnimation()
  const [refH1Second, inViewH1Second] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })
  const [refPSecond, inViewPSecond] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  React.useEffect(() => {
    // 第一个组件的动画效果（从左上角进入）
    if (inViewH1First) {
      controlsH1First.start({ opacity: 1, x: 0, y: 0 })
    }
    if (inViewPFirst) {
      controlsPFirst.start({ opacity: 1, x: 0, y: 0 })
    }

    // 第二个组件的动画效果（从右上角进入）
    if (inViewH1Second) {
      controlsH1Second.start({ opacity: 1, x: 0, y: 0 })
    }
    if (inViewPSecond) {
      controlsPSecond.start({ opacity: 1, x: 0, y: 0 })
    }
  }, [
    controlsH1First,
    controlsPFirst,
    inViewH1First,
    inViewPFirst,
    controlsH1Second,
    controlsPSecond,
    inViewH1Second,
    inViewPSecond,
  ])

  // 第一个组件的动画配置（从左上角进入）
  const animationConfigH1First = {
    initial: { opacity: 0, x: -30, y: -100 },
    animate: controlsH1First,
    transition: { duration: 0.8, ease: 'easeOut' },
  }

  const animationConfigPFirst = {
    initial: { opacity: 0, x: -30, y: -100 },
    animate: controlsPFirst,
    transition: { duration: 0.9, ease: 'easeOut' },
  }

  // 第二个组件的动画配置（从右上角进入）
  const animationConfigH1Second = {
    initial: { opacity: 0, x: 30, y: -100 },
    animate: controlsH1Second,
    transition: { duration: 0.7, ease: 'easeOut' },
  }

  const animationConfigPSecond = {
    initial: { opacity: 0, x: 30, y: -100 },
    animate: controlsPSecond,
    transition: { duration: 0.8, ease: 'easeOut' },
  }

  return (
    <div className='container mx-auto py-28 px-14'>
      <div className='flex flex-col lg:flex-row gap-8 items-start'>
        <div className='flex-1 space-y-8 text-left'>
          {' '}
          {/* 添加 text-left 类 */}
          <motion.h1
            ref={refH1First}
            className='text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-600 dark:text-emerald-400'
            {...animationConfigH1First}
          >
            后花园村介绍
          </motion.h1>
          <motion.p
            ref={refPFirst}
            className='text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 text-justify'
            {...animationConfigPFirst}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;后花园村坐落于南澳岛中部主峰果老山的北侧，下辖4个自然村，总人口约335人。它以两大产业为主：旅游业与茶产业，其中“宋茶”是后花园村的一大特色名片，可以说“村民即是茶农”。后花园村以其得天独厚的自然条件和深厚的文化底蕴，发展成为一个生态旅游村。村内山林覆盖率高达90%以上，空气中的氧离子含量丰富，被誉为天然“氧吧”。
            同时，它优越的天然环境也为宋茶的生长提供了良好环境。
          </motion.p>
        </div>
      </div>

      <div className='mt-16 flex flex-col lg:flex-row gap-8 items-start'>
        <div className='flex-1 space-y-8 text-right'>
          {' '}
          {/* 添加 text-right 类 */}
          <motion.h1
            ref={refH1Second}
            className='text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-600 dark:text-emerald-400'
            {...animationConfigH1Second}
          >
            宋茶品牌理念
          </motion.h1>
          <motion.p
            ref={refPSecond}
            className='text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 text-justify'
            {...animationConfigPSecond}
          >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“岛屿记忆”将健康与文化融合，带领人们踏上一段充满探索与品味的茶之旅。依托海岛自然与文化资源，展现创新茶文化，倡导人们追求身心平衡和内心的宁静。
          </motion.p>
        </div>
      </div>
    </div>
  )
}

export default Introduction
