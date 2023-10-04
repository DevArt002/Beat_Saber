import { EGameEvents, IPeerPlayerData, TPeerData, TPeerId } from 'src/types';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { Game } from 'src/helpers';
import { useToggle } from './useToggle';

/**
 * Hooks for game
 * @return ref of game container, instance of game, and loading status of game assets
 */
export const useGame = (
  players: Record<TPeerId, IPeerPlayerData>,
  onBroadcastMsg: (data: TPeerData) => void,
): {
  gameContainerRef: MutableRefObject<HTMLDivElement | null>;
  gameInstance: Game | null;
  loading: boolean;
} => {
  const [loading, { toggleOff: toggleOffLoading }] = useToggle(true);
  const [gameInstance, setGameInstance] = useState<Game | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);

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

  return { gameContainerRef, gameInstance, loading };
};
