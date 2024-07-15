import { animated, useSpring } from '@react-spring/web'
import { FloatButton } from 'antd'
import 'highlight.js/styles/github.css'
import React, { useState } from 'react'

import Block from './Block'
import ContactForm from './Contact'
import Introduction from './Introduction'
import Photowall from './Photowall'
import ShoppingCartList from './ShoppingCartList'
import VideoSection from './Video'
import pig from './assets/pig.png'
import Footer from './footer'
import Header from './header'
import { useTheme } from './theme-provider'

const Homepage = () => {
  const { theme } = useTheme()

  const MainContent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isFloatButtonRotated, setIsFloatButtonRotated] = useState(false)

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
      setIsFloatButtonRotated(!isFloatButtonRotated)
    }

    return (
      <main className='container flex-auto'>
        <button onClick={toggleSidebar} className='focus:outline-none'>
          <FloatButton
            className={`fixed top-1/2 transform-gpu transition-transform duration-500 ${isFloatButtonRotated ? 'rotate-180' : ''}`}
            icon={
              <div>
                <img src={pig} alt='svg' />
              </div>
            }
          />
        </button>

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </main>
    )
  }

  const Sidebar = ({ isOpen }) => {
    const sidebarAnimation = useSpring({
      transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
      opacity: isOpen ? 1 : 0,
      config: { tension: 200, friction: 20 },
      willChange: 'transform, opacity', // 添加 willChange 优化
    })

    return (
      <animated.aside
        className='fixed right-16 top-1/2 z-50 flex max-h-full overflow-y-auto rounded-3xl bg-white bg-opacity-65'
        style={sidebarAnimation}
      >
        <div className='flex h-full flex-col flex-wrap items-center justify-center px-4 py-2'>
          <p className='flex justify-center text-lg font-bold text-cyan-700'>
            其余板块正在努力开发中~
          </p>
        </div>
      </animated.aside>
    )
  }

  return (
    <>
      <FloatButton.BackTop />
      <div>
        <div
          className={`flex min-h-screen flex-col ${theme === 'dark' ? 'bg-gradient-to-r from-customgradient2 to-customgradient_2' : 'bg-gradient-to-r from-customgradient1 to-customgradient_1'}`}
        >
          <Header />
          <div className='relative flex flex-1 flex-col'>
            <VideoSection />
          </div>
          <MainContent />
          <Introduction />
          <Photowall />
          <Block />
          <ShoppingCartList />
          <ContactForm />
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Homepage
