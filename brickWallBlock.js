import { spritemap } from "./labs/sprite-lib.js";
import { Sprite } from "./labs/sprite.js";

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
      sprite.draw(ctx, this.x + col * brickSize, this.y + row * brickSize, brickSize, brickSize);
    });
  }
}
