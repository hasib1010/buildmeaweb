'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import ThreeScene from '../ThreeD/ThreeScene';
import { initHeroAnimations } from '../../lib/animations';

const HeroSection = ({ isLoaded, setIsLoaded }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) {
      setIsLoaded(true);
      initHeroAnimations();
    }
  }, [isLoaded, setIsLoaded]);

  return (
    <section 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white py-20 px-4"
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10 max-w-2xl">
          <h1 className="hero-title text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Transform</span> Your Online Presence
          </h1>
          <p className="hero-description text-xl mb-8 text-gray-300">
            We build stunning, high-performance websites that elevate your brand. 
            Choose from our flexible plans and get online in as little as 5 days.
          </p>
          <div className="hero-buttons flex flex-wrap gap-4">
            <Link 
              href="/plans" 
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-medium transition-colors duration-300 transform hover:scale-105 accent-glow"
            >
              Explore Plans
            </Link>
            <Link 
              href="/consultation" 
              className="bg-transparent border-2 border-purple-500 hover:bg-purple-900/20 px-8 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Free Consultation
            </Link>
          </div>
        </div>
        
        <div className="w-full h-96 md:h-auto relative">
          {isLoaded && <ThreeScene />}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="hero-decoration absolute w-96 h-96 bg-purple-500 rounded-full opacity-0 top-20 -left-20"></div>
        <div className="hero-decoration absolute w-96 h-96 bg-blue-500 rounded-full opacity-0 bottom-20 -right-20"></div>
      </div>
    </section>
  );
};

export default HeroSection;