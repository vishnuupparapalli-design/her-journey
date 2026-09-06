import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useJourneyStore } from '../state/useJourneyStore';

export default function CameraRig({ chapterOrder = 1, reducedMotion = false }) {
  const { camera, pointer, viewport } = useThree();
  const vec = useRef(new THREE.Vector3());
  const activeEffect = useJourneyStore((state) => state.activeEffect);

  useFrame((state, delta) => {
    const isPhone = viewport.aspect < 1;

    // Base camera distance
    let baseZ = isPhone ? 9.8 : 7.0;
    if (chapterOrder === 2) {
      baseZ = isPhone ? 9.0 : 6.5;
    }

    // If reduced motion is requested, keep camera calm and centered
    if (reducedMotion) {
      vec.current.set(0, 0, baseZ);
      camera.position.lerp(vec.current, delta * 2.0);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Subtle breathing drift
    const t = state.clock.getElapsedTime();
    const breathX = Math.sin(t * 0.35) * 0.2;
    const breathY = Math.cos(t * 0.25) * 0.15;

    // Parallax
    const targetX = pointer.x * 0.5 + breathX;
    const targetY = pointer.y * 0.35 + breathY;
    
    // Push-in for cinematic beats
    let effectZ = 0;
    if (activeEffect?.id === 'cinematic_beat' || activeEffect?.id === 'environment_transform') {
      effectZ = -1.6;
    } else if (activeEffect?.id === 'camera_drift') {
      effectZ = -0.8;
    }

    vec.current.set(targetX, targetY, baseZ + effectZ);
    camera.position.lerp(vec.current, delta * 2.8);
    camera.lookAt(0, 0, 0);
  });

  return null;
}