'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

export default function OrderConfirmation() {
  const router = useRouter();
  
  // Animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate the success icon
    tl.from('.success-icon', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
    
    // Animate the heading and content
    tl.from('.success-content h1, .success-content p, .success-content .steps-container', {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.3');
    
    // Animate the buttons
    tl.from('.success-actions button', {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.2');
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg text-center">
          <div className="success-icon w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div className="success-content">
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your order. Our team has received your request and will begin work soon.
            </p>
            
            <div className="steps-container bg-gray-900 bg-opacity-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">What happens next?</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="font-bold">1</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold">Initial Review</h4>
                    <p className="text-gray-300">Our team will review your requirements and contact you within 24 hours.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <span className="font-bold">2</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold">Design Phase</h4>
                    <p className="text-gray-300">We'll create initial mockups and send them for your approval.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center">
                      <span className="font-bold">3</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold">Development</h4>
                    <p className="text-gray-300">Once designs are approved, we'll build your website according to specifications.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="font-bold">4</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold">Launch</h4>
                    <p className="text-gray-300">After your final approval, we'll publish your new website!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="success-actions flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link href="/dashboard">
                <button className="w-full md:w-auto px-6 py-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition-colors">
                  Go to Dashboard
                </button>
              </Link>
              <Link href="/schedule-consultation">
                <button className="w-full md:w-auto px-6 py-3 border border-white rounded-lg text-white font-bold hover:bg-white hover:text-gray-800 transition-colors">
                  Schedule a Consultation
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mt-8 text-center">
          <p className="text-gray-300">
            Order reference: <span className="font-medium">#WB{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}