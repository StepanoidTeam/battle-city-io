import { cellSize, nesHeight, nesWidth } from "../consts.js";
import { ListItem, ListItemSelect, MenuList } from "../components/menuList.js";
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
} from "../components/sprite-lib.js";
import { TextSprite } from "../components/textSprite.js";

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
  let paintKeyDown = false;
  let cursorStep = 1;
  let cursorSize = 2;
  let menuIsOpen = false;

  //controls

  const itemColor = "white";
  const contextMenu = new MenuList({
    cursor: new TextSprite({ text: ">" }),
    lineSpacing: 8,
    cursorOffsetX: 8,

    listItems: [
      new ListItem({
        text: "clear",
        itemColor,
        onSelect: () => clearMap(),
      }),
      new ListItem({
        text: "load",
        itemColor,
        onSelect: () => loadMap(),
      }),
      new ListItem({
        text: "save",
        itemColor,
        onSelect: () => saveMap(),
      }),
      new ListItemSelect({
        text: "show grid",
        itemColor,
        valueColor: "gold",
        options: ["on", "off"],
        onSelect: (value) => {
          showGrid = value === "on";
        },
      }),
      new ListItemSelect({
        text: "grid size",
        itemColor,
        valueColor: "gold",
        options: ["8px", "16px"],
        onSelect: (value, index) => {
          cursorStep = [1, 2][index];
        },
      }),
      new ListItem({
        text: "exit",
        itemColor,
        onSelect: () => onExit(),
      }),
    ],
  });

  function onKeyDown(event) {
    // todo(vmyshko): extract?
    if (menuIsOpen) {
      switch (event.code) {
        case "ArrowUp": {
          contextMenu.prev();
          break;
        }
        case "ArrowDown": {
          contextMenu.next();
          break;
        }
        case "KeyZ": {
          if (event.repeat) break;
          contextMenu.select();
          break;
        }
        case "Escape": {
          if (event.repeat) break;
          menuIsOpen = false;
          break;
        }
      }

      return;
    }

    switch (event.code) {
      case "Enter": {
        menuIsOpen = true;
        break;
      }

      case "ArrowLeft": {
        cursorPosX -= cursorStep;
        break;
      }
      case "ArrowRight": {
        cursorPosX += cursorStep;
        break;
      }
      case "ArrowUp": {
        cursorPosY -= cursorStep;
        break;
      }
      case "ArrowDown": {
        cursorPosY += cursorStep;
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

        // currentTool = (currentTool + 1) % tools.length
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
        menuIsOpen = true;
        break;
      }
    } //switch Keys

    // check boundaries
    cursorPosX = Math.max(cursorPosX, 0);
    cursorPosX = Math.min(cursorPosX, cols - cursorSize);
    cursorPosY = Math.max(cursorPosY, 0);
    cursorPosY = Math.min(cursorPosY, rows - cursorSize);
    //---

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

  let showGrid = true;
  function drawGrid(ctx) {
    if (!showGrid) return;

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

  function drawCurrentTool(ctx) {
    const toolSprite = tools[currentTool];

    ctx.strokeStyle = "black";

    const [toolPosX, toolPosY] = [
      blockSize * 14 + cellSize + ((2 - cursorSize) * fragmentSize) / 2,
      fragmentSize + ((2 - cursorSize) * fragmentSize) / 2,
    ];

    ctx.strokeRect(
      toolPosX,
      toolPosY,
      (blockSize * cursorSize) / 2,
      (blockSize * cursorSize) / 2
    );

    for (let cursorPartX = 0; cursorPartX < cursorSize; cursorPartX++) {
      for (let cursorPartY = 0; cursorPartY < cursorSize; cursorPartY++) {
        toolSprite.draw(
          ctx,
          toolPosX + cursorPartX * fragmentSize,
          toolPosY + cursorPartY * fragmentSize,
          fragmentSize,
          fragmentSize
        );
      }
    }
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

  const [menuPosX, menuPosY] = [
    (nesWidth - contextMenu.width) / 2,
    (nesHeight - contextMenu.height) / 2,
  ];
  const menuPadding = 16;

  function drawContextMenu(ctx, timestamp) {
    if (!menuIsOpen) return;

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(
      menuPosX - menuPadding,
      menuPosY - menuPadding,
      contextMenu.width + menuPadding * 2,
      contextMenu.height + menuPadding * 2
    );
    contextMenu.draw(ctx, menuPosX, menuPosY);
  }
  //drawing

  const editorParts = [
    drawBg,
    drawField,
    drawCursor,
    drawCurrentTool,
    drawGrid,

    drawContextMenu,
  ];

  return {
    load() {
      menuIsOpen = false;
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("keydown", onKeyDown);
    },

    draw(ctx, timestamp) {
      //
      editorParts.forEach((component) => component(ctx, timestamp));
    },
  };
}
