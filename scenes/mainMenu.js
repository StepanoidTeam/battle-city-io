import {
  blackColor,
  brightOrange,
  greyColor,
  nesHeight,
  nesWidth,
} from "../consts.js";
import { ListItem, MenuList } from "../components/menuList.js";
import {
  tankCursor,
  wallBrickRedFullSprite,
} from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";
import { sleep } from "../helpers.js";

export function initMainMenu({ onStartGame, onOptions, onEditor }) {
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
      onSelect: () => onStartGame({ players: 1 }),
      itemColor: `${greyColor}`,
    }),
    new ListItem({
      text: "2 players",
      onSelect: () => onStartGame({ players: 2 }),
      itemColor: `${greyColor}`,
    }),
    new ListItem({
      text: "editor",
      onSelect: onEditor,
    }),
    new ListItem({
      text: "options",
      onSelect: onOptions,
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
  const screeninitialPoint = 16;
  let y = nesHeight;
  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColor}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      hightScores.draw(ctx, screenCenterX, y);
      header.draw(ctx, screenCenterX, y * 3);
      mainMenuList.draw(ctx, screenCenterX, y * 8);
      companyName.draw(ctx, screenCenterX, y * 12);
      copyright.draw(ctx, screenCenterX, y * 13);
      //             await sleep(100);

      // hightScores.draw(ctx, screenCenterX, screeninitialPoint);
      // header.draw(ctx, screenCenterX, screeninitialPoint * 3);
      // mainMenuList.draw(ctx, screenCenterX, screeninitialPoint * 8);
      // companyName.draw(ctx, screenCenterX, screeninitialPoint * 12);
      // copyright.draw(ctx, screenCenterX, screeninitialPoint * 13);
      // draw list
    },
    async load() {
      document.addEventListener("keydown", onKeyDown);
      while (y > screeninitialPoint) {
        if (y > screeninitialPoint) {
          await sleep(20);

          y--;
        }
      }
    },
    unload() {
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
