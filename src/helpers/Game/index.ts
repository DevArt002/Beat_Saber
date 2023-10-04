import * as THREE from 'three';

import { EGameEvents } from 'src/types';
import { disposeObject } from 'src/utils';

export class Game extends THREE.EventDispatcher<any> {
  private _renderer: THREE.WebGLRenderer; // Webgl renderer
  private _scene: THREE.Scene; // Scene
  private _camera: THREE.PerspectiveCamera; // Perspective camera
  private _width: number = 1; // Canvas width
  private _height: number = 1; // Canvas height
  private _pixelRatio: number = window.devicePixelRatio; // Display ratio
  private _aspect: number = 1; // Camera aspect

  constructor(private readonly _container: HTMLDivElement) {
    super();

    this._width = this._container.offsetWidth || 1;
    this._height = this._container.offsetHeight || 1;
    this._aspect = this._width / this._height;

    // Initialize webgl renderer
    this._renderer = new THREE.WebGLRenderer({
      antialias: !(this._pixelRatio > 1),
      alpha: true,
    });
    this._renderer.setPixelRatio(this._pixelRatio);
    this._renderer.setSize(this._width, this._height);
    this._renderer.xr.enabled = true;
    this._container.appendChild(this._renderer.domElement);

    // Initialize scene
    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0x00ff00);

    // Initialize camera
    this._camera = new THREE.PerspectiveCamera(45, this._aspect, 0.1, 1000);
    this._camera.position.set(0, 1.6, 1.5);
    this._scene.add(this._camera);

    // Initialize lights
    const directLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const ambientLight = new THREE.AmbientLight(0x404040);
    this._scene.add(directLight);
    this._scene.add(ambientLight);
  }

  // Getter of container
  get container() {
    return this._container;
  }

  // Getter of webgl renderer
  get renderer() {
    return this._renderer;
  }

  // Getter of camera
  get camera() {
    return this._camera;
  }

  // Getter of Scene
  get scene() {
    return this._scene;
  }

  /**
   * Initialize game scene and other rest functionalities
   */
  async init() {
    await this._loadAssets();
    this._addEventListeners();
    this._addGameObjects();
    this._addStats();

    // Dipatch event that says game is ready to play
    this.dispatchEvent({ type: EGameEvents.INITIALIZED });

    this._update();
  }

  /**
   * Load assets
   */
  private async _loadAssets() {
    try {
      // TODO Loading logic
    } catch (error) {
      console.error(error);
    }
  }

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
   * Add stats
   */
  private _addStats() {
    // TODO Add custom stats here
  }

  /**
   * Add game objects
   */
  private _addGameObjects() {
    // TODO Placeholder of gameobjects
    const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.position.set(0, 0, -3);
    this._scene.add(sphere);
  }

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
    this._renderer.setAnimationLoop(this._update);

    this._render();
  };

  /**
   * Render
   */
  private _render() {
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * Dispose
   */
  dispose() {
    this._removeEventListeners();
    disposeObject(this._scene);
  }
}
