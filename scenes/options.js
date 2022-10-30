import { blackColor, greyColor, redColor, whiteColor } from "../consts.js";
import {
  ListItem,
  ListItemSelect,
  MenuList,
  onOff,
  yesNo,
} from "../components/menuList.js";
import { nesWidth } from "../consts.js";
import {
  tankCursor,
  wallBrickRedFullSprite,
} from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";
import { config } from "../config.js";

// todo(vmyshko): extract?

export function initOptions({ onExit }) {
  //max items 10
  const optionsText = [
    [
      "pl.friendly fire",
      onOff,
      (value) => (config.options.player.friendlyFire = value),
    ],
    [
      "ai friendly fire",
      onOff,
      (value) => (config.options.ai.friendlyFire = value),
    ],
    ["ai use bonus", yesNo, (value) => (config.options.ai.useBonus = value)],
    [
      "bonus ship and gun",
      yesNo,
      (value) => {
        (config.options.extraBonuses.ship = value),
          (config.options.extraBonuses.gun = value);
      },
    ],
    [
      "additional lives",
      [1, 2, 3, 4, 5],
      (value) => (config.options.additionalLives = value),
    ],
    [
      "level pack",
      ["classic", "1990"],
      (value) => (config.options.levelPack = value),
    ],
    ["skin", ["1985", "reskin"], (value) => (config.options.skin = value)],
  ];

  const optionsItems = optionsText.map(([text, options, onSelect]) => {
    return new ListItemSelect({
      text,
      itemColor: `${greyColor}`,
      valueColor: `${whiteColor}`,
      options,
      onSelect,
    });
  });

  optionsItems.push(
    new ListItem({
      text: "main menu",
      itemColor: `${greyColor}`,
      onSelect: onExit,
    })
  );
  const menuOptions = new MenuList({
    listItems: optionsItems,
    cursor: tankCursor,
    lineSpacing: 8,
    cursorOffsetX: 24,
    textAlign: TextAlign.center,
  });

  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp": {
        menuOptions.prev();
        break;
      }
      case "ArrowDown": {
        menuOptions.next();
        break;
      }
      case "KeyZ": {
        if (event.repeat) break;
        menuOptions.select();
        break;
      }
      case "Escape": {
        if (event.repeat) break;

        onExit();
        break;
      }
    }
  }
  const optionsTitle = new TextSprite({
    text: "options",
    multiplyText: 4,
    fillStyle: wallBrickRedFullSprite.getPattern(),
    textAlign: TextAlign.center,
  });

  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColor}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      optionsTitle.draw(ctx, nesWidth / 2, 16);
      menuOptions.draw(ctx, nesWidth / 2 + 16, 16 * 4);
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
