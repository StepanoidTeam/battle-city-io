import { ListItem, ListItemSelect, MenuList } from "./menuList.js";
import { tankCursor, wallBrickRedFullSprite } from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";

// todo(vmyshko): extract?

export function initSettings({ onExit }) {
  const yesNo = ["yes", "no"];

  //max items 10
  const optionsText = [
    ["pl.friendly fire", yesNo],
    ["ai friendly fire", yesNo],
    ["ai use bonus", yesNo],
    ["bonus ship and gun", yesNo],
    ["additional lives", [1, 2, 3, 4, 5]],
    ["level pack", ["classic", "1990"]],
    ["skin", yesNo],
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
    shadowFill: true,
  });
  const menuPos = [2, 4].map((x) => x * 16);

  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      optionsTitle.draw(ctx, 0, 16);
      menuSettings.draw(ctx, ...menuPos);
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
