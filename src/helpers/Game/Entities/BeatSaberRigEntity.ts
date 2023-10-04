import * as THREE from 'three';

import { ESaberType } from 'src/types';
import { Entity } from './Entity';
import { RigSystem } from 'src/helpers/Game/Systems';
import { SaberEntity } from './SaberEntity';
import { disposeObject } from 'src/utils';

export class BeatSaberRigEntity extends Entity<THREE.Object3D> {
  protected _saberEntities: [SaberEntity, SaberEntity];

  constructor(private readonly _rigSystem: RigSystem) {
    super(new THREE.Object3D());

    // Saber entities
    const leftSaber = new SaberEntity(ESaberType.LEFT);
    const rightSaber = new SaberEntity(ESaberType.RIGHT);
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
  update(delta?: number) {
    this.leftSaber.update(delta);
    this.rightSaber.update(delta);
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this.leftSaber.dispose();
    this.rightSaber.dispose();
    this._disposeComponents();
    disposeObject(this._object3D);
  }
}
