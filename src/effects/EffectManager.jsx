import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useJourneyStore } from '../state/useJourneyStore';

const AURORA_COLORS = [
  '#D4AF6A', // Warm Gold
  '#8FB39B', // Sage Emerald
  '#4C8C86', // Steel Teal
  '#7C6A9C', // Ethereal Violet
  '#7FA7C4', // Ice Blue
  '#E8A857', // Amber Glow
];

export default function EffectManager() {
  const activeEffect = useJourneyStore((state) => state.activeEffect);
  const clearActiveEffect = useJourneyStore((state) => state.clearActiveEffect);
  
  const flashLightRef = useRef();
  const shockwaveRef = useRef();
  const particlesRef = useRef();
  const petalsGroupRef = useRef();

  // 1. STARDUST PARTICLES (Wider horizontal spread for wide laptop monitors)
  const particleCount = 75;
  const particlePositions = useRef(new Float32Array(particleCount * 3));
  const particleVelocities = useRef(
    Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 8.5, // Wide horizontal eruption
      y: (Math.random() - 0.5) * 6.5,
      z: (Math.random() - 0.5) * 3,
    }))
  );

  // 2. COSMIC AURORA FLOWER PETALS (Flutters outward past the card edges)
  const petalCount = 16;
  const petalData = useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => ({
      color: AURORA_COLORS[i % AURORA_COLORS.length],
      vx: (Math.random() - 0.5) * 7.0, // Flings wide past the card!
      vy: (Math.random() - 0.5) * 5.5,
      vz: (Math.random() - 0.5) * 2.5,
      rotX: Math.random() * 4 + 1,
      rotY: Math.random() * 4 + 1,
      rotZ: Math.random() * 3 + 1,
      scale: Math.random() * 0.5 + 0.9,
    }));
  }, []);

  const petalsRefs = useRef([]);

  useEffect(() => {
    if (!activeEffect) return;

    const effectId = activeEffect.id;

    // 1. RADIANT WORLD LIGHT FLASH
    if (flashLightRef.current) {
      gsap.fromTo(
        flashLightRef.current,
        { intensity: 0 },
        {
          intensity: effectId === 'cinematic_beat' ? 4.0 : 2.6,
          duration: 0.35,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        }
      );
    }

    // 2. EXPANDING SHOCKWAVE RING
    if (shockwaveRef.current) {
      shockwaveRef.current.scale.set(0.2, 0.2, 0.2);
      shockwaveRef.current.visible = true;
      gsap.fromTo(
        shockwaveRef.current.material,
        { opacity: 0.85 },
        {
          opacity: 0,
          duration: 1.1,
          ease: 'power2.out',
          onComplete: () => {
            if (shockwaveRef.current) shockwaveRef.current.visible = false;
          },
        }
      );
      gsap.to(shockwaveRef.current.scale, {
        x: effectId === 'cinematic_beat' ? 7.5 : 5.5,
        y: effectId === 'cinematic_beat' ? 7.5 : 5.5,
        z: effectId === 'cinematic_beat' ? 7.5 : 5.5,
        duration: 1.1,
        ease: 'power2.out',
      });
    }

    // 3. STARDUST BURST
    if (particlesRef.current) {
      for (let i = 0; i < particleCount; i++) {
        particlePositions.current[i * 3] = 0;
        particlePositions.current[i * 3 + 1] = 0;
        particlePositions.current[i * 3 + 2] = -0.1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.visible = true;

      gsap.fromTo(
        particlesRef.current.material,
        { opacity: 1 },
        {
          opacity: 0,
          duration: 1.2,
          ease: 'power2.out',
          onComplete: () => {
            if (particlesRef.current) particlesRef.current.visible = false;
          },
        }
      );
    }

    // 4. BLOOMING AURORA PETALS
    if (petalsGroupRef.current) {
      petalsGroupRef.current.visible = true;
      petalData.forEach((p, i) => {
        const mesh = petalsRefs.current[i];
        if (!mesh) return;

        mesh.position.set(0, 0, -0.1);
        mesh.scale.set(0, 0, 0);

        gsap.to(mesh.scale, {
          x: p.scale,
          y: p.scale,
          z: p.scale,
          duration: 0.35,
          ease: 'back.out(2)',
        });

        gsap.fromTo(
          mesh.material,
          { opacity: 0.95 },
          {
            opacity: 0,
            duration: 1.3,
            ease: 'power2.out',
            onComplete: () => {
              if (i === petalCount - 1 && petalsGroupRef.current) {
                petalsGroupRef.current.visible = false;
              }
            },
          }
        );
      });
    }

    const timer = setTimeout(() => {
      clearActiveEffect();
    }, 1400);

    return () => clearTimeout(timer);
  }, [activeEffect, petalData]);

  useFrame((_, delta) => {
    // Stardust physics
    if (particlesRef.current && particlesRef.current.visible) {
      const positions = particlePositions.current;
      const vels = particleVelocities.current;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += vels[i].x * delta * 2.2;
        positions[i * 3 + 1] += vels[i].y * delta * 2.2;
        positions[i * 3 + 2] += vels[i].z * delta * 2.2;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Fluttering Petals physics
    if (petalsGroupRef.current && petalsGroupRef.current.visible) {
      petalData.forEach((p, i) => {
        const mesh = petalsRefs.current[i];
        if (!mesh) return;

        mesh.position.x += p.vx * delta * 2.0;
        mesh.position.y += p.vy * delta * 2.0;
        mesh.position.z += p.vz * delta * 2.0;

        mesh.rotation.x += p.rotX * delta * 2.5;
        mesh.rotation.y += p.rotY * delta * 2.5;
        mesh.rotation.z += p.rotZ * delta * 2.5;
      });
    }
  });

  return (
    <group>
      {/* Radiant World Light */}
      <ambientLight
        ref={flashLightRef}
        intensity={0}
        color={activeEffect?.color || '#E8A857'}
      />

      {/* Expanding Shockwave */}
      <mesh ref={shockwaveRef} position={[0, 0, -0.5]} visible={false}>
        <ringGeometry args={[0.5, 0.7, 64]} />
        <meshBasicMaterial
          color={activeEffect?.color || '#E8A857'}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Stardust */}
      <points ref={particlesRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          color={activeEffect?.color || '#E8A857'}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Cosmic Aurora Petals */}
      <group ref={petalsGroupRef} visible={false}>
        {petalData.map((p, i) => (
          <mesh
            key={i}
            ref={(el) => (petalsRefs.current[i] = el)}
            scale={[0.8, 1.5, 0.25]}
          >
            <coneGeometry args={[0.18, 0.5, 4]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.8}
              roughness={0.15}
              metalness={0.8}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}