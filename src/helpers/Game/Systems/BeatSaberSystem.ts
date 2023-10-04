import { BeatSaberRigEntity, FloorEntity, SaberEntity } from 'src/helpers/Game/Entities';

import { EPeerDataType } from 'src/types';
import { Game } from 'src/helpers';
import { System } from './System';

export class BeatSaberSystem extends System {
  private _score: number = 0;
  private _floorEntity: FloorEntity | null = null;

  constructor(game: Game) {
    super(game);
  }

  // Getter of rig entity
  get rigEntity(): BeatSaberRigEntity | null {
    return this._game.rigSystem.activeRigEntity;
  }

  // Getter of left saber
  get leftSaber(): SaberEntity | null {
    return this.rigEntity?.leftSaber ?? null;
  }

  // Getter of right saber
  get rightSaber(): SaberEntity | null {
    return this.rigEntity?.rightSaber ?? null;
  }

  // Getter of score
  get score(): number {
    return this._score;
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

  /**
   * Update
   */
  update() {
    for (const key in this._entities) {
      this._entities[key].update();
    }

    this._game.onBroadcastMsg?.({
      type: EPeerDataType.PLAYER,
      score: this._score,
      sabersMatrix: [this.leftSaber?.matrixWorld, this.rightSaber?.matrixWorld],
    });
  }
}
