import { Entity } from './Entity';
import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup.js';
import { StatsSystem } from 'src/helpers/Game/Systems';
import { disposeObject } from 'src/utils';

export class StatsEntity extends Entity<InteractiveGroup> {
  private _statsMesh: HTMLMesh | null = null;

  constructor(private readonly _statsSystem: StatsSystem) {
    const { stats } = _statsSystem;
    const { renderer, camera } = _statsSystem.game;

    super(new InteractiveGroup(renderer, camera));

    if (stats !== null) {
      const statsMesh = new HTMLMesh(stats.dom);
      statsMesh.position.x = 0;
      statsMesh.position.y = 1.8;
      statsMesh.position.z = -1;
      statsMesh.rotation.x = Math.PI / 4;
      statsMesh.scale.setScalar(2.5);
      this.add(statsMesh);
      this._statsMesh = statsMesh;
    }
  }

  /**
   * Update
   */
  update(delta?: number) {
    // TODO Fixme: Texture doesn't have update function in ts, but has in js
    // @ts-ignore
    this._statsMesh?.material.map?.update();
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._statsMesh?.dispose();
    disposeObject(this._object3D);
    this._disposeComponents();
  }
}
