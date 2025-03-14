'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Animation for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.set('.mobile-menu', { display: 'flex' });
      gsap.to('.mobile-menu', {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    } else {
      gsap.to('.mobile-menu', {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set('.mobile-menu', { display: 'none' });
        }
      });
    }
  }, [isMobileMenuOpen]);
  
  // Set initial state for mobile menu
  useEffect(() => {
    gsap.set('.mobile-menu', { 
      display: 'none',
      opacity: 0,
      y: -20
    });
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                WB
              </div>
              <span className="ml-2 text-white font-bold text-xl">WebBuilder</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" active={pathname === '/'}>
              Home
            </NavLink>
            <NavLink href="/about" active={pathname === '/about'}>
              About
            </NavLink>
            <NavLink href="/pricing" active={pathname === '/pricing'}>
              Pricing
            </NavLink>
            <NavLink href="/contact" active={pathname === '/contact'}>
              Contact
            </NavLink>
            
            {!loading && (
              <>
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-1 text-white">
                      <span>{user.name}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                      <Link href="/dashboard">
                        <div className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Dashboard</div>
                      </Link>
                      <Link href="/profile">
                        <div className="block px-4 py-2 text-sm text-white hover:bg-gray-700">Profile</div>
                      </Link>
                      <div className="border-t border-gray-700"></div>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <button className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-purple-600 transition-colors">
                        Login
                      </button>
                    </Link>
                    <Link href="/register">
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-colors">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className="mobile-menu md:hidden absolute top-full left-0 right-0 flex-col bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <MobileNavLink href="/" active={pathname === '/'}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/about" active={pathname === '/about'}>
            About
          </MobileNavLink>
          <MobileNavLink href="/pricing" active={pathname === '/pricing'}>
            Pricing
          </MobileNavLink>
          <MobileNavLink href="/contact" active={pathname === '/contact'}>
            Contact
          </MobileNavLink>
          
          <div className="border-t border-gray-700 my-2"></div>
          
          {!loading && (
            <>
              {user ? (
                <>
                  <div className="px-4 py-2 text-white font-semibold">
                    Hello, {user.name}
                  </div>
                  <MobileNavLink href="/dashboard" active={pathname === '/dashboard'}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink href="/profile" active={pathname === '/profile'}>
                    Profile
                  </MobileNavLink>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col space-y-3">
                  <Link href="/login">
                    <button className="w-full px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-purple-600 transition-colors">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-colors">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Desktop Nav Link Component
const NavLink = ({ href, active, children }) => {
  return (
    <Link href={href}>
      <span className={`text-white cursor-pointer ${active ? 'font-bold' : 'hover:text-gray-300'}`}>
        {children}
        {active && <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 mt-1 rounded-full" />}
      </span>
    </Link>
  );
};

// Mobile Nav Link Component
const MobileNavLink = ({ href, active, children }) => {
  return (
    <Link href={href}>
      <span className={`block py-2 px-4 text-white cursor-pointer ${active ? 'font-bold bg-gray-800 rounded-lg' : 'hover:bg-gray-800 hover:bg-opacity-50 rounded-lg'}`}>
        {children}
      </span>
    </Link>
  );
};

export default Navbar;