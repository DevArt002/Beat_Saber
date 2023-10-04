import { BaseEntity } from './BaseEntity';
import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup.js';
import { StatsSystem } from 'src/helpers/Game/Systems';
import { disposeObject } from 'src/utils';

export class StatsEntity extends BaseEntity {
  private _statsMesh: HTMLMesh | null = null;

  constructor(statsSystem: StatsSystem) {
    super(statsSystem);

    const { stats } = statsSystem;
    const { renderer, camera } = statsSystem.game;

    this._object3D = new InteractiveGroup(renderer, camera);
    if (stats !== null) {
      const statsMesh = new HTMLMesh(stats.dom);
      statsMesh.position.x = 0;
      statsMesh.position.y = 1.5;
      statsMesh.position.z = -1;
      statsMesh.rotation.x = Math.PI / 4;
      statsMesh.scale.setScalar(2.5);
      this._object3D.add(statsMesh);
      this._statsMesh = statsMesh;
    }
  }

  /**
   * Update
   */
  update() {
    // TODO Texture doesn't have update function in type definition
    // @ts-ignore
    this._statsMesh?.material.map?.update();
  }

  /**
   * Dispose
   */
  dispose() {
    this._statsMesh?.dispose();
    disposeObject(this._object3D);
  }
}
