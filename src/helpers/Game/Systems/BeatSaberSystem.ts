import * as THREE from 'three';

import { BSM_DIFFICULTY_DATA, BSM_INFO_DATA } from 'src/constants';
import {
  BeatSaberRigEntity,
  FloorEntity,
  NotesEntity,
  SaberEntity,
} from 'src/helpers/Game/Entities';
import { EPeerDataType, INoteCubeData } from 'src/types';

import BEAT_SABER_TRACK from '/audio/beat_saber_track.mp3';
import { Game } from 'src/helpers';
import { System } from './System';

export class BeatSaberSystem extends System {
  private _clock = new THREE.Clock();

  // Entities
  private _floorEntity: FloorEntity | null = null;
  private _notesEntity: NotesEntity | null = null;

  // Beat saber parameters
  private readonly _bpm: number; // beats per min
  private readonly _bps: number; // beats per second
  private readonly _tpb: number; // time per beat
  private readonly _floorSize: THREE.Vector2Tuple = [2, 20]; // Runway width&length is meters
  private readonly _cellSize: number; // Note size in meters. Assuming the note emitter is 4x3 grid
  private readonly _noteMaxFlyDist: number; // Note is gonna be re-positioned or deleted at the max distance
  private readonly _noteMaxFlyTime: number = 3; // seconds which take to reach at the max distance
  private readonly _noteVelocity: number; // m/s
  private readonly _beatsForFly: number;
  private readonly _notes: Record<number, INoteCubeData[]> = {};
  private readonly _maxNoteCount = 20;
  private readonly _track = new Audio(BEAT_SABER_TRACK);
  private _isPlaying: boolean = false;
  private _prevBeat: number = -1;
  private _score: number = 0;

  constructor(game: Game) {
    super(game);

    this._bpm = BSM_INFO_DATA._beatsPerMinute;
    this._bps = this._bpm / 60;
    this._tpb = 1 / this._bps;
    this._cellSize = this._floorSize[0] / 4;
    this._noteMaxFlyDist = this._floorSize[1] + 5;
    this._noteVelocity = this._noteMaxFlyDist / this._noteMaxFlyTime;
    this._beatsForFly = this._bps * (this._floorSize[1] / this._noteVelocity);
  }

  // Getter of rig entity
  get rigEntity(): BeatSaberRigEntity | null {
    return this._game.rigSystem.activeRigEntity;
  }

  // Getter of left saber
  get leftSaber(): SaberEntity | null {
    return this.rigEntity?.leftSaber ?? null;
  }

  // Getter of right saber
  get rightSaber(): SaberEntity | null {
    return this.rigEntity?.rightSaber ?? null;
  }

  // Getter of note size
  get cellSize(): number {
    return this._cellSize;
  }

  // Getter of expected maximum count of notes in scene
  get maxNoteCount(): number {
    return this._maxNoteCount;
  }

  // Getter of note velocity
  get noteVelocity(): number {
    return this._noteVelocity;
  }

  // Getter of max fly distance
  get noteMaxFlyDist(): number {
    return this._noteMaxFlyDist;
  }

  // Getter of score
  get score(): number {
    return this._score;
  }

  // Getter of playing status
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Initialize
   */
  async init() {
    // Load audio track
    await this._loadAudioTrack();
    // Bake beat saber data first
    this._bakeBSMData();

    // Add floor entity
    const floorEntity = new FloorEntity(this._floorSize);
    floorEntity.position.z = -this._floorSize[1] / 2;
    this.addEntity(floorEntity);
    this._floorEntity = floorEntity;

    // Add notes entity
    const notesEntity = new NotesEntity(this);
    notesEntity.position.z -= this._floorSize[1];
    this.addEntity(notesEntity);
    this._notesEntity = notesEntity;

    // Stop clock
    this._clock.stop();

    // TODO Remove
    this.play();
  }

  /**
   * Bake BSM data, destruct into note array per integer time(second)
   */
  private _bakeBSMData() {
    for (const note of BSM_DIFFICULTY_DATA._notes) {
      const key = Math.floor(note._time);
      if (this._notes[key]) {
        this._notes[key].push(note);
      } else {
        this._notes[key] = [note];
      }
    }
  }

  /**
   * Load audio track
   * @returns
   */
  private async _loadAudioTrack() {
    return new Promise((resolve, reject) => {
      try {
        this._track.addEventListener('canplaythrough', resolve);
      } catch (error) {
        console.error(error);
        this._track.removeEventListener('canplaythrough', resolve);
        reject();
      }
    });
  }

  /**
   * Play
   */
  play() {
    if (this._isPlaying || this._notesEntity === null) return;

    this._isPlaying = true;
    this._clock.start();
    this._track.play();
  }

  /**
   * Stop playing
   * @returns
   */
  stop() {
    if (!this._isPlaying) return;

    this._isPlaying = false;
    this._clock.stop();
    this._track.pause();
    this._track.currentTime = 0;
  }

  /**
   * Play notes
   * @param beat
   * @returns
   */
  private _playNotes(beat: number) {
    if (this._notesEntity === null) return;

    const integerBeat = Math.floor(beat);
    const offset = beat - integerBeat;

    // Check if notes corresponding to key is added. If so, don't move forward.
    if (this._prevBeat === integerBeat) return;

    this._prevBeat = integerBeat;

    const key = Math.floor(beat + this._beatsForFly);
    const activeNotes = this._notes[key] ?? [];

    this._notesEntity?.addNewNotes(activeNotes, offset);
  }

  /**
   * Update
   */
  update() {
    // Broadcast game data
    this._game.onBroadcastMsg?.({
      type: EPeerDataType.PLAYER,
      score: this._score,
      sabersMatrix: [this.leftSaber?.matrixWorld, this.rightSaber?.matrixWorld],
    });

    // Get delta&elapsed time
    const delta = this._clock.getDelta();
    const elapsed = this._clock.elapsedTime;

    // If it's in play mode, play notes too
    if (this._isPlaying && this._notesEntity !== null) {
      const beat = elapsed / this._tpb;
      this._playNotes(beat);
    }

    for (const key in this._entities) {
      this._entities[key].update(delta);
    }
  }
}
