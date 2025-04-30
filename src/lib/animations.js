'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { Observer } from 'gsap/Observer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, Observer);

// Animation presets for reuse
const ANIMATION_PRESETS = {
  fadeUp: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.85 },
    to: { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }
  },
  slideInRight: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
  },
  slideInLeft: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
  },
  textReveal: {
    from: { opacity: 0, y: 10 },
    to: { opacity: 1, y: 0, duration: 0.3, stagger: 0.02, ease: 'power2.out' }
  }
};

/**
 * Initialize smooth scrolling for better user experience
 */
export function initSmoothScroll() {
  // Only initialize on desktop devices to avoid performance issues on mobile
  if (window.innerWidth > 768) {
    const smoother = ScrollSmoother.create({
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1, // Very light smoothing for touch devices
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    
    return () => smoother && smoother.kill();
  }
  return () => {};
}

/**
 * Create staggered animations for elements with the animate-on-scroll class
 * with support for different animation types via data attributes
 */
export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  const animations = [];

  // Create a timeline for each section to better control animation sequence
  document.querySelectorAll('[data-animate-section]').forEach(section => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reset'
      }
    });
    
    const elements = section.querySelectorAll('[data-animate]');
    
    if (elements.length) {
      tl.fromTo(elements, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }
    
    animations.push(tl);
  });

  // Handle individual elements
  animatedElements.forEach(element => {
    if (element.closest('[data-animate-section]')) {
      return; // Skip elements that are already part of a section animation
    }
    
    const preset = element.dataset.animate || 'fadeUp';
    const delay = parseFloat(element.dataset.delay || 0);
    
    // Use preset if available, otherwise use default fadeUp animation
    const animConfig = ANIMATION_PRESETS[preset] || ANIMATION_PRESETS.fadeUp;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reset'
      }
    });
    
    tl.fromTo(
      element,
      { ...animConfig.from },
      { ...animConfig.to, delay }
    );
    
    // Special handling for text elements to apply split text animation
    if (preset === 'textReveal' && element.tagName.match(/H1|H2|H3|P/i)) {
      try {
        const splitText = new SplitText(element, { type: 'words,chars' });
        tl.fromTo(
          splitText.chars,
          { opacity: 0, y: 10 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.3, 
            stagger: 0.02,
            ease: 'power2.out' 
          },
          0
        );
      } catch (e) {
        console.warn('SplitText animation failed, fallback to normal animation', e);
      }
    }
    
    // Handle Lottie animations
    if (element.hasAttribute('data-lottie')) {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        onEnter: () => element.classList.add('lottie-play'),
        onLeaveBack: () => element.classList.remove('lottie-play'),
        onEnterBack: () => element.classList.add('lottie-play'),
      });
    }
    
    animations.push(tl);
  });

  // Return cleanup function
  return () => {
    animations.forEach(tl => tl.kill());
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}

/**
 * Enhanced parallax effects with support for horizontal parallax and rotation
 */
export function initParallaxEffects() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const timelines = [];

  parallaxElements.forEach(element => {
    const config = element.dataset;
    const speed = parseFloat(config.parallax) || 0.2;
    const direction = config.direction || 'vertical';
    const rotation = parseFloat(config.rotation) || 0;
    const scale = config.scale ? parseFloat(config.scale) : null;
    
    // Create different effects based on direction
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element.closest('section') || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
    
    const effects = {};
    
    // Add movement effects
    if (direction === 'vertical' || direction === 'both') {
      effects.y = () => window.scrollY * speed;
    }
    
    if (direction === 'horizontal' || direction === 'both') {
      effects.x = () => window.scrollY * speed * 0.5;
    }
    
    // Add rotation effect if specified
    if (rotation) {
      effects.rotation = () => window.scrollY * rotation * 0.01;
    }
    
    // Add scale effect if specified
    if (scale) {
      const startScale = 1;
      const endScale = scale;
      effects.scale = () => {
        const progress = ScrollTrigger.create({
          trigger: element.closest('section') || element,
          start: 'top bottom',
          end: 'bottom top',
        }).progress;
        return startScale + (endScale - startScale) * progress;
      };
    }
    
    tl.to(element, {
      ...effects,
      ease: 'none'
    });
    
    timelines.push(tl);
  });

  return () => {
    timelines.forEach(tl => tl.kill());
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}

/**
 * Advanced hover effects with magnetic pull, particles, and custom cursors
 */
