import { tankCursor, wallBrickRedFullSprite } from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";

// todo(vmyshko): extract?
const noOp = () => console.log("no");

class ListItem {
  constructor({ text, itemColor, onSelect = noOp }) {
    this.text = text;
    this.onSelect = onSelect;

    this.textSprite = new TextSprite({
      text: text,
      fillStyle: itemColor,
    });
  }
  select() {
    this.onSelect();
  }
  draw(ctx, x, y) {
    this.textSprite.draw(ctx, x, y);
  }
}

class ListItemSelect extends ListItem {
  //

  get value() {
    return this.options[this.selectedIndex];
  }

  constructor({
    text,
    itemColor,
    valueColor,
    value,
    options,
    valueOffsetX,
    onSelect = noOp,
  }) {
    super({ text, itemColor, onSelect });

    // this.value = value;
    this.selectedIndex = options.includes(value) ? options.indexOf(value) : 0;
    this.options = options;

    this.valueOffsetX =
      valueOffsetX ?? (text.length + 1) * this.textSprite.charSize;

    this.optionSprites = this.options.map(
      (option) =>
        new TextSprite({
          text: option.toString(),
          fillStyle: valueColor ?? itemColor,
        })
    );
  }

  select() {
    this.selectedIndex++;
    if (this.selectedIndex >= this.options.length) {
      this.selectedIndex = 0;
    }
    super.onSelect();
  }

  draw(ctx, x, y) {
    super.draw(ctx, x, y);

    const selectedOption = this.optionSprites[this.selectedIndex];

    selectedOption.draw(ctx, x + this.valueOffsetX, y);
  }
}
class MenuList {
  constructor({
    listItems,
    cursor,
    lineSpacing = 0,
    cursorOffsetX,
    selectedIndex = 0,
  }) {
    this.listItems = listItems;
    this.cursor = cursor;
    this.lineSpacing = lineSpacing;
    this.cursorOffsetX = cursorOffsetX;
    this.selectedIndex = selectedIndex;
  }

  get selectedItem() {
    return this.listItems[this.selectedIndex];
  }

  select() {
    this.selectedItem.select();
  }

  prev() {
    this.selectedIndex--;
    if (this.selectedIndex < 0) {
      this.selectedIndex = this.listItems.length - 1;
    }
  }

  next() {
    this.selectedIndex++;
    if (this.selectedIndex >= this.listItems.length) {
      this.selectedIndex = 0;
    }
  }

  draw(ctx, x, y) {
    this.listItems.forEach((listItem, index) =>
      listItem.draw(
        ctx,
        x,
        y + index * (listItem.textSprite.charSize + this.lineSpacing)
      )
    );
    const cursorHeight = this.cursor.sHeight;
    const itemHeight = this.selectedItem.textSprite.charSize;

    this.cursor.draw(
      ctx,
      x - this.cursorOffsetX,
      y +
        this.selectedIndex * (itemHeight + this.lineSpacing) +
        (itemHeight - cursorHeight) / 2
    );
  }
}

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

  document.addEventListener("keydown", function (event) {
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
        break;
      }
    }
  });

  const optionsTitle = new TextSprite({
    text: "options",
    multiplyText: 4,
    fillStyle: wallBrickRedFullSprite.getPattern(),
    shadowFill: true,
  });
  const menuPos = [2, 4].map((x) => x * 16);

  return function drawSettings(ctx) {
    //bg
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // title
    optionsTitle.draw(ctx, 16, 16);
    menuSettings.draw(ctx, ...menuPos);
    // draw list
  };
}
