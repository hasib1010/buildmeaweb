// src/app/registration-success/page.js
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

export default function RegistrationSuccess() {
  const { verificationEmail, verificationRequired, resendVerification } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If verification is not required, redirect to home
    if (!verificationRequired) {
      router.push('/');
      return;
    }
    
    // Animate elements
    gsap.from('.success-icon', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)',
      delay: 0.3
    });
    
    gsap.from('.success-title', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.5
    });
    
    gsap.from('.success-message', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.7
    });
    
    gsap.from('.success-actions', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      delay: 0.9
    });
  }, [verificationRequired, router]);
  
  // Handle resend verification
  const handleResendVerification = async () => {
    await resendVerification();
    
    // Animate confirmation
    gsap.to('.resend-btn', {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    gsap.to('.resend-confirmation', {
      opacity: 1,
      y: 0,
      duration: 0.3
    });
    
    // Hide confirmation after 5 seconds
    setTimeout(() => {
      gsap.to('.resend-confirmation', {
        opacity: 0,
        y: -10,
        duration: 0.3
      });
    }, 5000);
  };
  
  if (!verificationRequired) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="success-icon w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          
          <h1 className="success-title text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Registration Successful!
          </h1>
          
          <div className="success-message bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg mb-8">
            <p className="text-xl mb-4">
              Thanks for signing up! We've sent a verification email to:
            </p>
            <p className="text-2xl font-bold text-blue-400 mb-6">
              {verificationEmail}
            </p>
            <p className="text-gray-300 mb-4">
              Please check your inbox and click the verification link to activate your account.
            </p>
            <p className="text-gray-300 text-sm">
              If you don't see the email, check your spam folder.
            </p>
            
            <div className="resend-confirmation opacity-0 transform translate-y-[-10px] mt-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-white">
              Verification email resent successfully!
            </div>
          </div>
          
          <div className="success-actions">
            <p className="text-gray-300 mb-4">
              Didn't receive the email?
            </p>
            <button
              onClick={handleResendVerification}
              className="resend-btn px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg mb-6"
            >
              Resend Verification Email
            </button>
            
            <div>
              <Link href="/login">
                <button className="text-blue-400 hover:text-blue-300">
                  Back to Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}