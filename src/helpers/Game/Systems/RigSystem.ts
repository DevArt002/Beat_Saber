import { BeatSaberRigEntity, NonXRRigEntity, XRRigEntity } from 'src/helpers/Game/Entities';
import { HAND_HEIGHT, RIG_HEIGHT } from 'src/constants';

import { Game } from 'src/helpers';
import { System } from './System';
import { TPeerId } from 'src/types';
import { isOddNumber } from 'src/utils';

export class RigSystem extends System {
  private _xrRigEntity: XRRigEntity | null = null;
  private _nonXRRigEntity: NonXRRigEntity | null = null;
  private _playersRigEntities: Record<TPeerId, NonXRRigEntity> = {}; // Non-XR rigs for other players
  private _activeRigEntity: BeatSaberRigEntity | null = null;

  constructor(game: Game) {
    super(game);
  }

  // Getter of active rig entity
  get activeRigEntity(): BeatSaberRigEntity | null {
    return this._activeRigEntity;
  }

  /**
   * Initialize
   */
  init() {
    // Rig entities
    this._xrRigEntity = new XRRigEntity(this);
    this._nonXRRigEntity = new NonXRRigEntity(this);
    this.addEntity(this._nonXRRigEntity, this._game.camera); // Add non-xr rig as default
    this._activeRigEntity = this._nonXRRigEntity;

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
      this._activeRigEntity = this._xrRigEntity;
    } else {
      // Add camera to scene root
      camera.position.y = RIG_HEIGHT;
      scene.add(camera);
      // Remove xr rig
      this.removeEntity(this._xrRigEntity.id);
      // Add non-xr rig
      this.addEntity(this._nonXRRigEntity, camera);
      this._activeRigEntity = this._nonXRRigEntity;
    }
  }

  /**
   * Update players
   * @param players
   */
  private _updatePlayers() {
    Object.entries(this._game.players).forEach(([key, { sabersMatrix }], index) => {
      // Update the player rig
      if (key in this._playersRigEntities) {
        const { leftSaber, rightSaber } = this._playersRigEntities[key];

        if (sabersMatrix[0]) {
          leftSaber.position.setFromMatrixPosition(sabersMatrix[0]);
          leftSaber.quaternion.setFromRotationMatrix(sabersMatrix[0]);
        }

        if (sabersMatrix[1]) {
          rightSaber.position.setFromMatrixPosition(sabersMatrix[1]);
          rightSaber.quaternion.setFromRotationMatrix(sabersMatrix[1]);
        }
      }
      // Create new rig
      else {
        const playerRigEntity = new NonXRRigEntity(this);
        playerRigEntity.position.set(
          3 * (isOddNumber(index) ? 1 : -1) * Math.ceil((index + 1) / 2),
          0,
          -10,
        );
        this.addEntity(playerRigEntity);
        this._playersRigEntities[key] = playerRigEntity;
      }
    });
  }

  /**
   * Update
   */
  update() {
    for (const key in this._entities) {
      this._entities[key].update();
    }

    this._updatePlayers();
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
