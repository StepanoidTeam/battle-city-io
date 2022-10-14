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
const reskinTanks = await loadImage("../sprites/reskin/Chr_00_0.png");

init();

function init() {
  const spritemapSize = [400, 256];

  const spriteSize = 16; //px

  const [nesWidth, nesHeight] = [256, 240];
  const scale = 3.5;

  canvasContainer.style.setProperty("--width", `${nesWidth * scale}px`);
  canvasContainer.style.setProperty("--height", `${nesHeight * scale}px`);
  canvasContainer.style.setProperty("--spriteSize", spriteSize);
  canvasContainer.style.setProperty("--scale", scale);

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

  const tankSprite3 = createSprite16(reskinTanks, 0, 0);

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

  btnSave.addEventListener("click", saveMap);
  btnLoad.addEventListener("click", loadMap);
  btnClear.addEventListener("click", clearMap);

  function saveMap() {
    const jsonMap = JSON.stringify(fieldMatrix);

    console.log(jsonMap);
  }

  function loadMap() {
    const jsonMap = prompt("input map as json array", "null");
    try {
      const mapObj = JSON.parse(jsonMap);

      if (!Array.isArray(mapObj)) throw Error("not an array");

      fieldMatrix.splice(0);
      fieldMatrix.push(...mapObj);
    } catch (error) {
      alert(`bad data: ${error}`);
    }
  }

  function clearMap() {
    initMap();
  }

  const [cols, rows] = [13, 13]; // field size in cells

  function initMap() {
    for (let row = 0; row < rows; row++) {
      fieldMatrix[row] = [];
      for (let col = 0; col < cols; col++) {
        fieldMatrix[row][col] = 0;
      }
    }
  }

  initMap();

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

  let paintKeyDown = false;
  document.addEventListener("keydown", function (event) {
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
        if (event.repeat) break;
        paintKeyDown = true;
        if (fieldMatrix[tankPos[0]][tankPos[1]] === currentTool) {
          if (currentTool === tools.length - 1) {
            currentTool = 0;
          } else {
            currentTool++;
          }
        }
        break;
      }
      case "KeyX": {
        if (event.repeat) break;
        paintKeyDown = true;
        if (fieldMatrix[tankPos[0]][tankPos[1]] === currentTool) {
          if (currentTool === 0) {
            currentTool = tools.length - 1;
          } else {
            currentTool--;
          }
        }
        break;
      }
    }

    if (paintKeyDown) {
      fieldMatrix[tankPos[0]][tankPos[1]] = currentTool;
    }
  });

  document.addEventListener("keyup", function (event) {
    switch (event.code) {
      case "KeyZ":
      case "KeyX": {
        paintKeyDown = false;
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
    const blinkingDelayMs = 250;
    if (Math.floor(timestamp / blinkingDelayMs) % 2 === 0) {
      tankSprite3.draw(
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
