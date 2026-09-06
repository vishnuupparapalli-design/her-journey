import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';

export default function ArrivalScene() {
  const coreRef = useRef();
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25;
      coreRef.current.rotation.x += delta * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.1;
      ringRef.current.rotation.x -= delta * 0.05;
    }
  });

  return (
    <group>
      {/* 1. Deep Twinkling Starfield */}
      <Stars
        radius={60}
        depth={50}
        count={3000}
        factor={5}
        saturation={0}
        fade
        speed={1.2}
      />

      {/* 2. Floating Golden Celestial Polyhedron (Right Side of Card) */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1.5}>
        <group position={[2.8, 0.6, 0]}>
          {/* Glowing Outer Wireframe Ring */}
          <mesh ref={ringRef}>
            <torusGeometry args={[1.3, 0.03, 16, 64]} />
            <meshStandardMaterial
              color="#E8A857"
              emissive="#E8A857"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Central Rotating Core */}
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial
              color="#E8A857"
              emissive="#E8A857"
              emissiveIntensity={0.6}
              roughness={0.1}
              metalness={0.9}
              wireframe={true}
            />
          </mesh>

          {/* Point light emitting from the beacon itself */}
          <pointLight color="#E8A857" intensity={2} distance={8} />
        </group>
      </Float>

      {/* 3. Smaller Companion Satellite (Left Side of Card) */}
      <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1}>
        <group position={[-2.8, -0.6, 0]}>
          <mesh>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color="#7C6A9C"
              emissive="#7C6A9C"
              emissiveIntensity={0.7}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          <pointLight color="#7C6A9C" intensity={1.5} distance={6} />
        </group>
      </Float>

      {/* Ambient Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#EDEAE0" />
    </group>
  );
}