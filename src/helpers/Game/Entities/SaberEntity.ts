import * as THREE from 'three';

import { ColliderComponent } from 'src/helpers/Game/Components';
import { Entity } from './Entity';

export class SaberEntity extends Entity<THREE.Mesh> {
  private _size: THREE.Vector3Tuple = [0.02, 0.02, 1.5];

  constructor(private readonly _color: number) {
    super(new THREE.Mesh());

    const [w, h, d] = this._size;
    this._object3D.geometry = new THREE.BoxGeometry(w, h, d);
    this._object3D.material = new THREE.MeshBasicMaterial({ color: this._color });

    // Add collider component
    this.addComponent(new ColliderComponent(this));
  }

  // Getter of size
  get size(): THREE.Vector3Tuple {
    return this._size;
  }
}
