import { motion, useAnimation } from 'framer-motion'
import React from 'react'
import { useInView } from 'react-intersection-observer'

import './index.css'

// 确保包含了 Tailwind CSS

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
    <section id='village' className='container mx-auto px-6 py-20 md:py-28'>
      <div className='flex flex-col items-start gap-8 lg:flex-row'>
        <div className='flex-1 space-y-8 text-left'>
          <motion.h2
            ref={refH1First}
            className='text-3xl font-bold text-emerald-600 dark:text-emerald-400 md:text-4xl lg:text-5xl'
            {...animationConfigH1First}
          >
            后花园村介绍
          </motion.h2>
          <motion.div
            ref={refPFirst}
            className='prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300'
            {...animationConfigPFirst}
          >
            <p className='leading-relaxed'>
              后花园村位于南澳岛中部主峰果老山北侧，由4个自然村组成，总人口约335人。这里以旅游与茶产业为支柱，
              <strong className='text-emerald-700 dark:text-emerald-400'>
                宋茶
              </strong>
              作为村庄特色名片，深受游客喜爱。
            </p>
            <p className='leading-relaxed'>
              环境得天独厚，山林覆盖率高达90%以上，空气负氧离子含量丰富，被誉为天然‘氧吧’。这样的自然环境为宋茶的生长提供了理想条件，使其具有独特的品质和口感。
            </p>
          </motion.div>
        </div>
      </div>

      <div className='mt-16 flex flex-col items-start gap-8 lg:flex-row'>
        <div className='flex-1 space-y-8'>
          <motion.h2
            ref={refH1Second}
            className='text-3xl font-bold text-emerald-600 dark:text-emerald-400 md:text-4xl lg:text-5xl'
            {...animationConfigH1Second}
          >
            宋茶品牌理念
          </motion.h2>
          <motion.div
            ref={refPSecond}
            className='prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300'
            {...animationConfigPSecond}
          >
            <p className='leading-relaxed'>
              <span className='text-xl font-semibold text-emerald-600 dark:text-emerald-400'>
                岛屿记忆
              </span>
              ——将健康与文化融为一体，带您踏上探索与品味的茶之旅。我们依托海岛的自然与文化资源，展现创新茶文化，倡导身心平衡和内心宁静的生活方式。
            </p>
            <div className='mt-4 flex flex-wrap gap-3'>
              <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-100'>
                天然有机
              </span>
              <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-100'>
                传统工艺
              </span>
              <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-100'>
                文化传承
              </span>
              <span className='rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-100'>
                生态可持续
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Introduction
