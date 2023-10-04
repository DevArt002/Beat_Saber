import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import {
  EPeerDataType,
  IPeerInitialConnectData,
  IPeerPlayerData,
  TPeerData,
  TPeerId,
} from 'src/types';
import { broadcastPeer, broadcastPeers, connectPeer, disconnectPeers, peer } from 'src/utils';

import { DataConnection } from 'peerjs';
import { useToggle } from './useToggle';

/**
 * Hooks for peer
 * @returns
 */
export const usePeer = (
  players: Record<TPeerId, IPeerPlayerData>,
): {
  peerId: TPeerId;
  destPeerId: TPeerId;
  connected: boolean;
  connections: Record<string, DataConnection>;
  onChangeDestPeerId: (e: ChangeEvent<HTMLInputElement>) => void;
  onConnect: (e: FormEvent<HTMLFormElement>) => void;
  onDisconnect: () => void;
  onBroadcast: (data: TPeerData) => void;
} => {
  const [peerId, setPeerId] = useState<TPeerId>('');
  const [destPeerId, setDestPeerId] = useState<TPeerId>('');
  const [connections, setConnections] = useState<Record<string, DataConnection>>({});
  const [connected, { toggleOn: toggleOnConnected, toggleOff: toggleOffConnected }] =
    useToggle(false);

  // Handler for changing dest peer id
  const onChangeDestPeerId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDestPeerId(e.target.value);
  }, []);

  // Listen when connection is opened
  const onConnectionOpen = useCallback(
    (connection: DataConnection) => {
      setConnections((cur) => {
        if (!(connection.peer in cur)) {
          console.info(`Connected a peer: ${connection.peer}`);
          broadcastPeer(connection, {
            type: EPeerDataType.INITIAL_CONNECT,
            peerIds: Object.keys(cur),
          });
        }
        cur[connection.peer] = connection;

        return cur;
      });
      toggleOnConnected();
    },
    [toggleOnConnected],
  );

  // Listen when connection is closed
  const onConnectionClose = useCallback((connection: DataConnection) => {
    setConnections((cur) => {
      delete cur[connection.peer];

      return { ...cur };
    });
  }, []);

  // Listen when received data through connection
  const onConnectionReceivedData = useCallback(
    (connection: DataConnection, data: TPeerData) => {
      // Initial connect data
      if (data.type === EPeerDataType.INITIAL_CONNECT) {
        for (const peerId of (data as IPeerInitialConnectData).peerIds) {
          if (connections[peerId]) continue;

          connectPeer(peerId, {
            onOpen: onConnectionOpen,
            onClose: onConnectionClose,
            onReceivedData: onConnectionReceivedData,
          });
        }
      }
      // Player data
      else if (data.type === EPeerDataType.PLAYER) {
        players[connection.peer] = data as IPeerPlayerData;
      }
    },
    [connections, onConnectionOpen, onConnectionClose, players],
  );

  // Add peer related listeners
  useEffect(() => {
    peer.on('open', setPeerId);
    peer.on('connection', (connection) => {
      connection.on('open', () => onConnectionOpen(connection));
      connection.on('close', () => onConnectionClose(connection));
      connection.on('data', (data: any) => onConnectionReceivedData(connection, data as TPeerData));
    });

    return () => {
      peer.removeAllListeners();
    };
  }, [onConnectionOpen, onConnectionClose, onConnectionReceivedData]);

  // Handler for submit on connect form
  const onConnect = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      connectPeer(destPeerId, {
        onOpen: onConnectionOpen,
        onClose: onConnectionClose,
        onReceivedData: onConnectionReceivedData,
      });
    },
    [destPeerId, onConnectionOpen, onConnectionClose, onConnectionReceivedData],
  );

  // Handler for disconnect
  const onDisconnect = useCallback(() => {
    disconnectPeers(Object.values(connections));
    toggleOffConnected();
  }, [connections, toggleOffConnected]);

  // Handler for broadcast
  const onBroadcast = useCallback(
    (data: TPeerData) => {
      broadcastPeers(Object.values(connections), data);
    },
    [connections],
  );

  return {
    peerId,
    destPeerId,
    connected,
    connections,
    onChangeDestPeerId,
    onConnect,
    onDisconnect,
    onBroadcast,
  };
};
