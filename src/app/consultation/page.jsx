// app/consultation/page.js
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Free Website Consultation</h1>
          <p className="text-xl mb-2">
            Let's discuss your vision and build your dream website together!
          </p>
          <p className="text-lg text-blue-600">
            Get a FREE 30-minute website strategy session when you submit this form.
          </p>
        </div>
        
        {submitSuccess ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg mb-8">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Thank You!</h2>
            <p className="mb-6">
              Your consultation request has been submitted successfully. One of our experts will 
              contact you within 1 business day to schedule your FREE strategy session.
            </p>
            <div className="flex justify-center">
              <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md">
            {submitError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block mb-2 font-medium">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`w-full p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="businessName" className="block mb-2 font-medium">
                    Business/Website Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="preferredPlan" className="block mb-2 font-medium">
                  Preferred Plan
                </label>
                <select
                  id="preferredPlan"
                  name="preferredPlan"
                  className="w-full p-3 border border-gray-300 rounded-lg"
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
                  <label htmlFor="websiteType" className="block mb-2 font-medium">
                    Website Type
                  </label>
                  <select
                    id="websiteType"
                    name="websiteType"
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                  <label htmlFor="timeline" className="block mb-2 font-medium">
                    Desired Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                <label htmlFor="message" className="block mb-2 font-medium">
                  Tell Us About Your Project <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  className={`w-full p-3 border rounded-lg ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Describe your website needs, goals, and any specific features you're looking for..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <p className="font-medium text-blue-800">
                  💡 For the Elite Custom option: A membership fee of $9.99/month applies. 
                  You can cancel anytime after your project is completed.
                </p>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Submit Your Request</h3>
              <p>Fill out the form with details about your project needs and goals.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Free Strategy Call</h3>
              <p>We'll schedule your 30-minute website strategy session to discuss your vision.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center text-xl font-bold rounded-full mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Custom Proposal</h3>
              <p>Receive a tailored proposal with timeline, features, and exact pricing.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Have questions? Contact us directly at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}