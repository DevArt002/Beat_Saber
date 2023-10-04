import { EGameEvents, IPeerPlayerData, TPeerData, TPeerId } from 'src/types';
import { IS_AR_SUPPORT, IS_VR_SUPPORT } from 'src/constants';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Game } from 'src/helpers';
import { useToggle } from './useToggle';

/**
 * Hooks for game
 * @return ref of game container, instance of game, and loading status of game assets
 */
export const useGame = (
  connected: boolean,
  allReady: boolean,
  players: Record<TPeerId, IPeerPlayerData>,
  onBroadcastMsg: (data: TPeerData) => void,
): {
  gameContainerRef: MutableRefObject<HTMLDivElement | null>;
  gameInstance: Game | null;
  loading: boolean;
  onRequestXRSession: () => void;
} => {
  const [loading, { toggleOff: toggleOffLoading }] = useToggle(true);
  const [gameInstance, setGameInstance] = useState<Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

  // Get current xr session
  const currentXRSession = useMemo(
    () => gameInstance?.renderer.xr.getSession() ?? null,
    [gameInstance],
  );

  // Handler for xr session ended
  const onXRSessionEnded = useCallback(() => {
    currentXRSession?.removeEventListener('end', onXRSessionEnded);
  }, [currentXRSession]);

  // Handler for xr session started
  const onXRSessionStarted = useCallback(
    async (session: XRSession) => {
      session.addEventListener('end', onXRSessionEnded);

      await gameInstance?.renderer.xr.setSession(session);
    },
    [gameInstance, onXRSessionEnded],
  );

  // Handler for entering XR mode
  const onRequestXRSession = useCallback(async () => {
    if (!navigator.xr) return;

    // Already XR session is in-progress, then abort here
    if (currentXRSession !== null) {
      currentXRSession.end();
      return;
    }

    let mode: XRSessionMode | null = null;
    if (IS_VR_SUPPORT) {
      mode = 'immersive-vr';
    }
    if (IS_AR_SUPPORT) {
      mode = 'immersive-ar';
    }

    // Not available for XR mode, then abort here too
    if (mode === null) return;

    const options = {
      optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'],
    };

    await navigator.xr.requestSession(mode, options).then(onXRSessionStarted);
  }, [currentXRSession, onXRSessionStarted]);

  // Initialize game context here
  useEffect(() => {
    if (gameContainerRef.current === null) return;

    // Instantiate game
    const gameInstance = new Game(gameContainerRef.current);
    // Add event listeners
    gameInstance.addEventListener(EGameEvents.INITIALIZED, toggleOffLoading);
    // Initialize game
    gameInstance.init();

    // Save game instance as state
    setGameInstance(gameInstance);

    return () => {
      // Detach event listeners
      gameInstance.removeEventListener(EGameEvents.INITIALIZED, toggleOffLoading);
      // Dispose game
      gameInstance.dispose();
      // Clean game instance state
      setGameInstance(null);
    };
  }, [toggleOffLoading]);

  // When connected to peer, start rendering loop
  // If disconnected, stop rendering loop
  useEffect(() => {
    if (!gameInstance) return;

    if (connected) {
      gameInstance.start();
    } else {
      gameInstance.stop();
    }
  }, [connected, gameInstance]);

  // Once all players are ready, play beat saber
  useEffect(() => {
    if (!gameInstance || !allReady) return;

    gameInstance.play();
  }, [allReady, gameInstance]);

  // Pass updated onBroadcastMsg to game instance, so that game can broadcast its status to peers correctly
  // TODO Instead of callback, we can setup global function which doesn't depend on state.
  // or Signal/Event listener is candidate too, but not recommended to make signals/events for broadcast every frame
  useEffect(() => {
    if (!gameInstance) return;

    gameInstance.onBroadcastMsg = onBroadcastMsg;
  }, [gameInstance, onBroadcastMsg]);

  // Update players in game
  useEffect(() => {
    if (!gameInstance) return;

    gameInstance.players = players;
  }, [gameInstance, players]);

  return { gameContainerRef, gameInstance, loading, onRequestXRSession };
};
