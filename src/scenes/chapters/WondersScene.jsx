import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

export default function WondersScene() {
  const gardenRef = useRef();

  useFrame((_, delta) => {
    if (gardenRef.current) gardenRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group>
      {/* 1. Drifting Glowing Fireflies */}
      <Sparkles count={120} scale={14} size={3} speed={0.4} color="#8FB39B" opacity={0.7} />

      {/* 2. Floating Bioluminescent Flora (Top-Right) */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[1.5, 2.0, -1]}>
          {/* Glowing Blossom Center */}
          <mesh>
            <sphereGeometry args={[0.45, 16, 16]} />
            <meshStandardMaterial color="#D4AF6A" emissive="#D4AF6A" emissiveIntensity={0.8} />
          </mesh>
          {/* Outer Petals */}
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 5]}>
              <coneGeometry args={[0.2, 0.9, 4]} />
              <meshStandardMaterial color="#8FB39B" emissive="#8FB39B" emissiveIntensity={0.3} roughness={0.3} />
            </mesh>
          ))}
          <pointLight color="#D4AF6A" intensity={2} distance={7} />
        </group>
      </Float>

      {/* 3. Sprouting Flora Bud (Bottom-Left) */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-1.5, -2.1, -1]}>
          <mesh>
            <dodecahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial color="#8FB39B" emissive="#8FB39B" emissiveIntensity={0.6} roughness={0.2} />
          </mesh>
          <pointLight color="#8FB39B" intensity={1.5} distance={6} />
        </group>
      </Float>

      {/* Warm Garden Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 3]} intensity={1.5} color="#8FB39B" />
      <pointLight position={[-4, -2, -2]} intensity={0.8} color="#D4AF6A" />
    </group>
  );
}