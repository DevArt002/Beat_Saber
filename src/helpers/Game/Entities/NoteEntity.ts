import * as THREE from 'three';

import { ENoteCutDirection, ENoteType } from 'src/types';
import { disposeObject, getHexColorByNoteType } from 'src/utils';

import { Entity } from './Entity';
import { NotesEntity } from './NotesEntity';
import { ROTATION_BY_CUT_DIR } from 'src/constants';

export class NoteEntity extends Entity {
  private _noteType: ENoteType = ENoteType.RED;
  private _lineIndex: number = 0;
  private _lineLayer: number = 0;
  private _cutDirection: number = 0;
  private _color: THREE.Color = new THREE.Color();
  private _isPlaying: boolean = false;

  constructor(private readonly _notesEntity: NotesEntity, private readonly _index: number) {
    super();
  }

  // Getter of note type
  get noteType(): number {
    return this._noteType;
  }

  // Setter of note noteType
  set noteType(val: number) {
    this._noteType = val;
  }

  // Getter of line index
  get lineIndex(): number {
    return this._lineIndex;
  }

  // Setter of line index
  set lineIndex(val: number) {
    this._lineIndex = val;
  }

  // Getter of line layer
  get lineLayer(): number {
    return this._lineLayer;
  }

  // Setter of line layer
  set lineLayer(val: number) {
    this._lineLayer = val;
  }

  // Getter of cut direction
  get cutDirection(): number {
    return this._cutDirection;
  }

  // Setter of cut direction
  set cutDirection(val: number) {
    this._cutDirection = val;
  }

  // Getter of color
  get color(): THREE.Color {
    return this._color;
  }

  // Setter of cut direction
  set color(val: THREE.Color) {
    this._color = val;
  }

  // Getter of playing status
  get isPlaying(): boolean {
    return this._isPlaying;
  }

  /**
   * Play note
   * @param noteType
   * @param lineIndex
   * @param lineLayer
   * @param cutDirection
   * @param offsetBeat
   */
  play(
    noteType: ENoteType,
    lineIndex: number,
    lineLayer: number,
    cutDirection: ENoteCutDirection,
    offsetBeat: number,
  ) {
    // Prepare note first, which means that paint and adjust transform before playing
    this._prepareNote(noteType, lineIndex, lineLayer, cutDirection, offsetBeat);

    this._isPlaying = true;
  }

  /**
   * Stop
   */
  stop() {
    this._isPlaying = false;
  }

  /**
   * Play note, which means that put note at the start line for runway
   * @param noteType
   * @param lineIndex
   * @param lineLayer
   * @param cutDirection
   * @param offsetBeat
   */
  private _prepareNote(
    noteType: ENoteType,
    lineIndex: number,
    lineLayer: number,
    cutDirection: ENoteCutDirection,
    offsetBeat: number,
  ) {
    const { cellSize } = this._notesEntity.beatSaberSystem;

    // Set color by note noteType
    const hex = getHexColorByNoteType(noteType);
    this._updateInstanceColor(hex);
    // Position by line index, layer, and offset
    this.position.set((lineIndex - 1.5) * cellSize, lineLayer * cellSize + 0.5, -offsetBeat);
    // Rotation by cut direction
    this.rotation.set(0, 0, ROTATION_BY_CUT_DIR[cutDirection]);
    this._updateInstanceMatrix();

    this._noteType = noteType;
    this._lineIndex = lineIndex;
    this._lineLayer = lineLayer;
    this._cutDirection = cutDirection;
    this._isPlaying = true;
  }

  private _moveForwrard(delta: number) {
    const { noteVelocity, noteMaxFlyDist } = this._notesEntity.beatSaberSystem;

    // If note flied enough, stop animating
    if (this.position.z > noteMaxFlyDist) {
      this.stop();
      return;
    }

    // Otherwise, move forward
    this.position.z += noteVelocity * delta;
    this._updateInstanceMatrix();
  }

  /**
   * Update instance's color
   */
  private _updateInstanceColor(hex: number) {
    this._notesEntity.setColorAt(this._index, this._color.setHex(hex));
    if (this._notesEntity.instanceColor) {
      this._notesEntity.instanceColor.needsUpdate = true;
    }
  }

  /**
   * Update instance's matrix with this object
   */
  private _updateInstanceMatrix() {
    this.updateMatrix();
    this._notesEntity.setMatrixAt(this._index, this.matrix);
    this._notesEntity.instanceMatrix.needsUpdate = true;
  }

  /**
   * Update
   */
  update(delta?: number) {
    if (!this._isPlaying || !delta) return;

    this._moveForwrard(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    disposeObject(this);
  }
}