'use client';

import { useEffect, useRef } from 'react';
import Marquee from 'react-fast-marquee';
import { gsap } from 'gsap';
import { FaReact, FaWordpress, FaShopify, FaPhp } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiStrapi, SiContentful, SiSanity, SiWoocommerce, SiTypescript, SiMongodb, SiPostgresql, SiMysql, SiLaravel } from 'react-icons/si';

const TechMarquee = () => {
  const cardsRef = useRef([]);

  // Technology list with CMS, e-commerce, databases, and frameworks
  const technologies = [
    {
      name: 'Next.js',
      color: '#0070f3',
      description: 'React framework for server-side rendering.',
      useCase: 'SEO-optimized web apps.',
      benefits: ['Fast builds', 'API routes'],
      icon: <SiNextdotjs size={130} />,
    },
    {
      name: 'React',
      color: '#61dafb',
      description: 'Library for interactive UIs.',
      useCase: 'Dynamic single-page apps.',
      benefits: ['Virtual DOM', 'Reusable components'],
      icon: <FaReact size={130} />,
    },
    {
      name: 'Tailwind',
      color: '#38bdf8',
      description: 'Utility-first CSS framework.',
      useCase: 'Responsive UI design.',
      benefits: ['Customizable', 'Minimal CSS'],
      icon: <SiTailwindcss size={130} />,
    }, 
    {
      name: 'WordPress',
      color: '#21759b',
      description: 'Popular CMS for websites.',
      useCase: 'Versatile website creation.',
      benefits: ['User-friendly', 'Plugins'],
      icon: <FaWordpress size={130} />,
    },
    {
      name: 'WooCommerce',
      color: '#96588a',
      description: 'E-commerce for WordPress.',
      useCase: 'Custom online stores.',
      benefits: ['Flexible', 'Scalable'],
      icon: <SiWoocommerce size={130} />,
    },
    {
      name: 'Shopify',
      color: '#95bf47',
      description: 'All-in-one e-commerce platform.',
      useCase: 'Managing online stores.',
      benefits: ['Hosted', 'Secure payments'],
      icon: <FaShopify size={130} />,
    },
    {
      name: 'TypeScript',
      color: '#3178c6',
      description: 'Typed JavaScript for apps.',
      useCase: 'Large-scale development.',
      benefits: ['Static types', 'Tooling'],
      icon: <SiTypescript size={130} />,
    },
    {
      name: 'MongoDB',
      color: '#47a248',
      description: 'NoSQL database for flexible data.',
      useCase: 'Scalable, document-based apps.',
      benefits: ['Schema-less', 'High performance'],
      icon: <SiMongodb size={130} />,
    },
    {
      name: 'PostgreSQL',
      color: '#336791',
      description: 'Relational database for robust apps.',
      useCase: 'Structured data management.',
      benefits: ['ACID compliance', 'Extensible'],
      icon: <SiPostgresql size={130} />,
    },
    {
      name: 'MySQL',
      color: '#4479a1',
      description: 'Relational database for web apps.',
      useCase: 'Managing structured data.',
      benefits: ['Fast queries', 'Widely used'],
      icon: <SiMysql size={130} />,
    },
    {
      name: 'PHP',
      color: '#777bb4',
      description: 'Server-side scripting language.',
      useCase: 'Dynamic web development.',
      benefits: ['Versatile', 'Large ecosystem'],
      icon: <FaPhp size={130} />,
    },
    {
      name: 'Laravel',
      color: '#ff2d20',
      description: 'PHP framework for web apps.',
      useCase: 'Building robust, elegant applications.',
      benefits: ['Eloquent ORM', 'Blade templating'],
      icon: <SiLaravel size={130} />,
    },
  ];

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      // Initial animation
      gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: index * 0.15,
        }
      );

      // Hover animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.1,
          rotate: 2,
          boxShadow: `0 0 50px rgba(${parseInt(card.dataset.color.slice(1, 3), 16)}, ${parseInt(
            card.dataset.color.slice(3, 5),
            16
          )}, ${parseInt(card.dataset.color.slice(5, 7), 16)}, 0.8)`,
          border: `3px solid ${card.dataset.color}`,
          duration: 0.4,
          ease: 'power2.out',
        });
        gsap.to(card.querySelector('.card-overlay'), {
          opacity: 0.4,
          duration: 0.4,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          rotate: 0,
          boxShadow: `0 0 25px rgba(${parseInt(card.dataset.color.slice(1, 3), 16)}, ${parseInt(
            card.dataset.color.slice(3, 5),
            16
          )}, ${parseInt(card.dataset.color.slice(5, 7), 16)}, 0.5)`,
          border: `2px solid ${card.dataset.color}66`,
          duration: 0.4,
          ease: 'power2.out',
        });
        gsap.to(card.querySelector('.card-overlay'), {
          opacity: 0,
          duration: 0.4,
        });
      });
    });

    return () => {
      cardsRef.current.forEach((card) => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <div className="relative  ">
      <Marquee speed={100} gradient={false} pauseOnHover={true}>
        {technologies.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            ref={(el) => (cardsRef.current[index] = el)}
            data-color={tech.color}
            className="mx-6 rounded-3xl overflow-hidden group relative my-15"
            style={{
              background: `linear-gradient(145deg, ${tech.color}55, ${tech.color}22)`,
              border: `2px solid ${tech.color}66`,
              boxShadow: `0 0 25px ${tech.color}55`,
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Card Content */}
            <div className="p-8 h-fit flex flex-col justify-between relative z-10">
              <div>
                <h3
                  className="text-4xl font-extrabold uppercase tracking-widest mb-4 text-center"
                  style={{
                    color: '#ffffff',
                    textShadow: `0 0 15px ${tech.color}`,
                  }}
                >
                  {tech.name}
                </h3>
                <div
                  className="flex items-center justify-center mb-4"
                  style={{ color: tech.color, filter: `drop-shadow(0 0 10px ${tech.color})` }}
                >
                  {tech.icon}
                </div>
                <p
                  className="text-gray-200 text-base mb-4 text-center"
                  style={{ textShadow: `0 0 8px ${tech.color}77` }}
                >
                  {tech.description}
                </p>
                <p className="text-gray-300 text-sm text-center">
                  <strong>Use Case:</strong> {tech.useCase}
                </p>
              </div> 
              
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"
              style={{
                background: tech.color,
                boxShadow: `0 0 25px ${tech.color}`,
              }}
            ></div>
            <div
              className="absolute bottom-4 left-4 w-12 h-12 rounded-full opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"
              style={{
                background: tech.color,
                boxShadow: `0 0 25px ${tech.color}`,
              }}
            ></div>

            {/* Holographic Overlay */}
            <div
              className="card-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0"
              style={{ backdropFilter: 'blur(8px)' }}
            ></div>

            {/* Reflective Surface */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: `linear-gradient(45deg, transparent, ${tech.color}44, transparent)`,
              }}
            ></div>

            {/* Particle Effect on Hover */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="particles group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute w-2 h-2 rounded-full"
                    style={{
                      background: tech.color,
                      boxShadow: `0 0 12px ${tech.color}`,
                      top: `${gsap.utils.random(0, 100)}%`,
                      left: `${gsap.utils.random(0, 100)}%`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Marquee>

      {/* CSS for effects */}
      <style jsx>{`
        .group:hover {
          transform: translateY(-10px);
          transition: transform 0.4s ease, box-shadow 0.4s ease, border 0.4s ease;
        }
        .particles {
          position: absolute;
          inset: 0;
        }
        .particle {
          animation: float 2s infinite ease-in-out;
          animation-delay: ${() => gsap.utils.random(0, 1.5)}s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-20px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default TechMarquee;