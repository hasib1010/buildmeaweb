'use client';

import Link from 'next/link';

const CtaSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="cta">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 z-0"></div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 z-0">
        {Array(20).fill().map((_, index) => (
          <div 
            key={index}
            className="absolute rounded-full bg-purple-500/30 blur-xl"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.2,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Neon Grid Lines */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full grid grid-cols-6">
          {Array(6).fill().map((_, index) => (
            <div 
              key={index}
              className="border-r border-purple-500/30"
            ></div>
          ))}
        </div>
        <div className="h-full w-full grid grid-rows-6">
          {Array(6).fill().map((_, index) => (
            <div 
              key={index}
              className="border-b border-purple-500/30"
            ></div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/60 to-gray-900/60 p-10 md:p-16 rounded-2xl backdrop-blur-lg border border-purple-500/20 shadow-xl animate-on-scroll">
          {/* Glowing accents */}
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          
          {/* Content */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your Website, Done For You —
              <br />
              <span className="gradient-text">Ready to Get Started?</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Join hundreds of satisfied business owners who've transformed their online presence without the stress of DIY website building.
            </p>
            
            <button className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 px-8 py-4 rounded-full leading-none flex items-center">
                <span className="text-white font-medium">Build My Website Now</span>
                <svg 
                  className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </div>
          
          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                title: "Quick Turnaround",
                description: "Get your website in as little as 7 days",
                icon: (
                  <svg className="w-6 h-6 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "Unlimited Revisions",
                description: "We'll make changes until you're 100% satisfied",
                icon: (
                  <svg className="w-6 h-6 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )
              },
              {
                title: "Lifetime Support",
                description: "Help when you need it, for as long as you need it",
                icon: (
                  <svg className="w-6 h-6 mx-auto text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;