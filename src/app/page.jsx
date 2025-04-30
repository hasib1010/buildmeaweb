'use client';

import { useEffect } from 'react';
import HeroSection from '@/components/Home/HeroSection';
import HowItWorks from '@/components/Home/HowItWorks';
import Testimonials from '@/components/Home/Testimonials';
import CtaSection from '@/components/Home/CtaSection';
import TechMarquee from '@/components/Home/TechMarquee';
import { initScrollAnimations } from '@/lib/animations';

export default function Home() {
  useEffect(() => {
    // Add required CSS for components if it doesn't exist
    if (!document.getElementById('animation-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'animation-styles';
      styleElement.textContent = `
        .gradient-text {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          background-image: linear-gradient(to right, #38bdf8, #a855f7);
        }
        
        .glow-effect {
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.4);
        }
        
        .testimonial-card {
          background: linear-gradient(to bottom right, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.7));
          border: 1px solid rgba(147, 51, 234, 0.2);
          border-radius: 1rem;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Initialize animations
    try {
      const cleanup = initScrollAnimations();
      
      // Implement our own scroll animation logic in case the animation library isn't working
      const handleScroll = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const elementVisible = 150;
          
          if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
          }
        });
      };
      
      // Run once for elements that are already in view on load
      handleScroll();
      
      // Add scroll listener
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        if (typeof cleanup === 'function') cleanup();
        window.removeEventListener('scroll', handleScroll);
      };
    } catch (error) {
      console.error('Animation initialization error:', error);
      
      // Fallback animation handling if the main animation fails
      const handleScrollFallback = () => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        animatedElements.forEach(element => {
          element.classList.add('visible');
        });
      };
      
      // Make all elements visible as fallback
      handleScrollFallback();
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-x-hidden">
      <HeroSection />

      {/* Technology Marquee Section */}
      <section className="py-24 relative">
        <div className="mx-auto relative z-10">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
                Our Tech Stack
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Explore the modern frameworks, CMS, and e-commerce platforms powering our solutions.
            </p>
          </div>
          <TechMarquee />
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)]"></div>
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Important: Adding sections with visible IDs */}
      <div id="how-it-works-container">
        <HowItWorks />
      </div>
      
      <div id="testimonials-container">
        <Testimonials />
      </div>
      
      <div id="cta-container">
        <CtaSection />
      </div>
    </main>
  );
}