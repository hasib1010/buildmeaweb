'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  Float, 
  PresentationControls, 
  useGLTF,
  Stars 
} from '@react-three/drei';
import SpinningCube from './SpinningCube';
import WebsiteModel from './WebsiteModel';

const ThreeScene = () => {
  // Check if WebsiteModel can be loaded
  const modelAvailable = () => {
    try {
      useGLTF('/laptop.glb');
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <Canvas style={{ height: '500px' }} camera={{ position: [0, 0, 5], fov: 50 }}>
      {/* Adds overall lighting to the scene */}
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Add stars background for dark theme */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Controls for interactive 3D movement */}
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          <Suspense fallback={null}>
            {modelAvailable() ? (
              <WebsiteModel />
            ) : (
              /* Fallback spinning cubes with gradient colors matching dark theme */
              <group position={[0, 0, 0]}>
                <SpinningCube position={[-2, 0, 0]} scale={[0.7, 0.7, 0.7]} color="#8a2be2" /> {/* Purple */}
                <SpinningCube position={[0, 0, 0]} scale={[1, 1, 1]} color="#00bfff" /> {/* Blue */}
                <SpinningCube position={[2, 0, 0]} scale={[0.7, 0.7, 0.7]} color="#ff4500" /> {/* Orange-red */}
              </group>
            )}
          </Suspense>
        </Float>
      </PresentationControls>
      
      {/* Environment lighting creates realistic reflections */}
      <Environment preset="night" />
    </Canvas>
  );
};

export default ThreeScene;