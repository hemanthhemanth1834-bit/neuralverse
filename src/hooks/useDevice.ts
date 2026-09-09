import { useEffect, useState } from 'react';
import { getDeviceTier, isTouchDevice, prefersReducedMotion, hasWebGL, type DeviceTier } from '../utils/device';

export interface DeviceInfo {
  tier: DeviceTier;
  touch: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  width: number;
}

export function useDevice(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>(() => ({
    tier: typeof window !== 'undefined' ? getDeviceTier() : 'medium',
    touch: typeof window !== 'undefined' ? isTouchDevice() : false,
    reducedMotion: typeof window !== 'undefined' ? prefersReducedMotion() : false,
    webgl: true,
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
  }));

  useEffect(() => {
    const compute = () => {
      setInfo({
        tier: getDeviceTier(),
        touch: isTouchDevice(),
        reducedMotion: prefersReducedMotion(),
        webgl: hasWebGL(),
        width: window.innerWidth,
      });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return info;
}
