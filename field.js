class Field {
  defaultX = 0;
  defaultY = 0;
  defaultColor = "black";
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  draw(ctx) {
    ctx.rect(this.defaultX, this.defaultY, this._width, this._height);
    ctx.fillStyle = this.defaultColor;
    ctx.fill();
  }
}
export default Field;
