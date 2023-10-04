import * as THREE from 'three';

import { Entity } from './Entity';

export class FloorEntity extends THREE.Mesh implements Entity {
  constructor(private readonly _size: THREE.Vector2Tuple) {
    super();

    this.geometry = new THREE.PlaneGeometry(_size[0], _size[1]);
    this.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.rotateX(-Math.PI / 2);
  }

  // Getter of size
  get size(): THREE.Vector2Tuple {
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
