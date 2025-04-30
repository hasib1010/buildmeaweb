'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Testimonials data with image paths
const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'Bloom Boutique',
    role: 'Founder',
    avatar: '/images/avatars/sarah.jpg', // Replace with actual image path
    quote: 'BuildMeAWeb transformed our online store, boosting sales by 40% with a stunning site!',
    stars: 5,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    company: 'TechStart Solutions',
    role: 'CEO',
    avatar: '/images/avatars/michael.jpg', // Replace with actual image path
    quote: 'Flawless delivery in record time, perfectly capturing our brand’s vision.',
    stars: 5,
  },
  {
    id: 3,
    name: 'Jessica Lee',
    company: 'Wellness Studio',
    role: 'Director',
    avatar: '/images/avatars/jessica.jpg', // Replace with actual image path
    quote: 'No tech skills needed! They delivered a site that’s pure perfection.',
    stars: 4,
  },
];

// Client logos with image paths
const clientLogos = [
  { id: 1, name: 'Company 1', logo: '/images/logos/company1.png' },
  { id: 2, name: 'Company 2', logo: '/images/logos/company2.png' },
  { id: 3, name: 'Company 3', logo: '/images/logos/company3.png' },
  { id: 4, name: 'Company 4', logo: '/images/logos/company4.png' },
  { id: 5, name: 'Company 5', logo: '/images/logos/company5.png' },
];

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);
  const logosRef = useRef(null);

  useEffect(() => {
    // Animate testimonial card
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: testimonialRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Animate client logos
    if (logosRef.current) {
      gsap.fromTo(
        logosRef.current.children,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: logosRef.current,
            start: 'top 90%',
          },
        }
      );
    }

    // Animate testimonial transition
    if (testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current,
        { opacity: 0, x: 20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [activeTestimonial]);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gray-900/50" id="testimonials">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0" data-parallax="0.2">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Hear From Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 animate-text-glow">Happy Clients</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover why businesses trust BuildMeAWeb to create stunning, high-performance websites.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="max-w-4xl mx-auto mb-16 animate-on-scroll">
          <div className="relative" ref={testimonialRef}>
            {/* Current Testimonial */}
            <div className="testimonial-card bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-500/20 hover:shadow-cyan-500/30 transition-all duration-300">
              <div className="mb-6 flex justify-between items-start">
                <div className="flex items-center">
                  <div className="mr-4 relative group">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50 glow-effect group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={testimonials[activeTestimonial].avatar}
                        alt={`${testimonials[activeTestimonial].name}'s avatar`}
                        width={80}
                        height={80}
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-400">
                      {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < testimonials[activeTestimonial].stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                    />
                  ))}
                </div>
              </div>

              <blockquote className="text-lg text-gray-200 italic mb-6">
                "{testimonials[activeTestimonial].quote}"
              </blockquote>

              {/* CTA Button */}
              <Link href="#order">
                <button
                  className="hero-button-primary bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-xl text-base font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
                  aria-label="Start your website project"
                >
                  Start Your Project
                </button>
              </Link>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-600 w-8'
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-gray-800/90 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm glow-effect"
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-gray-800/90 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm glow-effect"
                aria-label="Next testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Client Logos */}
        <div className="animate-on-scroll">
          <h3 className="text-center text-gray-300 text-xl font-semibold mb-8">
            Trusted by Leading Brands
          </h3>
          <div
            ref={logosRef}
            className="flex flex-wrap justify-center items-center gap-8 md:gap-12 relative overflow-hidden"
          >
            {clientLogos.concat(clientLogos).map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="relative group opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={120}
                  height={40}
                  className="h-10 object-contain group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-cyan-500/50 transition-transform duration-300"
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
          transform: translateY(-5px);
        }
        .glow-effect {
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.3);
        }
        .glow-effect:hover {
          box-shadow: 0 0 25px rgba(147, 51, 234, 0.6);
        }
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(147, 51, 234, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(0, 255, 255, 0.9), 0 0 30px rgba(147, 51, 234, 0.7);
          }
        }
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        .hero-button-primary:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

export default Testimonials;