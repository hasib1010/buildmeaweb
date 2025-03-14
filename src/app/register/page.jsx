// src/app/register/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { register, loading, error } = useAuth();
  const router = useRouter();
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      
      // Animate error shake
      gsap.to('.register-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
      
      return;
    }
    
    setPasswordError('');
    
    // Animate button loading state
    gsap.to('.register-btn', {
      scale: 0.95,
      duration: 0.1,
    });
    
    const success = await register(name, email, password);
    
    if (success) {
      // Animate success
      gsap.to('.register-form', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          // Redirect to verification page instead of dashboard
          router.push('/registration-success');
        }
      });
    } else {
      // Animate error shake
      gsap.to('.register-form', {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: 'power2.inOut',
      });
      
      // Reset button
      gsap.to('.register-btn', {
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
              Create Your Account
            </h1>
            <p className="text-gray-300 mt-2">
              Join us to start building your dream website
            </p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg register-form">
            {error && (
              <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-white">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
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
                <label htmlFor="password" className="block text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 bg-gray-700 rounded-lg border ${
                    passwordError ? 'border-red-500' : 'border-gray-600'
                  } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="register-btn w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex justify-center items-center"
              >
                {loading ? (
                  <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                ) : null}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="mt-6 text-center text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}