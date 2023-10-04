import {
  EPeerDataType,
  IPeerInitialConnectData,
  IPeerPlayerData,
  IPeerReadyData,
  TPeerData,
  TPeerId,
} from 'src/types';
import { broadcastPeer, broadcastPeers, connectPeer, disconnectPeers, peer } from 'src/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  connected: boolean;
  ready: boolean;
  allReady: boolean;
  connections: Record<TPeerId, DataConnection>;
  readyConnections: Record<TPeerId, boolean>;
  onConnect: (destPeerId: TPeerId) => void;
  onDisconnect: () => void;
  onReadyToggle: () => void;
  onBroadcast: (data: TPeerData) => void;
} => {
  const [peerId, setPeerId] = useState<TPeerId>('');
  const [connections, setConnections] = useState<Record<TPeerId, DataConnection>>({});
  const [readyConnections, setReadyConnections] = useState<Record<TPeerId, boolean>>({});
  const [connected, { toggleOn: toggleOnConnected, toggleOff: toggleOffConnected }] =
    useToggle(false);
  const [ready, { toggle: toggleReady, toggleOff: toggleOffReady }] = useToggle(false);

  const allReady = useMemo(() => {
    const readyConnectionsArr = Object.values(readyConnections);
    const othersReady = readyConnectionsArr.length === readyConnectionsArr.filter(Boolean).length;

    return othersReady && ready;
  }, [ready, readyConnections]);

  // Listen when connection is opened
  const onConnectionOpen = useCallback(
    (connection: DataConnection) => {
      // If the game was already started under the allReady state, refuse new connection
      if (allReady) {
        return connection.close();
      }

      // Add new connection to connection record
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
      // Add new connection to ready record
      setReadyConnections((cur) => {
        cur[connection.peer] = false;

        return cur;
      });

      toggleOnConnected();
    },
    [allReady, toggleOnConnected],
  );

  // Listen when connection is closed
  const onConnectionClose = useCallback((connection: DataConnection) => {
    // Remove connection from connection record
    setConnections((cur) => {
      delete cur[connection.peer];

      return { ...cur };
    });
    // Remove connection from ready record
    setReadyConnections((cur) => {
      delete cur[connection.peer];

      return { ...cur };
    });
  }, []);

  // Listen when received data through connection
  const onConnectionReceivedData = useCallback(
    (connection: DataConnection, data: TPeerData) => {
      // Initial connect data
      // User will connect to rest of players
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
      // Ready status
      else if (data.type === EPeerDataType.Ready) {
        // Update ready record
        setReadyConnections((cur) => {
          cur[connection.peer] = (data as IPeerReadyData).ready;

          return { ...cur };
        });
      }
      // Player data which update game data as realtime
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
    (destPeerId: TPeerId) => {
      toggleOnConnected();
      connectPeer(destPeerId, {
        onOpen: onConnectionOpen,
        onClose: onConnectionClose,
        onReceivedData: onConnectionReceivedData,
      });
    },
    [toggleOnConnected, onConnectionOpen, onConnectionClose, onConnectionReceivedData],
  );

  // Handler for disconnect
  const onDisconnect = useCallback(() => {
    disconnectPeers(Object.values(connections));
    toggleOffConnected();
    toggleOffReady();
  }, [connections, toggleOffConnected, toggleOffReady]);

  // Handler for broadcast
  const onBroadcast = useCallback(
    (data: TPeerData) => {
      broadcastPeers(Object.values(connections), data);
    },
    [connections],
  );

  // Handler for toggling ready status
  const onReadyToggle = useCallback(() => {
    toggleReady();
  }, [toggleReady]);

  // Try to broadcast user's ready status
  useEffect(() => {
    onBroadcast({ type: EPeerDataType.Ready, ready });
  }, [connections, onBroadcast, ready]);

  return {
    peerId,
    connected,
    ready,
    allReady,
    connections,
    readyConnections,
    onConnect,
    onDisconnect,
    onReadyToggle,
    onBroadcast,
  };
};
