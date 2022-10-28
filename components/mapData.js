import { fieldOffsetX, fieldOffsetY, fragmentSize, tiles } from "../consts.js";
import { tileSprites } from "./sprite-lib.js";

export class MapData {
  fieldMatrix = null;
  constructor({ cols, rows }) {
    this.cols = cols;
    this.rows = rows;
    this.init(cols, rows);
  }

  init(cols, rows) {
    this.fieldMatrix = [];
    for (let row = 0; row < rows; row++) {
      this.fieldMatrix[row] = [];
      for (let col = 0; col < cols; col++) {
        this.fieldMatrix[row][col] = tiles.Void;
      }
    }
  }

  clearMap() {
    this.init(this.cols, this.rows);
  }
}

export class MapDrawer {
  constructor({ mapData }) {
    this.mapData = mapData;
  }

  update(timestamp) {}

  #drawField(ctx) {
    const { cols, rows, fieldMatrix } = this.mapData;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tileId = fieldMatrix[row][col];

        const tileSprite = tileSprites.get(tileId);

        if (!tileSprite) continue;
        tileSprite.draw(
          ctx,
          row * fragmentSize + fieldOffsetX,
          col * fragmentSize + fieldOffsetY,
          fragmentSize,
          fragmentSize
        );
      }
    }
  }

  draw(ctx) {
    this.#drawField(ctx);
  }
}
