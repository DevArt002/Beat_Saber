import * as THREE from 'three';

import { Entity } from './Entity';
import { TXYZ } from 'src/types';

export class SaberEntity extends THREE.Mesh implements Entity {
  private _size: TXYZ = [0.02, 0.02, 1];

  constructor(private readonly _color: number) {
    super();

    const [w, h, d] = this._size;
    this.geometry = new THREE.BoxGeometry(w, h, d);
    this.material = new THREE.MeshBasicMaterial({ color: this._color });
  }

  // Getter of size
  get size(): TXYZ {
    return this._size;
  }

  /**
   * Update
   */
  update() {}

  /**
   * Dispose
   */
  dispose() {}
}
