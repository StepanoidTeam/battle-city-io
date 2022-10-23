import { cellSize, nesHeight, nesWidth } from "./consts.js";
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
  woodSprite8,
  waterSprite8,
  stoneSprite8,
  brickSprite8,
  iceSprite8,
  emptySprite8,
} from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";

export function getEditorScene({ onExit }) {
  function drawBg(ctx) {
    bgSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }

  //
  const fieldMatrix = [];
  const [cols, rows] = [26, 26]; // field size in cells

  function initMap() {
    for (let row = 0; row < rows; row++) {
      fieldMatrix[row] = [];
      for (let col = 0; col < cols; col++) {
        fieldMatrix[row][col] = 0;
      }
    }
  }

  function clearMap() {
    initMap();
  }
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
  function drawField(ctx) {
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const toolIndex = fieldMatrix[row][col];

        const tool = tools[toolIndex];

        if (!tool) continue;
        tool.draw(
          ctx,
          row * fragmentSize + fieldOffsetX,
          col * fragmentSize + fieldOffsetY,
          fragmentSize,
          fragmentSize
        );
      }
    }
  }

  const tools = [
    // emptySprite,
    emptySprite8,
    /* wallBrickRightSprite,
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
    iceSprite,*/
    woodSprite8,
    waterSprite8,
    stoneSprite8,
    brickSprite8,
    iceSprite8,
  ];

  initMap();

  let [cursorPosX, cursorPosY] = [0, 0]; //x,y

  let currentTool = 1;

  //controls

  let paintKeyDown = false;
  let cursorStep = 1;
  let cursorSize = 2;
  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowLeft": {
        cursorPosX = Math.max(cursorPosX - cursorStep, 0);
        break;
      }
      case "ArrowRight": {
        cursorPosX = Math.min(cursorPosX + cursorStep, cols - 2);
        break;
      }
      case "ArrowUp": {
        cursorPosY = Math.max(cursorPosY - cursorStep, 0);
        break;
      }
      case "ArrowDown": {
        cursorPosY = Math.min(cursorPosY + cursorStep, rows - 2);

        break;
      }

      case "KeyZ": {
        if (event.repeat) break;
        paintKeyDown = true;
        //  if (fieldMatrix[cursorPosX][cursorPosY] === currentTool) {
        if (currentTool === tools.length - 1) {
          currentTool = 0;
        } else {
          currentTool++;
        }
        //  }
        break;
      }

      case "KeyX": {
        if (event.repeat) break;
        paintKeyDown = true;
        // if (fieldMatrix[cursorPosX][cursorPosY] === currentTool) {
        if (currentTool === 0) {
          currentTool = tools.length - 1;
        } else {
          currentTool--;
        }
        //  }
        break;
      }

      case "KeyC": {
        if (event.repeat) break;

        cursorSize = cursorSize === 1 ? 2 : 1;
        break;
      }

      case "Escape": {
        if (event.repeat) break;

        onExit();
        break;
      }
    }

    if (paintKeyDown) {
      for (let cursorPartX = 0; cursorPartX < cursorSize; cursorPartX++) {
        for (let cursorPartY = 0; cursorPartY < cursorSize; cursorPartY++) {
          fieldMatrix[cursorPosX + cursorPartX][cursorPosY + cursorPartY] =
            currentTool;
        }
      }
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

  const fragmentSize = blockSize / 2;
  const [fieldOffsetX, fieldOffsetY] = [blockSize, blockSize];
  function drawGrid(ctx) {
    if (!chkGrid.checked) return;

    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    //columns
    for (let col = 0; col <= cols / cursorStep; col++) {
      ctx.moveTo(col * fragmentSize * cursorStep + fieldOffsetX, fieldOffsetY);
      ctx.lineTo(
        col * fragmentSize * cursorStep + fieldOffsetX,
        cols * fragmentSize + fieldOffsetY
      );
    }
    //rows
    for (let row = 0; row <= rows / cursorStep; row++) {
      ctx.moveTo(fieldOffsetX, row * fragmentSize * cursorStep + fieldOffsetY);
      ctx.lineTo(
        rows * fragmentSize + fieldOffsetX,
        row * fragmentSize * cursorStep + fieldOffsetY
      );
    }

    ctx.stroke();
  }

  // todo: refac to matrix

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
      ctx.strokeStyle = "greenyellow";
      ctx.strokeRect(
        cursorPosX * fragmentSize + fieldOffsetX,
        cursorPosY * fragmentSize + fieldOffsetY,
        fragmentSize * cursorSize,
        fragmentSize * cursorSize
      );
      /* tankSprite3.draw(
        ctx,
        cursorPosX * fragmentSize + fieldOffsetX,
        cursorPosY * fragmentSize + fieldOffsetY,
        fragmentSize * cursorSize,
        fragmentSize * cursorSize
      );*/
    }
  }
  //drawing

  const controlsLabel = new TextSprite({
    text: "<> - move, zx-paint, c-cursor",
  });
  function drawLabels(ctx) {
    controlsLabel.draw(ctx, 16, 230);
  }

  const editorParts = [
    drawBg,
    drawField,
    drawCursor,
    drawCurrentTool,
    drawGrid,
    drawLabels,
  ];

  return {
    load() {
      editorSideBar.hidden = false;
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("keydown", onKeyDown);
      btnSave.addEventListener("click", saveMap);
      btnLoad.addEventListener("click", loadMap);
      btnClear.addEventListener("click", clearMap);
    },
    unload() {
      editorSideBar.hidden = true;

      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("keydown", onKeyDown);
      btnSave.removeEventListener("click", saveMap);
      btnLoad.removeEventListener("click", loadMap);
      btnClear.removeEventListener("click", clearMap);
    },

    draw(ctx, timestamp) {
      //
      editorParts.forEach((component) => component(ctx, timestamp));
    },
  };
}
