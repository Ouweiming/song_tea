import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'

import Logo from './assets/logo.svg'
import './index.css'
import { useTheme } from './theme-provider'

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { setTheme, theme } = useTheme()

  const menuItems = ['Profile', 'Dashboard', 'Activity']

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      style={{
        backgroundColor:
          theme === 'dark'
            ? 'rgba(31, 41, 55, 0.6)'
            : 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <NavbarContent className='sm:hidden' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className='pr-3 sm:hidden' justify='center'>
        <NavbarBrand>
          <motion.img
            src={Logo}
            alt='Brand Icon'
            className={`mr-6 h-16 w-16 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.0, delay: 0.2 }}
          />
          <motion.p
            className={`text-lg font-bold ${theme === 'dark' ? 'text-emerald-600' : 'text-green-600'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4 }}
          >
            后花园庄
          </motion.p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarBrand>
          <motion.img
            src={Logo}
            alt='Brand Icon'
            className={`mr-6 h-16 w-16 ${theme === 'dark' ? 'logo-dark' : 'logo-light'}`}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 1.0, delay: 0.2 }}
          />
          <motion.p
            className={`text-2xl font-bold ${theme === 'dark' ? 'text-emerald-600' : 'text-green-600'}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4 }}
          >
            后花园庄
          </motion.p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify='end' className='flex items-center gap-2'>
        <NavbarItem>
          <Button
            isIconOnly
            size='lg'
            variant='light'
            color='success'
            className='rounded-full p-2'
            onClick={handleToggle}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {theme === 'dark' ? (
                <FiSun className='text-success' size={28} />
              ) : (
                <FiMoon className='text-success' size={28} />
              )}
            </motion.div>
          </Button>
        </NavbarItem>
      </NavbarContent>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <NavbarMenu>
              {menuItems.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <NavbarMenuItem>
                    <Link
                      className={`w-full ${theme === 'dark' ? 'text-green-200' : 'text-green-600'}`}
                      href='#'
                      size='lg'
                    >
                      {item}
                    </Link>
                  </NavbarMenuItem>
                </motion.div>
              ))}
            </NavbarMenu>
          </motion.div>
        )}
      </AnimatePresence>
    </Navbar>
  )
}
