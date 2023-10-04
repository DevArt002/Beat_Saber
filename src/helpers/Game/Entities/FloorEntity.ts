import * as THREE from 'three';

import { Entity } from './Entity';
import { TXY } from 'src/types';

export class FloorEntity extends THREE.Mesh implements Entity {
  private _size: TXY = [3, 20];

  constructor() {
    super();

    const [w, d] = this._size;
    this.geometry = new THREE.PlaneGeometry(w, d);
    this.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.rotateX(-Math.PI / 2);
  }

  // Getter of size
  get size(): TXY {
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
