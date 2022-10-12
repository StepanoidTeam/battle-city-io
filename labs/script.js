import { Sprite } from "./sprite.js";

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.addEventListener("load", () => resolve(img));
  });
}

const spritemap = await loadImage("../sprites/spritemap2.png");
const background = await loadImage("../sprites/reskin/bgblank.png");

init();

function init() {
  const spritemapSize = [400, 256];

  const spriteSize = 16; //px

  const [nesWidth, nesHeight] = [256, 224]; // from NES
  const scale = 3.5;

  const ctx = initCanvas(canvasGame, nesWidth, nesHeight);
  const ctxBg = initCanvas(canvasBg, background.width, background.height);

  function initCanvas(canvas, width, height) {
    const ctx = canvas.getContext("2d");
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false; // pixelated

    return ctx;
  }

  function createSprite16(spritemap, x, y) {
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

  const bgSprite = new Sprite({
    spritemap: background,
  });

  const emptySprite = createSprite16(spritemap, 21, 0);
  const tankSprite1 = createSprite16(spritemap, 0, 0);
  const tankSprite2 = createSprite16(spritemap, 1, 0);

  const wallBrickFullSprite = createSprite16(spritemap, 16, 0);
  const wallBrickRightSprite = createSprite16(spritemap, 17, 0);
  const wallBrickDownSprite = createSprite16(spritemap, 18, 0);
  const wallBrickLeftSprite = createSprite16(spritemap, 19, 0);
  const wallBrickTopSprite = createSprite16(spritemap, 20, 0);

  const wallStoneFullSprite = createSprite16(spritemap, 16, 1);
  const wallStoneRightSprite = createSprite16(spritemap, 17, 1);
  const wallStoneDownSprite = createSprite16(spritemap, 18, 1);
  const wallStoneLeftSprite = createSprite16(spritemap, 19, 1);
  const wallStoneTopSprite = createSprite16(spritemap, 20, 1);

  const waterSprite = createSprite16(spritemap, 16, 2);
  const woodSprite = createSprite16(spritemap, 17, 2);
  const iceSprite = createSprite16(spritemap, 18, 2);

  const tools = [
    emptySprite,

    wallBrickRightSprite,
    wallBrickDownSprite,
    wallBrickLeftSprite,
    wallBrickTopSprite,

    wallBrickFullSprite,

    wallStoneRightSprite,
    wallStoneDownSprite,
    wallStoneLeftSprite,
    wallStoneTopSprite,

    wallStoneFullSprite,

    waterSprite,
    woodSprite,
    iceSprite,
  ];

  // wallBrickSprite.draw(ctx, spriteSize, spriteSize);
  // wallStoneSprite.draw(ctx, 100, 100, spriteSize);

  const fieldMatrix = [];

  const [cols, rows] = [13, 13]; // field size in cells

  for (let row = 0; row < rows; row++) {
    fieldMatrix[row] = [];
    for (let col = 0; col < cols; col++) {
      fieldMatrix[row][col] = 0;
    }
  }

  console.log({ fieldMatrix });

  function drawField() {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const toolIndex = fieldMatrix[row][col];

        const tool = tools[toolIndex];

        if (!tool) continue;

        tool.draw(ctx, (row + 1) * spriteSize, (col + 1) * spriteSize);
      }
    }
  }

  const tankPos = [0, 0]; //x,y

  let currentTool = 1;

  //controls
  document.addEventListener("keydown", function (event) {
    // todo(vmyshko): add proverki bounds
    switch (event.code) {
      case "ArrowLeft": {
        tankPos[0] = Math.max(tankPos[0] - 1, 0);
        break;
      }
      case "ArrowRight": {
        tankPos[0] = Math.min(tankPos[0] + 1, cols - 1);
        break;
      }
      case "ArrowUp": {
        tankPos[1] = Math.max(tankPos[1] - 1, 0);
        break;
      }
      case "ArrowDown": {
        tankPos[1] = Math.min(tankPos[1] + 1, rows - 1);
        break;
      }

      case "KeyZ": {
        if (fieldMatrix[tankPos[0]][tankPos[1]] === currentTool) {
          if (currentTool === tools.length - 1) {
            currentTool = 0;
          } else {
            currentTool++;
          }
        }

        fieldMatrix[tankPos[0]][tankPos[1]] = currentTool;
      }
    }
  });

  bgSprite.draw(ctxBg, 0, 0, background.width, background.height);

  //drawing
  (function draw(timestamp) {
    ctx.clearRect(0, 0, nesWidth, nesHeight);
    //

    drawField();

    // blinking tank
    if (Math.floor(timestamp / 250) % 2 === 0) {
      tankSprite1.draw(
        ctx,
        ...tankPos.map((x) => (x + 1) * spriteSize),
        spriteSize,
        spriteSize
      );
    }

    // anim tank

    // (Math.floor(timestamp / 500) % 2 === 0 ? tankSprite1 : tankSprite2).draw(
    //   ctx,
    //   ...tankPos.map((x) => x * spriteSize),
    //   spriteSize,
    //   spriteSize
    // );

    requestAnimationFrame(draw);
  })();
}
