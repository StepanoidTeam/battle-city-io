// general sprite class to draw any sprite

export class Sprite {
  defaultSpriteSize = 16;

  constructor({
    // spritemap params
    spritemap,
    sx = 0,
    sy = 0,
    sWidth = spritemap.width,
    sHeight = spritemap.height,
  }) {
    // todo(vmyshko): replace to [x,y]-like arrays?

    // spritemap
    this.sx = sx;
    this.sy = sy;
    this.sWidth = sWidth;
    this.sHeight = sHeight;

    this.spritemap = spritemap;
  }

  draw(
    ctx,
    x,
    y,
    width = this.defaultSpriteSize,
    height = this.defaultSpriteSize
  ) {
    ctx.drawImage(
      this.spritemap,
      // spritemap
      this.sx,
      this.sy,
      this.sWidth,
      this.sHeight,
      // canvas
      x,
      y,
      width,
      height
    );
  }
}
