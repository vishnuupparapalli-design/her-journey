import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function BuildingScene() {
  const clusterRef = useRef();

  useFrame((_, delta) => {
    if (clusterRef.current) clusterRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group>
      {/* 1. Assembling Skyline Core (Top-Right) */}
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.7}>
        <group ref={clusterRef} position={[1.4, 2.0, -1]}>
          {/* Assembled Architectural Tower */}
          <mesh position={[-0.3, 0, 0]}>
            <boxGeometry args={[0.4, 1.2, 0.4]} />
            <meshStandardMaterial color="#D4AF6A" emissive="#D4AF6A" emissiveIntensity={0.4} roughness={0.3} />
          </mesh>
          {/* Second Tower */}
          <mesh position={[0.3, -0.2, 0]}>
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial color="#E8A857" emissive="#E8A857" emissiveIntensity={0.3} roughness={0.3} />
          </mesh>
          {/* Crown Jewel */}
          <mesh position={[0, 0.8, 0]}>
            <coneGeometry args={[0.25, 0.5, 4]} />
            <meshStandardMaterial color="#EDEAE0" emissive="#EDEAE0" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#D4AF6A" intensity={2} distance={7} />
        </group>
      </Float>

      {/* 2. Unfinished Plot Keystone (Bottom-Left) */}
      <Float speed={1.7} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-1.4, -2.1, -1]}>
          <mesh>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color="#D4AF6A" emissive="#D4AF6A" emissiveIntensity={0.5} wireframe={true} />
          </mesh>
          <pointLight color="#D4AF6A" intensity={1.5} distance={6} />
        </group>
      </Float>

      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} color="#D4AF6A" />
    </group>
  );
}