// app/consultation/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Animated component for section headers
const AnimatedHeader = ({ title, subtitle, highlight }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {title.split(highlight).map((part, i, arr) => (
          i === arr.length - 1 ? 
          <span key={i}>{part}</span> : 
          <span key={i}>
            {part}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-400 to-purple-600">
              {highlight}
            </span>
          </span>
        ))}
      </h1>
      <p className="text-xl mb-2 text-gray-300">
        {subtitle}
      </p>
      <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
        Get a FREE 30-minute website strategy session when you submit this form.
      </p>
    </div>
  );
};

// Step indicator component
const StepIndicator = ({ number, title, description }) => {
  return (
    <div className="text-center transform transition-all duration-300 hover:scale-105">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-14 h-14 flex items-center justify-center text-xl font-bold rounded-full mx-auto mb-4 shadow-lg shadow-purple-600/20">
        {number}
      </div>
      <h3 className="font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default function ConsultationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    message: '',
    preferredPlan: 'elite',
    websiteType: '',
    budget: '',
    timeline: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Gradient background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const gradientElements = document.querySelectorAll('.animate-gradient');
      gradientElements.forEach(el => {
        el.style.backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          businessName: '',
          message: '',
          preferredPlan: 'elite',
          websiteType: '',
          budget: '',
          timeline: ''
        });
      } else {
        setSubmitError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen overflow-x-hidden text-white relative pt-24 pb-12">
      {/* Background elements */}
      <div className="fixed inset-0 bg-black z-[-1]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-20 animate-gradient"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full filter blur-[150px] opacity-20 animate-gradient"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedHeader 
            title="Free Website Consultation" 
            subtitle="Let's discuss your vision and build your dream website together!"
            highlight="Website"
          />
          
          {submitSuccess ? (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm border-l-4 border-purple-500 p-8 rounded-r-lg mb-8 transform transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">Thank You!</h2>
                <p className="mb-6 text-center text-lg text-gray-300">
                  Your consultation request has been submitted successfully. One of our experts will 
                  contact you within 1 business day to schedule your FREE strategy session.
                </p>
                <Link href="/" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-600/20">
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-500">
              {submitError && (
                <div className="bg-red-900/30 backdrop-blur-sm border-l-4 border-red-500 p-4 mb-6 text-red-300">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {submitError}
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-gray-300">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`w-full p-3 bg-gray-800/90 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-300">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`w-full p-3 bg-gray-800/90 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full p-3 bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      placeholder="(123) 456-7890"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="businessName" className="block mb-2 font-medium text-gray-300">
                      Business/Website Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      className="w-full p-3 bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      placeholder="Your Business Name"
                      value={formData.businessName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="preferredPlan" className="block mb-2 font-medium text-gray-300">
                    Preferred Plan
                  </label>
                  <select
                    id="preferredPlan"
                    name="preferredPlan"
                    className="w-full p-3 bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    value={formData.preferredPlan}
                    onChange={handleChange}
                  >
                    <option value="starter">Starter ($150)</option>
                    <option value="growth">Growth ($499)</option>
                    <option value="elite">Elite - Custom Website</option>
                    <option value="not_sure">Not Sure Yet</option>
                  </select>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="websiteType" className="block mb-2 font-medium text-gray-300">
                      Website Type
                    </label>
                    <select
                      id="websiteType"
                      name="websiteType"
                      className="w-full p-3 bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      value={formData.websiteType}
                      onChange={handleChange}
                    >
                      <option value="">Select Type</option>
                      <option value="personal">Personal/Portfolio</option>
                      <option value="business">Business/Company</option>
                      <option value="ecommerce">E-commerce/Online Store</option>
                      <option value="blog">Blog/Content Site</option>
                      <option value="service">Service Provider</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timeline" className="block mb-2 font-medium text-gray-300">
                      Desired Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full p-3 bg-gray-800/90 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                      value={formData.timeline}
                      onChange={handleChange}
                    >
                      <option value="">Select Timeline</option>
                      <option value="asap">As Soon As Possible</option>
                      <option value="1_week">Within 1 Week</option>
                      <option value="2_weeks">Within 2 Weeks</option>
                      <option value="month">Within a Month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="message" className="block mb-2 font-medium text-gray-300">
                    Tell Us About Your Project <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    className={`w-full p-3 bg-gray-800/90 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white ${errors.message ? 'border-red-500' : 'border-gray-700'}`}
                    placeholder="Describe your website needs, goals, and any specific features you're looking for..."
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                </div>
                
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm p-4 rounded-lg mb-8 border border-blue-500/20">
                  <p className="font-medium text-blue-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    For the Elite Custom option: A membership fee of $9.99/month applies. 
                    You can cancel anytime after your project is completed.
                  </p>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Submit Consultation Request'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-16 p-8 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-blue-500/30 transition-all duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">What to Expect</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <StepIndicator 
                number="1" 
                title="Submit Your Request" 
                description="Fill out the form with details about your project needs and goals."
              />
              
              <StepIndicator 
                number="2" 
                title="Free Strategy Call" 
                description="We'll schedule your 30-minute website strategy session to discuss your vision."
              />
              
              <StepIndicator 
                number="3" 
                title="Custom Proposal" 
                description="Receive a tailored proposal with timeline, features, and exact pricing."
              />
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Have questions? Contact us directly at <a href="mailto:support@example.com" className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 hover:underline">support@example.com</a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Floating elements for visual interest */}
      <div className="fixed top-1/4 right-10 w-12 h-12 bg-purple-500 opacity-10 rounded-full animate-pulse hidden md:block"></div>
      <div className="fixed bottom-1/4 left-10 w-8 h-8 bg-blue-500 opacity-10 rounded-full animate-pulse hidden md:block"></div>
      
      {/* Back to home button */}
      <Link 
        href="/" 
        className="fixed bottom-6 left-6 bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Back to home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </Link>
    </div>
  );
}