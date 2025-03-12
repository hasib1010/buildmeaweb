'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

 
// AnimatedGradientButton component
const AnimatedGradientButton = ({ href, className, children, isPrimary = false }) => {
  return (
    <Link
      href={href}
      className={`relative overflow-hidden transition-all duration-300 rounded-lg group ${
        isPrimary 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/20'
          : 'border-2 border-purple-600 text-purple-500 hover:bg-purple-900/10'
      } hover:scale-105 ${className}`}
    >
      <span className="relative z-10 block py-3 px-4 sm:px-8 font-medium">{children}</span>
      <span className="absolute inset-0 overflow-hidden rounded-lg">
        <span className={`absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
          isPrimary ? 'bg-gradient-to-r from-purple-700 to-blue-700' : 'bg-purple-900/20'
        }`}></span>
      </span>
    </Link>
  );
};

// Helper component for feature comparison
function FeatureRow({ feature, starter, growth, elite }) {
  return (
    <tr className="border-b border-gray-800/30 hover:bg-gray-900/5 transition-colors">
      <td className="py-4 px-2 sm:px-4 font-medium text-sm sm:text-base">{feature}</td>
      <td className="py-4 px-2 sm:px-4 text-center">{
        typeof starter === 'boolean' 
          ? (starter 
              ? <span className="text-green-500 flex justify-center"><CheckIcon /></span> 
              : <span className="text-red-500 flex justify-center"><XIcon /></span>) 
          : <span className="text-sm sm:text-base">{starter}</span>
      }</td>
      <td className="py-4 px-2 sm:px-4 text-center">{
        typeof growth === 'boolean'
          ? (growth 
              ? <span className="text-green-500 flex justify-center"><CheckIcon /></span>
              : <span className="text-red-500 flex justify-center"><XIcon /></span>)
          : <span className="text-sm sm:text-base">{growth}</span>
      }</td>
      <td className="py-4 px-2 sm:px-4 text-center">{
        typeof elite === 'boolean'
          ? (elite 
              ? <span className="text-green-500 flex justify-center"><CheckIcon /></span>
              : <span className="text-red-500 flex justify-center"><XIcon /></span>)
          : <span className="text-sm sm:text-base">{elite}</span>
      }</td>
    </tr>
  );
}

