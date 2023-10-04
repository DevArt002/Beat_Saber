import { DataConnection, PeerError } from 'peerjs';
import { Matrix4 } from 'three';

export enum EGameEvents {
  INITIALIZED = 'initialized',
}

export enum EComponentType {
  Transform,
  XRRig,
}

export enum EPeerDataType {
  INITIAL_CONNECT,
  PLAYER_UPDATE,
}

export type TXY = [number, number];

export type TXYZ = [number, number, number];

export type TEntityID = number;

export type TPeerId = string;

export interface IPeerBaseData {
  type: EPeerDataType;
}

export interface IPeerInitialConnectData extends IPeerBaseData {
  peerIds: string[]; // Peer ids who joined the lobby already
}

export interface IPeerPlayerUpdateData extends IPeerBaseData {
  score: number; // Player score
  saberTransform: [Matrix4, Matrix4]; // Left/Right saber transform data
}

export type TPeerData = IPeerInitialConnectData | IPeerPlayerUpdateData;

export type TPeerConnectCallbacks = {
  onIceStateChanged?: (connection: DataConnection, state: RTCIceConnectionState) => void;
  onOpen?: (connection: DataConnection) => void;
  onClose?: (connection: DataConnection) => void;
  onReceivedData?: (connection: DataConnection, data: TPeerData) => void;
  onError?: (connection: DataConnection, error: PeerError<any>) => void;
};
