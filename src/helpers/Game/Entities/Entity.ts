import * as THREE from 'three';

export abstract class Entity extends THREE.Object3D {
  constructor() {
    super();
  }

  /**
   * Update
   */
  abstract update(): void;

  /**
   * Dispose
   */
  abstract dispose(): void;
}
