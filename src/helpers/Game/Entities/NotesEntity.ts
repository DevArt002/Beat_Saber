import * as THREE from 'three';

import { BeatSaberSystem } from 'src/helpers/Game/Systems';
import { Entity } from './Entity';
import { INoteCubeData } from 'src/types';
import { NoteEntity } from './NoteEntity';

// TODO Extend this entity to handle 2+ geometries
export class NotesEntity extends Entity<THREE.InstancedMesh> {
  private readonly _noteEntities: NoteEntity[]; // Geometries and materials are rendered in instanced mesh, but NoteEntity is needed for collider and animation
  private readonly _noteSize: number;

  constructor(private readonly _beatSaberSystem: BeatSaberSystem) {
    const { cellSize, maxNoteCount } = _beatSaberSystem;
    const noteSize = Math.sqrt((cellSize * cellSize) / 2);
    const geometry = new THREE.BoxGeometry(noteSize, noteSize, noteSize);
    super(new THREE.InstancedMesh(geometry, undefined, maxNoteCount));

    this._object3D.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._noteSize = noteSize;

    // Initialize note entities
    const noteEntities: NoteEntity[] = [];
    for (let i = 0; i < maxNoteCount; i++) {
      const noteEntity = new NoteEntity(this, i);
      this.add(noteEntity.object3D);
      noteEntities.push(noteEntity);
    }
    this._noteEntities = noteEntities;
  }

  // Getter of beatsaber system
  get beatSaberSystem(): BeatSaberSystem {
    return this._beatSaberSystem;
  }

  // Getter of note size
  get noteSize(): number {
    return this._noteSize;
  }

  // Getter of lazy notes
  get lazyNotes(): NoteEntity[] {
    return this._noteEntities.filter(({ isPlaying }) => !isPlaying);
  }

  /**
   * Add new notes
   */
  addNewNotes(notes: INoteCubeData[], offset: number) {
    for (let i = 0; i < notes.length; i++) {
      const { _type, _lineIndex, _lineLayer, _cutDirection } = notes[i];
      this.lazyNotes[i].play(_type, _lineIndex, _lineLayer, _cutDirection, offset);
    }
  }

  /**
   * Stop playing
   * @returns
   */
  stop() {
    for (const noteEntity of this._noteEntities) {
      noteEntity.stop();
    }
  }

  /**
   * Listener when xr presenting state is changed
   * @param isPresenting
   */
  onXRPresent(isPresenting: boolean) {
    for (const noteEntity of this._noteEntities) {
      noteEntity.onXRPresent(isPresenting);
    }
  }

  /**
   * Update note entities
   */
  protected _updateNoteEntities(delta?: number) {
    for (const noteEntity of this._noteEntities) {
      noteEntity.update(delta);
    }
  }

  /**
   * Dispose note entities
   */
  protected _disposeNoteEntities() {
    for (const noteEntity of this._noteEntities) {
      noteEntity.dispose();
    }
  }

  /**
   * Animate instances
   */
  update(delta?: number) {
    this._updateNoteEntities(delta);
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._object3D.dispose();
    this._disposeNoteEntities();
    this._disposeComponents();
  }
}
