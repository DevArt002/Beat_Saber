import { Entity } from './Entity';
import { HTMLMesh } from 'three/examples/jsm/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/examples/jsm/interactive/InteractiveGroup.js';
import { System } from 'src/helpers/Game/Systems';
import { disposeObject } from 'src/utils';

export class ScoreEntity extends Entity<InteractiveGroup> {
  private _dom: HTMLDivElement;
  private _scoreMesh: HTMLMesh | null = null;
  private _score: number = 0;

  constructor(private readonly _system: System, private readonly _isSelf: boolean = true) {
    const { game } = _system;
    const { renderer, camera, container } = game;

    super(new InteractiveGroup(renderer, camera));

    const dom = document.createElement('div');
    dom.style.background = 'white';
    dom.style.width = '2000px';
    dom.style.height = '500px';
    dom.style.fontSize = '200px';
    dom.style.padding = '4px';
    dom.style.display = 'flex';
    dom.style.justifyContent = 'center';
    dom.style.alignItems = 'center';
    dom.style.borderRadius = '4px';
    dom.innerText = `${this._score}`;
    container.appendChild(dom);
    const scoreMesh = new HTMLMesh(dom);
    if (_isSelf) {
      scoreMesh.position.y = 0.2;
      scoreMesh.position.z -= 18;
    }
    this.add(scoreMesh);
    this._dom = dom;
    this._scoreMesh = scoreMesh;
  }

  // Getter of score
  get score(): number {
    return this._score;
  }

  // Setter of score
  set score(val: number) {
    this._score = val;
    this._dom.innerText = `${val}`;
  }

  /**
   * Update
   */
  update(delta?: number) {
    // TODO Fixme: Texture doesn't have update function in ts, but has in js
    // @ts-ignore
    this._scoreMesh?.material.map?.update();
    this._updateComponents(delta);
  }

  /**
   * Dispose
   */
  dispose() {
    this._dom.remove();
    this._scoreMesh?.dispose();
    disposeObject(this._object3D);
    this._disposeComponents();
  }
}
