'use client';

import { useState, useRef, Suspense, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that depend on browser APIs
// This ensures they only load on the client side
const ThreeSceneContent = dynamic(() => import('./ThreeSceneContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-xl">
      <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
    </div>
  )
});

// Main ThreeScene component wrapper
export default function ThreeScene() {
  return (
    <div className="w-full h-full" style={{ height: '600px' }}>
      <ThreeSceneContent />
    </div>
  );
}