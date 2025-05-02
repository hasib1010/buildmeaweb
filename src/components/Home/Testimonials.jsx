'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'Bloom Boutique',
    role: 'Founder',
    avatar: '/images/avatars/sarah.jpg',
    quote: 'BuildMeAWeb transformed our online store, boosting sales by 40% with a stunning site!',
    stars: 5,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    company: 'TechStart Solutions',
    role: 'CEO',
    avatar: '/images/avatars/michael.jpg',
    quote: 'Flawless delivery in record time, perfectly capturing our brand’s vision.',
    stars: 5,
  },
  {
    id: 3,
    name: 'Jessica Lee',
    company: 'Wellness Studio',
    role: 'Director',
    avatar: '/images/avatars/jessica.jpg',
    quote: 'No tech skills needed! They delivered a site that’s pure perfection.',
    stars: 4,
  },
];

// Client logos
const clientLogos = [
  { id: 1, name: 'Company 1', logo: '/images/logos/company1.png' },
  { id: 2, name: 'Company 2', logo: '/images/logos/company2.png' },
  { id: 3, name: 'Company 3', logo: '/images/logos/company3.png' },
  { id: 4, name: 'Company 4', logo: '/images/logos/company4.png' },
  { id: 5, name: 'Company 5', logo: '/images/logos/company5.png' },
];

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const logosRef = useRef(null);
  const progressRef = useRef(null);
  const touchStartX = useRef(null);

  // Handle initial animations (run once on mount)
  useEffect(() => {
    // Animate carousel entrance
    if (carouselRef.current) {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Animate client logos
    if (logosRef.current) {
      gsap.fromTo(
        logosRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: logosRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf([carouselRef.current, logosRef.current, progressRef.current]);
    };
  }, []);

  // Handle auto-rotation and progress bar
  useEffect(() => {
    // Auto-rotation
    const interval = setInterval(() => {
      if (!isPaused) {
        nextTestimonial();
      }
    }, 6000);

    // Progress bar animation
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: '100%',
        duration: 6,
        ease: 'linear',
        overwrite: 'auto',
        onComplete: () => {
          if (!isPaused) {
            gsap.set(progressRef.current, { width: '0%' });
          }
        },
      });
    }

    return () => {
      clearInterval(interval);
      gsap.killTweensOf(progressRef.current);
    };
  }, [isPaused]);

  const animateTestimonialTransition = (direction, onComplete) => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current.children[0], {
        opacity: 0,
        x: direction === 'next' ? -30 : 30,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete,
      });
    }
  };

  const nextTestimonial = () => {
    animateTestimonialTransition('next', () => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      gsap.set(progressRef.current, { width: '0%' });
      if (carouselRef.current) {
        gsap.fromTo(
          carouselRef.current.children[0],
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    });
  };

  const prevTestimonial = () => {
    animateTestimonialTransition('prev', () => {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      gsap.set(progressRef.current, { width: '0%' });
      if (carouselRef.current) {
        gsap.fromTo(
          carouselRef.current.children[0],
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    });
  };

  const goToTestimonial = (index) => {
    if (index === activeTestimonial) return;
    const direction = index > activeTestimonial ? 'next' : 'prev';
    animateTestimonialTransition(direction, () => {
      setActiveTestimonial(index);
      gsap.set(progressRef.current, { width: '0%' });
      if (carouselRef.current) {
        gsap.fromTo(
          carouselRef.current.children[0],
          { opacity: 0, x: direction === 'next' ? 30 : -30 },
          { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out', overwrite: 'auto' }
        );
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextTestimonial();
    if (e.key === 'ArrowLeft') prevTestimonial();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) nextTestimonial();
    if (diff < -50) prevTestimonial();
  };

  return (
    <section
      className="py-24 relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
      id="testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Testimonials carousel"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white font-sans">
            What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 animate-text-glow">Clients Say</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto font-light">
            See why businesses choose BuildMeAWeb for exceptional, high-performance websites.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="max-w-4xl mx-auto mb-16"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative" ref={carouselRef}>
            {/* Current Testimonial */}
            <div className="testimonial-card bg-gray-800/90 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="mb-6 flex justify-between items-start">
                <div className="flex items-center">
                  <div className="mr-4 relative group">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/50 glow-effect group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={testimonials[activeTestimonial].avatar}
                        alt={`${testimonials[activeTestimonial].name}'s avatar`}
                        width={64}
                        height={64}
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-400 text-sm">
                      {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < testimonials[activeTestimonial].stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>

              <blockquote className="text-lg text-gray-200 italic mb-6 font-light">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>

              {/* CTA Button */}
              <Link href="#order">
                <button
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl text-base font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label="Start your website project"
                >
                  Start Your Project
                </button>
              </Link>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div ref={progressRef} className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === index
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 w-5'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                  aria-label={`View testimonial from ${testimonials[index].name}`}
                  aria-current={activeTestimonial === index ? 'true' : 'false'}
                ></button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:block absolute -left-12 top-1/2 transform -translate-y-1/2">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-gray-800/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 rounded-full flex items-center justify-center text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm glow-effect focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="hidden md:block absolute -right-12 top-1/2 transform -translate-y-1/2">
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-gray-800/80 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-500 rounded-full flex items-center justify-center text-gray-200 hover:text-white transition-all duration-300 backdrop-blur-sm glow-effect focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div>
          <h3 className="text-center text-gray-300 text-xl font-semibold mb-8">
            Trusted by Top Brands
          </h3>
          <div
            ref={logosRef}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
          >
            {clientLogos.map((client) => (
              <div
                key={client.id}
                className="relative group opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={120}
                  height={40}
                  className="h-12 object-contain group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-cyan-500/40 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for Effects */}
      <style jsx>{`
        .testimonial-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-8px);
        }
        .glow-effect {
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.3);
        }
        .glow-effect:hover {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.6);
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 8px rgba(34, 211, 238, 0.6), 0 0 16px rgba(147, 51, 234, 0.4);
          }
          50% {
            text-shadow: 0 0 12px rgba(34, 211, 238, 0.8), 0 0 24px rgba(147, 51, 234, 0.6);
          }
        }
        .animate-text-glow {
          animation: text-glow 2.5s ease-in-out infinite;
        }
        section:focus {
          outline: none;
        }
        @media (max-width: 768px) {
          .testimonial-card {
            padding: 1.5rem;
          }
          .absolute.-left-12,
          .absolute.-right-12 {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;