// src/app/resend-verification/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }
    
    try {
      setStatus('loading');
      setMessage('Sending verification email...');
      
      // Animate button loading state
      gsap.to('.resend-btn', {
        scale: 0.95,
        duration: 0.1,
      });
      
      const response = await axios.post('/api/auth/resend-verification', { email });
      
      if (response.data.success) {
        setStatus('success');
        setMessage('Verification email sent! Please check your inbox.');
        
        // Animate success
        gsap.to('.resend-form', {
          y: -10,
          ease: 'power2.out',
          duration: 0.5,
        });
      } else {
        throw new Error(response.data.message || 'Failed to send verification email');
      }
    } catch (error) {
      setStatus('error');
      setMessage(
        error.response?.data?.message || 
        'Failed to send verification email. Please try again.'
      );
      
      // Animate error shake
      gsap.to('.resend-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
    } finally {
      // Reset button
      gsap.to('.resend-btn', {
        scale: 1,
        duration: 0.2,
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Resend Verification Email
            </h1>
            <p className="text-gray-300 mt-2">
              Enter your email address to receive a new verification link
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg resend-form">
            {status === 'success' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg mb-6">{message}</p>
                <div className="flex space-x-4 justify-center">
                  <Link href="/login">
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg">
                      Go to Login
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-white">
                    {message}
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="resend-btn w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex justify-center items-center"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Sending...
                    </>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
                
                <div className="mt-6 text-center text-gray-400">
                  Remember your password?{' '}
                  <Link href="/login" className="text-blue-400 hover:text-blue-300">
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}