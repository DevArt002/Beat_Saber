import { Game } from 'src/helpers';
import Stats from 'three/examples/jsm/libs/stats.module';
import { StatsEntity } from 'src/helpers/Game/Entities';
import { System } from './System';

export class StatsSystem extends System {
  private _stats: Stats | null = null;
  private _container: HTMLDivElement | null = null;
  private _rendererInfoContainer: HTMLDivElement | null = null;
  private _statsEntity: StatsEntity | null = null;

  constructor(game: Game) {
    super(game);
  }

  // Getter of stats
  get stats(): Stats | null {
    return this._stats;
  }

  /**
   * Initialize
   */
  init() {
    // Instantiate stats
    this._stats = new Stats(); // 2D stats
    // Create dom nodes for stats panel
    this._container = document.createElement('div');
    this._rendererInfoContainer = document.createElement('div');
    // Adjust styles of dom nodes
    this._stats.dom.style.position = 'relative';
    this._rendererInfoContainer.style.fontSize = '11px';
    this._container.style.position = 'absolute';
    this._container.style.bottom = '0px';
    this._container.style.top = 'auto';
    // Append to game container
    this._container.appendChild(this._rendererInfoContainer);
    this._container.appendChild(this._stats.dom);
    this._game.container.appendChild(this._container);
    // Instantiate 3D stats, but don't add to scene yet
    this._statsEntity = new StatsEntity(this); // 3D stats
  }

  /**
   * Listener when xr presenting state is changed
   * @param isPresenting
   */
  onXRPresent(isPresenting: boolean) {
    if (this._statsEntity === null) return;

    // Add/Remove 3D stats conditionally
    if (isPresenting) {
      this.addEntity(this._statsEntity);
    } else {
      this.removeEntity(this._statsEntity.id);
    }
  }

  /**
   * Update
   */
  update() {
    if (this._stats === null || this._rendererInfoContainer === null) return;

    // Update stats
    this._stats.update();
    for (const key in this._entities) {
      this._entities[key].update();
    }

    // Update renderer info
    const { memory, render, programs } = this._game.renderer.info;
    this._rendererInfoContainer.innerHTML = `
      Frame number: ${render.frame} <br />
      Geometries: ${memory.geometries} <br />
      Textures: ${memory.textures} <br />
      Draw calls: ${render.calls} <br />
      Triangles: ${render.triangles} <br />
      Points: ${render.points} <br />
      Lines: ${render.lines} <br />
      Programs: ${programs?.length} <br />
    `;
  }

  /**
   * Dispose
   */
  dispose() {
    this._container?.remove();
    for (const key in this._entities) {
      this._entities[key].dispose();
    }
  }
}
