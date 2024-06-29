import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { animated, useSpring } from '@react-spring/web';
import reactIcon from './assets/react.svg';
import { RiHomeHeartLine } from "react-icons/ri";
import { useTheme } from './theme-provider';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);
  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const rotate = useSpring({
    loop: true,
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
    config: { duration: isHovered ? 999 : 5000 }, // 提高旋转速度
  });

  useEffect(() => {
    document.addEventListener("mousedown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const closeMenu = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        onClick={toggleMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <animated.img 
          src={reactIcon} 
          alt="React Icon" 
          className="mr-6 w-12 h-12"
          style={rotate} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute top-full left-0 w-64 bg-${theme === 'dark' ? 'gray-800' : 'white'} shadow-lg rounded-lg overflow-hidden mt-3 border border-gray-200`}
          >
            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-6 py-4"
            >
              <Link to="/Homepage">
              <button className={`w-full text-left px-4 py-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-100'} rounded-md`}>
                <span className="inline-flex items-center">
                  Home
                  <RiHomeHeartLine className="ml-1" />
                </span>
              </button>
              </Link>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="px-6 py-4"
            >
              <Link to="/Introduction">
              <button className={`w-full text-left px-4 py-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-100'} rounded-md`}>
                Personal Introduction
              </button>
              </Link>
            </motion.li>

            <motion.li
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              className="px-6 py-4"
            >
              <Link to="/Resume">
              <button className={`w-full text-left px-4 py-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-100'} rounded-md`}>
                Personal Resume
              </button>
              </Link>
            </motion.li>

          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
