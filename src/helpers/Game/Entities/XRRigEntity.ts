import { Entity } from './Entity';
import { HAND_HEIGHT } from 'src/constants';
import { RigSystem } from 'src/helpers/Game/Systems';

export class XRRigEntity extends Entity {
  constructor(rigSystem: RigSystem) {
    super();

    const { game, saberEntities } = rigSystem;
    const { renderer } = game;
    const [sourceLeftSaber, sourceRightSaber] = saberEntities;

    if (sourceLeftSaber !== null && sourceRightSaber !== null) {
      const leftSaber = sourceLeftSaber.clone();
      const rightSaber = sourceRightSaber.clone();
      const controller1 = renderer.xr.getController(0);
      controller1.add(rightSaber);
      this.add(controller1);

      const controller2 = renderer.xr.getController(1);
      controller2.add(leftSaber);
      this.add(controller2);
      this.position.y = HAND_HEIGHT;
    }
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