export function initHoverEffects() {
  const glowButtons = document.querySelectorAll('[data-hover]');
  const cleanupFunctions = [];

  glowButtons.forEach(button => {
    const type = button.dataset.hover || 'glow';
    const intensity = parseFloat(button.dataset.intensity || 1);
    
    // Create particle container for glow and particle effects
    if (type === 'glow' || type === 'particles') {
      const particleContainer = document.createElement('div');
      particleContainer.className = 'particle-container';
      button.appendChild(particleContainer);
      
      // Create optimized number of particles based on button size
      const buttonArea = button.offsetWidth * button.offsetHeight;
      const particleCount = Math.min(Math.max(3, Math.floor(buttonArea / 2000)), 10);
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particleContainer.appendChild(particle);
      }
    }
    
    // Magnetic effect
    if (type === 'magnetic') {
      const onMouseMove = (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const strength = 0.1 * intensity;
        
        gsap.to(button, {
          x: x * strength,
          y: y * strength,
          rotation: (x * y) * 0.0001 * intensity,
          duration: 0.6,
          ease: 'power2.out'
        });
      };
      
      const onMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      };
      
      const onMouseEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      };
      
      button.addEventListener('mousemove', onMouseMove);
      button.addEventListener('mouseleave', onMouseLeave);
      button.addEventListener('mouseenter', onMouseEnter);
      
      cleanupFunctions.push(() => {
        button.removeEventListener('mousemove', onMouseMove);
        button.removeEventListener('mouseleave', onMouseLeave);
        button.removeEventListener('mouseenter', onMouseEnter);
      });
    }
    
    // Standard hover effect with glow and scale
    else {
      const onMouseEnter = () => {
        gsap.to(button, {
          scale: 1.05,
          boxShadow: `0 0 ${15 * intensity}px rgba(147, 51, 234, ${0.4 * intensity})`,
          duration: 0.2,
          ease: 'power2.out'
        });
        
        if (type === 'particles') {
          const particles = button.querySelectorAll('.particle');
          gsap.to(particles, {
            x: () => gsap.utils.random(-20, 20) * intensity,
            y: () => gsap.utils.random(-20, 20) * intensity,
            opacity: 0.7 * intensity,
            scale: () => gsap.utils.random(0.4, 0.8) * intensity,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out'
          });
        }
        
        if (button.hasAttribute('data-lottie')) {
          button.classList.add('lottie-play');
        }
      };
      
      const onMouseLeave = () => {
        gsap.to(button, {
          scale: 1,
          boxShadow: '0 0 5px rgba(147, 51, 234, 0.2)',
          duration: 0.2,
          ease: 'power2.out'
        });
        
        if (type === 'particles') {
          const particles = button.querySelectorAll('.particle');
          gsap.to(particles, {
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        if (button.hasAttribute('data-lottie')) {
          button.classList.remove('lottie-play');
        }
      };
      
      button.addEventListener('mouseenter', onMouseEnter);
      button.addEventListener('mouseleave', onMouseLeave);
      
      cleanupFunctions.push(() => {
        button.removeEventListener('mouseenter', onMouseEnter);
        button.removeEventListener('mouseleave', onMouseLeave);
      });
    }
  });

  // Create a custom cursor effect for desktop
  if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
    
    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power1.out'
      });
      
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    };
    
    document.addEventListener('mousemove', onMouseMove);
    
    // Create hover effects for cursor
    document.querySelectorAll('a, button, [data-hover]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        follower.classList.add('follower-hover');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        follower.classList.remove('follower-hover');
      });
    });
    
    cleanupFunctions.push(() => {
      document.removeEventListener('mousemove', onMouseMove);
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      if (follower.parentNode) follower.parentNode.removeChild(follower);
    });
  }

  // Add CSS for custom cursor
  const style = document.createElement('style');
  style.textContent = `
    .custom-cursor {
      position: fixed;
      width: 8px;
      height: 8px;
      background: rgba(147, 51, 234, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
    }
    
    .cursor-follower {
      position: fixed;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(147, 51, 234, 0.3);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: width 0.3s, height 0.3s;
    }
    
    .cursor-hover {
      transform: translate(-50%, -50%) scale(1.5);
      background: rgba(147, 51, 234, 0.5);
    }
    
    .follower-hover {
      width: 20px;
      height: 20px;
      background: rgba(147, 51, 234, 0.1);
      border-color: rgba(147, 51, 234, 0.6);
    }
  `;
  document.head.appendChild(style);
  cleanupFunctions.push(() => {
    if (style.parentNode) style.parentNode.removeChild(style);
  });

  return () => {
    cleanupFunctions.forEach(fn => fn());
  };
}

/**
 * Initialize text animations with typewriter and reveal effects
 */
