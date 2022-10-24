import { blackColour, brightOrange, greyColour, nesWidth } from "../consts.js";
import { ListItem, MenuList } from "../components/menuList.js";
import {
  tankCursor,
  wallBrickRedFullSprite,
} from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";

export function initMainMenu({ onStartGame, onSettings, onEditor }) {
  const hightScores = new TextSprite({
    text: "I-     00  HI-  20000",
    textAlign: TextAlign.center,
  });

  const companyName = new TextSprite({
    text: "stepanoid team",
    fillStyle: `${brightOrange}`,
    textAlign: TextAlign.center,
  });

  const copyright = new TextSprite({
    text: "© 2023 stepanoid team ltd.\nall rights reserved",
    lineSpacing: 8,
    textAlign: TextAlign.center,
  });

  const header = new TextSprite({
    text: `BATTLE\nCITY`,
    lineSpacing: 8,
    fillStyle: wallBrickRedFullSprite.getPattern(),
    multiplyText: 4,
    textAlign: TextAlign.center,
  });

  const settingsItems = [
    new ListItem({
      text: "1 player",
      onSelect: onStartGame,
      itemColor: `${greyColour}`,
    }),
    new ListItem({
      text: "2 players",
      onSelect: onStartGame,
      itemColor: `${greyColour}`,
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
    textAlign: TextAlign.center,
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

  const screenCenterX = nesWidth / 2;

  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColour}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      hightScores.draw(ctx, screenCenterX, 14);
      header.draw(ctx, screenCenterX, 40);
      mainMenuList.draw(ctx, screenCenterX, 126);
      companyName.draw(ctx, screenCenterX, 192);
      copyright.draw(ctx, screenCenterX, 206);
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
