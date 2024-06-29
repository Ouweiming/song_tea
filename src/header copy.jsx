import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from '@nextui-org/react';
import './index.css';
import { FaGithub } from 'react-icons/fa';
import { RiHomeHeartLine } from "react-icons/ri";
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './theme-provider';
import DropdownMenu from './DropdownMenu';

export default function Header() {


  const { setTheme, theme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Navbar isBordered style={{ backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}>
      <NavbarBrand>
        <DropdownMenu />
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Button
            as={Link}
            color={theme === 'dark' ? 'success' : 'primary'}
            href="/Introduction"
            variant="ghost"
            radius="full"
          >
            Personal Introduction
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            color={theme === 'dark' ? 'success' : 'primary'}
            href="/Homepage"
            variant="ghost"
            radius="full"
            endContent={<RiHomeHeartLine size={20} />}
          >
            Home
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            as={Link}
            color={theme === 'dark' ? 'success' : 'primary'}
            href="/Resume"
            variant="ghost"
            radius="full"
          >
            Personal Resume
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="flex items-center gap-2">
        <NavbarItem>
          <Button
            isIconOnly
            as="a"
            href="https://github.com/Ouweiming"
            color='primary'
            variant="light"
            className="p-2 rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub size={24} />
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            color='primary'
            className="p-2 rounded-full"
            onClick={handleToggle}
          >
            <FiSun className="text-primary dark:hidden" size={24} />
            <FiMoon className="hidden dark:inline text-primary" size={24} />
           
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