export function initTextAnimations() {
  const textElements = document.querySelectorAll('[data-text-effect]');
  const timelines = [];

  textElements.forEach(element => {
    const effect = element.dataset.textEffect || 'reveal';
    
    if (effect === 'reveal') {
      try {
        const splitText = new SplitText(element, { type: 'lines,words,chars' });
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reset'
          }
        });
        
        tl.fromTo(
          splitText.chars,
          { opacity: 0, y: 10 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.03, 
            stagger: 0.02,
            ease: 'power2.out' 
          }
        );
        
        timelines.push(tl);
      } catch (e) {
        console.warn('Text reveal animation failed, fallback to normal animation', e);
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none reset'
          }
        });
        
        tl.fromTo(
          element,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
        
        timelines.push(tl);
      }
    } 
    else if (effect === 'typewriter') {
      const text = element.textContent;
      element.textContent = '';
      element.style.visibility = 'visible';
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reset'
        }
      });
      
      let currentText = '';
      const duration = text.length * 0.03;
      
      tl.to(element, {
        duration,
        onUpdate: function() {
          const progress = this.progress();
          const charIndex = Math.floor(text.length * progress);
          currentText = text.slice(0, charIndex);
          element.textContent = currentText + (progress < 1 ? '|' : '');
        },
        onComplete: function() {
          element.textContent = text;
        }
      });
      
      timelines.push(tl);
    }
  });

  return () => {
    timelines.forEach(tl => tl.kill());
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
}

/**
 * Initialize 3D tilt effect for cards and images
 */
export function initTiltEffect() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  const cleanupFunctions = [];

  tiltElements.forEach(element => {
    const intensity = parseFloat(element.dataset.tiltIntensity || 1);
    const glare = element.dataset.tiltGlare !== undefined;
    
    let tiltObj = {
      element,
      listener: null,
      centerX: 0,
      centerY: 0,
      initialTransform: window.getComputedStyle(element).transform
    };
    
    // Save initial transform state
    if (tiltObj.initialTransform === 'none') {
      tiltObj.initialTransform = '';
    }
    
    if (glare) {
      const glareElement = document.createElement('div');
      glareElement.className = 'tilt-glare';
      element.appendChild(glareElement);
      
      // Add styles for glare effect
      glareElement.style.position = 'absolute';
      glareElement.style.top = '0';
      glareElement.style.left = '0';
      glareElement.style.width = '100%';
      glareElement.style.height = '100%';
      glareElement.style.background = 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)';
      glareElement.style.opacity = '0';
      glareElement.style.pointerEvents = 'none';
      glareElement.style.borderRadius = 'inherit';
      
      tiltObj.glareElement = glareElement;
    }
    
    // Make sure the element is positioned relatively
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    
    const update = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = -(e.clientY - centerY) / (rect.height / 2);
      
      const maxTilt = 15 * intensity;
      const tiltX = percentY * maxTilt;
      const tiltY = percentX * maxTilt;
      
      gsap.to(element, {
        transform: `${tiltObj.initialTransform} perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`,
        duration: 0.6,
        ease: 'power1.out'
      });
      
      if (glare) {
        const glarePosition = percentX * 100;
        const glareOpacity = Math.abs(percentX * percentY) * 0.3 * intensity;
        
        gsap.to(tiltObj.glareElement, {
          opacity: glareOpacity,
          duration: 0.6,
          backgroundPosition: `${glarePosition}% 50%`,
          ease: 'power1.out'
        });
      }
    };
    
    const resetTilt = () => {
      gsap.to(element, {
        transform: tiltObj.initialTransform,
        duration: 0.6,
        ease: 'power1.out'
      });
      
      if (glare) {
        gsap.to(tiltObj.glareElement, {
          opacity: 0,
          duration: 0.6,
          ease: 'power1.out'
        });
      }
    };
    
    element.addEventListener('mousemove', update);
    element.addEventListener('mouseleave', resetTilt);
    
    cleanupFunctions.push(() => {
      element.removeEventListener('mousemove', update);
      element.removeEventListener('mouseleave', resetTilt);
      if (glare && tiltObj.glareElement && tiltObj.glareElement.parentNode) {
        tiltObj.glareElement.parentNode.removeChild(tiltObj.glareElement);
      }
    });
  });

  return () => {
    cleanupFunctions.forEach(fn => fn());
  };
}

/**
 * Initialize all animations and effects
 */
export function initAllAnimations() {
  // Create a batch of cleanup functions
  const cleanupFunctions = [];
  
  // Feature detection for advanced animations
  const supportsAdvancedAnimations = window.innerWidth > 768 && !navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i);
  
  // Initialize basic animations first
  cleanupFunctions.push(initScrollAnimations());
  cleanupFunctions.push(initParallaxEffects());
  cleanupFunctions.push(initHoverEffects());
  
  // Initialize advanced animations if supported
  if (supportsAdvancedAnimations) {
    cleanupFunctions.push(initSmoothScroll());
    cleanupFunctions.push(initTextAnimations());
    cleanupFunctions.push(initTiltEffect());
  }
  
  // Return a single cleanup function that calls all others
  return () => {
    cleanupFunctions.forEach(cleanup => typeof cleanup === 'function' && cleanup());
  };
}

// Export all available animation functions
export {
  ANIMATION_PRESETS
};