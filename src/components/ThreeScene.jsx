'use client';

import { useState, useRef, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  ContactShadows,
  Html,
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';

// Loading component
function Loader() {
  return (
    <Html center>
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
      </div>
    </Html>
  );
}

// Cursor following model component
function CursorFollowingModel({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const modelRef = useRef();
  const { scene } = useGLTF(url);
  const { viewport, camera, mouse } = useThree();
  
  // Clone the scene to avoid issues with multiple instances
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Follow cursor and add floating animation
  useFrame((state) => {
    if (!modelRef.current) return;
    
    const t = state.clock.getElapsedTime();
    
    // Follow cursor with the model - adjust sensitivity as needed
    const targetRotationX = (mouse.y * 0.5) + rotation[0];
    const targetRotationY = (mouse.x * 0.5) + rotation[1];
    
    // Apply smooth rotation transitions
    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      0.05
    );
    
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      0.05
    );
    
    // Add a gentle floating animation
    modelRef.current.position.y = THREE.MathUtils.lerp(
      modelRef.current.position.y,
      position[1] + Math.sin(t / 1.5) / 10,
      0.1
    );
  });

  return (
    <group
      ref={modelRef}
      position={position}
      rotation={rotation}
      scale={Array.isArray(scale) ? scale : [scale, scale, scale]}
    >
      <primitive 
        object={clonedScene}
      />
    </group>
  );
}

// Main ThreeScene component
export default function ThreeScene() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Track cursor position globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Your GLB model path
  const modelUrl = "/laptop.glb";
  
  return (
    <div 
      className="w-full h-full" 
      style={{ 
        height: '600px',
        cursor: 'none', // Hide default cursor for a more immersive experience
        touchAction: 'none' // Prevents browser handling of panning/zooming
      }}
    >
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 8], fov: 40 }}
        onCreated={(state) => {
          state.gl.setClearColor(0x000000, 0); // Transparent background
          setIsLoaded(true);
        }}
        gl={{ 
          alpha: true, 
          antialias: true,
          preserveDrawingBuffer: true
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4} />
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.15} 
            penumbra={1} 
            intensity={0.8} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          <pointLight position={[-5, -5, -5]} intensity={0.2} />
          
          <Float 
            rotationIntensity={0.1} // Reduced because we're adding our own rotation
            floatIntensity={0.5}
            speed={2}
          >
            <CursorFollowingModel 
              url={modelUrl} 
              scale={0.7} 
              position={[0, -0.1, 0]} 
              rotation={[0, 0, 0]} 
            />
          </Float>
          
          <ContactShadows 
            position={[0, -1.5, 0]} 
            opacity={0.4} 
            scale={6} 
            blur={2.5} 
            far={4} 
          />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
      
      {/* Optional: Custom cursor */}
      <div 
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '2px solid white',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          left: `${(cursorPosition.x + 1) * window.innerWidth / 2}px`,
          top: `${(-cursorPosition.y + 1) * window.innerHeight / 2}px`,
          zIndex: 1000,
          mixBlendMode: 'difference'
        }}
      />
    </div>
  );
}

// Preload the model to improve performance
useGLTF.preload("/laptop.glb");