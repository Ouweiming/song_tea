import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './index.css';
import hill1 from './assets/hill1.png';
import hill2 from './assets/hill2.png';
import hill3 from './assets/hill3.png';
import hill4 from './assets/hill4.png';
import hill5 from './assets/hill5.png';
import leaf from './assets/leaf.png';
import plant from './assets/plant.png';

const Parallax = () => {
  const [{ scrollY }, api] = useSpring(() => ({ scrollY: 0 }));

  const handleScroll = () => {
    api.start({ scrollY: window.scrollY });
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative h-screen flex justify-center items-center overflow-hidden">
        <animated.img 
          style={{
            transform: scrollY.to(y => `translateY(${y * 0.05}vh)`)
          }} 
          src={hill1}
          alt="Hill1" 
          className="absolute w-full h-full top-0 left-0 pointer-events-none object-cover" 
        />
        
        <img 
          src={hill2}
          alt="Hill2" 
          className="top-0 left-0 w-full h-full absolute pointer-events-none object-cover" 
        />
        
        <animated.h2 
          style={{
            transform: scrollY.to(y => `translateY(${y * 0.05}vh)`),
            top: '30%' // 调整这个值来定位 h2
          }} 
          className="absolute italic text-5xl text-white font-bold"
        >
          Welcome to my website!💕
        </animated.h2>
      
        <img 
          src={hill3}
          alt="Hill3" 
          className="top-0 left-0 w-full h-full absolute pointer-events-none object-cover" 
        />
       
        <animated.img 
          style={{
            transform: scrollY.to(y => `translateX(${y * -0.08}vw)`)
          }} 
          src={hill4}
          alt="Hill4" 
          className="top-0 left-0 w-full h-full absolute pointer-events-none object-cover" 
        />
        
        <animated.img 
          style={{
            transform: scrollY.to(y => `translateY(${y * 0.15}vh)`)
          }} 
          src={hill5}
          alt="Hill5" 
          className="absolute w-full h-full top-0 left-0 pointer-events-none object-cover" 
        />
       
        <animated.img 
          style={{
            transform: scrollY.to(y => `translateY(${y * 0.05}vh)`)
          }} 
          src={plant}
          alt="plant" 
          className="absolute w-full h-full top-0 left-0 pointer-events-none object-cover" 
        />
        
        <animated.img 
          style={{
            transform: scrollY.to(y => `translateY(${y * -0.15}vh) translateX(${y * 0.15}vw)`)
          }} 
          src={leaf}
          alt="leaf" 
          className="absolute w-full h-full top-0 left-0 pointer-events-none object-cover" 
        />
      </section>
    </div>
  );
};

export default Parallax;
