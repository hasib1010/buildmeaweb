'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
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
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Professional website for small to medium sized businesses',
    features: ['Company profile', 'Services/Products section', 'Testimonials', 'Contact information', 'About Us page'],
    price: 499,
    popular: true,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Full-featured online store with product catalog and shopping cart',
    features: ['Product catalog', 'Shopping cart', 'Secure checkout', 'Customer accounts', 'Order tracking'],
    price: 999,
    popular: false,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Share your thoughts and content with a beautiful blog template',
    features: ['Article layout', 'Categories', 'Tags', 'Comments section', 'Author profiles'],
    price: 299,
    popular: false,
    thumbnail: '/api/placeholder/300/200'
  },
  {
    id: 'custom',
    name: 'Custom Website',
    description: 'A fully custom website designed specifically for your unique needs',
    features: ['Completely custom design', 'Tailored functionality', 'Advanced features', 'Unique user experience', 'Personalized development'],
    price: 'Custom',
    popular: false,
    thumbnail: '/api/placeholder/300/200'
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
    price: 999,
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
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 'Custom',
    description: 'Tailored solution for complex requirements',
    features: [
      'Custom feature set',
      'Enterprise integration',
      'Advanced security',
      'Specialized functionality',
      'Custom admin dashboard',
      'API development',
      'Database design',
      'Custom user roles',
      'Third-party integrations',
      'Premium support package',
      'Training & documentation'
    ]
  }
];

// Available add-ons
const addOns = [
  {
    id: 'logo',
    name: 'Logo Design',
    price: 99,
    description: 'Professional logo design for your brand'
  },
  {
    id: 'seo',
    name: 'SEO Package',
    price: 199,
    description: 'Comprehensive SEO optimization for better rankings'
  },
  {
    id: 'maintenance',
    name: 'Maintenance Plan',
    price: 49,
    description: 'Monthly maintenance and updates (per month)'
  },
  {
    id: 'hosting',
    name: 'Premium Hosting',
    price: 149,
    description: '1 year of high-performance hosting'
  },
  {
    id: 'analytics',
    name: 'Analytics Setup',
    price: 79,
    description: 'Google Analytics and reporting dashboard'
  }
];

const OrderWebsitePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [customRequest, setCustomRequest] = useState('');
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    websiteName: '',
    domain: '',
    description: '',
    requiredPages: '',
    preferredColors: '',
    references: '',
    businessType: '',
    targetAudience: '',
    competitorWebsites: '',
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/order-website');
    }
  }, [user, loading, router]);
  
  // Update form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  // Remove a file
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  // Toggle add-on selection
  const toggleAddOn = (addOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };
  
  // Calculate total price
  const calculateTotal = () => {
    if (!selectedPlan || typeof selectedPlan.price !== 'number') return 'Custom';
    
    const basePrice = selectedPlan.price;
    const addOnsPrice = selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
    
    return basePrice + addOnsPrice;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTemplate || !selectedPlan) {
      setSubmitError("Please select both a template and plan to continue.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Create the order data
      const orderData = {
        template: selectedTemplate.id,
        plan: selectedPlan.id,
        price: typeof selectedPlan.price === 'number' ? calculateTotal() : 'Custom',
        addOns: selectedAddOns.map(addon => addon.id),
        customRequest: customRequest || '',
        requirements: {
          websiteName: formData.websiteName,
          description: formData.description,
          requiredPages: formData.requiredPages,
          preferredColors: formData.preferredColors,
          references: formData.references,
          businessType: formData.businessType,
          targetAudience: formData.targetAudience,
          competitorWebsites: formData.competitorWebsites,
          contactInfo: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          }
        }
      };
      
      // Create FormData for file uploads
      const formDataForUpload = new FormData();
      formDataForUpload.append('orderData', JSON.stringify(orderData));
      files.forEach((file, index) => {
        formDataForUpload.append(`file-${index}`, file);
      });
      
      // Submit the order to the API
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formDataForUpload,
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create order');
      }
      
      // Navigate to confirmation page with the order ID
      router.push(`/order-confirmation?id=${data.order._id}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitError(error.message || 'There was an error submitting your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {step === 1 ? 'Choose a Template' : step === 2 ? 'Select Your Plan' : step === 3 ? 'Add Extras' : 'Complete Your Order'}
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {step === 1 
              ? 'Select a starting point for your website. Our team will customize it to your needs.' 
              : step === 2 
                ? 'Choose the plan that best fits your requirements and budget.'
                : step === 3
                  ? 'Enhance your website with these optional add-ons.'
                  : 'Provide details about your website requirements to help us build exactly what you need.'}
          </p>
        </div>
        
        {/* Steps Navigation */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">1</span>
            </div>
            <div className="text-sm ml-2 mr-4">Template</div>
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">2</span>
            </div>
            <div className="text-sm ml-2 mr-4">Plan</div>
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">3</span>
            </div>
            <div className="text-sm ml-2 mr-4">Add-ons</div>
          </div>
          <div className={`w-12 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <span className="font-bold">4</span>
            </div>
            <div className="text-sm ml-2">Details</div>
          </div>
        </div>
        
        {/* Error message if any */}
        {submitError && (
          <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-500 text-red-100 p-4 rounded-lg">
            <p>{submitError}</p>
          </div>
        )}
        
        {/* Step 1: Choose Template */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {websiteTemplates.map((template) => (
              <div 
                key={template.id}
                className={`bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
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
                      {typeof template.price === 'number' ? `$${template.price.toLocaleString()}` : template.price}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${
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
        
        {/* Step 3: Add-ons */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {addOns.map((addOn) => {
                const isSelected = selectedAddOns.some(item => item.id === addOn.id);
                return (
                  <div 
                    key={addOn.id}
                    className={`bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border ${
                      isSelected ? 'border-blue-500' : 'border-gray-700'
                    } p-6 cursor-pointer`}
                    onClick={() => toggleAddOn(addOn)}
                  >
                    <div className="flex items-start mb-4">
                      <div className={`w-5 h-5 rounded-md border ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-500'} flex-shrink-0 mr-3 mt-1 flex items-center justify-center`}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{addOn.name}</h3>
                        <p className="text-gray-400 text-sm">{addOn.description}</p>
                      </div>
                    </div>
                    <div className="text-right font-bold">${addOn.price}</div>
                  </div>
                );
              })}
            </div>
            
            {(selectedTemplate?.id === 'custom' || selectedPlan?.id === 'custom') && (
              <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Custom Request Details</h3>
                <textarea
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value)}
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
                  placeholder="Please describe your custom requirements in detail. Include specific features, functionality, or any other special needs for your project."
                ></textarea>
              </div>
            )}
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Template:</span>
                  <span>{selectedTemplate?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span>{selectedPlan?.name}</span>
                </div>
                
                {selectedAddOns.length > 0 && (
                  <>
                    <div className="pt-2 border-t border-gray-700">
                      <h4 className="font-medium mb-2">Add-ons:</h4>
                      {selectedAddOns.map(addon => (
                        <div key={addon.id} className="flex justify-between text-sm mb-1">
                          <span>{addon.name}</span>
                          <span>${addon.price}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="flex justify-between pt-2 border-t border-gray-700 font-bold text-lg">
                  <span>Total:</span>
                  <span>{typeof calculateTotal() === 'number' ? `$${calculateTotal().toLocaleString()}` : calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Project Details Form */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Website Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-1">Website Name *</label>
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
                <label className="block text-gray-300 mb-1">Website Description *</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-32"
                  placeholder="Describe your business and what you want your website to achieve..."
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-1">Business Type</label>
                  <input 
                    type="text" 
                    name="businessType" 
                    value={formData.businessType} 
                    onChange={handleInputChange} 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Restaurant, Consulting, Retail"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Target Audience</label>
                  <input 
                    type="text" 
                    name="targetAudience" 
                    value={formData.targetAudience} 
                    onChange={handleInputChange} 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Young professionals, Families, B2B"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Required Pages *</label>
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
                  <label className="block text-gray-300 mb-1">Competitor Websites (optional)</label>
                  <input 
                    type="text" 
                    name="competitorWebsites" 
                    value={formData.competitorWebsites} 
                    onChange={handleInputChange} 
                    className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="URLs of your main competitors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Inspiration Websites (optional)</label>
                <input 
                  type="text" 
                  name="references" 
                  value={formData.references} 
                  onChange={handleInputChange} 
                  className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="URLs of websites you like the style of"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Reference Materials (optional)</label>
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-colors text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Upload logos, brand guidelines, existing content, etc. (Max 10MB per file)
                  </p>
                </div>
                
                {files.length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-3">
                    <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex justify-between items-center text-sm bg-gray-800 p-2 rounded">
                          <div className="truncate">{file.name}</div>
                          <button 
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mb-6 pt-4 border-t border-gray-700">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-1">Your Name *</label>
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
                    <label className="block text-gray-300 mb-1">Email *</label>
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
                
                {selectedAddOns.length > 0 && (
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span>Add-ons:</span>
                      <span></span>
                    </div>
                    {selectedAddOns.map(addon => (
                      <div key={addon.id} className="flex justify-between items-center text-sm pl-4">
                        <span>{addon.name}</span>
                        <span>${addon.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    {typeof calculateTotal() === 'number' ? `${calculateTotal().toLocaleString()}` : calculateTotal()}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-white font-medium hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-bold hover:from-blue-600 hover:to-purple-700 transition-colors shadow-lg relative"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="opacity-0">Place Order</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Navigation Buttons */}
        {step < 4 && (
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
                  setSubmitError("Please select a template to continue");
                  return;
                }
                if (step === 2 && !selectedPlan) {
                  setSubmitError("Please select a plan to continue");
                  return;
                }
                setSubmitError(null);
                setStep(prev => Math.min(prev + 1, 4));
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