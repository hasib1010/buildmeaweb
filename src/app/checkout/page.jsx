// app/checkout/page.js
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Loading component to use with Suspense
function CheckoutLoading() {
  return (
    <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-sm">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <p className="mt-4 text-gray-600">Loading checkout details...</p>
    </div>
  );
}

// The actual checkout component
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    websiteType: '',
    websiteGoals: '',
    existingWebsite: '',
    customRequirements: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    termsAccepted: false
  });
  
  const [planDetails, setPlanDetails] = useState({
    id: '',
    name: '',
    price: 0,
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  
  // Set plan details based on URL parameter
  useEffect(() => {
    const plans = {
      starter: {
        id: 'starter',
        name: 'Starter',
        price: 150,
        description: 'Best for Personal & Landing Pages'
      },
      growth: {
        id: 'growth',
        name: 'Growth',
        price: 499,
        description: 'Best for Small Businesses & Coaches'
      }
    };
    
    if (planId && plans[planId]) {
      setPlanDetails(plans[planId]);
    } else if (planId === 'elite') {
      // Redirect to consultation page for Elite plan
      router.push('/consultation');
    } else {
      // Invalid or missing plan ID, redirect to plans page
      router.push('/plans');
    }
  }, [planId, router]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Email is invalid';
    
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number';
      
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) newErrors.cardExpiry = 'Invalid format (MM/YY)';
      
      if (!formData.cardCvv.trim()) newErrors.cardCvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = 'Invalid CVV';
    }
    
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setCheckoutError('');
    
    try {
      // Simulate successful checkout (for demo purposes)
      setTimeout(() => {
        setOrderCompleted(true);
        setOrderDetails({
          id: 'ORD-' + Math.floor(Math.random() * 10000),
          planName: planDetails.name,
          price: planDetails.price,
          customerEmail: formData.customerEmail,
          createdAt: new Date().toISOString()
        });
        setIsSubmitting(false);
      }, 1500);
      
      /* In a real app, you would use something like:
      
      const paymentDetails = formData.paymentMethod === 'creditCard' 
        ? {
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardCvv: formData.cardCvv
          }
        : {};
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: planDetails.id,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          websiteDetails: {
            websiteType: formData.websiteType,
            websiteGoals: formData.websiteGoals,
            existingWebsite: formData.existingWebsite
          },
          customRequirements: formData.customRequirements,
          paymentMethod: formData.paymentMethod,
          paymentDetails
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderCompleted(true);
        setOrderDetails(data.order);
      } else {
        setCheckoutError(data.message || 'Something went wrong with the checkout process. Please try again.');
      }
      */
      
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError('An error occurred during checkout. Please try again later.');
      setIsSubmitting(false);
    }
  };
  
  if (!planDetails.id) {
    return (
      <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-sm">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading plan details...</p>
      </div>
    );
  }
  
  if (orderCompleted) {
    return (
      <div className="bg-green-50 border-2 border-green-200 p-6 sm:p-8 rounded-lg text-center shadow-sm">
        <div className="text-green-600 text-4xl sm:text-6xl mb-4">✓</div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Order Confirmed!</h2>
        <p className="text-base sm:text-lg mb-6">
          Thank you for your order. We've received your payment and will begin working on your website right away.
        </p>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm max-w-md mx-auto mb-6 sm:mb-8">
          <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-left">Order Summary</h3>
          <div className="space-y-2 text-left mb-4 text-sm sm:text-base">
            <p><span className="font-medium">Order Number:</span> {orderDetails?.id}</p>
            <p><span className="font-medium">Plan:</span> {orderDetails?.planName}</p>
            <p><span className="font-medium">Amount Paid:</span> ${orderDetails?.price}</p>
            <p><span className="font-medium">Date:</span> {new Date(orderDetails?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <p className="mb-6 text-sm sm:text-base">
          We've sent a confirmation email to <strong>{orderDetails?.customerEmail}</strong> with all the details.
          We'll contact you within 24 hours to discuss the next steps.
        </p>
        <div className="flex justify-center">
          <Link href="/" className="bg-blue-600 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
      {/* Order Summary - stacks on mobile, side by side on desktop */}
      <div className="w-full lg:w-1/3 order-2 lg:order-1">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm lg:sticky lg:top-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Order Summary</h2>
          <div className="border-t border-b border-gray-200 py-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">{planDetails.name} Plan</span>
              <span>${planDetails.price}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{planDetails.description}</p>
          </div>
          <div className="flex justify-between font-bold text-base sm:text-lg">
            <span>Total</span>
            <span>${planDetails.price}</span>
          </div>
          <div className="mt-5 sm:mt-6 text-xs sm:text-sm space-y-1 sm:space-y-2">
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✓</span> Fast Turnaround (5-7 days)
            </p>
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✓</span> No Hidden Fees
            </p>
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✓</span> 100% Satisfaction Guarantee
            </p>
            <p className="flex items-start">
              <span className="text-green-600 mr-2">✓</span> Secure Payment
            </p>
          </div>
          <div className="mt-5 sm:mt-6 text-center sm:text-left">
            <Link href="/plans" className="text-blue-600 text-sm hover:underline inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change Plan
            </Link>
          </div>
        </div>
      </div>
      
      {/* Checkout Form */}
      <div className="w-full lg:w-2/3 order-1 lg:order-2">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
          {checkoutError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mb-5 sm:mb-6 text-red-700 text-sm sm:text-base">
              {checkoutError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Contact Information */}
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact Information</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-5 sm:mb-6">
              <div>
                <label htmlFor="customerName" className="block mb-1 font-medium text-sm sm:text-base">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.customerName}
                  onChange={handleChange}
                />
                {errors.customerName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerName}</p>}
              </div>
              
              <div>
                <label htmlFor="customerEmail" className="block mb-1 font-medium text-sm sm:text-base">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base ${errors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.customerEmail}
                  onChange={handleChange}
                />
                {errors.customerEmail && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerEmail}</p>}
              </div>
              
              <div>
                <label htmlFor="customerPhone" className="block mb-1 font-medium text-sm sm:text-base">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  value={formData.customerPhone}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="websiteType" className="block mb-1 font-medium text-sm sm:text-base">
                  Website Type
                </label>
                <select
                  id="websiteType"
                  name="websiteType"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  value={formData.websiteType}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="personal">Personal/Portfolio</option>
                  <option value="business">Business/Company</option>
                  <option value="blog">Blog</option>
                  <option value="service">Service Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            {/* Website Details */}
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Website Details</h3>
            <div className="space-y-4 mb-5 sm:mb-6">
              <div>
                <label htmlFor="websiteGoals" className="block mb-1 font-medium text-sm sm:text-base">
                  What are your goals for this website?
                </label>
                <textarea
                  id="websiteGoals"
                  name="websiteGoals"
                  rows="3"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  placeholder="e.g., Attract new clients, showcase my portfolio, etc."
                  value={formData.websiteGoals}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="existingWebsite" className="block mb-1 font-medium text-sm sm:text-base">
                  Do you have an existing website? (If yes, please provide the URL)
                </label>
                <input
                  type="text"
                  id="existingWebsite"
                  name="existingWebsite"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  placeholder="e.g., https://example.com"
                  value={formData.existingWebsite}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="customRequirements" className="block mb-1 font-medium text-sm sm:text-base">
                  Any specific requirements or features you need?
                </label>
                <textarea
                  id="customRequirements"
                  name="customRequirements"
                  rows="3"
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm sm:text-base"
                  placeholder="e.g., Contact form, image gallery, specific color scheme, etc."
                  value={formData.customRequirements}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            {/* Payment Information */}
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Payment Information</h3>
            <div className="mb-4">
              <div className="flex flex-wrap gap-4 mb-4">
                <label className="flex items-center text-sm sm:text-base">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="creditCard"
                    checked={formData.paymentMethod === 'creditCard'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Credit Card
                </label>
                <label className="flex items-center text-sm sm:text-base">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PayPal
                </label>
              </div>
              
              {formData.paymentMethod === 'creditCard' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block mb-1 font-medium text-sm sm:text-base">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.cardNumber}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardExpiry" className="block mb-1 font-medium text-sm sm:text-base">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base ${errors.cardExpiry ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                      />
                      {errors.cardExpiry && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.cardExpiry}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="cardCvv" className="block mb-1 font-medium text-sm sm:text-base">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="cardCvv"
                        name="cardCvv"
                        className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base ${errors.cardCvv ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={handleChange}
                      />
                      {errors.cardCvv && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.cardCvv}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              {formData.paymentMethod === 'paypal' && (
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-sm sm:text-base">You will be redirected to PayPal to complete your payment after submitting this form.</p>
                </div>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start text-sm sm:text-base">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="mt-1 mr-2"
                />
                <span>
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                  understand that my website will be delivered within 5-7 business days after payment.
                </span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.termsAccepted}</p>}
            </div>
            
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className={`bg-blue-600 text-white w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Pay $${planDetails.price} & Complete Order`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Checkout</h1>
            <p className="text-gray-600 text-sm sm:text-base">Complete your order and we'll start building your website</p>
          </div>
          
          <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}