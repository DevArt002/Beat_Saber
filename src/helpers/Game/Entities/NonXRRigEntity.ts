import { HAND_HEIGHT, RIG_HEIGHT } from 'src/constants';

import { BeatSaberRigEntity } from './BeatSaberRigEntity';
import { RigSystem } from 'src/helpers/Game/Systems';
import { ScoreEntity } from './ScoreEntity';
import { disposeObject } from 'src/utils';

export class NonXRRigEntity extends BeatSaberRigEntity {
  private _scoreEntity: ScoreEntity | null = null;

  constructor(rigSystem: RigSystem, private readonly _isSelf: boolean = true) {
    super(rigSystem);

    // Saber entities
    this.leftSaber.position.x -= 0.25;
    this.rightSaber.position.x += 0.25;

    this.add(this.leftSaber.object3D);
    this.add(this.rightSaber.object3D);

    if (!_isSelf) {
      const scoreEntity = new ScoreEntity(rigSystem, false);
      scoreEntity.position.y -= HAND_HEIGHT;
      scoreEntity.position.z -= 2;
      this.add(scoreEntity.object3D);
      this._scoreEntity = scoreEntity;
    }

    this.position.y -= RIG_HEIGHT - HAND_HEIGHT;
  }

  // Getter of score
  get score(): number {
    return this._scoreEntity?.score ?? 0;
  }

  // Setter of score
  set score(val: number) {
    if (!this._scoreEntity) return;

    this._scoreEntity.score = val;
  }

  /**
   * Update
   */
  update(delta?: number) {
    this._scoreEntity?.update(delta);
    this.leftSaber.update(delta);
    this.rightSaber.update(delta);
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._scoreEntity?.dispose();
    this.leftSaber.dispose();
    this.rightSaber.dispose();
    this._disposeComponents();
    disposeObject(this._object3D);
  }
}
