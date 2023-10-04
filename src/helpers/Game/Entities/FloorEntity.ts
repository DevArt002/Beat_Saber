import * as THREE from 'three';

import { Entity } from './Entity';

export class FloorEntity extends Entity<THREE.Mesh> {
  constructor(private readonly _size: THREE.Vector2Tuple) {
    super(new THREE.Mesh());

    this._object3D.geometry = new THREE.PlaneGeometry(_size[0], _size[1]);
    this._object3D.material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this._object3D.rotateX(-Math.PI / 2);
  }

  // Getter of size
  get size(): THREE.Vector2Tuple {
    return this._size;
  }
}
