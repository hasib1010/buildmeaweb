'use client';

import { useRef } from 'react';
import PlanCard from '../ui/PlanCard';

const PlansSection = () => {
  const plansRef = useRef(null);

  const plans = [
    {
      name: "Starter",
      description: "Best for Personal & Landing Pages",
      price: "$150",
      period: "one-time",
      features: [
        { text: "Up to 2 pages" },
        { text: "Simple & clean designs" },
        { text: "Basic SEO optimization" },
        { text: "Mobile-Friendly", value: false },
      ],
      isFeatured: false,
      ctaText: "Get Started",
      ctaLink: "/checkout?plan=starter",
      ctaStyle: "secondary"
    },
    {
      name: "Growth",
      description: "Best for Small Businesses & Coaches",
      price: "$499",
      period: "one-time",
      features: [
        { text: "Up to 4 pages" },
        { text: "Your custom design" },
        { text: "Advanced SEO" },
        { text: "Mobile-Friendly", value: true },
      ],
      isFeatured: true,
      ctaText: "Get Started",
      ctaLink: "/checkout?plan=growth",
      ctaStyle: "primary"
    },
    {
      name: "Elite - Custom",
      description: "For Businesses, E-commerce & Advanced Needs",
      price: "Custom Pricing",
      subscription: "$9.99/month membership",
      features: [
        { text: "Unlimited pages" },
        { text: "Fully tailored design" },
        { text: "Full SEO strategy" },
        { text: "E-commerce ready", value: true },
      ],
      isFeatured: false,
      ctaText: "Get Free Consultation",
      ctaLink: "/consultation",
      ctaStyle: "secondary"
    }
  ];

  return (
    <section ref={plansRef} className="plans-section py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-white">Website Building <span className="gradient-text">Plans</span></h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Choose the perfect plan for your needs, or get a custom solution tailored specifically to your business.
        </p>
      </div>
      
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            name={plan.name}
            description={plan.description}
            price={plan.price}
            period={plan.period}
            subscription={plan.subscription}
            features={plan.features}
            isFeatured={plan.isFeatured}
            ctaText={plan.ctaText}
            ctaLink={plan.ctaLink}
            ctaStyle={plan.ctaStyle}
          />
        ))}
      </div>
    </section>
  );
};

export default PlansSection;