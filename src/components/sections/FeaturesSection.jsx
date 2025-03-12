'use client';

import { useRef } from 'react';
import FeatureCard from '../ui/FeatureCard';

const FeaturesSection = () => {
  const featureRef = useRef(null);

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Stunning Design",
      description: "Professional, modern designs that make your business stand out from the competition.",
      color: "purple"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Fast Turnaround",
      description: "Get your website up and running in as little as 5-7 days, not weeks or months.",
      color: "blue"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Transparent Pricing",
      description: "No hidden fees or surprises. Clear pricing structure with exactly what you get.",
      color: "orange"
    }
  ];

  return (
    <section ref={featureRef} className="features-section py-20 px-4 bg-black">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 gradient-text">Why Choose Our Website Building Service?</h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          We combine cutting-edge technology with beautiful design to create websites 
          that not only look great but also drive results for your business.
        </p>
      </div>
      
      <div className="container mx-auto grid md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            color={feature.color}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;