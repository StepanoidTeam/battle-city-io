import { fieldOffsetX, fieldOffsetY, fragmentSize, tiles } from "../consts.js";
import { tileSprites } from "./sprite-lib.js";

export class MapData {
  /**
   * safely get matrix value
   * @param {*} col
   * @param {*} row
   * @returns tileId, or null - if out of bounds
   */
  getTileId({ col, row }) {
    const fieldRow = this.fieldMatrix[row];

    if (!fieldRow) return null;

    return fieldRow[col] ?? null;
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

  save() {
    const jsonMap = JSON.stringify(this.fieldMatrix);

    return jsonMap;
  }

  load(jsonMap) {
    const mapObj = JSON.parse(jsonMap);

    // todo(vmyshko): add other checks?

    if (!Array.isArray(mapObj))
      throw Error("invalid map string - not an array");

    this.fieldMatrix.splice(0);
    this.fieldMatrix.push(...mapObj);
  }
}

export function forEachTile({ mapData, callback }) {
  const { cols, rows, fieldMatrix } = mapData;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileId = fieldMatrix[row][col];

      callback({ tileId, row, col });
    }
  }
}

export const pathlessBlocks = [null, tiles.Brick, tiles.Concrete, tiles.Water];
export const destroyableBlocks = [
  null,
  tiles.Brick,
  tiles.Concrete,
  tiles.Forest,
];

export class MapDrawer {
  constructor({ mapData }) {
    this.mapData = mapData;
  }

  update(timestamp) {}

  #drawField(ctx) {
    forEachTile({
      mapData: this.mapData,
      callback: ({ tileId, row, col }) => {
        const tileSprite = tileSprites.get(tileId);

        if (!tileSprite) return;
        tileSprite.draw(
          ctx,
          col * fragmentSize + fieldOffsetX,
          row * fragmentSize + fieldOffsetY,
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
      callback: ({ tileId, row, col }) => {
        if (!pathlessBlocks.includes(tileId)) return;
        ctx.strokeStyle = "magenta";
        ctx.strokeRect(
          col * fragmentSize + fieldOffsetX,
          row * fragmentSize + fieldOffsetY,
          fragmentSize,
          fragmentSize
        );
        ctx.fillStyle = "rgba(255,0,255,0.2)";
        ctx.fillRect(
          col * fragmentSize + fieldOffsetX,
          row * fragmentSize + fieldOffsetY,
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
