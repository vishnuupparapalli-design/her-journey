import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';

export default function WhatsAheadScene() {
  const sunRef = useRef();

  useFrame((_, delta) => {
    if (sunRef.current) sunRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group>
      {/* Soft Fading Stardust of all 13 past worlds */}
      <Stars radius={60} count={1500} factor={3} fade speed={0.6} />
      <Sparkles count={120} scale={14} size={3} speed={0.4} color="#E8A857" opacity={0.7} />

      {/* 1. Rising Golden Dawn Sun (Top-Right) */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <group ref={sunRef} position={[1.4, 2.0, -1]}>
          <mesh>
            <sphereGeometry args={[0.85, 32, 32]} />
            <meshStandardMaterial
              color="#E8A857"
              emissive="#E8A857"
              emissiveIntensity={0.7}
              roughness={0.2}
            />
          </mesh>
          <pointLight color="#E8A857" intensity={2.5} distance={10} />
        </group>
      </Float>

      {/* 2. Morning Petal of Hope (Bottom-Left) */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[-1.4, -2.1, -1]}>
          <mesh>
            <dodecahedronGeometry args={[0.55, 0]} />
            <meshStandardMaterial
              color="#EDEAE0"
              emissive="#D4AF6A"
              emissiveIntensity={0.6}
            />
          </mesh>
          <pointLight color="#D4AF6A" intensity={1.8} distance={7} />
        </group>
      </Float>

      {/* Warm Golden Sunrise Horizon */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 6, 4]} intensity={1.6} color="#E8A857" />
    </group>
  );
}