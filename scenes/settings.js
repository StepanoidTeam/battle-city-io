import { blackColour, redColour } from "../consts.js";
import { ListItem, ListItemSelect, MenuList } from "../components/menuList.js";
import { nesWidth } from "../consts.js";
import {
  tankCursor,
  wallBrickRedFullSprite,
} from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";
import { config } from "../config.js";

// todo(vmyshko): extract?

export function initSettings({ onExit }) {
  const yesNo = [
    { value: true, text: "yes" },
    { value: false, text: "no" },
  ];
  const onOff = [
    { value: true, text: "on" },
    { value: false, text: "off" },
  ];

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

  const maxTextLength = Math.max(...optionsText.map(([text]) => text.length));

  const settingsItems = optionsText.map(([text, options, onSelect]) => {
    return new ListItemSelect({
      text,
      itemColor: "greenyellow",
      valueColor: `${redColour}`,
      options,
      valueOffsetX: (maxTextLength + 1) * 8,
      onSelect,
    });
  });

  settingsItems.push(
    new ListItem({
      text: "main menu",
      itemColor: "blueviolet",
      onSelect: onExit,
    })
  );

  const menuSettings = new MenuList({
    listItems: settingsItems,
    cursor: tankCursor,
    lineSpacing: 8,
    cursorOffsetX: 24,
    textAlign: TextAlign.center,
  });

  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp": {
        menuSettings.prev();
        break;
      }
      case "ArrowDown": {
        menuSettings.next();
        break;
      }
      case "KeyZ": {
        if (event.repeat) break;
        menuSettings.select();
        console.log(config);
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
    text: "settings",
    multiplyText: 4,
    fillStyle: wallBrickRedFullSprite.getPattern(),
    textAlign: TextAlign.center,
  });

  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColour}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      optionsTitle.draw(ctx, nesWidth / 2, 16);
      menuSettings.draw(ctx, nesWidth / 2 + 16, 16 * 4);
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
