import { Entity } from './Entity';
import { RigSystem } from 'src/helpers/Game/Systems';
import { SaberEntity } from './SaberEntity';

export class BeatSaberRigEntity extends Entity {
  protected _saberEntities: [SaberEntity, SaberEntity];

  constructor(rigSystem: RigSystem) {
    super();

    // Saber entities
    const leftSaber = new SaberEntity(0xff0000);
    const rightSaber = new SaberEntity(0x0000ff);
    leftSaber.position.z -= leftSaber.size[2] / 2;
    rightSaber.position.z -= rightSaber.size[2] / 2;
    this._saberEntities = [leftSaber, rightSaber];
  }

  // Getter of sabers
  get saberEntities(): [SaberEntity, SaberEntity] {
    return this._saberEntities;
  }

  // Getter of left saber
  get leftSaber(): SaberEntity {
    return this.saberEntities[0];
  }

  // Getter of right saber
  get rightSaber(): SaberEntity {
    return this.saberEntities[1];
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
