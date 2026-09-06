import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';

export default function ThresholdsScene() {
  const gateRef = useRef();

  useFrame((_, delta) => {
    if (gateRef.current) gateRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group>
      <Sparkles count={90} scale={12} size={2.5} speed={0.4} color="#8FB39B" opacity={0.6} />

      {/* 1. Luminous Gate of Trust (Top-Right) */}
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.7}>
        <group ref={gateRef} position={[1.4, 2.0, -1]}>
          <mesh>
            <torusGeometry args={[0.85, 0.08, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#8FB39B" emissive="#8FB39B" emissiveIntensity={0.7} />
          </mesh>
          <pointLight color="#8FB39B" intensity={2} distance={7} />
        </group>
      </Float>

      {/* 2. Soft Threshold Lantern (Bottom-Left) */}
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[-1.4, -2.1, -1]}>
          <mesh>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial color="#D4AF6A" emissive="#D4AF6A" emissiveIntensity={0.5} />
          </mesh>
          <pointLight color="#D4AF6A" intensity={1.5} distance={6} />
        </group>
      </Float>

      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={1.2} color="#8FB39B" />
    </group>
  );
}