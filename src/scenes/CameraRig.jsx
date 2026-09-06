import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraRig({ chapterOrder = 1 }) {
  const { camera, pointer, viewport } = useThree();
  const vec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // 1. Detect if the screen is a phone (portrait mode)
    const isPhone = viewport.aspect < 1;

    // 2. Cosmic breathing motion
    const t = state.clock.getElapsedTime();
    const breathX = Math.sin(t * 0.35) * 0.2;
    const breathY = Math.cos(t * 0.25) * 0.15;

    // 3. Gentle touch/mouse parallax
    const targetX = pointer.x * 0.5 + breathX;
    const targetY = pointer.y * 0.35 + breathY;
    
    // 4. SMART CAMERA DISTANCE:
    // Pulls back to z=9.5 on phones so planets & stars fit without being cut off!
    // Sits at z=7.0 on laptops.
    let baseZ = isPhone ? 9.8 : 7.0;
    if (chapterOrder === 2) {
      baseZ = isPhone ? 9.0 : 6.5;
    }

    // 5. Smooth dampening
    vec.current.set(targetX, targetY, baseZ);
    camera.position.lerp(vec.current, delta * 2.0);
    camera.lookAt(0, 0, 0);
  });

  return null;
}