import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';
import ArrivalScene from './chapters/ArrivalScene';
import ReflectionsScene from './chapters/ReflectionsScene';

export default function SceneManager({ chapterId = 'arrival', chapterOrder = 1 }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto overflow-hidden bg-void">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        {/* Cinematic Camera Rig */}
        <CameraRig chapterOrder={chapterOrder} />

        {/* 3D Chapter Switching */}
        <Suspense fallback={null}>
          {chapterId === 'reflections' ? (
            <ReflectionsScene />
          ) : (
            <ArrivalScene />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}