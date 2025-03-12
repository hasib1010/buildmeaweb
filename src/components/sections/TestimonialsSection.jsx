'use client';

import TestimonialCard from '../ui/TestimonialCard';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The team delivered exactly what I wanted, and faster than I expected. My new website looks professional and has already started bringing in more leads.",
      author: "Sarah Johnson",
      role: "Small Business Owner",
      rating: 5
    },
    {
      quote: "I was hesitant at first due to the price, but it was worth every penny. The Growth plan gave me everything I needed to establish my online coaching business.",
      author: "Michael Torres",
      role: "Life Coach",
      rating: 5
    },
    {
      quote: "The Elite plan was perfect for my e-commerce store. The custom features and integrations have made managing my online business so much easier.",
      author: "Emma Wilson",
      role: "Online Retailer",
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section py-20 px-4 bg-black">
      <div className="container mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-white">What Our <span className="gradient-text">Clients Say</span></h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Don't just take our word for it - hear from some of our satisfied customers
        </p>
      </div>
      
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            quote={testimonial.quote}
            author={testimonial.author}
            role={testimonial.role}
            rating={testimonial.rating}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;