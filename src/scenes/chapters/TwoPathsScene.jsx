import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function TwoPathsScene() {
  const pathLeft = useRef();
  const pathRight = useRef();

  useFrame((_, delta) => {
    if (pathLeft.current) pathLeft.current.rotation.y += delta * 0.1;
    if (pathRight.current) pathRight.current.rotation.y -= delta * 0.1;
  });

  return (
    <group>
      {/* 1. Left Path Ribbon (Dusty Violet) */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[-1.4, 2.0, -1]}>
          <mesh ref={pathLeft}>
            <torusGeometry args={[0.7, 0.08, 16, 32, Math.PI * 1.5]} />
            <meshStandardMaterial
              color="#7C6A9C"
              emissive="#7C6A9C"
              emissiveIntensity={0.7}
              roughness={0.3}
            />
          </mesh>
          <pointLight color="#7C6A9C" intensity={2} distance={7} />
        </group>
      </Float>

      {/* 2. Right Path Ribbon (Warm Gold) */}
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.7}>
        <group position={[1.4, -2.1, -1]}>
          <mesh ref={pathRight}>
            <torusGeometry args={[0.7, 0.08, 16, 32, Math.PI * 1.5]} />
            <meshStandardMaterial
              color="#D4AF6A"
              emissive="#D4AF6A"
              emissiveIntensity={0.7}
              roughness={0.3}
            />
          </mesh>
          <pointLight color="#D4AF6A" intensity={2} distance={7} />
        </group>
      </Float>

      {/* Horizon Split Plane */}
      <mesh position={[0, -2.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0B0E1A" roughness={0.3} metalness={0.7} />
      </mesh>

      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 5, 3]} intensity={1.2} color="#EDEAE0" />
    </group>
  );
}