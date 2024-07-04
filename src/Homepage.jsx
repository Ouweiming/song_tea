import React, { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { FloatButton } from 'antd'
import Block from './Block'
import Introduction from './Introduction'
import VideoSection from './Video'
import 'highlight.js/styles/github.css' // 导入高亮样式
import Header from './header'
import Footer from './footer'
import pig from './assets/pig.png'
import { useTheme } from './theme-provider'
import Photowall from './Photowall'
import ContactForm from './Contact'
import ShoppingCartList from './ShoppingCartList'

const Homepage = () => {
  const { theme } = useTheme()

  const MainContent = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isFloatButtonRotated, setIsFloatButtonRotated] = useState(false)

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
      setIsFloatButtonRotated(!isFloatButtonRotated) // 旋转 FloatButton
    }

    return (
      <main className='container flex-auto'>
        {/* 侧边栏图标 */}
        <div onClick={toggleSidebar}>
          <FloatButton
            className={`fixed top-1/2 transform-gpu transition-transform duration-500 ${isFloatButtonRotated ? 'rotate-180' : ''}`} // 使用 Tailwind CSS 类实现按钮旋转
            icon={
              <div>
                <img src={pig} alt='svg' />
              </div>
            }
          />
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      </main>
    )
  }

  {
    /* 侧边栏 */
  }
  const Sidebar = ({ isOpen }) => {
    // 使用 react-spring 的 useSpring 钩子来定义侧边栏动画
    const sidebarAnimation = useSpring({
      transform: isOpen ? 'translateX(0%)' : 'translateX(100%)', // 打开时从右侧平移进来，关闭时向右侧平移出去
      opacity: isOpen ? 1 : 0, // 显示或隐藏侧边栏
      config: { tension: 200, friction: 20 }, // 调整动画的张力和摩擦力
    })

    return (
      <animated.aside
        className='flex rounded-3xl fixed right-16 top-1/2 max-h-full bg-white bg-opacity-65 overflow-y-auto z-50'
        style={sidebarAnimation}
      >
        <div className='flex flex-col flex-wrap justify-center items-center h-full px-4 py-2'>
          <p className='flex justify-center text-cyan-700 font-bold text-lg'>
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
          className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-gradient-to-r from-customgradient2 to-customgradient_2' : 'bg-gradient-to-r from-customgradient1 to-customgradient_1'}`}
        >
          <Header />
          <div className='relative flex flex-col flex-1'>
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
