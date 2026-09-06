import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';

export default function DistanceScene() {
  const bridgeRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bridgeRef.current) {
      bridgeRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 1.5) * 0.2;
    }
  });

  return (
    <group>
      <Stars radius={70} count={2800} factor={4} fade speed={1} />

      {/* 1. Her Island (Top-Right) */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[1.8, 2.0, -1]}>
          <mesh>
            <sphereGeometry args={[0.65, 24, 24]} />
            <meshStandardMaterial color="#E8A857" emissive="#E8A857" emissiveIntensity={0.4} />
          </mesh>
          <pointLight color="#E8A857" intensity={2} distance={7} />
        </group>
      </Float>

      {/* 2. Your Island (Bottom-Left) */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <group position={[-1.8, -2.1, -1]}>
          <mesh>
            <sphereGeometry args={[0.65, 24, 24]} />
            <meshStandardMaterial color="#7FA7C4" emissive="#7FA7C4" emissiveIntensity={0.4} />
          </mesh>
          <pointLight color="#7FA7C4" intensity={2} distance={7} />
        </group>
      </Float>

      {/* 3. Glowing Bridge of Light Connecting Across Space */}
      <mesh ref={bridgeRef} position={[0, 0, -1.2]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 6.0, 16]} />
        <meshStandardMaterial
          color="#EDEAE0"
          emissive="#EDEAE0"
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>

      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 4, 3]} intensity={1.2} color="#EDEAE0" />
    </group>
  );
}