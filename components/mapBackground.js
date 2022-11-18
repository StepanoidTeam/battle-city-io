import {
  fieldOffsetX,
  fieldOffsetY,
  fragmentSize,
  nesHeight,
  nesWidth,
  tiles,
} from "../consts.js";
import { forEachTile } from "./mapData.js";
import { bgDirt, createSprite } from "./sprite-lib.js";

const bgPinkNotFound = createSprite({
  spritemap: bgDirt,
  size: fragmentSize,
  x: 3,
  y: 5,
});

function makeSprite([key, { x, y }]) {
  return [key, createSprite({ spritemap: bgDirt, size: fragmentSize, x, y })];
}

const bgPartsDirt = Object.fromEntries(
  [
    [["0111"], { x: 0, y: 0 }], // top
    [["1011"], { x: 1, y: 0 }], // right
    [["1101"], { x: 2, y: 0 }], // bottom
    [["1110"], { x: 3, y: 0 }], // left

    [["0110"], { x: 0, y: 1 }], // topLeft
    [["1001"], { x: 1, y: 1 }], // bottomRight
    [["1100"], { x: 2, y: 1 }], // bottomLeft
    [["0011"], { x: 3, y: 1 }], // topRight

    [["0101"], { x: 0, y: 2 }], // topBottom
    [["1010"], { x: 1, y: 2 }], // leftRight
    [["0000"], { x: 2, y: 2 }], // solid-single
    [["1111"], { x: 3, y: 2 }], // full

    [["1000"], { x: 0, y: 3 }], // notTop
    [["0010"], { x: 1, y: 3 }], // notBottom
    [["0100"], { x: 2, y: 3 }], // notRight
    [["0001"], { x: 3, y: 3 }], // notLeft
  ].map(makeSprite)
);

const bgEmpty = createSprite({
  spritemap: bgDirt,
  size: fragmentSize,
  x: 0,
  y: 5,
});

const bgEmptyDirts = [
  { x: 0, y: 4 },
  { x: 1, y: 4 },
  { x: 2, y: 4 },
  { x: 3, y: 4 },
].map(({ x, y }) =>
  createSprite({ spritemap: bgDirt, size: fragmentSize, x, y })
);

const bgPartsWater = Object.fromEntries(
  [
    ["pink", { x: 3, y: 5 }],
    ["pink", { x: 3, y: 5 }],
    ["pink", { x: 3, y: 5 }],
  ].map(([key, { x, y }]) => [
    [key, createSprite({ spritemap: bgDirt, size: fragmentSize, x, y })],
  ])
);

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

          const currentSprite = bgPartsDirt[tileType];

          if (!currentSprite) {
            bgPinkNotFound.draw(
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
            const dirtIndex = Math.floor(Math.random() * bgEmptyDirts.length);
            const randomDirt = bgEmptyDirts[dirtIndex];

            randomDirt.draw(
              ctx,
              col * fragmentSize,
              row * fragmentSize,
              fragmentSize,
              fragmentSize
            );
          } else {
            bgEmpty.draw(
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
