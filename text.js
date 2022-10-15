class Text {
  defaultFontFamily = "Press Start 2P";
  constructor({text, size, style, positionX, positionY}) {
    this._text = text;
    this._size = size;
    this._style = style;
    this._positionX = positionX;
    this._positionY = positionY;
  }

  draw(ctx) {
    ctx.font = `${this._size} '${this.defaultFontFamily}'`;
    ctx.fillStyle = this._style;
    ctx.fillText(this._text, this._positionX, this._positionY);

  }
 
}

export default Text;
