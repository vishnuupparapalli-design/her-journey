import { useState, useEffect } from 'react';

/**
 * Intelligent Device Tier & Accessibility Hook
 * Categorizes device into: 'low' | 'medium' | 'high'
 */
export function useDeviceTier() {
  const [tier, setTier] = useState('high');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Check user's OS reduced-motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // 2. Hardware heuristic detection
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const memory = navigator.deviceMemory || 4; // GB of RAM

    if (cores <= 4 || memory < 4 || (isMobile && window.innerWidth < 450)) {
      setTier('low');
    } else if (cores <= 6 || isMobile) {
      setTier('medium');
    } else {
      setTier('high');
    }

    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return {
    tier,
    isLowTier: tier === 'low',
    isHighTier: tier === 'high',
    prefersReducedMotion,
  };
}