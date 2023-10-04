import { BaseEntity } from 'src/helpers/Game/Entities';
import { Game } from 'src/helpers';
import { TEntityID } from 'src/types';

export abstract class BaseSystem {
  protected _entities: Record<TEntityID, BaseEntity> = {};

  constructor(protected readonly _game: Game) {}

  // Getter of game
  get game(): Game {
    return this._game;
  }

  // Getter of entities
  get entities(): Record<TEntityID, BaseEntity> {
    return this._entities;
  }

  // Initialize system
  abstract init(): void;

  /**
   * Add single entity
   * @param entity
   */
  addEntity(entity: BaseEntity) {
    this._game.addEntity(entity);
    this._entities[entity.id] = entity;
  }

  /**
   * Add multiple entities
   * @param entities
   */
  addEntities(entities: BaseEntity[]) {
    entities.forEach((entity) => this.addEntity(entity));
  }

  /**
   * Get single entity by entity id
   * @param entityId
   * @returns Entity
   */
  getEntity(entityId: TEntityID): BaseEntity | null {
    return this._entities[entityId] ?? null;
  }

  /**
   * Get multiple entities by entity id
   * @param entityIds
   * @returns Entities
   */
  getEntitys(entityIds: TEntityID[]): Array<BaseEntity | null> {
    return entityIds.map((entityId) => this.getEntity(entityId));
  }

  /**
   * Remove single entity by entity id
   * @param entityId
   */
  removeEntity(entityId: TEntityID) {
    this._game.removeEntity(this._entities[entityId]);
    delete this._entities[entityId];
  }

  /**
   * Remove multiple entities by entity id
   * @param entityIds
   */
  removeEntities(entityIds: TEntityID[]) {
    entityIds.map((entityId) => this.removeEntity(entityId));
  }

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
