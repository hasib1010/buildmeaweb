'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Step data
const steps = [
  {
    id: 1,
    title: 'Select Your Solution',
    description: 'Choose from our curated development packages tailored for startups, SMEs, and enterprises.',
    icon: (
      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    details: 'Our packages include everything from sleek landing pages to complex e-commerce platforms and custom web applications. Each solution is built with responsive design, SEO optimization, and a robust CMS, tailored to your business goals.'
  },
  {
    id: 2,
    title: 'Share Your Vision',
    description: 'Complete our detailed brief to outline your brand, objectives, and technical requirements.',
    icon: (
      <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    details: 'Our in-depth questionnaire captures your brand identity, target audience, design preferences, and technical specifications. This ensures we align our development process with your vision, delivering a product that resonates with your audience.'
  },
  {
    id: 3,
    title: 'We Code & Launch',
    description: 'Our expert developers craft your website, delivering a polished product ready to shine.',
    icon: (
      <svg className="w-12 h-12 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    details: 'In 1-4 weeks, we build your site using cutting-edge technologies, provide a preview for feedback, and implement revisions. We ensure a seamless launch with performance optimization and post-launch support.'
  }
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(null);
  const particlesRef = useRef(null);

  const toggleStep = (id) => {
    setActiveStep(activeStep === id ? null : id);
  };

  useEffect(() => {
    // Particle animation
    const particlesContainer = particlesRef.current;
    if (!particlesContainer) return;
    
    const particleCount = 12;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particlesContainer.appendChild(particle);
      particles.push(particle);

      gsap.set(particle, {
        x: gsap.utils.random(0, window.innerWidth),
        y: gsap.utils.random(0, window.innerHeight),
        scale: gsap.utils.random(0.3, 0.8),
        opacity: gsap.utils.random(0.2, 0.6),
        background: gsap.utils.random(['#00f7ff', '#ff00ff', '#ffffff']),
      });

      gsap.to(particle, {
        x: `+=${gsap.utils.random(-200, 200)}`,
        y: `+=${gsap.utils.random(-200, 200)}`,
        duration: gsap.utils.random(5, 10),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.2,
      });
    }

    // Card hover animations
    const cards = document.querySelectorAll('.step-card');
    const mouseEnterHandlers = [];
    const mouseLeaveHandlers = [];
    
    cards.forEach((card, index) => {
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -8,
          boxShadow: '0 0 40px rgba(147, 51, 234, 0.6)',
          duration: 0.4,
          ease: 'power2.out',
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)',
          duration: 0.4,
          ease: 'power2.out',
        });
      };
      
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      mouseEnterHandlers[index] = handleMouseEnter;
      mouseLeaveHandlers[index] = handleMouseLeave;
    });

    return () => {
      // Cleanup
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        gsap.killTweensOf(particle);
      });
      
      cards.forEach((card, index) => {
        card.removeEventListener('mouseenter', mouseEnterHandlers[index]);
        card.removeEventListener('mouseleave', mouseLeaveHandlers[index]);
        gsap.killTweensOf(card);
      });
    };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden" id="how-it-works">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-purple-950 opacity-80"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-4xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-4xl"></div>
        <div ref={particlesRef} className="absolute inset-0"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              How We Build Your Vision
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Our expert developers deliver high-performance websites with a seamless, client-focused process.
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row gap-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="animate-on-scroll flex-1 h-fit"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div
                className={`step-card h-full cursor-pointer bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-8 transition-all duration-300 ${
                  activeStep === step.id ? 'border-purple-500/70 shadow-xl shadow-purple-500/20' : ''
                }`}
                onClick={() => toggleStep(step.id)}
              >
                {/* Icon & Number */}
                <div className="flex items-center mb-6">
                  <div className="mr-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-xl"></div>
                    <div className="relative" style={{ filter: `drop-shadow(0 0 10px ${step.icon.props.className.split('text-')[1].split('-')[0]}-500)` }}>
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                      {step.id}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-200 mb-6">{step.description}</p>

                {/* Expandable Details */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    activeStep === step.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pt-6 border-t border-gray-700/50">
                    <p className="text-gray-300">{step.details}</p>
                  </div>
                </div>

                {/* Show More/Less Button */}
                <button 
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-6 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStep(step.id);
                  }}
                >
                  {activeStep === step.id ? 'Show Less' : 'Show More'}
                  <svg
                    className={`ml-2 w-4 h-4 transition-transform duration-300 ${
                      activeStep === step.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for effects */}
      <style jsx>{`
        .step-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border 0.3s ease;
        }
        .step-card:hover {
          transform: translateY(-8px);
        }
        .particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;