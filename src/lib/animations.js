import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Initialize animations for the hero section
 */
export const initHeroAnimations = () => {
  // Hero title animation - fade in and slide up
  gsap.fromTo(
    '.hero-title',
    { opacity: 0, y: 100 },
    { opacity: 1, y: 0, duration: 1, delay: 0.2 }
  );
  
  // Hero description animation - fade in
  gsap.fromTo(
    '.hero-description',
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 0.6 }
  );
  
  // Hero buttons animation - fade in and slide up
  gsap.fromTo(
    '.hero-buttons',
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, delay: 0.9 }
  );
  
  // Hero decorative elements animation
  gsap.fromTo(
    '.hero-decoration',
    { opacity: 0, scale: 0.8 },
    { opacity: 0.2, scale: 1, duration: 1.5, ease: "power2.out" }
  );
};

/**
 * Initialize scroll-triggered animations for sections
 */
export const initScrollAnimations = () => {
  // Trusted section logos
  gsap.from('.trusted-logo', {
    scrollTrigger: {
      trigger: '.trusted-section',
      start: 'top 90%',
    },
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
  });

  // Features section animation
  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
  });
  
  // Plans animation
  gsap.from('.plan-card', {
    scrollTrigger: {
      trigger: '.plans-section',
      start: 'top 70%',
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3,
  });
  
  // CTA section animation
  gsap.from('.cta-section', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
    },
    y: 30,
    opacity: 0,
    duration: 1,
  });
  
  // Testimonials animation
  gsap.from('.testimonial-card', {
    scrollTrigger: {
      trigger: '.testimonials-section',
      start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.8,
  });
};

/**
 * Initialize all animations
 */
export const initAllAnimations = () => {
  initHeroAnimations();
  initScrollAnimations();
};

export default initAllAnimations;