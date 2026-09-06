import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraRig({ chapterOrder = 1 }) {
  const { camera, pointer } = useThree();
  const vec = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // 1. Slow cosmic breathing motion
    const t = state.clock.getElapsedTime();
    const breathX = Math.sin(t * 0.4) * 0.3;
    const breathY = Math.cos(t * 0.3) * 0.2;

    // 2. Subtle mouse / finger parallax (camera tilts gently where she looks)
    const targetX = pointer.x * 0.8 + breathX;
    const targetY = pointer.y * 0.5 + breathY;
    
    // 3. Different chapter depths
    const baseZ = chapterOrder === 2 ? 6.2 : 7.0;

    // 4. Smooth cinematic camera lerp
    vec.current.set(targetX, targetY, baseZ);
    camera.position.lerp(vec.current, delta * 1.5);
    camera.lookAt(0, 0, 0);
  });

  return null;
}