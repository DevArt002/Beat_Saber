import { IS_AR_SUPPORT, IS_VR_SUPPORT } from 'src/constants';

import { LoadingSpinner } from 'src/components';
import React from 'react';
import clsx from 'clsx';
import { requestXRSession } from 'src/utils';
import { useGame } from 'src/hooks';

export const LandingPage = () => {
  const { gameContainerRef, gameInstance, loading } = useGame();

  return (
    <div className="h-full w-full bg-gray-900">
      {/* UI overlay */}
      <div className="z-10 flex h-full w-full items-center justify-center">
        {loading && <LoadingSpinner />}
        {(IS_VR_SUPPORT || IS_AR_SUPPORT) && (
          <button
            className="z-10 bg-white"
            onClick={() => requestXRSession(gameInstance?.renderer)}>
            Enter XR Mode
          </button>
        )}
      </div>
      {/* Game renderer container */}
      <div
        ref={gameContainerRef}
        className={clsx('absolute top-0 left-0 h-full w-full', loading && 'invisible')}
      />
    </div>
  );
};
