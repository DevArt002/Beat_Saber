import { LoadingSpinner } from 'src/components';
import React from 'react';
import { useGame } from 'src/hooks';

export const LandingPage = () => {
  const { gameContainerRef, loading } = useGame();

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-900">
      {loading && <LoadingSpinner />}
      <div ref={gameContainerRef} className="bg-red absolute h-full w-full" />
    </div>
  );
};
