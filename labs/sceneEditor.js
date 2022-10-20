
import { cellSize, nesHeight, nesWidth } from "./script.js";
import {
  bgSprite,
  emptySprite,
  iceSprite,
  blockSize,
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

export function getEditorScene({ onExit }) {
  function drawBg(ctx) {
    bgSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }
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
  const editorParts = [
    drawBg,
    drawField,
    drawCursor,
    drawCurrentTool,
    drawGrid,
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

  const tankPos = [0, 0]; //x,y

  let currentTool = 1;

  //controls

  let paintKeyDown = false;

  function onKeyDown(event) {
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
        if (event.repeat) break;

        onExit();
        break;
      }
    }

    if (paintKeyDown) {
      fieldMatrix[tankPos[0]][tankPos[1]] = currentTool;
    }
  }

  function onKeyUp(event) {
    switch (event.code) {
      case "KeyZ":
      case "KeyX": {
        paintKeyDown = false;
      }
    }
  }

  function drawGrid(ctx) {
    if (!chkGrid.checked) return;

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    for (let col = 0; col <= cols; col++) {
      ctx.moveTo((col + 1) * blockSize, blockSize);
      ctx.lineTo((col + 1) * blockSize, (cols + 1) * blockSize);
    }

    for (let row = 0; row <= rows; row++) {
      ctx.moveTo(blockSize, (row + 1) * blockSize);
      ctx.lineTo((rows + 1) * blockSize, (row + 1) * blockSize);
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

  function drawSprites(ctx, timestamp) {
    ctx.clearRect(0, 0, nesWidth, nesHeight);
    tankSprite3.draw(
      ctx,
      ...tankPos.map((x) => (x + 1) * cellSize * 2),
      cellSize * 2,
      cellSize * 2
    );
  }
  return {
    load() {
      editorSideBar.hidden = false;
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      editorSideBar.hidden = true;

      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("keydown", onKeyDown);
    },

    draw(ctx, timestamp) {
      //
      editorParts.forEach((component) => component(ctx, timestamp));
    },
  };
}
