import React from 'react';
import { Float, Sparkles } from '@react-three/drei';

export default function UsSoFarScene() {
  return (
    <group>
      {/* Warm Nostalgic Memory Motes */}
      <Sparkles count={80} scale={12} size={2.5} speed={0.3} color="#E8A857" opacity={0.6} />

      {/* 1. Golden Memory Orb (Top-Right) */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <group position={[1.4, 2.0, -1]}>
          <mesh>
            <sphereGeometry args={[0.7, 32, 32]} />
            <meshStandardMaterial
              color="#D4AF6A"
              emissive="#D4AF6A"
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
          <pointLight color="#D4AF6A" intensity={2.2} distance={8} />
        </group>
      </Float>

      {/* 2. Cozy Ember Lantern (Bottom-Left) */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <group position={[-1.4, -2.1, -1]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.45, 0.9, 6]} />
            <meshStandardMaterial
              color="#B77B4A"
              emissive="#B77B4A"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
          <pointLight color="#B77B4A" intensity={1.8} distance={7} />
        </group>
      </Float>

      {/* Warm Ambient Hearth Tone */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} color="#D4AF6A" />
    </group>
  );
}