// Feature icons
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function PlansPage() {
  const headingRef = useRef(null);
  const cardsRef = useRef(null);
  const tableRef = useRef(null);
  const offerRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Make sure we're in the browser
    if (typeof window === 'undefined' || !gsap) return;

    const timer = setTimeout(() => {
      try {
        // Heading animations
        gsap.from(headingRef.current.querySelector('h1'), {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });

        gsap.from(headingRef.current.querySelector('p'), {
          y: 20,
          opacity: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'power2.out'
        });

      
        // Table animation
        if (tableRef.current) {
          gsap.from(tableRef.current, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.6,
            ease: 'power2.out'
          });
        }

        // Special offer section animation
        gsap.from(offerRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: offerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          ease: 'power2.out'
        });

        // Why choose us section animation
        const features = featuresRef.current.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
          gsap.from(feature, {
            x: index % 2 === 0 ? -30 : 30,
            opacity: 0,
            duration: 0.6,
            delay: 0.2 * index,
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none'
            },
            ease: 'power2.out'
          });
        });

        // CTA animation
        gsap.from(ctaRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          ease: 'power3.out'
        });

      } catch (error) {
        console.error("Error applying animations:", error);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">
      {/* Background gradient effects */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-0 right-0 w-60 sm:w-96 h-60 sm:h-96 bg-purple-600 rounded-full filter blur-[100px] sm:blur-[150px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-60 sm:w-96 h-60 sm:h-96 bg-blue-600 rounded-full filter blur-[100px] sm:blur-[150px] opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div ref={headingRef} className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">Website Building</span> Plans
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-gray-300 px-4">
            Choose the perfect plan for your needs, with transparent pricing and no hidden fees.
            Our plans are designed to give you exactly what you need, no more, no less.
          </p>
        </div>

        {/* Mobile pricing cards (visible on small and medium screens) */}
        <div ref={cardsRef} className="lg:hidden space-y-8 sm:space-y-12 mb-12 sm:mb-16">
          {/* Starter Plan Card */}
          <div className="plan-card bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-lg hover:shadow-purple-900/10 transition-all duration-500 hover:-translate-y-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Starter</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4">Best for Personal & Landing Pages</p>
            <p className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">$150 <span className="text-xs sm:text-sm font-normal text-gray-500">one-time</span></p>
            
            <h3 className="font-semibold mt-6 mb-4 text-white">What's included:</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Up to 2 pages</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Simple & clean designs</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Basic SEO optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Standard speed optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Standard security features</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Contact form</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">14 days support</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-sm sm:text-base text-gray-300">Mobile-Friendly</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-sm sm:text-base text-gray-300">E-commerce features</span>
              </li>
            </ul>
            
            <AnimatedGradientButton href="/checkout?plan=starter" className="w-full text-center">
              Get Started
            </AnimatedGradientButton>
          </div>

          {/* Growth Plan Card */}
          <div className="plan-card border-2 border-purple-600 bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg shadow-purple-900/30 relative transition-all duration-500 hover:-translate-y-2">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs sm:text-sm font-bold py-1 px-3 sm:px-4 rounded-bl-lg rounded-tr-lg">
              BEST VALUE
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white mt-4">Growth</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4">Best for Small Businesses & Coaches</p>
            <p className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">$499 <span className="text-xs sm:text-sm font-normal text-gray-500">one-time</span></p>
            
            <h3 className="font-semibold mt-6 mb-4 text-white">What's included:</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Up to 4 pages</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Your custom design</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Advanced SEO optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Mobile-Friendly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Booking system</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Blog setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Optimized speed</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Enhanced security</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">2-3 custom forms</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Basic integrations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Social media integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">FREE logo design</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">30 days support</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <span className="text-sm sm:text-base text-gray-300">E-commerce features</span>
              </li>
            </ul>
            
            <AnimatedGradientButton href="/checkout?plan=growth" isPrimary={true} className="w-full text-center">
              Get Started
            </AnimatedGradientButton>
          </div>

          {/* Elite Plan Card */}
          <div className="plan-card bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-800 shadow-lg hover:shadow-purple-900/10 transition-all duration-500 hover:-translate-y-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Elite - Custom Website</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4">For Businesses, E-commerce & Advanced Needs</p>
            <p className="text-2xl sm:text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Custom Pricing</p>
            <p className="text-xs sm:text-sm text-purple-400 mb-6">$9.99/month membership</p>
            
            <h3 className="font-semibold mt-6 mb-4 text-white">What's included:</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Unlimited pages</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Fully tailored, unique design</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Full SEO strategy & Google ranking boost</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Mobile-Friendly</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">E-commerce ready (Full online store, automation, memberships)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Advanced booking system & automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Full content strategy for blog</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Ultra-fast performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Enterprise-grade security</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Fully interactive forms, surveys, and automation</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Full integrations (CRM, automation, analytics)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Social media integration</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">Custom branding & logo design</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">FREE business email setup</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm sm:text-base text-gray-300">FREE domain & hosting (1+ years)</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2 text-lg">•</span>
                <span className="text-sm sm:text-base text-gray-300">Ongoing support (Retainer options available)</span>
              </li>
            </ul>
            
            <AnimatedGradientButton href="/consultation" className="w-full text-center">
              Get Free Consultation
            </AnimatedGradientButton>
          </div>
        </div>

        {/* Pricing table (visible on large screens) */}
        <div ref={tableRef} className="hidden lg:block overflow-x-auto mb-16 md:mb-20">
          <table className="w-full border-collapse bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="py-6 lg:py-8 px-2 lg:px-4 text-left"></th>
                <th className="py-6 lg:py-8 px-2 lg:px-4 text-center">
                  <span className="block text-lg lg:text-xl font-bold text-white">Starter</span>
                  <span className="block text-gray-400 text-xs lg:text-sm">Best for Personal & Landing Pages</span>
                  <span className="block text-2xl lg:text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">$150</span>
                  <span className="block text-gray-400 text-xs lg:text-sm">One-time</span>
                </th>
                <th className="py-6 lg:py-8 px-2 lg:px-4 text-center relative">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium py-1 px-2 absolute top-0 left-0 right-0">
                    Best Value
                  </div>
                  <span className="block text-lg lg:text-xl font-bold mt-6 text-white">Growth</span>
                  <span className="block text-gray-400 text-xs lg:text-sm">Best for Small Businesses & Coaches</span>
                  <span className="block text-2xl lg:text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">$499</span>
                  <span className="block text-gray-400 text-xs lg:text-sm">One-time</span>
                </th>
                <th className="py-6 lg:py-8 px-2 lg:px-4 text-center">
                  <span className="block text-lg lg:text-xl font-bold text-white">Elite - Custom</span>
                  <span className="block text-gray-400 text-xs lg:text-sm">For Businesses, E-commerce & Advanced Needs</span>
                  <span className="block text-2xl lg:text-3xl font-bold mt-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Custom</span>
                  <span className="block text-purple-400 text-xs lg:text-sm">$9.99/month membership</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <FeatureRow 
                feature="Pages" 
                starter="Up to 2 pages" 
                growth="Up to 4 pages" 
                elite="Unlimited" 
              />
              <FeatureRow 
                feature="Customization" 
                starter="Simple & clean designs" 
                growth="Your custom design" 
                elite="Fully tailored, unique design" 
              />
              <FeatureRow 
                feature="SEO Optimization" 
                starter="Basic" 
                growth="Advanced" 
                elite="Full SEO strategy" 
              />
              <FeatureRow 
                feature="Mobile-Friendly" 
                starter={false} 
                growth={true} 
                elite={true} 
              />
              <FeatureRow 
                feature="E-commerce Ready" 
                starter={false}
                growth={false}
                elite="Full online store"
              />
              <FeatureRow 
                feature="Booking System" 
                starter={false}
                growth={true}
                elite="Advanced & automated"
              />
              <FeatureRow 
                feature="Blog Setup" 
                starter={false}
                growth={true}
                elite="Full content strategy"
              />
              <FeatureRow 
                feature="Speed Optimization" 
                starter="Standard"
                growth="Optimized"
                elite="Ultra-fast"
              />
              <FeatureRow 
                feature="Security Features" 
                starter="Standard"
                growth="Enhanced"
                elite="Enterprise-grade"
              />
              <FeatureRow 
                feature="Custom Forms" 
                starter="Contact form"
                growth="2-3 forms"
                elite="Interactive & automated"
              />
              <FeatureRow 
                feature="Integrations" 
                starter={false}
                growth="Basic"
                elite="Full suite"
              />
              <FeatureRow 
                feature="Social Media" 
                starter={false}
                growth={true}
                elite={true}
              />
              <FeatureRow 
                feature="Logo Design" 
                starter={false}
                growth="FREE logo"
                elite="Custom branding"
              />
              <FeatureRow 
                feature="FREE Business Email" 
                starter={false}
                growth={false}
                elite={true}
              />
              <FeatureRow 
                feature="FREE Domain & Hosting" 
                starter={false}
                growth={false}
                elite="1+ years"
              />
              <FeatureRow 
                feature="Support" 
                starter="14 days"
                growth="30 days"
                elite="Ongoing"
              />
              <tr>
                <td className="py-6 lg:py-8 px-2 lg:px-4"></td>
                <td className="py-6 lg:py-8 px-2 lg:px-4 text-center">
                  <AnimatedGradientButton href="/checkout?plan=starter" className="inline-block mx-auto">
                    Get Started
                  </AnimatedGradientButton>
                </td>
                <td className="py-6 lg:py-8 px-2 lg:px-4 text-center">
                  <AnimatedGradientButton href="/checkout?plan=growth" isPrimary={true} className="inline-block mx-auto">
                    Get Started
                  </AnimatedGradientButton>
                </td>
                <td className="py-6 lg:py-8 px-2 lg:px-4 text-center">
                  <AnimatedGradientButton href="/consultation" className="inline-block mx-auto">
                    Free Consultation
                  </AnimatedGradientButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Special Offer Section */}
        <div 
          ref={offerRef}
          className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border-l-4 border-purple-500 p-5 sm:p-8 rounded-lg mb-12 sm:mb-16 md:mb-20"
        >
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500 rounded-full filter blur-[60px] sm:blur-[80px] opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-32 h-32 sm:w-48 sm:h-48 bg-blue-500 rounded-full filter blur-[60px] sm:blur-[80px] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white">🔥 Special Offer!</h2>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-200">
              Sign up today and get a FREE 30-minute website strategy session with our expert team!
            </p>
            <p className="text-sm sm:text-base mb-3 sm:mb-4 text-gray-300">
              <strong className="text-white">For the Custom-built Elite option:</strong> You will need to sign up for a membership fee of $9.99/month 
              to have access to this service. Cancel any time but not before your project is completed.
            </p>
            </div>
        </div>

        {/* Why Choose Us Section */}
        <div ref={featuresRef} className="bg-gray-900/80 backdrop-blur-sm p-5 sm:p-8 rounded-xl border border-gray-800 shadow-lg mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Why Choose BUILDMEAWEB?</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <div className="feature-item flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">No Hidden Fees</h3>
              <p className="text-sm sm:text-base text-gray-300">Transparent pricing with everything included. What you see is what you pay.</p>
            </div>
            <div className="feature-item flex flex-col items-center text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400 mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">Fast Turnaround</h3>
              <p className="text-sm sm:text-base text-gray-300">Get your website delivered in as little as <strong className="text-white">5-7 days</strong>, depending on complexity.</p>
            </div>
            <div className="feature-item flex flex-col items-center text-center sm:col-span-2 md:col-span-1 sm:max-w-md sm:mx-auto md:max-w-none">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-900/30 rounded-full flex items-center justify-center text-purple-400 mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">100% Satisfaction</h3>
              <p className="text-sm sm:text-base text-gray-300">We work with you until you're completely satisfied with your website.</p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">How It Works</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">1</div>
              <div className="h-12 w-12 sm:h-14 sm:w-14 text-purple-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Choose Your Plan</h3>
              <p className="text-sm text-gray-400">Select the plan that fits your needs and budget from our simple options.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">2</div>
              <div className="h-12 w-12 sm:h-14 sm:w-14 text-blue-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Share Your Vision</h3>
              <p className="text-sm text-gray-400">Tell us about your business, goals, and ideas for your website design.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">3</div>
              <div className="h-12 w-12 sm:h-14 sm:w-14 text-purple-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Review & Approve</h3>
              <p className="text-sm text-gray-400">We create your site and you review it. We'll make revisions until you're happy.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-gray-800 relative group hover:border-purple-500 transition-all duration-300">
              <div className="absolute -top-4 -left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base">4</div>
              <div className="h-12 w-12 sm:h-14 sm:w-14 text-green-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Launch Your Site</h3>
              <p className="text-sm text-gray-400">We launch your site and provide training on how to maintain and update it.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Frequently Asked Questions</h2>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">How long does it take to build a website?</h3>
                <p className="text-sm text-gray-400">Most of our websites are completed within 5-7 business days from the time we receive your content and approve the design. Our turnaround time depends on the complexity of your project and how quickly you provide feedback.</p>
              </div>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Do I need to provide my own content?</h3>
                <p className="text-sm text-gray-400">While we recommend you provide the core content (text and images) for authenticity, we offer content creation services as an add-on. Our writers can help craft compelling copy, and we have access to premium stock photography.</p>
              </div>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Will my website work on mobile devices?</h3>
                <p className="text-sm text-gray-400">Absolutely! Our Growth and Elite plans include fully responsive and mobile-friendly websites by default. They adapt beautifully to any screen size, ensuring your visitors have a great experience on any device.</p>
              </div>
            </div>
            
            <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500 transition-colors duration-300">
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">What about hosting and domain names?</h3>
                <p className="text-sm text-gray-400">We can help you set up hosting and register a domain name, or work with your existing providers. Our Elite plan includes FREE domain and hosting for 1+ years.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">What Our Clients Say</h2>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-black/50 p-5 sm:p-6 rounded-2xl border border-gray-800 shadow-xl relative">
              <div className="absolute -top-4 -left-4 text-3xl sm:text-4xl text-purple-500 opacity-50">"</div>
              <p className="text-sm sm:text-base text-gray-300 italic mb-4 sm:mb-6">
                Working with BUILDMEAWEB was an incredible experience. They delivered a stunning website in just 6 days that perfectly captured our brand. The team was responsive and professional throughout the process.
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">SJ</div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-white font-semibold text-sm sm:text-base">Sarah Johnson</div>
                  <div className="text-gray-400 text-xs sm:text-sm">CEO, TechStart</div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/50 p-5 sm:p-6 rounded-2xl border border-gray-800 shadow-xl relative">
              <div className="absolute -top-4 -left-4 text-3xl sm:text-4xl text-purple-500 opacity-50">"</div>
              <p className="text-sm sm:text-base text-gray-300 italic mb-4 sm:mb-6">
                I needed an e-commerce site quickly and BUILDMEAWEB delivered beyond my expectations. The custom Elite plan was perfect, and their ongoing support has been invaluable for my business growth.
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">RM</div>
                <div className="ml-3 sm:ml-4">
                  <div className="text-white font-semibold text-sm sm:text-base">Robert Miller</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Founder, Fashion Boutique</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div ref={ctaRef} className="text-center py-10 sm:py-12 md:py-16 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-gray-800 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-purple-500 rounded-full filter blur-[80px] sm:blur-[120px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-blue-500 rounded-full filter blur-[80px] sm:blur-[120px] opacity-20"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">Ready to Create Your Perfect Website?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-300">
              Our team is ready to transform your vision into a stunning online presence.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6">
              <AnimatedGradientButton 
                href="/consultation" 
                isPrimary={true} 
                className="w-full sm:w-auto text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-10"
              >
                Let's Start Building!
              </AnimatedGradientButton>
              <AnimatedGradientButton 
                href="#" 
                className="w-full sm:w-auto text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-10"
              >
                Contact Us
              </AnimatedGradientButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}