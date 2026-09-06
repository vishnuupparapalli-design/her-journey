import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function HorizonsScene() {
  const archRef = useRef();

  useFrame((_, delta) => {
    if (archRef.current) archRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      {/* 1. Golden Horizon Island (Top-Right) */}
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.8}>
        <group position={[1.5, 2.1, -1.5]}>
          {/* Island Landmass */}
          <mesh rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[1.1, 0.3, 0.4, 6]} />
            <meshStandardMaterial color="#E8A857" emissive="#E8A857" emissiveIntensity={0.25} roughness={0.4} />
          </mesh>
          {/* Crystal Monolith */}
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[0.25, 0.9, 4]} />
            <meshStandardMaterial color="#EDEAE0" emissive="#D4AF6A" emissiveIntensity={0.5} />
          </mesh>
          <pointLight color="#E8A857" intensity={2} distance={8} />
        </group>
      </Float>

      {/* 2. Distant Horizon Arch (Bottom-Left) */}
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-1.5, -2.1, -1]}>
          <mesh ref={archRef}>
            <torusGeometry args={[0.75, 0.08, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#D4AF6A" emissive="#D4AF6A" emissiveIntensity={0.7} />
          </mesh>
          <pointLight color="#D4AF6A" intensity={1.5} distance={6} />
        </group>
      </Float>

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 4, 4]} intensity={1.4} color="#E8A857" />
    </group>
  );
}