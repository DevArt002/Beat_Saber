import * as THREE from 'three';

export abstract class Entity extends THREE.Object3D {
  constructor() {
    super();
  }

  /**
   * Update
   */
  abstract update(delta?: number): void;

  /**
   * Dispose
   */
  abstract dispose(): void;
}
