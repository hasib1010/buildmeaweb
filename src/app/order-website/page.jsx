'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { gsap } from 'gsap';
import Navbar from '@/components/ui/Navbar';

// Sample template data
const websiteTemplates = [
  {
    id: 'personal',
    name: 'Personal Portfolio',
    description: 'Showcase your work and skills with a professional portfolio website',
    features: ['About section', 'Portfolio gallery', 'Contact form', 'Resume display'],
    price: 150,
    popular: false,
    thumbnail: '/api/placeholder/400/240'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Professional website for small to medium sized businesses',
    features: ['Company profile', 'Services/Products section', 'Testimonials', 'Contact information', 'About Us page'],
    price: 499,
    popular: true,
    thumbnail: '/api/placeholder/400/240'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Full-featured online store with product catalog and shopping cart',
    features: ['Product catalog', 'Shopping cart', 'Secure checkout', 'Customer accounts', 'Order tracking'],
    price: 999,
    popular: false,
    thumbnail: '/api/placeholder/400/240'
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Share your thoughts and content with a beautiful blog template',
    features: ['Article layout', 'Categories', 'Tags', 'Comments section', 'Author profiles'],
    price: 299,
    popular: false,
    thumbnail: '/api/placeholder/400/240'
  }
];

// Available plans
const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 150,
    description: 'Best for Personal & Landing Pages',
    features: [
      'Up to 2 pages',
      'Basic SEO Optimization',
      'Contact form',
      '14 days support',
      'Simple & clean designs'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 499,
    description: 'Best for Small Businesses & Coaches',
    features: [
      'Up to 4 pages',
      'Custom design',
      'Advanced SEO Optimization',
      'Mobile-Friendly',
      'Booking System',
      'Blog Setup',
      'Optimized Speed',
      'Enhanced Security',
      '2-3 Custom Forms',
      'Basic Integrations',
      'Social Media Integration',
      'FREE Logo Design',
      '30 days support'
    ],
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 'Custom',
    description: 'For Businesses, E-commerce & Advanced Needs',
    features: [
      'Unlimited pages',
      'Fully tailored, unique design',
      'Full SEO strategy & ranking boost',
      'Mobile-Friendly',
      'E-commerce Ready',
      'Advanced booking & automation',
      'Full content strategy',
      'Ultra-fast performance',
      'Enterprise-grade security',
      'Interactive forms & automation',
      'Full Integrations (CRM & more)',
      'Custom branding & logo design',
      'FREE Business Email Setup',
      'FREE Domain & Hosting (1+ years)',
      'Ongoing support & maintenance'
    ],
    membership: '$9.99/month'
  }
];

const OrderWebsitePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    websiteName: '',
    domain: '',
    description: '',
    requiredPages: '',
    preferredColors: '',
    references: '',
    name: '',
    email: '',
    phone: ''
  });
  
  // Animations
  useEffect(() => {
    // Animation for page load
    gsap.from('.page-header', {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
    
    gsap.from('.steps', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power3.out'
    });
    
    // Animation for template cards
    gsap.from('.template-card', {
      y: 40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power3.out'
    });
    
    // Animation for plan cards
    gsap.from('.plan-card', {
      y: 40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power3.out'
    });
  }, [step]);
  
  // Update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would submit the order to your backend
      console.log('Submitting order...', {
        template: selectedTemplate,
        plan: selectedPlan,
        details: formData
      });
      
      // Animate success and redirect
      gsap.to('.order-form-container', {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
          // Navigate to thank you page or dashboard
          router.push('/order-confirmation');
        }
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    }
  };
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/order-website');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="page-header text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {step === 1 ? 'Choose a Template' : step === 2 ? 'Select Your Plan' : 'Complete Your Order'}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {step === 1 
              ? 'Select a starting point for your website. Our team will customize it to your needs.' 
              : step === 2 
                ? 'Choose the plan that best fits your requirements and budget.'
                : 'Provide details about your website requirements to help us build exactly what you need.'}
          </p>
        </div>
        
        {/* Steps Navigation */}
        <div className="steps flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">1</span>
            </div>
            <div className="text-sm ml-2 mr-4">Template</div>
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">2</span>
            </div>
            <div className="text-sm ml-2 mr-4">Plan</div>
          </div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">3</span>
            </div>
            <div className="text-sm ml-2">Details</div>
          </div>
        </div>
        
        {/* Step 1: Choose Template */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
            {websiteTemplates.map((template) => (
              <div 
                key={template.id}
                className={`template-card bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : 'border border-gray-700'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="relative">
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full h-48 object-cover"
                  />
                  {template.popular && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-300 mb-4">
                    {template.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Features:</h4>
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">
                      ${typeof template.price === 'number' ? template.price.toLocaleString() : template.price}
                    </div>
                    <button 
                      className={`px-4 py-2 rounded-lg text-white font-medium ${
                        selectedTemplate?.id === template.id 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      } transition-colors`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Step 2: Choose Plan */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`plan-card relative bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
                  selectedPlan?.id === plan.id ? 'ring-2 ring-blue-500' : 'border border-gray-700'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-center py-1 text-white text-sm font-bold">
                    Most Popular
                  </div>
                )}
                <div className="p-6 pt-8">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}</span>
                    {typeof plan.price === 'number' && <span className="text-gray-400 ml-1">one-time</span>}
                    {plan.membership && (
                      <p className="text-sm text-gray-400 mt-1">
                        (Membership: {plan.membership})
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                      selectedPlan?.id === plan.id 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    } transition-colors`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Step 3: Project Details Form */}
        {step === 3 && (
          <div className="order-form-container max-w-3xl mx-auto bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Website Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-1">Website Name</label>
                    <input 
                      type="text" 
                      name="websiteName" 
                      value={formData.websiteName} 
                      onChange={handleInputChange} 
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. My Coffee Shop"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Preferred Domain (optional)</label>
                    <input 
                      type="text" 
                      name="domain" 
                      value={formData.domain} 
                      onChange={handleInputChange} 
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. mycoffeeshop.com"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Website Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
                  placeholder="Describe your business and what you want your website to achieve..."
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Required Pages</label>
                <textarea 
                  name="requiredPages" 
                  value={formData.requiredPages} 
                  onChange={handleInputChange} 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-24"
                  placeholder="e.g. Home, About, Services, Gallery, Contact"
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-1">Preferred Color Scheme (optional)</label>
                  <input 
                    type="text" 
                    name="preferredColors" 
                    value={formData.preferredColors} 
                    onChange={handleInputChange} 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Blue and white, earthy tones"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Websites You Like (optional)</label>
                  <input 
                    type="text" 
                    name="references" 
                    value={formData.references} 
                    onChange={handleInputChange} 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="URLs of websites you like the style of"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Phone (optional)</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange} 
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-bold mb-2">Order Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span>Template:</span>
                  <span className="font-medium">{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Plan:</span>
                  <span className="font-medium">{selectedPlan?.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    {typeof selectedPlan?.price === 'number' 
                      ? `$${selectedPlan?.price.toLocaleString()}` 
                      : selectedPlan?.price}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between">
            <button
              onClick={() => setStep(prev => Math.max(prev - 1, 1))}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                step === 1 
                  ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
                  : 'border border-gray-600 hover:bg-gray-700'
              } transition-colors`}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step === 1 && !selectedTemplate) {
                  alert('Please select a template to continue');
                  return;
                }
                if (step === 2 && !selectedPlan) {
                  alert('Please select a plan to continue');
                  return;
                }
                setStep(prev => Math.min(prev + 1, 3));
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderWebsitePage;