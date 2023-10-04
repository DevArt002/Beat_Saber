import { BaseEntity } from 'src/helpers/Game/Entities';
import { EComponentType } from 'src/types';

export abstract class BaseComponent {
  abstract type: EComponentType;

  constructor(protected readonly _entity: BaseEntity) {}

  // Getter of entity
  get entity(): BaseEntity {
    return this._entity;
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
