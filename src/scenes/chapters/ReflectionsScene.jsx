import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function ReflectionsScene() {
  const crystalLeft = useRef();
  const crystalRight = useRef();

  useFrame((_, delta) => {
    if (crystalLeft.current) crystalLeft.current.rotation.y += delta * 0.2;
    if (crystalRight.current) crystalRight.current.rotation.y -= delta * 0.15;
  });

  return (
    <group>
      {/* 1. Reflective Water Floor */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0B0E1A"
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* 2. Floating Silver Prism (Left Side) */}
      <Float speed={2} rotationIntensity={0.7} floatIntensity={1.2}>
        <group position={[-2.9, 0.5, 0]}>
          <mesh ref={crystalLeft}>
            <octahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial
              color="#7FA7C4"
              emissive="#7FA7C4"
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
          <pointLight color="#7FA7C4" intensity={2} distance={8} />
        </group>
      </Float>

      {/* 3. Floating Sage Crystal (Right Side) */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[2.9, -0.3, 0]}>
          <mesh ref={crystalRight}>
            <coneGeometry args={[0.7, 1.8, 5]} />
            <meshStandardMaterial
              color="#8FB39B"
              emissive="#8FB39B"
              emissiveIntensity={0.4}
              roughness={0.15}
              metalness={0.85}
            />
          </mesh>
          <pointLight color="#8FB39B" intensity={1.8} distance={8} />
        </group>
      </Float>

      {/* Ambient Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 6, 2]} intensity={1} color="#EDEAE0" />
    </group>
  );
}