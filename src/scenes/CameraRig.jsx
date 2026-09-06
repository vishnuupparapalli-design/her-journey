import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useJourneyStore } from '../state/useJourneyStore';

export default function CameraRig({ chapterOrder = 1 }) {
  const { camera, pointer, viewport } = useThree();
  const vec = useRef(new THREE.Vector3());
  const activeEffect = useJourneyStore((state) => state.activeEffect);

  useFrame((state, delta) => {
    const isPhone = viewport.aspect < 1;

    // 1. Cosmic breathing motion
    const t = state.clock.getElapsedTime();
    const breathX = Math.sin(t * 0.35) * 0.2;
    const breathY = Math.cos(t * 0.25) * 0.15;

    // 2. Parallax
    const targetX = pointer.x * 0.5 + breathX;
    const targetY = pointer.y * 0.35 + breathY;
    
    // 3. Base camera distance
    let baseZ = isPhone ? 9.8 : 7.0;
    if (chapterOrder === 2) {
      baseZ = isPhone ? 9.0 : 6.5;
    }

    // 4. DRAMATIC CAMERA PUSH-IN FOR EFFECTS:
    // When a cinematic beat or transform plays, camera glides forward by 1.6 units!
    let effectZ = 0;
    if (activeEffect?.id === 'cinematic_beat' || activeEffect?.id === 'environment_transform') {
      effectZ = -1.6;
    } else if (activeEffect?.id === 'camera_drift') {
      effectZ = -0.8;
    }

    // Smooth cinematic glide
    vec.current.set(targetX, targetY, baseZ + effectZ);
    camera.position.lerp(vec.current, delta * 2.8);
    camera.lookAt(0, 0, 0);
  });

  return null;
}