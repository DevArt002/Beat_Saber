import { EComponentType, TXYZ } from 'src/types';

import { BaseComponent } from './BaseComponent';
import { BaseEntity } from 'src/helpers/Game/Entities';

export class TransformComponent extends BaseComponent {
  type: EComponentType = EComponentType.Transform;

  private _position: TXYZ = [0, 0, 0];
  private _rotation: TXYZ = [0, 0, 0];
  private _scale: TXYZ = [1, 1, 1];

  constructor(entity: BaseEntity) {
    super(entity);
  }

  // Getter of position
  get position(): TXYZ {
    return this._position;
  }

  // Setter of position
  set position(val: TXYZ) {
    this.entity.object3D?.position.fromArray(val);
    this._position = val;
  }

  // Getter of rotation
  get rotation(): TXYZ {
    return this._rotation;
  }

  // Setter of rotation
  set rotation(val: TXYZ) {
    this.entity.object3D?.rotation.fromArray(val);
    this._rotation = val;
  }

  // Getter of scale
  get scale(): TXYZ {
    return this._scale;
  }

  // Setter of scale
  set scale(val: TXYZ) {
    this.entity.object3D?.scale.fromArray(val);
    this._scale = val;
  }

  /**
   * Update
   */
  update() {}

  /**
   * Dispose
   */
  dispose() {}
}
