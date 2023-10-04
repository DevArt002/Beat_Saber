import { IS_AR_SUPPORT, IS_VR_SUPPORT } from 'src/constants';
import { EXRSessionSupportType } from 'src/types';
import * as THREE from 'three';

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

let currentSession: XRSession | null = null;

async function onSessionStarted(session: XRSession, renderer?: THREE.WebGLRenderer) {
  session.addEventListener('end', onSessionEnded);

  await renderer?.xr.setSession(session);

  currentSession = session;
}

function onSessionEnded(/*event*/) {
  currentSession?.removeEventListener('end', onSessionEnded);

  currentSession = null;
}

// Request XR session
export async function requestXRSession(renderer?: THREE.WebGLRenderer) {
  if (!navigator.xr) return;

  if (currentSession === null) {
    let mode: XRSessionMode | null = null;
    if (IS_VR_SUPPORT) {
      mode = 'immersive-vr';
    }
    if (IS_AR_SUPPORT) {
      mode = 'immersive-ar';
    }

    if (!mode) return;

    const options = {
      optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'],
    };
    navigator.xr
      .requestSession(mode, options)
      .then((session) => onSessionStarted(session, renderer));
  } else {
    currentSession.end();
  }
}
