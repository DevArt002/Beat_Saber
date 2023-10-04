import { EXRSessionSupportType } from 'src/types';

/**
 * Get types of xr support
 * @returns
 */
export async function getXRSupportTypes(): Promise<Set<EXRSessionSupportType>> {
  const supportTypes = new Set<EXRSessionSupportType>();

  if (navigator.xr) {
    const [isVRSupported, isARSupported] = await Promise.all([
      navigator.xr.isSessionSupported('immersive-vr'),
      navigator.xr.isSessionSupported('immersive-ar'),
    ]);

    isVRSupported && supportTypes.add(EXRSessionSupportType.SUPPORTED_VR);
    isARSupported && supportTypes.add(EXRSessionSupportType.SUPPORTED_AR);
  } else {
    supportTypes.add(EXRSessionSupportType.NOT_FOUND);
  }

  return supportTypes;
}
