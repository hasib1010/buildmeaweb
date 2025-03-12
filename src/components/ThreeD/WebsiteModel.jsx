'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const WebsiteModel = (props) => {
  // This will attempt to load the GLB file if it exists
  // If you don't have a real model yet, use the fallback logic in the component
  try {
    const { nodes, materials } = useGLTF('/laptop.glb');
    const meshRef = useRef();
    
    // Animate the 3D model
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      }
    });

    return (
      <group {...props} dispose={null}>
        <mesh
          ref={meshRef}
          geometry={nodes.Laptop.geometry}
          material={materials.LaptopMaterial}
          scale={[1.2, 1.2, 1.2]}
          position={[0, -1, 0]}
        />
      </group>
    );
  } catch (error) {
    console.log('Model not loaded, using fallback');
    return null; // Return null as the fallback will be handled in ThreeScene
  }
};

export default WebsiteModel;