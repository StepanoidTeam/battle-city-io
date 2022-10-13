import { canvas, ctx, width_$, height_$, initialSprite } from "./consts.js";
import Field from "./field.js";
import Text from "./text.js";
import { Sprite } from "./sprites.js";
import { SpriteUser } from "./sprites.js";
canvas.width = width_$;
canvas.height = height_$;
initialSprite.src = "./sprites/isTMrKg.gif";

const sprite = new Sprite(ctx, 420, 955, 25, 25, initialSprite);
const user = new SpriteUser(10, "general");

const field = new Field(ctx);
const fieldLevelOne = new Image();
fieldLevelOne.src = "./sprites/reskin/bg01.png";
const levelOneBcg = new Field(ctx, 0, 0, 256, 240, fieldLevelOne);
const paragraph = 50;
const initialTitles = new Text(
  ctx,
  "I-   00   HI-  2000",
  "18px 'Press Start 2P'",
  "white",
  150,
  730
);

const battle = new Text(
  ctx,
  "BATTLE",
  "60px 'Press Start 2P'",
  "white",
  370,
  830
);
const city = new Text(ctx, "CITY", "60px 'Press Start 2P'", "white", 420, 930);
const chosePlayer1 = new Text(
  ctx,
  "1 PLAYER",
  "20px 'Press Start 2P'",
  "white",
  470,
  980
);
const chosePlayer2 = new Text(
  ctx,
  "2 PLAYERS",
  "20px 'Press Start 2P'",
  "white",
  470,
  1030
);
const choseConstruction = new Text(
  ctx,
  "CONSTRUCTION",
  "20px 'Press Start 2P'",
  "white",
  470,
  1080
);

const namcot = new Text(
  ctx,
  "namcot",
  "45px 'Press Start 2P'",
  "red",
  470,
  1130
);
const brand = new Text(
  ctx,
  "ⓒ   1980   1985  NAMCO LTD.",
  "20px 'Press Start 2P'",
  "white",
  270,
  1180
);
const permission = new Text(
  ctx,
  "ALL RIGHTS RESERVED",
  "20px 'Press Start 2P'",
  "white",
  390,
  1230
);

let newPositionY;
let initial = true;
let newSpritePositionY;
const components = [
  field,
  initialTitles,
  battle,
  city,
  chosePlayer1,
  chosePlayer2,
  choseConstruction,
  namcot,
  brand,
  permission,
  sprite,
];
document.addEventListener("keydown", function (event) {
  console.log(newSpritePositionY);

  if (event.code == "ArrowUp" && sprite.positionY != newSpritePositionY) {
    newPositionY = sprite.positionY -= 50;
  } else if (
    event.code == "ArrowDown" &&
    sprite.positionY != newSpritePositionY + 100
  ) {
    newPositionY = sprite.positionY += 50;
  }
  if (event.code == "Enter") {
    initial = false;
  }
});
let playGame = setInterval(function () {
  ctx.clearRect(0, 0, field.width, field.height);

  if (initial) {
    components.forEach(function (component) {
      component.render();
    });

    if (initialTitles.positionY > paragraph) {
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
      newSpritePositionY = sprite.positionY;
    }
  } else {
    levelOneBcg.render();
    user.render();
  }
}, 10);