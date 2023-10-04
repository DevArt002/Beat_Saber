import { DataConnection, PeerError } from 'peerjs';
import * as THREE from 'three';

export enum EGameEvents {
  INITIALIZED = 'initialized',
}

export enum EPeerDataType {
  INITIAL_CONNECT,
  Ready,
  PLAYER,
}

export enum ENoteType {
  RED,
  BLUE,
  Unused,
  Bomb,
}
export enum ENoteCutDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  UP_LEFT,
  UP_RIGHT,
  DOWN_LEFT,
  DOWN_RIGHT,
  Any, // dot
}

export type TEntityID = number;

export type TPeerId = string;

export interface INoteCubeData {
  _time: number;
  _lineIndex: number;
  _lineLayer: number;
  _type: ENoteType;
  _cutDirection: ENoteCutDirection;
}

export interface IBSMGDifficultyData {
  _version: string;
  _BPMChanges: any;
  _events: any;
  _notes: INoteCubeData[];
  _obstacles: any;
  _bookmarks: any;
}

export interface IBSMGInfoData {
  _beatsPerMinute: number;
  [key: string]: any; // TODO Define details
}

export interface IPeerBaseData {
  type: EPeerDataType;
}

export interface IPeerInitialConnectData extends IPeerBaseData {
  peerIds: string[]; // Peer ids who joined the lobby already
}

export interface IPeerReadyData extends IPeerBaseData {
  ready: boolean; // Tell others my ready status
}

export interface IPeerPlayerData extends IPeerBaseData {
  score: number; // Player score
  sabersMatrix: [THREE.Matrix4 | undefined, THREE.Matrix4 | undefined];
}

export type TPeerData = IPeerInitialConnectData | IPeerReadyData | IPeerPlayerData;

export type TPeerConnectCallbacks = {
  onIceStateChanged?: (connection: DataConnection, state: RTCIceConnectionState) => void;
  onOpen?: (connection: DataConnection) => void;
  onClose?: (connection: DataConnection) => void;
  onReceivedData?: (connection: DataConnection, data: TPeerData) => void;
  onError?: (connection: DataConnection, error: PeerError<any>) => void;
};
