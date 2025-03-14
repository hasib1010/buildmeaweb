// src/app/verify-email/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const [animation, setAnimation] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification token. Please request a new verification email.');
      return;
    }
    
    // Animate verifying icon
    const tl = gsap.timeline({ repeat: -1 });
    tl.to('.verifying-icon', {
      rotation: 360,
      duration: 2,
      ease: 'power1.inOut'
    });
    setAnimation(tl);
    
    // Verify email
    const verifyEmail = async () => {
      try {
        const response = await axios.post('/api/auth/verify-email', { token });
        
        if (response.data.success) {
          setStatus('success');
          setMessage(response.data.message || 'Your email has been verified successfully!');
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Failed to verify email. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Failed to verify email. The link may be expired or invalid.'
        );
      }
    };
    
    verifyEmail();
    
    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [token, router]);
  
  useEffect(() => {
    // Stop animation when status changes
    if (status !== 'verifying' && animation) {
      animation.kill();
    }
    
    // Animate success or error state
    if (status === 'success') {
      gsap.to('.success-icon', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    } else if (status === 'error') {
      gsap.to('.error-icon', {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }
  }, [status, animation]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Email Verification
            </h1>
            
            <div className="flex justify-center mb-6">
              {status === 'verifying' && (
                <div className="verifying-icon w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              )}
              
              {status === 'success' && (
                <div className="success-icon w-20 h-20 bg-green-500 rounded-full flex items-center justify-center scale-0 opacity-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              
              {status === 'error' && (
                <div className="error-icon w-20 h-20 bg-red-500 rounded-full flex items-center justify-center scale-0 opacity-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            
            <p className="text-lg mb-6">{message}</p>
            
            {status === 'error' && (
              <div className="mt-6">
                <p className="text-gray-300 mb-4">
                  Need a new verification link?
                </p>
                <Link href="/resend-verification">
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                    Resend Verification Email
                  </button>
                </Link>
              </div>
            )}
            
            {status === 'success' && (
              <p className="text-gray-300 mt-4">
                Redirecting you to dashboard...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}