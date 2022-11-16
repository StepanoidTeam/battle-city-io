import {
  blockSize,
  cellSize,
  defaultMapSize,
  fieldOffsetX,
  fieldOffsetY,
  fragmentSize,
  localMapKey,
  nesHeight,
  nesWidth,
  tiles,
} from "../consts.js";
import {
  ListItem,
  ListItemSelect,
  MenuList,
  onOff,
} from "../components/menuList.js";
import {
  bgFrameSprite,
  fgShadowSprite,
  tileSprites,
} from "../components/sprite-lib.js";
import { TextSprite } from "../components/textSprite.js";
import { Grid } from "../components/grid.js";
import { MapData, MapDrawer } from "../components/mapData.js";

const [cols, rows] = [defaultMapSize, defaultMapSize]; // field size in cells
const mapData = new MapData({ cols, rows });

export function getEditor({ onExit }) {
  function drawBg(ctx) {
    bgFrameSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }

  function drawFg(ctx) {
    fgShadowSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }
  //

  function saveMap() {
    const jsonMap = mapData.save();

    console.log(jsonMap);
  }

  function loadMap() {
    const jsonMap = prompt("input map as json array", "null");
    try {
      mapData.load(jsonMap);
    } catch (error) {
      alert(`bad data: ${error}`);
    }
  }

  const tools = Object.values(tiles);

  let [cursorPosX, cursorPosY] = [0, 0]; //x,y
  let currentToolIndex = 1;
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
        onSelect: () => mapData.clearMap(),
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
        options: onOff,
        onSelect: (value) => {
          grid.hidden = !value;
        },
      }),
      new ListItemSelect({
        text: "grid size",
        itemColor,
        valueColor: "gold",
        options: [
          { value: 1, text: "8px" },
          { value: 2, text: "16px" },
        ],
        onSelect: (value) => {
          cursorStep = value;
          grid.setCellSize(value);
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
        currentToolIndex = (currentToolIndex + 1) % tools.length;

        break;
      }

      case "KeyX": {
        if (event.repeat) break;
        paintKeyDown = true;
        // if (fieldMatrix[cursorPosX][cursorPosY] === currentTool) {
        if (currentToolIndex === 0) {
          currentToolIndex = tools.length - 1;
        } else {
          currentToolIndex--;
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
          mapData.fieldMatrix[cursorPosX + cursorPartX][
            cursorPosY + cursorPartY
          ] = tools[currentToolIndex];
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

  const grid = new Grid({
    cols,
    rows,
    cellSize: cursorStep,
    fieldOffsetX,
    fieldOffsetY,
  });
  function drawCurrentTool(ctx) {
    const toolSprite = tileSprites.get(tools[currentToolIndex]);

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
  const mapDrawer = new MapDrawer({ mapData });
  const editorParts = [
    drawBg,
    (ctx) => mapDrawer.draw(ctx),
    drawCursor,
    drawCurrentTool,
    (ctx) => {
      grid.draw(ctx);
    },

    drawContextMenu,
    drawFg,
  ];

  return {
    load() {
      // load cached map
      const jsonMap = localStorage.getItem(localMapKey);
      if (jsonMap) {
        mapData.load(jsonMap);
      } else {
        // default empty map
        mapData.init(defaultMapSize, defaultMapSize);
      }

      menuIsOpen = false;
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      const jsonMap = mapData.save();
      localStorage.setItem(localMapKey, jsonMap);

      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("keydown", onKeyDown);
    },

    draw(ctx, timestamp) {
      //
      editorParts.forEach((component) => component(ctx, timestamp));
    },
  };
}
