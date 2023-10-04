import { ENoteCutDirection } from 'src/types';

export const ROTATION_BY_CUT_DIR: Record<ENoteCutDirection, number> = {
  [ENoteCutDirection.UP]: 0,
  [ENoteCutDirection.DOWN]: Math.PI,
  [ENoteCutDirection.LEFT]: Math.PI / 2,
  [ENoteCutDirection.RIGHT]: -Math.PI / 2,
  [ENoteCutDirection.UP_LEFT]: (-Math.PI * 3) / 4,
  [ENoteCutDirection.UP_RIGHT]: (Math.PI * 3) / 4,
  [ENoteCutDirection.DOWN_LEFT]: -Math.PI / 4,
  [ENoteCutDirection.DOWN_RIGHT]: Math.PI / 4,
  [ENoteCutDirection.Any]: 0,
};
