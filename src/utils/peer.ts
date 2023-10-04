import Peer, { DataConnection, PeerError } from 'peerjs';
import { TPeerConnectCallbacks, TPeerData, TPeerId } from 'src/types';

// Peer
export const peer = new Peer();

/**
 * Connect to single peer
 * @param peerId
 * @param callbacks
 * @returns connection
 */
export function connectPeer(peerId: TPeerId, callbacks?: TPeerConnectCallbacks): DataConnection {
  const connection = peer.connect(peerId);

  if (callbacks) {
    const { onIceStateChanged, onOpen, onClose, onReceivedData, onError } = callbacks;

    onIceStateChanged &&
      connection.on('iceStateChanged', (state: RTCIceConnectionState) =>
        onIceStateChanged(connection, state),
      );
    onOpen && connection.on('open', () => onOpen(connection));
    onClose && connection.on('close', () => onClose(connection));
    onReceivedData &&
      connection.on('data', (data: any) => onReceivedData(connection, data as TPeerData));
    onError && connection.on('error', (error: PeerError<any>) => onError(connection, error));
  }

  return connection;
}

/**
 * Connects to multiple peers
 * @param peerId
 * @param callbacks
 * @returns
 */
export function connectPeers(
  peerId: TPeerId[],
  callbacks?: TPeerConnectCallbacks,
): DataConnection[] {
  return peerId.map((peerId) => connectPeer(peerId, callbacks));
}

/**
 * Disconnect from peer, or close connection
 * @param connection
 */
export function disconnectPeer(connection: DataConnection) {
  connection.close();
}

/**
 * Disconnect from multiple peers, or close connections
 * @param connections
 */
export function disconnectPeers(connections: DataConnection[]) {
  connections.map((connection) => disconnectPeer(connection));
}

/**
 * Broadcast data to single peer
 * @param connection
 * @param data
 */
export function broadcastPeer(connection: DataConnection, data: TPeerData) {
  connection.send(data);
}

/**
 * Broadcast data to multiple peers
 * @param connections
 * @param data
 */
export function broadcastPeers(connections: DataConnection[], data: TPeerData) {
  connections.forEach((connection) => broadcastPeer(connection, data));
}
