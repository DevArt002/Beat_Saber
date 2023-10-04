import { EComponentType } from 'src/types';

export abstract class Component<T> {
  protected abstract _type: EComponentType;

  constructor(protected readonly _entity: T) {}

  // Getter of entity
  get entity(): T {
    return this._entity;
  }

  // Getter of type
  get type(): EComponentType {
    return this._type;
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
