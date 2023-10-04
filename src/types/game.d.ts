import { DataConnection, PeerError } from 'peerjs';
import * as THREE from 'three';

export enum EGameEvents {
  INITIALIZED = 'initialized',
}

export enum EComponentType {
  Transform,
  XRRig,
}

export enum EPeerDataType {
  INITIAL_CONNECT,
  PLAYER,
}

export type TEntityID = number;

export type TPeerId = string;

export interface IPeerBaseData {
  type: EPeerDataType;
}

export interface IPeerInitialConnectData extends IPeerBaseData {
  peerIds: string[]; // Peer ids who joined the lobby already
}

export interface IPeerPlayerData extends IPeerBaseData {
  score: number; // Player score
  sabersMatrix: [THREE.Matrix4 | undefined, THREE.Matrix4 | undefined];
}

export type TPeerData = IPeerInitialConnectData | IPeerPlayerData;

export type TPeerConnectCallbacks = {
  onIceStateChanged?: (connection: DataConnection, state: RTCIceConnectionState) => void;
  onOpen?: (connection: DataConnection) => void;
  onClose?: (connection: DataConnection) => void;
  onReceivedData?: (connection: DataConnection, data: TPeerData) => void;
  onError?: (connection: DataConnection, error: PeerError<any>) => void;
};
