import {
  blackColor,
  brightOrange,
  greyColor,
  nesHeight,
  nesWidth,
} from "../consts.js";
import { ListItem, MenuList } from "../components/menuList.js";
import {
  tankAnimationCursor,
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

  function getRndGameName() {
    const origParts = ["battle", "city", "tank", "1990"];
    const trashParts = [
      "demo",
      "demon",
      "reskin",
      "svetlana",
      "pavlo",
      "bob",
      "metal",
      "max",
      "returns",
      "squad",
      "nemesis",
      "another",
      "colorful",
      "sequel",
    ];
    const parts = [...origParts, ...trashParts];

    function shuffle(array) {
      // todo(vmyshko): should return shuffled copy of an array
    }

    function sampleSize(array, count = 1) {
      // todo(vmyshko): should get random item from array, or multiple items if count > 1
      const arrCopy = Array.from(array);

      const result = [];
      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * array.length);
        result.push(arrCopy[index]);
      }

      return result;
    }

    return sampleSize(parts, 2).join("\n");
  }

  const titleText = getRndGameName();
  console.log(titleText);

  const header = new TextSprite({
    text: titleText,
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
    cursor: tankAnimationCursor,
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
  let averageOffset = 240;
  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColor}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      hightScores.draw(ctx, screenCenterX, 8 + 8 + averageOffset);
      header.draw(ctx, screenCenterX, 32 + 8 + averageOffset);
      mainMenuList.draw(ctx, screenCenterX, 114 + 8 + averageOffset);
      companyName.draw(ctx, screenCenterX, 180 + 8 + averageOffset);
      copyright.draw(ctx, screenCenterX, 196 + 8 + averageOffset);
    },
    async load() {
      document.addEventListener("keydown", function skipIntro(event) {
        if (["Escape", "Enter", "KeyZ"].includes(event.code)) {
          averageOffset = 0;
        }
        document.removeEventListener("keydown", skipIntro);
      });

      while (averageOffset > 0) {
        averageOffset -= 1;
        await sleep(20);
      }
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
