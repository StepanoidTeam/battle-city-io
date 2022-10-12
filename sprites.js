import {ctx, initialSprite} from './consts.js'

export class Sprite {
  constructor(ctx, positionX, positionY, width, height, imageSrc) {
    this._ctx = ctx;
    this._positionX = positionX;
    this._positionY = positionY;
    this._width = width;
    this._height = height;
    this._imageSrc = imageSrc;
  }
  get ctx() {
    return this._ctx;
  }
  get positionX() {
    return this._positionX;
  }
  get positionY() {
    return this._positionY;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get imageSrc() {
    return this._imageSrc;
  }
  
  set positionX(value) {
    this._positionX = value;
  }
  set positionY(value) {
    this._positionY = value;
  }
  render() {
    this._ctx.drawImage(
      this.imageSrc,
      this.positionX,
      this.positionY,
      this.height,
      this.width
    );
  }
}
export class SpriteUser extends Sprite {
  constructor(damage, weapon) {
    super(ctx, 300, 300, 25, 25, initialSprite);
    this._damage = damage;
    this._weapon = weapon;
  }

  get damage() {
    return this._damage;
  }
  get weapon() {
    return this._weapon;
  }
  set damage(value) {
    this._damage = value;
  }
  set weapon(value) {
    this._weapon = value;
  }
  render() {
    super.render(
      this.imageSrc,
      this.positionX,
      this.positionY,
      this.height,
      this.width
    );
  }
}
