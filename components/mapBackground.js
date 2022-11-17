import {
  fieldOffsetX,
  fieldOffsetY,
  fragmentSize,
  nesHeight,
  nesWidth,
  tiles,
} from "../consts.js";
import { forEachTile } from "./mapData.js";
import { bgParts } from "./sprite-lib.js";

export default class MapBackground {
  #ctx = null;

  constructor({ mapData }) {
    this.load({ mapData });
  }

  load({ mapData }) {
    const ctx = document.createElement("canvas").getContext("2d");

    ctx.canvas.width = nesWidth;
    ctx.canvas.height = nesHeight;

    this.#ctx = ctx;

    forEachTile({
      mapData,
      callback: ({ tileId, row, col }) => {
        //

        if ([tiles.Concrete].includes(tileId)) {
          //

          const tileType = [
            mapData.getTileId({ col, row: row - 1 }), //top
            mapData.getTileId({ col: col + 1, row }), //right
            mapData.getTileId({ col, row: row + 1 }), //bottom
            mapData.getTileId({ col: col - 1, row }), //left
          ]
            .map((tileId) => +[tiles.Concrete].includes(tileId))
            .join("");

          const tileTypeSprites = {
            ["1111"]: bgParts.full,
            ["0000"]: bgParts.solid,

            ["0111"]: bgParts.top,
            ["1011"]: bgParts.right,
            ["1101"]: bgParts.bottom,
            ["1110"]: bgParts.left,

            ["0011"]: bgParts.topRight,
            ["1001"]: bgParts.bottomRight,
            ["1100"]: bgParts.bottomLeft,
            ["0110"]: bgParts.topLeft,

            ["0101"]: bgParts.topBottom,
            ["1010"]: bgParts.leftRight,

            ["1000"]: bgParts.notTop,
            ["0100"]: bgParts.notRight,
            ["0010"]: bgParts.notBottom,
            ["0001"]: bgParts.notLeft,
          };

          const currentSprite = tileTypeSprites[tileType];

          if (!currentSprite) {
            bgParts.pink.draw(
              ctx,
              col * fragmentSize,
              row * fragmentSize,
              fragmentSize,
              fragmentSize
            );

            return;
          }

          currentSprite.draw(
            ctx,
            col * fragmentSize,
            row * fragmentSize,
            fragmentSize,
            fragmentSize
          );
        } else {
          // 1% to gen dirt

          const dirtProbability = Math.floor((Math.random() * 100) / 3);
          if (dirtProbability === 0) {
            const dirtIndex = Math.floor(
              Math.random() * bgParts.emptyDirts.length
            );
            const randomDirt = bgParts.emptyDirts[dirtIndex];

            randomDirt.draw(
              ctx,
              col * fragmentSize,
              row * fragmentSize,
              fragmentSize,
              fragmentSize
            );
          } else {
            bgParts.empty.draw(
              ctx,
              col * fragmentSize,
              row * fragmentSize,
              fragmentSize,
              fragmentSize
            );
          }
        }
      },
    });
  }

  draw(ctx, timestamp) {
    ctx.drawImage(this.#ctx.canvas, fieldOffsetX, fieldOffsetY);
  }
}
