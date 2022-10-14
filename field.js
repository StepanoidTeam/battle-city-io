const width_$ = window.innerWidth;
const height_$ = window.innerHeight;
class Field {
  constructor(ctx, x = 0, y = 0, width = width_$, height = height_$, imageSrc) {
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._imageSrc = imageSrc;
  }

  // todo(vmyshko): remove redundant getters
  // todo(vmyshko): make getters only if they change the value
  // for example:
  // get square(){ return this.x*this.y  };
  get ctx() {
    return this._ctx;
  }
  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }
  get y() {
    return this._y;
  }

  get x() {
    return this._x;
  }
  get imageSrc() {
    return this._imageSrc;
  }
  render() {
    if (this.imageSrc) {
      this._ctx.scale(1, 1);

      this._ctx.drawImage(
        this.imageSrc,
        this.x,
        this.y,
        this.height,
        this.width
      );
    } else {
      this._ctx.rect(this.x, this.y, this.width - this.x, this.height - this.y);
      this._ctx.fillStyle = "black";
      this._ctx.fill();
    }
  }
}
export default Field;
