'use client';

import { useRef } from 'react';
import Link from 'next/link';

const CtaSection = () => {
  const ctaRef = useRef(null);

  return (
    <section ref={ctaRef} className="cta-section py-20 px-4 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Perfect Website?</h2>
        <p className="text-xl mb-8">
          🔥 Sign up today and get a FREE 30-minute website strategy session!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/plans" 
            className="bg-white text-purple-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            View All Plan Details
          </Link>
          <Link 
            href="/consultation" 
            className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all"
          >
            Schedule Consultation
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;