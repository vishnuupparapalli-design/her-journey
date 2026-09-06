import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

export default function WeatheringScene() {
  const stormLightRef = useRef();

  // Gentle storm flicker softening into calm
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (stormLightRef.current) {
      stormLightRef.current.intensity = 1.4 + Math.sin(t * 3) * 0.4;
    }
  });

  return (
    <group>
      {/* 1. The Calming Sea Surface */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[45, 45, 24, 24]} />
        <meshStandardMaterial
          color="#0B0E1A"
          emissive="#4C8C86"
          emissiveIntensity={0.3}
          roughness={0.2}
          wireframe={true}
        />
      </mesh>

      {/* 2. Clearing Horizon Beacon (Top-Right) */}
      <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
        <group position={[1.5, 2.0, -1]}>
          <mesh>
            <octahedronGeometry args={[0.7, 1]} />
            <meshStandardMaterial color="#4C8C86" emissive="#4C8C86" emissiveIntensity={0.6} />
          </mesh>
          <pointLight ref={stormLightRef} color="#4C8C86" intensity={1.8} distance={8} />
        </group>
      </Float>

      {/* 3. Sunrise Dawn Mote (Bottom-Left) */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-1.5, -2.1, -1]}>
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#E8A857" emissive="#E8A857" emissiveIntensity={0.6} />
          </mesh>
          <pointLight color="#E8A857" intensity={1.8} distance={7} />
        </group>
      </Float>

      <ambientLight intensity={0.3} />
      <directionalLight position={[0, 4, 2]} intensity={1.0} color="#7FA7C4" />
    </group>
  );
}