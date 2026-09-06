import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraRig from './CameraRig';
import EffectManager from '../effects/EffectManager';
import { useDeviceTier } from '../hooks/useDeviceTier';

// All 14 Chapter Worlds
import ArrivalScene from './chapters/ArrivalScene';
import ReflectionsScene from './chapters/ReflectionsScene';
import WondersScene from './chapters/WondersScene';
import UsSoFarScene from './chapters/UsSoFarScene';
import HorizonsScene from './chapters/HorizonsScene';
import TidesScene from './chapters/TidesScene';
import ConstellationScene from './chapters/ConstellationScene';
import TwoPathsScene from './chapters/TwoPathsScene';
import DistanceScene from './chapters/DistanceScene';
import ThresholdsScene from './chapters/ThresholdsScene';
import HerSkyScene from './chapters/HerSkyScene';
import BuildingScene from './chapters/BuildingScene';
import WeatheringScene from './chapters/WeatheringScene';
import WhatsAheadScene from './chapters/WhatsAheadScene';

export default function SceneManager({ chapterId = 'arrival', chapterOrder = 1, reducedMotion = false }) {
  const { isLowTier, prefersReducedMotion } = useDeviceTier();
  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

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
      case 'distance':
        return <DistanceScene />;
      case 'thresholds':
        return <ThresholdsScene />;
      case 'her_sky':
        return <HerSkyScene />;
      case 'building':
        return <BuildingScene />;
      case 'weathering':
        return <WeatheringScene />;
      case 'whats_ahead':
        return <WhatsAheadScene />;
      case 'arrival':
      default:
        return <ArrivalScene />;
    }
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto overflow-hidden bg-void">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{
          antialias: !isLowTier, // Disable heavy antialias on low-tier mobile to save battery
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={isLowTier ? 1 : [1, 1.75]} // Adaptive pixel ratio
      >
        {/* Adaptive Camera Rig */}
        <CameraRig chapterOrder={chapterOrder} reducedMotion={shouldReduceMotion} />
        
        {/* 3D Centralized Effect System */}
        <EffectManager />

        <Suspense fallback={null}>
          {renderWorld()}
        </Suspense>
      </Canvas>
    </div>
  );
}