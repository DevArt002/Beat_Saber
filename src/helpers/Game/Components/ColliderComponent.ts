import * as THREE from 'three';

import { Component } from './Component';
import { EComponentType } from 'src/types';
import { Entity } from 'src/helpers/Game/Entities';

// TODO Extend to have sphere collider as well
export class ColliderComponent<T extends Entity<THREE.Mesh>> extends Component<T> {
  _type: EComponentType = EComponentType.Collider;
  private _bbox: THREE.Box3;
  private _collidableEntities: Set<Entity<THREE.Mesh>> = new Set<Entity<THREE.Mesh>>();

  // Callbacks
  private _onCollide: ((entity: Entity<THREE.Mesh>) => void) | null = null;

  constructor(entity: T) {
    super(entity);

    // Generate bounding box
    const bbox = new THREE.Box3();
    bbox.setFromObject(entity.object3D);
    this._bbox = bbox;
  }

  // Getter of bbox
  get bbox(): THREE.Box3 {
    return this._bbox;
  }

  // Getter of collidableEntities
  get collidableEntities(): Set<Entity<THREE.Mesh>> {
    return this._collidableEntities;
  }

  // Setter of collidableEntities
  set collidableEntities(val: Set<Entity<THREE.Mesh>>) {
    this._collidableEntities = val;
  }

  // Getter of onCollide
  get onCollide(): ((entity: Entity<THREE.Mesh>) => void) | null {
    return this._onCollide;
  }

  // Setter of onCollide
  set onCollide(val: ((entity: Entity<THREE.Mesh>) => void) | null) {
    this._onCollide = val;
  }

  // Getter of collidable colliders
  get collidableColliders(): Set<ColliderComponent<T>> {
    const colliders: ColliderComponent<T>[] = [];
    for (const collidableEntity of this._collidableEntities) {
      const collider = collidableEntity.getComponentByType(EComponentType.Collider);

      if (collider === null) continue;

      colliders.push(collider as ColliderComponent<T>);
    }

    return new Set(colliders);
  }

  /**
   * Check collisions
   */
  private _checkCollisions() {
    for (const collidableCollider of this.collidableColliders) {
      if (this._bbox.intersectsBox(collidableCollider.bbox)) {
        this._onCollide?.(collidableCollider.entity);
      }
    }
  }

  /**
   * Update bbox
   */
  private _updateBBox() {
    const { geometry, matrixWorld } = this._entity.object3D;

    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      this._bbox.copy(geometry.boundingBox).applyMatrix4(matrixWorld);
    }
  }

  /**
   * Update
   */
  update() {
    this._updateBBox();
    this._checkCollisions();
  }

  /**
   * Dispose
   */
  dispose() {}
}
