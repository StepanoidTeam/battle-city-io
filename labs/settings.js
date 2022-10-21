import { ListItem, ListItemSelect, MenuList } from "./menuList.js";
import { nesWidth } from "./script.js";
import { tankCursor, wallBrickRedFullSprite } from "./sprite-lib.js";
import { TextAlign, TextSprite } from "./textSprite.js";

// todo(vmyshko): extract?

export function initSettings({ onExit }) {
  const yesNo = ["yes", "no"];
  const onOff = ["on", "off"];

  //max items 10
  const optionsText = [
    ["pl.friendly fire", onOff],
    ["ai friendly fire", onOff],
    ["ai use bonus", yesNo],
    ["bonus ship and gun", yesNo],
    ["additional lives", [1, 2, 3, 4, 5]],
    ["level pack", ["classic", "1990"]],
    ["skin", ["1985", "reskin"]],
  ];

  const maxTextLength = Math.max(...optionsText.map(([text]) => text.length));

  const settingsItems = optionsText.map(([text, options]) => {
    return new ListItemSelect({
      text,
      itemColor: "greenyellow",
      valueColor: "red",

      options,

      valueOffsetX: (maxTextLength + 1) * 8,
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
      ctx.fillStyle = "black";
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
