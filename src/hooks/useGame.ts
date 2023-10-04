import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { Game } from 'src/helpers';
import { useToggle } from './useToggle';
import { EGameEvents } from 'src/types';

/**
 * Hooks for game
 * @return ref of game container, instance of game, and loading status of game assets
 */
export const useGame = (): {
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

  return { gameContainerRef, gameInstance, loading };
};
