import { spritemap } from "./sprite-lib.js";
import { Sprite } from "./sprite.js";

const bricksWallSprites = [];
const brickSize = 4;

const [cols, rows] = [4, 4]; // bricks size in cells

const [brickOffsetX, brickOffsetY] = [64, 0];
for (let col = 0; col < cols; col++) {
  for (let row = 0; row < rows; row++) {
    bricksWallSprites.push({
      sprite: Sprite.createSprite(
        spritemap,
        brickOffsetX + col,
        brickOffsetY + row,
        brickSize
      ),
      col,
      row,
    });
  }
}

export class BrickWallBlock {
  static sprites = bricksWallSprites;
  brickPieces = [
    [1, 1, 0, 1],
    [0, 1, 0, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 0],
  ];
  constructor({
    // spritemap params
    x,
    y,
  }) {
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    BrickWallBlock.sprites.forEach(({ sprite, col, row }) => {
      if (this.brickPieces[row][col] === 0) return;
      sprite.draw(
        ctx,
        this.x + col * brickSize,
        this.y + row * brickSize,
        brickSize,
        brickSize
      );
    });
  }
}
