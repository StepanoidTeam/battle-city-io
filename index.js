import Field from "./field.js";
import Text from "./text.js";
import { BrickWallBlock } from "./brickWallBlock.js";
import { Sprite } from "./labs/sprite.js";
import { spritemap } from "./labs/sprite-lib.js";

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.addEventListener("load", () => resolve(img));
  });
}

const reskinTanks = await loadImage("./sprites/reskin/Chr_00_0.png");

init();
function init() {
  const spritemapSize = [400, 256];
  const [nesWidth, nesHeight] = [256, 224]; // from NES

  const spriteSize = 4; //px

  const scale = 3.5;

  const ctx = initCanvas(canvasGame, nesWidth, nesHeight);
  const ctxBg = initCanvas(canvasBg, nesWidth, nesHeight);

  function initCanvas(canvas, width, height) {
    const ctx = canvas.getContext("2d");
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false; // pixelated

    return ctx;
  }

  function createSprite16(m, x, y) {
    return Sprite.createSprite(m, x, y, 16);
  }

  function createSprite4(m, x, y) {
    return Sprite.createSprite(m, x, y, 4);
  }
  const paragraph = 12;
  const subtitlesPos = [10, 224];
  const shiftSubtitle = [70, 20];

  const bgSprite = new Field(nesWidth, nesHeight);
  const initialTitles = new Text({
    text: "I-   00   HI-  2000",
    size: "4px",
    style: "white",
    positionX: subtitlesPos[0],
    positionY: subtitlesPos[1],
  });
  const battle = new Text({
    text: "BATTLE",
    size: "14px",
    style: "white",
    positionX: subtitlesPos[0] + shiftSubtitle[0],
    positionY: subtitlesPos[1] + shiftSubtitle[1],
  });
  const city = new Text({
    text: "CITY",
    size: "14px",
    style: "white",
    positionX: subtitlesPos[0] * 2 + shiftSubtitle[0],
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 2,
  });
  const chosePlayer1 = new Text({
    text: "1 PLAYER",
    size: "8px",
    style: "white",
    positionX: subtitlesPos[0] + shiftSubtitle[0],
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 3,
  });
  const chosePlayer2 = new Text({
    text: "2 PLAYERS",
    size: "8px",
    style: "white",
    positionX: subtitlesPos[0] + shiftSubtitle[0],
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 4,
  });
  const choseConstruction = new Text({
    text: "CONSTRUCTION",
    size: "8px",
    style: "white",
    positionX: subtitlesPos[0] + shiftSubtitle[0],
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 5,
  });

  const stepanoidTeam = new Text({
    text: "STEPANOID TEAM",
    size: "10px",
    style: "red",
    positionX: subtitlesPos[0] + shiftSubtitle[0] / 1.5,
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 6,
  });
  const brand = new Text({
    text: "ⓒ    2022    2022    STEPANOID TEAM LTD.",
    size: "6px",
    style: "white",
    positionX: subtitlesPos[0],
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 7,
  });
  const permission = new Text({
    text: "ALL RIGHTS RESERVED",
    size: "6px",
    style: "white",
    positionX: subtitlesPos[0] + shiftSubtitle[0] / 1.2,
    positionY: subtitlesPos[1] + shiftSubtitle[1] * 8,
  });
  const subtitles = [
    initialTitles,
    battle,
    city,
    chosePlayer1,
    chosePlayer2,
    choseConstruction,
    stepanoidTeam,
    brand,
    permission,
  ];

  let tankSprite3 = createSprite16(reskinTanks, 1, 1);
  let bullet = createSprite4(spritemap, 82.5, 25.3);

  const tankPos = [4, 4]; //x,y

  let initialPosition = 64;
  let currentPosForBullet;
  let currentPos;
  let shot = false;
  document.addEventListener("keydown", function (event) {
    switch (event.code) {
      case "ArrowLeft": {
        currentPos = tankPos[0] -= 1;
        currentPosForBullet = [currentPos + spriteSize, tankPos[1] / 2];
        tankSprite3 = createSprite16(reskinTanks, 3, 1);
        console.log(currentPosForBullet);
        break;
      }
      case "ArrowRight": {
        currentPos = tankPos[0] += 1;
        currentPosForBullet = [currentPos + spriteSize, tankPos[1] / 2];
        tankSprite3 = createSprite16(reskinTanks, 7, 1);
        console.log(currentPosForBullet);

        break;
      }
      case "ArrowUp": {
        currentPos = tankPos[1] -= 1;
        currentPosForBullet = [tankPos[0] + 1.5, currentPos];
        console.log(currentPosForBullet);

        tankSprite3 = createSprite16(reskinTanks, 1, 1);
        bullet = createSprite4(spritemap, 80.5, 25.4);
        break;
      }
      case "ArrowDown": {
        currentPos = tankPos[1] += 1;
        currentPosForBullet = [tankPos[0] / 2, currentPos + spriteSize];
        console.log(currentPosForBullet);

        tankSprite3 = createSprite16(reskinTanks, 5, 1);

        break;
      }

      case "KeyZ": {
        break;
      }
      case "KeyX": {
        shot = true;
        for (let i = 0; i < currentPosForBullet.length - 1; i++) {
          currentPosForBullet[i]++;
        }

        break;
      }
    }
  });
  let drawBullet;

  bgSprite.draw(ctxBg, 0, 0);
   const brickWall = new BrickWallBlock({ x: 0, y: 0 });
  const brickWallOne = new BrickWallBlock({ x: 16, y: 16 });

  //drawing
  (function draw() {
    ctx.clearRect(0, 0, nesWidth, nesHeight);
    //
    ctx.beginPath();
    subtitles.forEach((subtitle) => {
      subtitle.draw(ctx);
    });

    if (initialTitles._positionY > paragraph) {
      subtitles.forEach((subtitle) => {
        subtitle._positionY -= 1;
      });
    }

    drawBullet = function (position) {
      bullet.draw(
        ctx,
        ...position.map((x) => x * spriteSize + spriteSize),
        spriteSize,
        spriteSize
      );
    };
    if (currentPosForBullet && shot) {
      console.log(currentPosForBullet);
      drawBullet(currentPosForBullet);
    }
    bullet.draw(ctx, 50, 25, spriteSize, spriteSize);

    tankSprite3.draw(
      ctx,
      ...tankPos.map((x) => (x + 1) * spriteSize),
      spriteSize * 4,
      spriteSize * 4
    );

    brickWall.draw(ctx);
    brickWallOne.draw(ctx);
    ctx.closePath();
    requestAnimationFrame(draw);
  })();
}
