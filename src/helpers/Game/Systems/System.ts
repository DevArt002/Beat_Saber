import * as THREE from 'three';

import { Entity } from 'src/helpers/Game/Entities';
import { Game } from 'src/helpers';
import { TEntityID } from 'src/types';

export abstract class System {
  protected _entities: Record<TEntityID, Entity<THREE.Object3D>> = {};

  constructor(protected readonly _game: Game) {}

  // Getter of game
  get game(): Game {
    return this._game;
  }

  // Getter of entities
  get entities(): Record<TEntityID, Entity<THREE.Object3D>> {
    return this._entities;
  }

  /**
   * Add single entity
   * @param entity
   */
  addEntity(entity: Entity<THREE.Object3D>, parent?: THREE.Object3D) {
    if (parent) {
      parent.add(entity.object3D);
    } else {
      this._game.scene.add(entity.object3D);
    }
    this._entities[entity.id] = entity;
  }

  /**
   * Add multiple entities
   * @param entities
   */
  addEntities(entities: Entity<THREE.Object3D>[], parent?: THREE.Object3D) {
    entities.forEach((entity) => this.addEntity(entity, parent));
  }

  /**
   * Get single entity by entity id
   * @param entityId
   * @returns Entity
   */
  getEntity(entityId: TEntityID): Entity<THREE.Object3D> | null {
    return this._entities[entityId] ?? null;
  }

  /**
   * Get multiple entities by entity id
   * @param entityIds
   * @returns Entities
   */
  getEntitys(entityIds: TEntityID[]): Array<Entity<THREE.Object3D> | null> {
    return entityIds.map((entityId) => this.getEntity(entityId));
  }

  /**
   * Remove single entity by entity id
   * @param entityId
   */
  removeEntity(entityId: TEntityID) {
    this._entities[entityId]?.object3D.removeFromParent();
    delete this._entities[entityId];
  }

  /**
   * Remove multiple entities by entity id
   * @param entityIds
   */
  removeEntities(entityIds: TEntityID[]) {
    entityIds.map((entityId) => this.removeEntity(entityId));
  }

  // Initialize system
  abstract init(): void;

  /**
   * Listener when xr presenting state is changed
   * @param isPresenting
   */
  onXRPresent(isPresenting: boolean) {}

  /**
   * Update entities
   */
  protected _updateEntities(delta?: number) {
    for (const key in this._entities) {
      this._entities[key].update(delta);
    }
  }

  /**
   * Dispose entities
   */
  protected _disposeEntities() {
    for (const key in this._entities) {
      this._entities[key].dispose();
    }
  }

  /**
   * Update
   */
  update(delta?: number) {
    this._updateEntities(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._disposeEntities();
  }
}
