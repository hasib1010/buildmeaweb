// src/app/login/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, verificationRequired, verificationEmail, resendVerification } = useAuth();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Animate button loading state
    gsap.to('.login-btn', {
      scale: 0.95,
      duration: 0.1,
    });
    
    const success = await login(email, password);
    
    if (success) {
      // Animate success
      gsap.to('.login-form', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          router.push(redirectPath);
        }
      });
    } else {
      // Animate error shake
      gsap.to('.login-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
      
      // Reset button
      gsap.to('.login-btn', {
        scale: 1,
        duration: 0.2,
      });
    }
  };
  
  // Handle resend verification email
  const handleResendVerification = async () => {
    const success = await resendVerification();
    
    if (success) {
      // Animate success
      gsap.to('.verification-alert', {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10B981',
        duration: 0.3,
      });
      
      // Reset animation after 2 seconds
      setTimeout(() => {
        gsap.to('.verification-alert', {
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: '#EF4444',
          duration: 0.3,
        });
      }, 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Welcome Back
            </h1>
            <p className="text-gray-300 mt-2">
              Sign in to your account to access your website projects
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg login-form">
            {/* Verification Required Alert */}
            {verificationRequired && (
              <div className="verification-alert mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-white">
                <p className="mb-2">
                  Your email ({verificationEmail}) has not been verified. Please check your inbox for a verification link.
                </p>
                <button 
                  onClick={handleResendVerification}
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Resend verification email
                </button>
              </div>
            )}
            
            {/* Other Errors */}
            {error && !verificationRequired && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-white">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
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
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-gray-300">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="login-btn w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex justify-center items-center"
              >
                {loading ? (
                  <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              
              <div className="mt-6 text-center text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}