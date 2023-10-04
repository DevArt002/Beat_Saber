import { Game } from 'src/helpers';
import Stats from 'three/examples/jsm/libs/stats.module';
import { StatsEntity } from 'src/helpers/Game/Entities';
import { System } from './System';

export class StatsSystem extends System {
  private _stats: Stats | null = null;
  private _container: HTMLDivElement | null = null;
  private _rendererInfoContainer: HTMLDivElement | null = null;
  private _statsEntity: StatsEntity | null = null;
  private _visibleStatsEntity: boolean = false;

  constructor(game: Game) {
    super(game);
  }

  // Getter of stats
  get stats(): Stats | null {
    return this._stats;
  }

  /**
   * Initialize 2D stats view
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
    // Instantiate 3D stats, but not add to scene yet
    this._statsEntity = new StatsEntity(this); // 3D stats
  }

  /**
   * Update
   */
  update() {
    if (this._stats === null || this._statsEntity === null || this._rendererInfoContainer === null)
      return;

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

    // Add/Remove 3D stats conditionally
    if (this._game.renderer.xr.isPresenting) {
      if (!this._visibleStatsEntity) {
        this.addEntity(this._statsEntity);
        this._visibleStatsEntity = true;
      }
    } else {
      if (this._visibleStatsEntity) {
        this.removeEntity(this._statsEntity.id);
        this._visibleStatsEntity = false;
      }
    }
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
