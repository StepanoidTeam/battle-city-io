import { ListItem, MenuList } from "./menuList.js";
import { tankCursor, wallBrickRedFullSprite } from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";

export function initMainMenu({ onStartGame, onSettings, onEditor }) {
  const hightScores = new TextSprite({
    text: "I-     00  HI-  20000",
  });
  const companyName = new TextSprite({
    text: "stepanoid team",
    fillStyle: "rgb(173,48,5)",
  });
  const copyright = new TextSprite({
    text: "© 2023 stepanoid team ltd.\n all rights reserved",
    lineSpacing: 8,
  });
  const header = new TextSprite({
    text: `BATTLE\n CITY`,
    lineSpacing: 8,
    fillStyle: wallBrickRedFullSprite.getPattern(),
    multiplyText: 4,
  });
  const settingsItems = [
    new ListItem({
      text: "1 player",
      onSelect: onStartGame,
    }),
    new ListItem({
      text: "2 players",
      onSelect: onStartGame,
    }),
    new ListItem({
      text: "editor",
      onSelect: onEditor,
    }),
    new ListItem({
      text: "settings",
      onSelect: onSettings,
    }),
  ];

  const mainMenuList = new MenuList({
    listItems: settingsItems,
    cursor: tankCursor,
    lineSpacing: 8,
    cursorOffsetX: 24,
  });
  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp": {
        mainMenuList.prev();
        break;
      }
      case "ArrowDown": {
        mainMenuList.next();
        break;
      }
      case "KeyZ": {
        if (event.repeat) break;
        mainMenuList.select();
        break;
      }
    }
  }
  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      hightScores.draw(ctx, 18, 14);
      header.draw(ctx, 28, 40);
      mainMenuList.draw(ctx, 90, 126);
      companyName.draw(ctx, 70, 192);
      copyright.draw(ctx, 30, 206);
      // draw list
    },
    load() {
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
