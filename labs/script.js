import {
  bgSprite,
  emptySprite,
  iceSprite,
  tankSprite3,
  wallBrickDownSprite,
  wallBrickFullSprite,
  wallBrickLeftSprite,
  wallBrickRightSprite,
  wallBrickTopSprite,
  wallStoneDownSprite,
  wallStoneFullSprite,
  wallStoneLeftSprite,
  wallStoneRightSprite,
  wallStoneTopSprite,
  waterSprite,
  woodSprite,
} from "./sprite-lib.js";

init();

function init() {
  const cellSize = 8; //px

  const [nesWidth, nesHeight] = [256, 240];
  const scale = 3.5;

  canvasContainer.style.setProperty("--width", `${nesWidth * scale}px`);
  canvasContainer.style.setProperty("--height", `${nesHeight * scale}px`);
  canvasContainer.style.setProperty("--spriteSize", cellSize * 2);
  canvasContainer.style.setProperty("--scale", scale);

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

        tool.draw(ctx, (row + 1) * cellSize * 2, (col + 1) * cellSize * 2);
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

  bgSprite.draw(ctxBg, 0, 0, nesWidth, nesHeight);

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
        ...tankPos.map((x) => (x + 1) * cellSize * 2),
        cellSize * 2,
        cellSize * 2
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
