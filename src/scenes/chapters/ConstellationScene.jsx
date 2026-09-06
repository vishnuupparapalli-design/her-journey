import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';

export default function ConstellationScene() {
  const constellationRef = useRef();

  useFrame((_, delta) => {
    if (constellationRef.current) {
      constellationRef.current.rotation.y += delta * 0.08;
      constellationRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group>
      {/* Quiet Starfield */}
      <Stars radius={60} count={2000} factor={4} fade speed={0.8} />

      {/* Floating Constellation Figure (Top-Right) */}
      <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.7}>
        <group ref={constellationRef} position={[1.4, 2.0, -1]}>
          {/* Star Nodes */}
          {[
            [0, 0.7, 0],
            [-0.6, 0, 0],
            [0.6, 0, 0],
            [0, -0.7, 0],
          ].map((pos, idx) => (
            <mesh key={idx} position={pos}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color="#EDEAE0" />
            </mesh>
          ))}

          {/* Glowing Constellation Diamond Lines */}
          <mesh>
            <octahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial
              color="#EDEAE0"
              emissive="#EDEAE0"
              emissiveIntensity={0.8}
              wireframe={true}
            />
          </mesh>
          <pointLight color="#EDEAE0" intensity={2} distance={7} />
        </group>
      </Float>

      {/* Second Solitary Star Node (Bottom-Left) */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group position={[-1.4, -2.1, -1]}>
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color="#EDEAE0" />
          </mesh>
          <pointLight color="#EDEAE0" intensity={1.5} distance={6} />
        </group>
      </Float>

      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 4, 4]} intensity={1} color="#EDEAE0" />
    </group>
  );
}