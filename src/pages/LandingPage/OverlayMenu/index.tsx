import { ICommonComponentProps, TPeerId } from 'src/types';
import React, { FC } from 'react';

import { Button } from 'src/components';
import clsx from 'clsx';

interface IOverlayMenuProps extends ICommonComponentProps {
  isARSupport: boolean;
  isVRSupport: boolean;
  ready: boolean;
  allReady: boolean;
  readyConnections: Record<TPeerId, boolean>;
  onDisconnect: () => void;
  onReadyToggle: () => void;
  onRequestXRSession: () => void;
}

export const OverlayMenu: FC<IOverlayMenuProps> = ({
  className,
  style,
  isARSupport,
  isVRSupport,
  ready,
  allReady,
  readyConnections,
  onDisconnect,
  onReadyToggle,
  onRequestXRSession,
  ...rest
}) => {
  return (
    <div className={clsx('h-full w-full p-3', className)} style={style} {...rest}>
      {/* Ready status */}
      <div className="absolute top-0 left-0 z-10 flex flex-col gap-1 p-3">
        <p className="text-xs font-bold text-red-600">{`You-${ready ? 'Ready' : 'Not Ready'}`}</p>
        {Object.entries(readyConnections).map(([peerId, peerReady]) => (
          <p key={peerId} className="text-xs font-bold text-red-600">{`${peerId}-${
            peerReady ? 'Ready' : 'Not Ready'
          }`}</p>
        ))}
      </div>
      {/* Menu */}
      <div className="absolute right-0 bottom-0 z-10 flex flex-col gap-2 p-3">
        {(isVRSupport || isARSupport) && (
          <Button className="w-28" onClick={onRequestXRSession}>
            Enter XR Mode
          </Button>
        )}
        {!allReady && (
          <Button className="w-28" onClick={onReadyToggle}>
            {ready ? 'Not Ready' : 'Ready'}
          </Button>
        )}
        <Button className="w-28" onClick={onDisconnect}>
          Exit
        </Button>
      </div>
    </div>
  );
};
