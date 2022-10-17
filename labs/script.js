import {
  bgSprite,
  emptySprite,
  iceSprite,
  spriteSize,
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
import { TextSprite } from "./text.js";

init();

function init() {
  const cellSize = 8; //px

  const [nesWidth, nesHeight] = [256, 240];
  const scale = 3;

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

  function drawField(ctx) {
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
  let showMenu = false;
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

      case "Escape": {
        showMenu = !showMenu;
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

  function drawGrid(ctx) {
    if (!chkGrid.checked) return;

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    for (let col = 0; col <= cols; col++) {
      ctx.moveTo((col + 1) * spriteSize, spriteSize);
      ctx.lineTo((col + 1) * spriteSize, (cols + 1) * spriteSize);
    }

    for (let row = 0; row <= rows; row++) {
      ctx.moveTo(spriteSize, (row + 1) * spriteSize);
      ctx.lineTo((rows + 1) * spriteSize, (row + 1) * spriteSize);
    }

    ctx.stroke();
  }

  function drawCurrentTool(ctx) {
    const toolSprite = tools[currentTool];

    ctx.fillRect(
      cellSize * 2 * 14 + cellSize,
      cellSize,
      cellSize * 2,
      cellSize * 2
    );

    toolSprite.draw(
      ctx,

      cellSize * 2 * 14 + cellSize,
      cellSize
    );
  }

  function drawCursor(ctx, timestamp) {
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
  }

  //drawing
  function drawBg(ctx) {
    bgSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }

  const sceneEditor = [
    drawBg,
    drawField,
    drawCursor,
    drawCurrentTool,
    drawGrid,
  ];

  const menuCursorPos = 0;

  const menuText1 = new TextSprite({
    x: 0,
    y: 150,
    lineSpacing: 4,
    text: ">svetlana impl. numbers!\n© bob..\n kekekekeke",
    color: "red",
  });

  const menuText2 = new TextSprite({
    x: 0,
    y: 6,
    lineSpacing: 8,
    text: `
    >1 player
     2 players
     construction`,
    color: "yellow",
  });
  console.log(menuText2);
  function drawMenu(ctx, timestamp) {
    tankSprite3.draw(
      ctx,
      ...tankPos.map((x) => (x + 1) * cellSize * 2),
      cellSize * 2,
      cellSize * 2
    );

    menuText1.draw(ctx, timestamp);
    menuText2.draw(ctx, timestamp);
  }

  //
  (function draw(timestamp) {
    ctx.clearRect(0, 0, nesWidth, nesHeight);

    // todo(vmyshko): refac to use different scenes? how to manage/switch them?
    if (showMenu) {
      // drawBg(ctx, timestamp);
      drawMenu(ctx, timestamp);
    } else {
      sceneEditor.forEach((component) => component(ctx, timestamp));
    }

    requestAnimationFrame(draw);
  })();
}
