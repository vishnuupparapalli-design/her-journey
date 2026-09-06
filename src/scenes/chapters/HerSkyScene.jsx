import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useJourneyStore } from '../../state/useJourneyStore';

export default function HerSkyScene() {
  const crystalRef = useRef();
  const dreamCoreRef = useRef();
  const personalization = useJourneyStore((state) => state.personalization);

  useFrame((state, delta) => {
    if (crystalRef.current) crystalRef.current.rotation.y += delta * 0.15;
    if (dreamCoreRef.current) {
      const t = state.clock.getElapsedTime();
      dreamCoreRef.current.rotation.z += delta * 0.2;
      dreamCoreRef.current.position.y = 2.1 + Math.sin(t * 1.2) * 0.15;
    }
  });

  const hasDream = Boolean(personalization?.chosenDream);

  return (
    <group>
      <Sparkles count={110} scale={14} size={3} speed={0.5} color="#B77B4A" opacity={0.7} />

      {/* 1. Her Solo Floating Sanctuary (Top-Right) */}
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.8}>
        <group position={[1.5, 2.0, -1]}>
          <mesh>
            <cylinderGeometry args={[0.9, 0.4, 0.35, 6]} />
            <meshStandardMaterial color="#B77B4A" emissive="#B77B4A" emissiveIntensity={0.35} roughness={0.3} />
          </mesh>
          <mesh ref={crystalRef} position={[0, 0.6, 0]}>
            <octahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial color="#E8A857" emissive="#E8A857" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#E8A857" intensity={2.2} distance={8} />
        </group>
      </Float>

      {/* 2. PERSONALIZED CELESTIAL DREAM CRYSTAL (Floats Top-Left if she shared a dream) */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
        <group ref={dreamCoreRef} position={[-1.6, 2.1, -1]}>
          <mesh>
            <icosahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial
              color={hasDream ? '#D4AF6A' : '#7FA7C4'}
              emissive={hasDream ? '#D4AF6A' : '#7FA7C4'}
              emissiveIntensity={hasDream ? 0.9 : 0.4}
              wireframe={true}
            />
          </mesh>
          <pointLight
            color={hasDream ? '#D4AF6A' : '#7FA7C4'}
            intensity={hasDream ? 2.5 : 1.2}
            distance={7}
          />
        </group>
      </Float>

      {/* 3. Morning Star Stone (Bottom-Left) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
        <group position={[-1.5, -2.1, -1]}>
          <mesh>
            <dodecahedronGeometry args={[0.45, 0]} />
            <meshStandardMaterial color="#EDEAE0" emissive="#B77B4A" emissiveIntensity={0.5} />
          </mesh>
          <pointLight color="#B77B4A" intensity={1.5} distance={6} />
        </group>
      </Float>

      <ambientLight intensity={0.6} />
      <directionalLight position={[0, 6, 4]} intensity={1.5} color="#EDEAE0" />
    </group>
  );
}