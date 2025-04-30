'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import Lottie to prevent it from affecting initial page load
const Lottie = dynamic(() => import('lottie-react'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg animate-pulse"></div>
  )
});

const HeroSection = () => {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load animation data asynchronously
  useEffect(() => {
    // Use browser's fetch API to load the JSON file
    const loadAnimationData = async () => {
      try {
        const response = await fetch('/anime.json');
        const data = await response.json();
        setAnimationData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load animation:', error);
        setIsLoading(false);
      }
    };

    loadAnimationData();
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 bg-black"
      id="hero"
    >
      {/* Background - Static */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900 opacity-80"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-white">
              Build Your Perfect Website
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                Fast, Flawless, Yours
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-lg leading-relaxed">
              Transform your vision into a stunning, high-performance website. Delivered in days, customized to your brand, and optimized for success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="#order">
                <button
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold"
                  aria-label="Start building your website"
                >
                  Start Your Journey
                </button>
              </Link>
              <Link href="#pricing">
                <button
                  className="border-2 border-purple-500 text-purple-400 px-10 py-4 rounded-xl text-lg font-semibold"
                  aria-label="View pricing plans"
                >
                  Explore Plans
                </button>
              </Link>
            </div>
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-200 text-sm lg:text-base">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Rapid Delivery
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Tailored Design
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 6.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                Expert Support
              </div>
            </div>
            {/* Trust Indicators */}
            <div className="mt-6 text-gray-400 text-sm">
              <p>Trusted by <span className="text-cyan-400">500+ businesses</span> worldwide</p>
              <p>Over <span className="text-cyan-400">1,000 websites</span> launched successfully</p>
            </div>
          </div>

          {/* Right Side - Optimized Lottie Loading */}
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0 hidden lg:block">
            <div className="relative w-full h-full mx-auto">
              {/* Show a placeholder while Lottie loads */}
              {isLoading ? (
                <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-purple-900/30 rounded-lg flex items-center justify-center">
                  <div className="text-purple-400">Loading...</div>
                </div>
              ) : (
                animationData && (
                  <Lottie 
                    animationData={animationData} 
                    loop={true} 
                    rendererSettings={{
                      preserveAspectRatio: 'xMidYMid slice',
                      progressiveLoad: true, // Enable progressive loading
                      hideOnTransparent: true // Hide parts on transparent background
                    }}
                    lottieRef={(ref) => {
                      // If available, reduce quality for better performance
                      if (ref) {
                        ref.setQuality('low');
                      }
                    }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
 
    </section>
  );
};

export default HeroSection;