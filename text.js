class Text {
  constructor(ctx, text, size, style, positionX, positionY) {
    this._ctx = ctx;
    this._text = text;
    this._size = size;
    this._style = style;
    this._positionX = positionX;
    this._positionY = positionY;
  }
  get ctx() {
    return this._ctx;
  }
  get text() {
    return this._text;
  }
  get size() {
    return this._size;
  }
  get style() {
    return this._style;
  }
  get positionX() {
    return this._positionX;
  }
  get positionY() {
    return this._positionY;
  }
  set text(text) {
    return (this._text = text);
  }
  set size(size) {
    return (this._size = size);
  }
  set style(style) {
    return (this._style = style);
  }
  set positionX(x) {
    return (this._positionX = x);
  }
  set positionY(y) {
    return (this._positionY = y);
  }
  render() {
    this._ctx.beginPath();

     this._ctx.font = this.size;
     this._ctx.fillStyle = this.style;
     this._ctx.fillText(this.text, this.positionX, this.positionY);
     this._ctx.closePath();
  }
}

export default Text