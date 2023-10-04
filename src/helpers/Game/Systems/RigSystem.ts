import { HAND_HEIGHT, RIG_HEIGHT } from 'src/constants';
import { NonXRRigEntity, SaberEntity, XRRigEntity } from 'src/helpers/Game/Entities';

import { Game } from 'src/helpers';
import { System } from './System';

export class RigSystem extends System {
  private _saberEntities: [SaberEntity | null, SaberEntity | null] = [null, null];
  private _xrRigEntity: XRRigEntity | null = null;
  private _nonXRRigEntity: NonXRRigEntity | null = null;

  constructor(game: Game) {
    super(game);
  }

  // Getter of sabers
  get saberEntities(): [SaberEntity | null, SaberEntity | null] {
    return this._saberEntities;
  }

  /**
   * Initialize
   */
  init() {
    // Saber entities
    const leftSaber = new SaberEntity(0xff0000);
    const rightSaber = new SaberEntity(0x0000ff);
    leftSaber.position.z -= leftSaber.size[2] / 2;
    rightSaber.position.z -= rightSaber.size[2] / 2;
    this._saberEntities[0] = leftSaber;
    this._saberEntities[1] = rightSaber;

    // Rig entities
    this._xrRigEntity = new XRRigEntity(this);
    this._nonXRRigEntity = new NonXRRigEntity(this);
    this.addEntity(this._nonXRRigEntity, this._game.camera); // Add non-xr rig as default

    this._addEventListeners();
  }

  /**
   * Add event listeners
   */
  private _addEventListeners = () => {
    const { domElement } = this._game.renderer;

    domElement.addEventListener('mousedown', this._onMouseDown, false);
    domElement.addEventListener('mousemove', this._onMouseMove, false);
  };

  /**
   * Remove event listeners
   */
  private _removeEventListeners = () => {
    const { domElement } = this._game.renderer;

    domElement.removeEventListener('mousedown', this._onMouseDown, false);
    domElement.removeEventListener('mousemove', this._onMouseMove, false);
  };

  /**
   * Mouse down listener
   */
  private _onMouseDown = () => {
    this._game.renderer.domElement.requestPointerLock();
  };

  /**
   * Mouse move listener
   */
  private _onMouseMove = (e: MouseEvent) => {
    const { camera } = this.game;

    if (document.pointerLockElement === this._game.renderer.domElement) {
      camera.rotation.y -= e.movementX / 500;
      camera.rotation.x -= e.movementY / 500;
    }
  };

  /**
   * Listener when xr presenting state is changed
   * @param isPresenting
   */
  onXRPresent(isPresenting: boolean) {
    if (this._xrRigEntity === null || this._nonXRRigEntity === null) return;
    const { camera, scene } = this._game;

    if (isPresenting) {
      // Add camera to xr rig
      camera.position.y = RIG_HEIGHT - HAND_HEIGHT;
      this._xrRigEntity.add(camera);
      // Add xr rig
      this.addEntity(this._xrRigEntity);
      // Remove non-xr rig
      this.removeEntity(this._nonXRRigEntity.id);
    } else {
      // Add camera to scene root
      camera.position.y = RIG_HEIGHT;
      scene.add(camera);
      // Remove xr rig
      this.removeEntity(this._xrRigEntity.id);
      // Add non-xr rig
      this.addEntity(this._nonXRRigEntity, camera);
    }
  }

  /**
   * Dispose
   */
  dispose() {
    this._removeEventListeners();

    for (const key in this._entities) {
      this._entities[key].dispose();
    }
  }
}
