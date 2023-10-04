import { IPeerPlayerData, TPeerId } from 'src/types';
import { IS_AR_SUPPORT, IS_VR_SUPPORT } from 'src/constants';
import React, { useRef } from 'react';
import { useGame, usePeer } from 'src/hooks';

import { LoadingSpinner } from 'src/components';
import clsx from 'clsx';
import { requestXRSession } from 'src/utils';

export const LandingPage = () => {
  const playersRef = useRef<Record<TPeerId, IPeerPlayerData>>({});
  const {
    peerId,
    destPeerId,
    connected,
    onChangeDestPeerId,
    onConnect,
    onDisconnect,
    onBroadcast,
  } = usePeer(playersRef.current);
  const { gameContainerRef, gameInstance, loading } = useGame(playersRef.current, onBroadcast);

  return (
    <div className="h-full w-full">
      {/* UI overlay */}
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        {loading && <LoadingSpinner />}
        {!loading && !connected && (
          <form className="flex flex-col gap-2" onSubmit={onConnect}>
            <p className="text-white">My peer ID: {peerId}</p>
            <input
              className="outline-none rounded p-1"
              type="text"
              placeholder="Input target peer ID"
              value={destPeerId}
              onChange={onChangeDestPeerId}
            />
            <button type="submit" className="z-10 rounded bg-white p-2">
              Connect
            </button>
          </form>
        )}
        {!loading && connected && (
          <div className="flex flex-col gap-2">
            <button className="z-10 rounded bg-white p-2" onClick={onDisconnect}>
              Disconnect
            </button>
            {(IS_VR_SUPPORT || IS_AR_SUPPORT) && (
              <button
                className="z-10 rounded bg-white p-2"
                onClick={() => requestXRSession(gameInstance?.renderer)}>
                Enter XR Mode
              </button>
            )}
          </div>
        )}
      </div>
      {/* Game renderer container */}
      <div
        ref={gameContainerRef}
        className={clsx(
          'absolute top-0 left-0 h-full w-full',
          (loading || !connected) && 'invisible',
        )}
      />
    </div>
  );
};
