import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';

// 3D Chapter Worlds (1 through 8)
import ArrivalScene from './chapters/ArrivalScene';
import ReflectionsScene from './chapters/ReflectionsScene';
import WondersScene from './chapters/WondersScene';
import UsSoFarScene from './chapters/UsSoFarScene';
import HorizonsScene from './chapters/HorizonsScene';
import TidesScene from './chapters/TidesScene';
import ConstellationScene from './chapters/ConstellationScene';
import TwoPathsScene from './chapters/TwoPathsScene';

export default function SceneManager({ chapterId = 'arrival', chapterOrder = 1 }) {
  const renderWorld = () => {
    switch (chapterId) {
      case 'reflections':
        return <ReflectionsScene />;
      case 'wonders':
        return <WondersScene />;
      case 'us_so_far':
        return <UsSoFarScene />;
      case 'horizons':
        return <HorizonsScene />;
      case 'tides':
        return <TidesScene />;
      case 'constellation':
        return <ConstellationScene />;
      case 'two_paths':
        return <TwoPathsScene />;
      case 'arrival':
      default:
        return <ArrivalScene />;
    }
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto overflow-hidden bg-void">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <CameraRig chapterOrder={chapterOrder} />
        <Suspense fallback={null}>
          {renderWorld()}
        </Suspense>
      </Canvas>
    </div>
  );
}