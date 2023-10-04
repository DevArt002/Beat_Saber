import * as THREE from 'three';

import { Entity } from './Entity';

export class SaberEntity extends THREE.Mesh implements Entity {
  private _size: THREE.Vector3Tuple = [0.02, 0.02, 1.5];

  constructor(private readonly _color: number) {
    super();

    const [w, h, d] = this._size;
    this.geometry = new THREE.BoxGeometry(w, h, d);
    this.material = new THREE.MeshBasicMaterial({ color: this._color });
  }

  // Getter of size
  get size(): THREE.Vector3Tuple {
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
