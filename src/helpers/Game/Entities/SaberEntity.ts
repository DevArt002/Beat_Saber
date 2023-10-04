import * as THREE from 'three';

import { ColliderComponent } from 'src/helpers/Game/Components';
import { ESaberType } from 'src/types';
import { Entity } from './Entity';

export class SaberEntity extends Entity<THREE.Mesh> {
  private _size: THREE.Vector3Tuple = [0.02, 0.02, 2];

  constructor(private readonly _type: ESaberType) {
    super(new THREE.Mesh());

    const [w, h, d] = this._size;
    this._object3D.geometry = new THREE.BoxGeometry(w, h, d);
    this._object3D.material = new THREE.MeshBasicMaterial({
      color: _type === ESaberType.LEFT ? 0xff0000 : 0x0000ff,
    });

    // Add collider component
    this.addComponent(new ColliderComponent(this));
  }

  // Getter of type
  get type(): ESaberType {
    return this._type;
  }

  // Getter of size
  get size(): THREE.Vector3Tuple {
    return this._size;
  }
}
