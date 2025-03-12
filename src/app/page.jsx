'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import GSAP directly in the page component
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ThreeScene from '@/components/ThreeScene';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animated logo component
const AnimatedLogo = () => {
  return (
    <div className="relative">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-400 to-purple-600">
          BUILD
        </span>
        <span className="text-white">ME</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
          AWEB
        </span>
      </h1>
      <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-blue-400 to-purple-600"></div>
    </div>
  );
};

// Mobile Navigation Menu
const MobileMenu = ({ isOpen, toggleMenu }) => {
  return (
    <div className={`fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <button
        onClick={toggleMenu}
        className="absolute top-6 right-6 text-white p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <nav className="flex flex-col items-center space-y-8 text-2xl">
        <a href="#features" onClick={toggleMenu} className="text-white hover:text-purple-400 transition-colors duration-300">Features</a>
        <a href="#plans" onClick={toggleMenu} className="text-white hover:text-purple-400 transition-colors duration-300">Plans</a>
        <a href="#process" onClick={toggleMenu} className="text-white hover:text-purple-400 transition-colors duration-300">Process</a>
        <a href="#portfolio" onClick={toggleMenu} className="text-white hover:text-purple-400 transition-colors duration-300">Portfolio</a>
        <a href="#contact" onClick={toggleMenu} className="text-white hover:text-purple-400 transition-colors duration-300">Contact</a>
      </nav>

      <div className="mt-12">
        <Link
          href="/consultation"
          onClick={toggleMenu}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-lg font-medium transition-all duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

// FeatureCard Component with enhanced design
const FeatureCard = ({ icon, title, description, color }) => {
  // Define styles based on color
  const getColorClasses = (colorName) => {
    switch (colorName) {
      case 'purple':
        return {
          bg: 'bg-purple-900/20',
          text: 'text-purple-400',
          border: 'hover:border-purple-500',
          gradient: 'from-purple-500 to-blue-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-900/20',
          text: 'text-blue-400',
          border: 'hover:border-blue-500',
          gradient: 'from-blue-500 to-indigo-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-900/20',
          text: 'text-orange-400',
          border: 'hover:border-orange-500',
          gradient: 'from-orange-500 to-amber-500'
        };
      default:
        return {
          bg: 'bg-purple-900/20',
          text: 'text-purple-400',
          border: 'hover:border-purple-500',
          gradient: 'from-purple-500 to-blue-500'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className={`feature-card group flex flex-col items-center p-6 sm:p-8 rounded-xl border border-gray-800 ${colorClasses.border} transition-all duration-500 hover:shadow-lg hover:-translate-y-2 bg-gray-900/80 backdrop-blur-sm h-full relative overflow-hidden`}>
      {/* Gradient background that appears on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

      <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center ${colorClasses.bg} ${colorClasses.text} rounded-full mb-4 sm:mb-6 z-10 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white z-10">{title}</h3>
      <p className="text-gray-400 text-center z-10 text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};

// PlanCard Component with enhanced design
const PlanCard = ({
  name,
  description,
  price,
  period,
  subscription,
  features,
  isFeatured,
  ctaText,
  ctaLink,
  ctaStyle
}) => {
  // Determine button style based on props
  const getButtonStyle = () => {
    if (ctaStyle === 'primary') {
      return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-600/20';
    } else {
      return 'border-2 border-purple-600 text-purple-400 hover:bg-purple-900/20 hover:shadow-lg hover:shadow-purple-600/10';
    }
  };

  // Determine card style based on whether it's featured
  const cardStyle = isFeatured
    ? 'border-2 border-purple-600 shadow-lg shadow-purple-900/30'
    : 'border border-gray-800 hover:border-gray-700';

  const buttonStyle = getButtonStyle();

  return (
    <div className={`plan-card bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-xl hover:shadow-purple-900/20 ${cardStyle} relative h-full`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm font-bold py-1 px-3 sm:px-4 rounded-bl-lg rounded-tr-lg">
          BEST VALUE
        </div>
      )}

      <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{name}</h3>
      <p className="text-gray-400 mb-4 text-sm sm:text-base">{description}</p>

      <div className="text-3xl sm:text-4xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{price}</div>
      {period && <span className="text-xs sm:text-sm text-gray-400">{period}</span>}
      {subscription && <p className="text-xs sm:text-sm text-purple-400 mb-4 sm:mb-6">{subscription}</p>}

      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left text-sm sm:text-base">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {typeof feature.value === 'boolean' ? (
              <span className={feature.value ? "text-green-500 mr-2" : "text-red-500 mr-2"}>
                {feature.value ? '✓' : '✗'}
              </span>
            ) : (
              <span className="text-purple-400 mr-2 text-lg">•</span>
            )}
            <span className="text-gray-300">{feature.text}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaLink}
        className={`block w-full text-center py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-medium transition-all duration-300 ${buttonStyle} hover:scale-105 text-sm sm:text-base`}
      >
        {ctaText}
      </Link>
    </div>
  );
};

// Main Page Component
export default function Home() {
  const featuresRef = useRef(null);
  const plansRef = useRef(null);
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const processRef = useRef(null);
  const portfolioRef = useRef(null);

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu function
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);

    // Prevent body scroll when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    // Clean up function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    // Make sure we're in the browser and GSAP is available
    if (typeof window === 'undefined' || !gsap) return;

    console.log("Initializing animations...");

    // Delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      try {
        // Logo animation
        gsap.from(logoRef.current, {
          y: -50,
          opacity: 0,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        });

        // Hero section animations
        gsap.from('.hero-title', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });

        gsap.from('.hero-description', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out'
        });

        gsap.from('.hero-buttons', {
          y: 30,
          opacity: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'power2.out'
        });

        // Features section animations
        const featureCards = document.querySelectorAll('.feature-card-wrapper');
        featureCards.forEach((card, index) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: 0.1 * index,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          });
        });

        // Plans section animations
        const planCards = document.querySelectorAll('.plan-card-wrapper');
        planCards.forEach((card, index) => {
          gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: 0.1 * index,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: plansRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          });
        });

        console.log("Animations applied successfully!");
      } catch (error) {
        console.error("Error applying animations:", error);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      // Clean up ScrollTrigger instances
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  // Features data
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Stunning Design",
      description: "Professional, modern designs that make your business stand out from the competition.",
      color: "purple"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fast Turnaround",
      description: "Get your website up and running in as little as 5-7 days, not weeks or months.",
      color: "blue"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Transparent Pricing",
      description: "No hidden fees or surprises. Clear pricing structure with exactly what you get.",
      color: "orange"
    }
  ];

  // Plans data
  const plans = [
    {
      name: "Starter",
      description: "Best for Personal & Landing Pages",
      price: "$150",
      period: "one-time",
      features: [
        { text: "Up to 2 pages" },
        { text: "Simple & clean designs" },
        { text: "Basic SEO optimization" },
        { text: "Mobile-Friendly", value: false },
      ],
      isFeatured: false,
      ctaText: "Get Started",
      ctaLink: "/checkout?plan=starter",
      ctaStyle: "secondary"
    },
    {
      name: "Growth",
      description: "Best for Small Businesses & Coaches",
      price: "$499",
      period: "one-time",
      features: [
        { text: "Up to 4 pages" },
        { text: "Your custom design" },
        { text: "Advanced SEO" },
        { text: "Mobile-Friendly", value: true },
      ],
      isFeatured: true,
      ctaText: "Get Started",
      ctaLink: "/checkout?plan=growth",
      ctaStyle: "primary"
    },
    {
      name: "Elite - Custom",
      description: "For Businesses, E-commerce & Advanced Needs",
      price: "Custom Pricing",
      subscription: "$9.99/month membership",
      features: [
        { text: "Unlimited pages" },
        { text: "Fully tailored design" },
        { text: "Full SEO strategy" },
        { text: "E-commerce ready", value: true },
      ],
      isFeatured: false,
      ctaText: "Get Free Consultation",
      ctaLink: "/consultation",
      ctaStyle: "secondary"
    }
  ];

  return (
    <div className="overflow-x-hidden text-white">
      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} toggleMenu={toggleMobileMenu} />

      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/70 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div ref={logoRef}>
            <AnimatedLogo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Features</a>
            <a href="#plans" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Plans</a>
            <a href="#process" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Process</a>
            <a href="#portfolio" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Portfolio</a>
            <a href="#contact" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop CTA Button */}
          <Link
            href="/consultation"
            className="hidden md:block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors duration-300 text-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Background gradient effects */}
      <div className="fixed inset-0 bg-black z-[-1]">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600 rounded-full filter blur-[100px] sm:blur-[150px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600 rounded-full filter blur-[100px] sm:blur-[150px] opacity-20"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 px-4" id="home">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="z-10 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">Transform</span> Your Online Presence
            </h1>
            <p className="hero-description text-lg sm:text-xl mb-8 text-gray-300">
              At <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">BUILDMEAWEB</span>, we craft stunning, high-performance websites that elevate your brand.
              Choose from our flexible plans and get online in as little as 5 days.
            </p>
            <div className="hero-buttons flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="#plans"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-600/20 text-sm sm:text-base"
              >
                Explore Plans
              </Link>
              <Link
                href="/consultation"
                className="bg-transparent border-2 border-purple-500 hover:bg-purple-900/20 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Free Consultation
              </Link>
            </div>
          </div>

          <div className="w-full h-64 sm:h-80 lg:h-[600px] relative z-10 mt-8 lg:mt-0">
            <ThreeScene />
          </div>
        </div>

        {/* Floating elements - visible on larger screens */}
        <div className="absolute hidden md:block top-1/4 right-10 w-24 h-24 bg-purple-500 opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute hidden md:block bottom-1/4 left-10 w-16 h-16 bg-blue-500 opacity-10 rounded-full animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="features-section py-16 sm:py-24 px-4">
        <div className="container mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Why Choose BUILDMEAWEB?</h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
            We combine cutting-edge technology with beautiful design to create websites
            that not only look great but also drive results for your business.
          </p>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card-wrapper"
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  color={feature.color}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 px-4 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">100+</div>
              <p className="text-sm sm:text-base text-gray-400">Websites Launched</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">5-7</div>
              <p className="text-sm sm:text-base text-gray-400">Days Average Delivery</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">98%</div>
              <p className="text-sm sm:text-base text-gray-400">Client Satisfaction</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">24/7</div>
              <p className="text-sm sm:text-base text-gray-400">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} id="process" className="py-16 sm:py-24 px-4 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 opacity-70"></div>
        <div className="absolute top-20 right-20 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500 rounded-full filter blur-[100px] sm:blur-[120px] opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500 rounded-full filter blur-[100px] sm:blur-[120px] opacity-20"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Process</span></h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
              We've perfected our workflow to deliver exceptional results quickly and efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">1</div>
              <div className="h-14 w-14 sm:h-16 sm:w-16 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Discovery</h3>
              <p className="text-sm sm:text-base text-gray-400">We learn about your business, goals, and target audience to create a tailored strategy.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">2</div>
              <div className="h-14 w-14 sm:h-16 sm:w-16 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Design</h3>
              <p className="text-sm sm:text-base text-gray-400">Our designers create a stunning, user-focused layout that reflects your brand.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">3</div>
              <div className="h-14 w-14 sm:h-16 sm:w-16 text-orange-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Development</h3>
              <p className="text-sm sm:text-base text-gray-400">Our engineers build your site with clean code, optimized for speed and performance.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">4</div>
              <div className="h-14 w-14 sm:h-16 sm:w-16 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Launch</h3>
              <p className="text-sm sm:text-base text-gray-400">After thorough testing, we deploy your site and provide training on maintaining it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section ref={plansRef} id="plans" className="plans-section py-16 sm:py-24 px-4">
        <div className="container mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Website Building <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Plans</span></h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your needs, or get a custom solution tailored specifically to your business.
          </p>
        </div>

        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="plan-card-wrapper"
              >
                <PlanCard
                  name={plan.name}
                  description={plan.description}
                  price={plan.price}
                  period={plan.period}
                  subscription={plan.subscription}
                  features={plan.features}
                  isFeatured={plan.isFeatured}
                  ctaText={plan.ctaText}
                  ctaLink={plan.ctaLink}
                  ctaStyle={plan.ctaStyle}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section id="portfolio" ref={portfolioRef} className="py-16 sm:py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Portfolio</span></h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Check out some of our recent website projects
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Portfolio Item 1 */}
            <div className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <div className="h-64 sm:h-80 bg-gray-800 relative overflow-hidden">
                {/* Replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                <div className="h-full w-full bg-gradient-to-br from-purple-900 to-blue-900 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-xl sm:text-2xl">E-commerce Site</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Fashion Boutique</h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-3">Modern e-commerce site with custom product showcase</p>
                <a href="#" className="inline-block px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm hover:bg-white/20 transition-colors">View Project</a>
              </div>
            </div>

            {/* Portfolio Item 2 */}
            <div className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <div className="h-64 sm:h-80 bg-gray-800 relative overflow-hidden">
                {/* Replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20"></div>
                <div className="h-full w-full bg-gradient-to-br from-blue-900 to-cyan-900 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-xl sm:text-2xl">Corporate Site</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Financial Services</h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-3">Professional corporate website with custom dashboards</p>
                <a href="#" className="inline-block px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm hover:bg-white/20 transition-colors">View Project</a>
              </div>
            </div>

            {/* Portfolio Item 3 */}
            <div className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-amber-500/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
              <div className="h-64 sm:h-80 bg-gray-800 relative overflow-hidden">
                {/* Replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20"></div>
                <div className="h-full w-full bg-gradient-to-br from-amber-900 to-orange-900 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white font-bold text-xl sm:text-2xl">Restaurant Site</div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Gourmet Bistro</h3>
                <p className="text-xs sm:text-sm text-gray-300 mb-3">Beautiful restaurant website with online reservations</p>
                <a href="#" className="inline-block px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-xs sm:text-sm hover:bg-white/20 transition-colors">View Project</a>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <a href="#" className="inline-block px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 text-sm sm:text-base">
              View All Projects
            </a>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 sm:py-20 px-4 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Clients Say</span></h2>
        </div>

        <div className="container mx-auto max-w-4xl lg:max-w-5xl">
          <div className="bg-black/50 p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-xl relative">
            <div className="absolute -top-5 -left-5 text-4xl sm:text-6xl text-purple-500 opacity-50">"</div>
            <div className="text-base sm:text-xl text-gray-300 italic mb-6 text-center">
              Working with BUILDMEAWEB was an incredible experience. They delivered a stunning website in just 6 days that perfectly captured our brand. The team was responsive, professional, and went above and beyond our expectations.
            </div>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm sm:text-base">SJ</div>
              <div className="ml-4 text-left">
                <div className="text-white font-semibold text-sm sm:text-base">Sarah Johnson</div>
                <div className="text-gray-400 text-xs sm:text-sm">CEO, TechStart</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-4 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Questions</span></h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions about our services
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-4 sm:gap-6">
            {/* FAQ Item 1 */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">How long does it take to build a website?</h3>
                <p className="text-sm sm:text-base text-gray-400">Most of our websites are completed within 5-7 business days from the time we receive your content and approve the design. Our turnaround time depends on the complexity of your project and how quickly you provide feedback during the review stages.</p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Do I need to provide my own content?</h3>
                <p className="text-sm sm:text-base text-gray-400">While we recommend you provide the core content (text and images) for authenticity, we offer content creation services as an add-on. Our writers can help craft compelling copy, and we have access to premium stock photography if you need visual assets.</p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Will my website work on mobile devices?</h3>
                <p className="text-sm sm:text-base text-gray-400">Absolutely! All our websites are fully responsive and mobile-friendly by default. They adapt beautifully to any screen size, ensuring your visitors have a great experience whether they're on desktop, tablet, or smartphone.</p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">What about hosting and domain names?</h3>
                <p className="text-sm sm:text-base text-gray-400">We can help you set up hosting and register a domain name, or work with your existing providers. We recommend certain hosting solutions based on your needs, but you maintain ownership of your domain and hosting accounts.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <a href="#" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base">
              <span>View more FAQs</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-16 sm:py-24 px-4 bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Technology</span> Stack</h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
              We use cutting-edge technologies to build fast, secure, and scalable websites
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {/* Tech icons */}
            {/* React */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400 hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10">
                  <path d="M12 9.861A2.139 2.139 0 1 0 12 14.139 2.139 2.139 0 1 0 12 9.861zM6.008 16.255l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 0 0 1.363 3.578l.101.213-.101.213a23.307 23.307 0 0 0-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 0 1 1.182-3.046A24.752 24.752 0 0 1 5.317 8.95z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-400 text-xs sm:text-sm">React</span>
            </div>
            {/* Next.js */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-900/30 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10">
                  <path d="M11.572 0c-.176 0-.31.001-.358.007-.171.027-.373.087-.52.19-.251.175-.44.447-.546.77a2.66 2.66 0 0 0-.13.865v11.635c0 .133.058.318.174.558.116.24.3.518.547.798.137.156.32.299.52.416.202.117.44.188.638.216.252.036.458.045.6.045h.238c.282 0 .547-.052.825-.157.277-.105.522-.25.733-.431.275-.238.49-.54.618-.879.137-.339.21-.704.21-1.084H13.6v2.346c0 .753-.129 1.333-.36 1.762a2.627 2.627 0 0 1-.905.924c-.408.225-.924.349-1.512.367L10.51 18H0V0h11.572Z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-400 text-xs sm:text-sm">Next.js</span>
            </div>

            {/* Tailwind */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-400 hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10">
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-400 text-xs sm:text-sm">Tailwind</span>
            </div>

            {/* Node.js */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-900/30 rounded-full flex items-center justify-center text-green-500 hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10">
                  <path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314.496-.165.588-.201 1.101-.493.056-.027.129-.016.185.021l1.87 1.12c.074.036.166.036.231 0l7.299-4.221c.072-.039.118-.128.118-.21v-8.422c0-.087-.045-.173-.12-.219l-7.301-4.211c-.067-.041-.16-.041-.235 0l-7.293 4.216c-.073.043-.119.131-.119.214v8.422c0 .082.046.165.118.208l2.001 1.156c1.08.545 1.747-.095 1.747-.739v-8.305c0-.119.095-.212.209-.212h.938c.114 0 .209.093.209.212v8.305c0 1.445-.788 2.271-2.154 2.271-.42 0-.752 0-1.676-.454l-1.906-1.102c-.467-.27-.772-.776-.772-1.324v-8.422c0-.549.3-1.057.772-1.324l7.299-4.217c.467-.27 1.067-.27 1.523 0l7.299 4.217c.467.267.772.776.772 1.324v8.422c0 .549-.305 1.057-.772 1.324l-7.299 4.221c-.242.128-.496.201-.771.201z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-400 text-xs sm:text-sm">Node.js</span>
            </div>

            {/* MongoDB */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-900/30 rounded-full flex items-center justify-center text-green-500 hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10">
                  <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-400 text-xs sm:text-sm">MongoDB</span>
            </div>

            {/* Three.js */}
            <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-10 sm:h-10">
                  <path d="M12.33,17.32c-5.7,0-10.33-2.09-10.33-4.67c0-1.73,1.67-3.27,4.25-4.07 C6.13,9.73,6.25,11,6.25,12c0,4.07,2.73,7.8,6.69,8.95C12.72,20.97,12.5,20.97,12.33,17.32z M11.89,0 c6.81,0,12.33,5.52,12.33,12.33c0,5.88-4.11,10.79-9.6,12.04c-0.35-0.35-1.14-1.76-0.44-3.67c0.35-0.99,1.49-6.5,1.49-6.5 s0.41-0.82,0.41-2.03c0-1.9-1.08-3.32-2.46-3.32c-1.17,0-1.72,0.88-1.72,1.92c0,1.17,0.76,2.93,1.14,4.54 c0.32,1.37-0.7,2.5-2.06,2.5c-2.49,0-4.4-3.2-4.4-7c0-3.67,2.47-6.43,6.96-6.43c4.67,0,7.73,3.38,7.73,7.05 c0,4.84-2.69,8.46-6.67,8.46c-1.34,0-2.59-0.72-3.02-1.52c0,0-0.73,2.96-0.9,3.53c-0.41,1.49-1.49,3.32-2.17,4.42 c1.17,0.35,2.38,0.52,3.67,0.52c6.81,0,12.33-5.52,12.33-12.33C24.22,5.52,18.7,0,11.89,0z" />
                </svg>
              </div>
              <span className="mt-2 text-gray-400 text-xs sm:text-sm">Three.js</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 sm:py-24 px-4 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Touch</span></h2>
            <p className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Have questions? Ready to start building your dream website? Drop us a message!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-black/50 p-6 sm:p-8 rounded-xl border border-gray-800">
                <form>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-300 mb-2 text-sm sm:text-base">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 bg-gray-900/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm sm:text-base"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-300 mb-2 text-sm sm:text-base">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 bg-gray-900/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm sm:text-base"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="project" className="block text-gray-300 mb-2 text-sm sm:text-base">Project Type</label>
                    <select 
                      id="project" 
                      className="w-full px-4 py-3 bg-gray-900/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm sm:text-base"
                    >
                      <option value="" disabled selected>Select your project type</option>
                      <option value="landing">Landing Page</option>
                      <option value="business">Business Website</option>
                      <option value="ecommerce">E-commerce Store</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-300 mb-2 text-sm sm:text-base">Your Message</label>
                    <textarea 
                      id="message" 
                      rows="4" 
                      className="w-full px-4 py-3 bg-gray-900/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-sm sm:text-base"
                      placeholder="Tell us about your project..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 text-sm sm:text-base"
                  >
                    Send Message
                  </button>
                </form>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Contact Information</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-6">
                    Reach out to us directly or fill out the form and we'll get back to you within 24 hours.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium text-sm sm:text-base">Email</p>
                        <p className="text-gray-400 text-sm sm:text-base">hello@buildmeaweb.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium text-sm sm:text-base">Phone</p>
                        <p className="text-gray-400 text-sm sm:text-base">(555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium text-sm sm:text-base">Office</p>
                        <p className="text-gray-400 text-sm sm:text-base">123 Web Street, Digital City</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-black/50 rounded-xl border border-gray-800">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">Business Hours</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Monday - Friday:</span>
                      <span className="text-gray-300">9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Saturday:</span>
                      <span className="text-gray-300">10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-400">Sunday:</span>
                      <span className="text-gray-300">Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-90"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full filter blur-[80px] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full filter blur-[80px] opacity-10"></div>
        </div>
        
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6">Ready to Create Your Perfect Website?</h2>
          <p className="text-base sm:text-xl mb-8">
            🔥 Sign up today and get a FREE 30-minute website strategy session!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/plans"
              className="bg-white text-purple-700 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              View All Plan Details
            </Link>
            <Link
              href="/consultation"
              className="bg-transparent border-2 border-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 bg-black border-t border-gray-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <AnimatedLogo />
              <p className="mt-4 text-gray-400 text-sm sm:text-base">
                Creating stunning websites that drive results for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-base lg:text-lg font-bold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Web Design</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Landing Pages</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">E-Commerce</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">SEO Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base lg:text-lg font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Our Team</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base lg:text-lg font-bold mb-4 text-white">Contact</h4>
              <ul className="space-y-2 text-sm sm:text-base">
                <li className="text-gray-400">hello@buildmeaweb.com</li>
                <li className="text-gray-400">(555) 123-4567</li>
                <li className="text-gray-400">123 Web Street, Digital City</li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto text-center text-gray-500 pt-8 border-t border-gray-800">
          <p className="text-sm sm:text-base">© {new Date().getFullYear()} BUILDMEAWEB. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Cookies</a>
          </div>
        </div>
        
        {/* Back to top button */}
        <a 
          href="#home" 
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </a>
      </footer>
    </div>
  );
}