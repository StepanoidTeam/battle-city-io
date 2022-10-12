const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const width_$ = window.innerWidth;
const height_$ = window.innerHeight;
canvas.width = width_$;
canvas.height = height_$;

class Field {
  constructor(ctx, x = 0, y = 0, width = width_$, height = height_$, imageSrc) {
    this._ctx = ctx;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._imageSrc = imageSrc;
  }
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
class Text {
  constructor(text, size, style, positionX, positionY) {
    this._text = text;
    this._size = size;
    this._style = style;
    this._positionX = positionX;
    this._positionY = positionY;
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
    ctx.beginPath();

    ctx.font = this.size;
    ctx.fillStyle = this.style;
    ctx.fillText(this.text, this.positionX, this.positionY);
    ctx.closePath();
  }
}

class Sprite {
  constructor(ctx, positionX, positionY, width, height, imageSrc) {
    this._ctx = ctx;
    this._positionX = positionX;
    this._positionY = positionY;
    this._width = width;
    this._height = height;
    this._imageSrc = imageSrc;
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
let initialSprite = new Image();
initialSprite.src = "./sprites/isTMrKg.gif";
class SpriteUser extends Sprite {
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

const sprite = new Sprite(ctx, 420, 1005, 25, 25, initialSprite);
const user = new SpriteUser(10, "general");

const field = new Field(ctx);
const fieldLevelOne = new Image();
fieldLevelOne.src = "./sprites/BattleCity-reskin/bg01.png";
const levelOneBcg = new Field(ctx, 0, 0, height_$, width_$, fieldLevelOne);

const initialTitles = new Text(
  "I-   00   HI-  2000",
  "18px 'Press Start 2P'",
  "white",
  150,
  730
);

const battle = new Text("BATTLE", "60px 'Press Start 2P'", "white", 370, 830);
const city = new Text("CITY", "60px 'Press Start 2P'", "white", 420, 930);
const chosePlayer1 = new Text(
  "1 PLAYER",
  "20px 'Press Start 2P'",
  "white",
  470,
  980
);
const chosePlayer2 = new Text(
  "2 PLAYERS",
  "20px 'Press Start 2P'",
  "white",
  470,
  1030
);
const choseConstruction = new Text(
  "CONSTRUCTION",
  "20px 'Press Start 2P'",
  "white",
  470,
  1080
);

const namcot = new Text("namcot", "45px 'Press Start 2P'", "red", 470, 1130);
const brand = new Text(
  "ⓒ   1980   1985  NAMCO LTD.",
  "20px 'Press Start 2P'",
  "white",
  270,
  1180
);
const permission = new Text(
  "ALL RIGHTS RESERVED",
  "20px 'Press Start 2P'",
  "white",
  390,
  1230
);

let newPositionY;
let initial = true;
document.addEventListener("keydown", function (event) {
  if (event.code == "ArrowUp" && sprite.positionY != 305) {
    newPositionY = sprite.positionY -= 50;
  } else if (event.code == "ArrowDown" && sprite.positionY != 405) {
    newPositionY = sprite.positionY += 50;
  }
  if (event.code == "Enter") {
    initial = false;
  }
});
let playGame = setInterval(function () {
  ctx.clearRect(0, 0, field.width, field.height);

  if (initial) {
    field.render();
    initialTitles.render();
    battle.render();
    city.render();
    chosePlayer1.render();
    chosePlayer2.render();
    choseConstruction.render();
    namcot.render();
    brand.render();
    permission.render();
    sprite.render();
    if (initialTitles.positionY > 80) {
      initialTitles.positionY -= 5;
      battle.positionY -= 5;
      city.positionY -= 5;
      chosePlayer1.positionY -= 5;
      chosePlayer2.positionY -= 5;
      choseConstruction.positionY -= 5;
      namcot.positionY -= 5;
      brand.positionY -= 5;
      permission.positionY -= 5;
      sprite.positionY -= 5;
    }
  } else {
    levelOneBcg.render();
    user.render();
  }
}, 10);
