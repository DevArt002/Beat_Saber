import * as THREE from 'three';

import { EGameEvents } from 'src/types';
import { IS_DEV } from 'src/constants';
import { StatsSystem } from './Systems';

export class Game extends THREE.EventDispatcher<any> {
  private _renderer: THREE.WebGLRenderer; // Webgl renderer
  private _scene: THREE.Scene; // Scene
  private _camera: THREE.PerspectiveCamera; // Perspective camera
  private _width: number = 1; // Canvas width
  private _height: number = 1; // Canvas height
  private _pixelRatio: number = window.devicePixelRatio; // Display ratio
  private _aspect: number = 1; // Camera aspect

  // Systems
  private _statsSystem: StatsSystem = new StatsSystem(this);

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
    this._container.appendChild(renderer.domElement);
    this._renderer = renderer;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00ff00);
    this._scene = scene;

    // TODO Expecting camera to be inherited to core entity
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(45, this._aspect, 0.1, 1000);
    camera.position.set(0, 1.6, 1.5);
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
  get renderer() {
    return this._renderer;
  }

  // Getter of Scene
  get scene() {
    return this._scene;
  }

  // Getter of camera
  get camera() {
    return this._camera;
  }

  /**
   * Initialize game scene and other rest functionalities
   */
  async init() {
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

  // /**
  //  * Add game objects
  //  */
  // private _addGameObjects() {
  //   const sphereGeo = new THREE.SphereGeometry(1, 32, 16);
  //   const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //   const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  //   sphere.position.set(0, 0, -3);
  //   this._scene.add(sphere);

  //   const geometry = new THREE.BufferGeometry();
  //   geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5)]);

  //   const controller1 = this._renderer.xr.getController(0);
  //   controller1.add(new THREE.Line(geometry));
  //   this._scene.add(controller1);

  //   const controller2 = this._renderer.xr.getController(1);
  //   controller2.add(new THREE.Line(geometry));
  //   this._scene.add(controller2);

  //   //

  //   const controllerModelFactory = new XRControllerModelFactory();

  //   const controllerGrip1 = this._renderer.xr.getControllerGrip(0);
  //   controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
  //   this._scene.add(controllerGrip1);

  //   const controllerGrip2 = this._renderer.xr.getControllerGrip(1);
  //   controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
  //   this._scene.add(controllerGrip2);
  // }

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
    // Render scene
    this._renderer.render(this._scene, this._camera);

    // Update systems
    this._statsSystem.update();
  };

  /**
   * Dispose
   */
  dispose() {
    this._removeEventListeners();

    // Dispose systems
    this._statsSystem.dispose();
  }
}
