import { HAND_HEIGHT, RIG_HEIGHT } from 'src/constants';

import { BeatSaberRigEntity } from './BeatSaberRigEntity';
import { RigSystem } from 'src/helpers/Game/Systems';

export class NonXRRigEntity extends BeatSaberRigEntity {
  constructor(rigSystem: RigSystem) {
    super(rigSystem);

    // Saber entities
    this.leftSaber.position.x -= 0.2;
    this.rightSaber.position.x += 0.2;

    this.add(this.leftSaber.object3D);
    this.add(this.rightSaber.object3D);
    this.position.y -= RIG_HEIGHT - HAND_HEIGHT;
  }
}
