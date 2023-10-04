import * as THREE from 'three';

import { BeatSaberSystem, RigSystem, StatsSystem } from './Systems';
import { EGameEvents, IPeerPlayerData, TPeerData, TPeerId } from 'src/types';
import { IS_DEV, RIG_HEIGHT } from 'src/constants';

export class Game extends THREE.EventDispatcher<any> {
  // Renderer related attributes
  private _renderer: THREE.WebGLRenderer; // Webgl renderer
  private _scene: THREE.Scene; // Scene
  private _camera: THREE.PerspectiveCamera; // Perspective camera
  private _width: number = 1; // Canvas width
  private _height: number = 1; // Canvas height
  private _pixelRatio: number = window.devicePixelRatio; // Display ratio
  private _aspect: number = 1; // Camera aspect

  // Systems
  private _rigSystem: RigSystem = new RigSystem(this);
  private _beatSaberSystem: BeatSaberSystem = new BeatSaberSystem(this);
  private _statsSystem: StatsSystem = new StatsSystem(this);

  // Callbacks from outside of game
  private _onBroadcastMsg: ((data: TPeerData) => void) | null = null;

  private _players: Record<TPeerId, IPeerPlayerData> = {};
  private _prevIsXR: boolean = false;

  constructor(private readonly _container: HTMLDivElement) {
    super();

    this._width = this._container.offsetWidth || 1;
    this._height = this._container.offsetHeight || 1;
    this._aspect = this._width / this._height;

    // Initialize webgl renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !(this._pixelRatio > 1),
      alpha: true,
    });
    renderer.setPixelRatio(this._pixelRatio);
    renderer.setSize(this._width, this._height);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType('local');
    this._container.appendChild(renderer.domElement);
    this._renderer = renderer;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00ff00);
    this._scene = scene;

    // TODO Expecting camera to be inherited to core entity
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(45, this._aspect, 0.1, 1000);
    camera.position.set(0, RIG_HEIGHT, 0);
    this._scene.add(camera);
    this._camera = camera;

    // TODO Expecting lights to be inherited to core entity
    // Initialize lights
    const directLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const ambientLight = new THREE.AmbientLight(0x404040);
    this._scene.add(directLight);
    this._scene.add(ambientLight);
  }

  // Getter of container
  get container(): HTMLDivElement {
    return this._container;
  }

  // Getter of width
  get width(): number {
    return this._width;
  }

  // Getter of height
  get height(): number {
    return this._height;
  }

  // Getter of pixelRatio
  get pixelRatio(): number {
    return this._pixelRatio;
  }

  // Getter of aspect
  get aspect(): number {
    return this._aspect;
  }

  // Getter of webgl renderer
  get renderer(): THREE.WebGLRenderer {
    return this._renderer;
  }

  // Getter of Scene
  get scene(): THREE.Scene {
    return this._scene;
  }

  // Getter of camera
  get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  // Getter of rig system
  get rigSystem(): RigSystem {
    return this._rigSystem;
  }

  // Getter of players
  get players(): Record<TPeerId, IPeerPlayerData> {
    return this._players;
  }

  // Setter of players
  set players(val: Record<TPeerId, IPeerPlayerData>) {
    this._players = val;
  }

  // Getter of onBroadcastMsg
  get onBroadcastMsg(): ((data: TPeerData) => void) | null {
    return this._onBroadcastMsg;
  }

  // Setter of onBroadcastMsg
  set onBroadcastMsg(val: ((data: TPeerData) => void) | null) {
    this._onBroadcastMsg = val;
  }

  /**
   * Initialize game scene and other rest functionalities
   */
  async init() {
    this._rigSystem.init();
    this._beatSaberSystem.init();

    // Dev systems, which are visible only in dev environment
    if (IS_DEV) {
      this._statsSystem.init();
    }

    this._addEventListeners();

    // Dipatch event that says game is ready to play
    this.dispatchEvent({ type: EGameEvents.INITIALIZED });

    // Loop
    this._renderer.setAnimationLoop(this._update);
  }

  // /**
  //  * Load assets
  //  */
  // private async _loadAssets() {
  //   try {
  //     // TODO Loading logic
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  /**
   * Add event listeners
   */
  private _addEventListeners = () => {
    window.addEventListener('resize', this._onWindowResize, false);
  };

  /**
   * Remove event listeners
   */
  private _removeEventListeners = () => {
    window.removeEventListener('resize', this._onWindowResize, false);
  };

  /**
   * Window resize listener
   */
  private _onWindowResize = () => {
    this._width = this._container.offsetWidth;
    this._height = this._container.offsetHeight;
    const newAspect = this._width / this._height;
    this._aspect = newAspect;

    this._camera.aspect = this._aspect;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(this._width, this._height);
  };

  /**
   * Update
   */
  private _update = () => {
    // Entered/Exited XR mode
    if (this._renderer.xr.isPresenting !== this._prevIsXR) {
      const prevIsXR = !this._prevIsXR;
      this._rigSystem.onXRPresent(prevIsXR);
      this._beatSaberSystem.onXRPresent(prevIsXR);
      this._statsSystem.onXRPresent(prevIsXR);
      this._prevIsXR = prevIsXR;
    }

    // Render scene
    this._renderer.render(this._scene, this._camera);

    // Update systems
    this._rigSystem.update();
    this._beatSaberSystem.update();
    this._statsSystem.update();
  };

  /**
   * Dispose
   */
  dispose() {
    this._removeEventListeners();

    // Dispose systems
    this._rigSystem.dispose();
    this._beatSaberSystem.dispose();
    this._statsSystem.dispose();
  }
}
