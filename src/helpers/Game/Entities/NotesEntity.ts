import * as THREE from 'three';

import { BeatSaberSystem } from 'src/helpers/Game/Systems';
import { Entity } from './Entity';
import { INoteCubeData } from 'src/types';
import { NoteEntity } from './NoteEntity';

// TODO Extend this entity to handle 2+ geometries
export class NotesEntity extends THREE.InstancedMesh implements Entity {
  private readonly _noteEntities: NoteEntity[];
  private readonly _noteSize: number;

  constructor(private readonly _beatSaberSystem: BeatSaberSystem) {
    const { cellSize, maxNoteCount } = _beatSaberSystem;
    const noteSize = Math.sqrt((cellSize * cellSize) / 2);
    super(new THREE.BoxGeometry(noteSize, noteSize, noteSize), undefined, maxNoteCount);

    this.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this._noteSize = noteSize;

    // Initialize note entities
    const noteEntities: NoteEntity[] = [];
    for (let i = 0; i < maxNoteCount; i++) {
      noteEntities.push(new NoteEntity(this, i));
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
   * Animate instances
   */
  update(delta?: number) {
    for (const key in this._noteEntities) {
      this._noteEntities[key].update(delta);
    }
  }
}
