import { Entity } from 'src/helpers/Game/Entities';
import { Game } from 'src/helpers';
import { TEntityID } from 'src/types';

export abstract class System {
  protected _entities: Record<TEntityID, Entity> = {};

  constructor(protected readonly _game: Game) {}

  // Getter of game
  get game(): Game {
    return this._game;
  }

  // Getter of entities
  get entities(): Record<TEntityID, Entity> {
    return this._entities;
  }

  /**
   * Add single entity
   * @param entity
   */
  addEntity(entity: Entity, parent?: THREE.Object3D) {
    if (parent) {
      parent.add(entity);
    } else {
      this._game.scene.add(entity);
    }
    this._entities[entity.id] = entity;
  }

  /**
   * Add multiple entities
   * @param entities
   */
  addEntities(entities: Entity[], parent?: THREE.Object3D) {
    entities.forEach((entity) => this.addEntity(entity, parent));
  }

  /**
   * Get single entity by entity id
   * @param entityId
   * @returns Entity
   */
  getEntity(entityId: TEntityID): Entity | null {
    return this._entities[entityId] ?? null;
  }

  /**
   * Get multiple entities by entity id
   * @param entityIds
   * @returns Entities
   */
  getEntitys(entityIds: TEntityID[]): Array<Entity | null> {
    return entityIds.map((entityId) => this.getEntity(entityId));
  }

  /**
   * Remove single entity by entity id
   * @param entityId
   */
  removeEntity(entityId: TEntityID) {
    this._entities[entityId]?.removeFromParent();
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
   * Update
   */
  update() {
    for (const key in this._entities) {
      this._entities[key].update();
    }
  }

  /**
   * Dispose
   */
  dispose() {
    for (const key in this._entities) {
      this._entities[key].dispose();
    }
  }
}
