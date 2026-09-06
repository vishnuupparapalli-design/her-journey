import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. Shooting Stars (Meteors)
function ShootingStars() {
  const starsRef = useRef([]);
  const starCount = 3;

  const data = useMemo(() => {
    return Array.from({ length: starCount }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: Math.random() * 6 + 4,
      z: (Math.random() - 0.5) * 6 - 2,
      speed: Math.random() * 10 + 9,
      delay: Math.random() * 3,
      timer: 0,
    }));
  }, []);

  useFrame((_, delta) => {
    data.forEach((star, i) => {
      const mesh = starsRef.current[i];
      if (!mesh) return;

      star.timer += delta;
      if (star.timer < star.delay) {
        mesh.visible = false;
        return;
      }

      mesh.visible = true;
      star.x -= delta * star.speed;
      star.y -= delta * (star.speed * 0.6);
      mesh.position.set(star.x, star.y, star.z);

      if (star.y < -8 || star.x < -12) {
        star.x = Math.random() * 8 + 5;
        star.y = Math.random() * 5 + 5;
        star.timer = 0;
        star.delay = Math.random() * 5 + 2;
      }
    });
  });

  return (
    <group>
      {data.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (starsRef.current[i] = el)}
          rotation={[0, 0, Math.PI / 5]}
        >
          <cylinderGeometry args={[0.02, 0.07, 2.2, 8]} />
          <meshBasicMaterial color="#EDEAE0" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 2. Swirling Milky Way Galactic Dust
function MilkyWayGalaxy() {
  const pointsRef = useRef();
  const count = 1200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorInside = new THREE.Color('#E8A857');
    const colorOutside = new THREE.Color('#7C6A9C');

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 2) * 15 + 1;
      const spinAngle = r * 0.8;
      const branchAngle = ((i % 2) * Math.PI);

      const randomX = (Math.random() - 0.5) * (r * 0.3);
      const randomY = (Math.random() - 0.5) * 1.5;
      const randomZ = (Math.random() - 0.5) * (r * 0.3);

      pos[i * 3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      pos[i * 3 + 1] = randomY;
      pos[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ - 5;

      const mixedColor = colorInside.clone().lerp(colorOutside, r / 15);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.z += delta * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// 3. Majestic Ringed Planet (Framing the Top-Right)
function RingedPlanet() {
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.06;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group position={[1.4, 2.1, -1.5]}>
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#D4AF6A"
            roughness={0.55}
            metalness={0.2}
            emissive="#E8A857"
            emissiveIntensity={0.2}
          />
        </mesh>

        <mesh ref={ringRef} rotation={[-Math.PI / 3, 0.4, 0]}>
          <ringGeometry args={[1.25, 2.1, 64]} />
          <meshStandardMaterial
            color="#E8A857"
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
            roughness={0.3}
            metalness={0.3}
          />
        </mesh>

        <pointLight color="#E8A857" intensity={2} distance={7} />
      </group>
    </Float>
  );
}

// 4. Distant Moon (Framing the Bottom-Left)
function DistantMoon() {
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
      <group position={[-1.4, -2.2, -1]}>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshStandardMaterial
            color="#7FA7C4"
            roughness={0.8}
            metalness={0.1}
            emissive="#7FA7C4"
            emissiveIntensity={0.3}
          />
        </mesh>
        <pointLight color="#7FA7C4" intensity={1.5} distance={6} />
      </group>
    </Float>
  );
}

// Master Scene
export default function ArrivalScene() {
  return (
    <group>
      {/* 1. Deep Twinkling Stars */}
      <Stars
        radius={70}
        depth={60}
        count={3500}
        factor={5}
        saturation={0}
        fade
        speed={1.2}
      />

      {/* 2. Swirling Galaxy Dust */}
      <MilkyWayGalaxy />

      {/* 3. Real Shooting Stars */}
      <ShootingStars />

      {/* 4. Ringed Planet */}
      <RingedPlanet />

      {/* 5. Moon */}
      <DistantMoon />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 4]} intensity={1.2} color="#EDEAE0" />
    </group>
  );
}