import { fieldOffsetX, fieldOffsetY, fragmentSize, tiles } from "../consts.js";
import { tileSprites } from "./sprite-lib.js";

export class MapData {
  /**
   * safely get matrix value
   * @param {*} col
   * @param {*} row
   * @returns tileId, or null - if out of bounds
   */
  getTileId(col, row) {
    const column = this.fieldMatrix[col];

    if (!column) return null;

    return column[row] ?? null;
  }

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

function forEachTile({ mapData, callback }) {
  const { cols, rows, fieldMatrix } = mapData;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileId = fieldMatrix[row][col];

      callback(tileId, row, col);
    }
  }
}

export const pathlessBlocks = [null, tiles.Brick, tiles.Concrete, tiles.Water];

export class MapDrawer {
  constructor({ mapData }) {
    this.mapData = mapData;
  }

  update(timestamp) {}

  #drawField(ctx) {
    forEachTile({
      mapData: this.mapData,
      callback: (tileId, row, col) => {
        const tileSprite = tileSprites.get(tileId);

        if (!tileSprite) return;
        tileSprite.draw(
          ctx,
          row * fragmentSize + fieldOffsetX,
          col * fragmentSize + fieldOffsetY,
          fragmentSize,
          fragmentSize
        );
      },
    });
  }

  #drawColliders(ctx) {
    if (globalThis.debug === false) return;
    forEachTile({
      mapData: this.mapData,
      callback: (tileId, row, col) => {
        if (!pathlessBlocks.includes(tileId)) return;
        ctx.strokeStyle = "magenta";
        ctx.strokeRect(
          row * fragmentSize + fieldOffsetX,
          col * fragmentSize + fieldOffsetY,
          fragmentSize,
          fragmentSize
        );
        ctx.fillStyle = "rgba(255,0,255,0.2)";
        ctx.fillRect(
          row * fragmentSize + fieldOffsetX,
          col * fragmentSize + fieldOffsetY,
          fragmentSize,
          fragmentSize
        );
      },
    });
  }

  draw(ctx) {
    this.#drawField(ctx);
    this.#drawColliders(ctx);
  }
}
