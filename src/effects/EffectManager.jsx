import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useJourneyStore } from '../state/useJourneyStore';

// Curated Cosmic Aurora Palette
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

  // 1. STARDUST BURST PARTICLES (60 points)
  const particleCount = 60;
  const particlePositions = useRef(new Float32Array(particleCount * 3));
  const particleVelocities = useRef(
    Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 4.5,
      y: (Math.random() - 0.5) * 4.5,
      z: (Math.random() - 0.5) * 2.5,
    }))
  );

  // 2. COSMIC AURORA FLOWER PETALS (14 floating blooming petals)
  const petalCount = 14;
  const petalData = useMemo(() => {
    return Array.from({ length: petalCount }, (_, i) => ({
      color: AURORA_COLORS[i % AURORA_COLORS.length],
      vx: (Math.random() - 0.5) * 3.2,
      vy: Math.random() * 2.5 + 0.5, // Float gently upward and outward
      vz: (Math.random() - 0.5) * 2,
      rotX: Math.random() * 3 + 1,
      rotY: Math.random() * 3 + 1,
      rotZ: Math.random() * 2 + 1,
      scale: Math.random() * 0.4 + 0.8,
    }));
  }, []);

  const petalsRefs = useRef([]);

  useEffect(() => {
    if (!activeEffect) return;

    const effectId = activeEffect.id;

    // 1. RADIANT UNIVERSE LIGHT FLASH
    if (flashLightRef.current) {
      gsap.fromTo(
        flashLightRef.current,
        { intensity: 0 },
        {
          intensity: effectId === 'cinematic_beat' ? 3.8 : 2.4,
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
        { opacity: 0.8 },
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
        x: effectId === 'cinematic_beat' ? 6 : 4,
        y: effectId === 'cinematic_beat' ? 6 : 4,
        z: effectId === 'cinematic_beat' ? 6 : 4,
        duration: 1.1,
        ease: 'power2.out',
      });
    }

    // 3. STARDUST BURST
    if (particlesRef.current) {
      for (let i = 0; i < particleCount; i++) {
        particlePositions.current[i * 3] = 0;
        particlePositions.current[i * 3 + 1] = 0;
        particlePositions.current[i * 3 + 2] = -0.2;
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

    // 4. BLOOMING AURORA FLOWER PETALS
    if (petalsGroupRef.current) {
      petalsGroupRef.current.visible = true;
      petalData.forEach((p, i) => {
        const mesh = petalsRefs.current[i];
        if (!mesh) return;

        mesh.position.set(0, 0, -0.1);
        mesh.scale.set(0, 0, 0);

        // Pop open and scale up
        gsap.to(mesh.scale, {
          x: p.scale,
          y: p.scale,
          z: p.scale,
          duration: 0.35,
          ease: 'back.out(2)',
        });

        // Fade out gently as they flutter away
        gsap.fromTo(
          mesh.material,
          { opacity: 0.9 },
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

  // Update physics for stardust & fluttering flower petals
  useFrame((_, delta) => {
    // Animate Stardust
    if (particlesRef.current && particlesRef.current.visible) {
      const positions = particlePositions.current;
      const vels = particleVelocities.current;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += vels[i].x * delta * 2;
        positions[i * 3 + 1] += vels[i].y * delta * 2;
        positions[i * 3 + 2] += vels[i].z * delta * 2;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Fluttering Petals (gentle tumble and sway)
    if (petalsGroupRef.current && petalsGroupRef.current.visible) {
      petalData.forEach((p, i) => {
        const mesh = petalsRefs.current[i];
        if (!mesh) return;

        mesh.position.x += p.vx * delta * 1.8;
        mesh.position.y += p.vy * delta * 1.8;
        mesh.position.z += p.vz * delta * 1.8;

        mesh.rotation.x += p.rotX * delta * 2;
        mesh.rotation.y += p.rotY * delta * 2;
        mesh.rotation.z += p.rotZ * delta * 2;
      });
    }
  });

  return (
    <group>
      {/* 1. Radiant Light Pulse */}
      <ambientLight
        ref={flashLightRef}
        intensity={0}
        color={activeEffect?.color || '#E8A857'}
      />

      {/* 2. Expanding Starlight Shockwave */}
      <mesh ref={shockwaveRef} position={[0, 0, -0.5]} visible={false}>
        <ringGeometry args={[0.5, 0.7, 64]} />
        <meshBasicMaterial
          color={activeEffect?.color || '#E8A857'}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Stardust Cloud */}
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
          size={0.22}
          color={activeEffect?.color || '#E8A857'}
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 4. Cosmic Aurora Blooming Petals */}
      <group ref={petalsGroupRef} visible={false}>
        {petalData.map((p, i) => (
          <mesh
            key={i}
            ref={(el) => (petalsRefs.current[i] = el)}
            scale={[0.7, 1.4, 0.2]} // Graceful organic petal shape
          >
            <coneGeometry args={[0.16, 0.45, 4]} />
            <meshStandardMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={0.65}
              roughness={0.2}
              metalness={0.7}
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