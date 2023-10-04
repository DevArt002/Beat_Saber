import { IPeerPlayerData, TPeerId } from 'src/types';
import React, { useRef } from 'react';
import { useGame, usePeer } from 'src/hooks';

import { ConnectForm } from './ConnectForm';
import { LoadingSpinner } from 'src/components';
import { OverlayMenu } from './OverlayMenu';
import clsx from 'clsx';

export const LandingPage = () => {
  const playersRef = useRef<Record<TPeerId, IPeerPlayerData>>({});
  const {
    peerId,
    connected,
    ready,
    allReady,
    readyConnections,
    onConnect,
    onDisconnect,
    onReadyToggle,
    onBroadcast,
  } = usePeer(playersRef.current);
  const { gameContainerRef, loading, onRequestXRSession } = useGame(
    connected,
    allReady,
    playersRef.current,
    onBroadcast,
  );

  return (
    <div className="h-full w-full">
      {/* UI overlay */}
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        {loading ? (
          <LoadingSpinner />
        ) : connected ? (
          <OverlayMenu
            ready={ready}
            allReady={allReady}
            readyConnections={readyConnections}
            onDisconnect={onDisconnect}
            onReadyToggle={onReadyToggle}
            onRequestXRSession={onRequestXRSession}
          />
        ) : (
          <ConnectForm peerId={peerId} onConnect={onConnect} />
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
