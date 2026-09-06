import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

export default function TidesScene() {
  const waterRef = useRef();

  // Oceanic tide breathing motion
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      waterRef.current.position.y = -2.6 + Math.sin(t * 0.8) * 0.15;
      waterRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
    }
  });

  return (
    <group>
      {/* Bioluminescent Sea Foam Particles */}
      <Sparkles count={100} scale={14} size={3} speed={0.6} color="#4C8C86" opacity={0.7} />

      {/* 1. Breathing Ocean Surface */}
      <mesh ref={waterRef} position={[0, -2.6, 0]} rotation={[-Math.PI / 2.2, 0, 0]}>
        <planeGeometry args={[45, 30, 32, 32]} />
        <meshStandardMaterial
          color="#0B0E1A"
          emissive="#4C8C86"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </mesh>

      {/* 2. Floating Teal Tidal Pearl (Top-Right) */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[1.5, 2.0, -1]}>
          <mesh>
            <sphereGeometry args={[0.65, 32, 32]} />
            <meshStandardMaterial
              color="#4C8C86"
              emissive="#4C8C86"
              emissiveIntensity={0.6}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <pointLight color="#4C8C86" intensity={2} distance={8} />
        </group>
      </Float>

      <ambientLight intensity={0.4} />
      <directionalLight position={[-3, 5, 2]} intensity={1.2} color="#7FA7C4" />
    </group>
  );
}