import { Entity } from './Entity';
import { RigSystem } from 'src/helpers/Game/Systems';

export class NonXRRigEntity extends Entity {
  constructor(rigSystem: RigSystem) {
    super();

    const { saberEntities } = rigSystem;
    const [sourceLeftSaber, sourceRightSaber] = saberEntities;

    if (sourceLeftSaber !== null && sourceRightSaber !== null) {
      const leftSaber = sourceLeftSaber.clone();
      const rightSaber = sourceRightSaber.clone();
      this.add(leftSaber);
      this.add(rightSaber);
      leftSaber.position.x -= 0.2;
      rightSaber.position.x += 0.2;
      this.position.set(0, -0.2, 0);
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
