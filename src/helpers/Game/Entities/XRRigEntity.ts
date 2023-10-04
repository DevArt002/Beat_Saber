import { BeatSaberRigEntity } from './BeatSaberRigEntity';
import { HAND_HEIGHT } from 'src/constants';
import { RigSystem } from 'src/helpers/Game/Systems';

export class XRRigEntity extends BeatSaberRigEntity {
  constructor(rigSystem: RigSystem) {
    super(rigSystem);

    const { renderer } = rigSystem.game;

    // XR controllers
    const controller1 = renderer.xr.getController(0);
    controller1.add(this.rightSaber.object3D);
    this.add(controller1);

    const controller2 = renderer.xr.getController(1);
    controller2.add(this.leftSaber.object3D);
    this.add(controller2);
    this.position.y = HAND_HEIGHT;
  }
}
