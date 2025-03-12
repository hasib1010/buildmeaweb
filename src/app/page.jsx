'use client';

import { useState, useEffect } from 'react';
import { initAllAnimations } from '../lib/animations';

// Import all section components
import HeroSection from '../components/sections/HeroSection';
import TrustedBySection from '../components/sections/TrustedBySection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PlansSection from '../components/sections/PlansSection';
import CtaSection from '../components/sections/CtaSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize animations after component mounts
  useEffect(() => {
    // Only run animations after all components are mounted
    if (isLoaded) {
      initAllAnimations();
    }
  }, [isLoaded]);

  return (
    <div className="overflow-x-hidden bg-black text-white">
      {/* Hero Section with 3D animation */}
      <HeroSection isLoaded={isLoaded} setIsLoaded={setIsLoaded} />
      
      {/* Trusted By Section */}
      <TrustedBySection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Plans Section */}
      <PlansSection />
      
      {/* CTA Section */}
      <CtaSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} Website Builder Service. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-gray-400 hover:text-purple-400 mx-2">Terms</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 mx-2">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 mx-2">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}