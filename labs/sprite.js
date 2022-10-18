// general sprite class to draw any sprite

export class Sprite {
  defaultSpriteSize = 16;
  static createSprite(spritemap, x, y, spriteSize) {
    return new Sprite({
      // spritemap
      spritemap,
      sx: spriteSize * x,
      sy: spriteSize * y,
      sHeight: spriteSize,
      sWidth: spriteSize,
      // canvas
      width: spriteSize,
      height: spriteSize,
    });
  }
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
  getPattern({
    width = this.defaultSpriteSize,
    height = this.defaultSpriteSize,
  } = {}) {
    const ctxBuffer = document.createElement("canvas").getContext("2d");
    ctxBuffer.canvas.width = width;
    ctxBuffer.canvas.height = height;
    ctxBuffer.imageSmoothingEnabled = false; // pixelated
    this.draw(ctxBuffer, 0, 0);
    const pattern = ctxBuffer.createPattern(ctxBuffer.canvas, "repeat");
    return pattern;
  }
}
