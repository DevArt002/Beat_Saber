import { FloorEntity } from 'src/helpers/Game/Entities';
import { Game } from 'src/helpers';
import { System } from './System';

export class BeatSaberSystem extends System {
  private _floorEntity: FloorEntity | null = null;

  constructor(game: Game) {
    super(game);
  }

  /**
   * Initialize
   */
  init() {
    // Add floor entity
    const floorEntity = new FloorEntity();
    floorEntity.position.z = -floorEntity.size[1] / 2;
    this.addEntity(floorEntity);
    this._floorEntity = floorEntity;
  }
}
