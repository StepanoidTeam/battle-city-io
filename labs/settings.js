import { tankCursor, wallBrickRedFullSprite } from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";

// todo(vmyshko): extract?
const noOp = () => void 0;

class ListItem {
  text = "list item";
  onSelect = noOp;
  textSprite;

  constructor({ text, itemColor, onSelect = noOp }) {
    this.text = text;
    this.onSelect = onSelect;

    this.textSprite = new TextSprite({
      text: text,
      fillStyle: itemColor,
    });
  }

  draw(ctx, x, y) {
    this.textSprite.draw(ctx, x, y);
  }
}

class ListItemSelect extends ListItem {
  //
  value = null;
  options = [false];
  selectedIndex = 0;

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

    this.value = value;
    this.selectedIndex = options.includes(value) ? options.indexOf(value) : 0;
    this.options = options;

    this.valueOffsetX = valueOffsetX ?? text.length * super.textSprite.charSize;

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
  }

  draw(ctx, x, y) {
    super.draw(ctx, x, y);

    const selectedOption = this.optionSprites[this.selectedIndex];

    selectedOption.draw(ctx, x + this.valueOffsetX, y);
  }
}

export function initSettings({ onExit }) {
  const menuPos = [4, 4].map((x) => x * 16);

  const optionsText = [
    "friendly fire",
    "ai use bonus",
    "5 bonus tanks",
    "bonus shots",
    "8 ai tanks",
    "40 ai total",
    "ai tank armor",
    "swap palettes",
    "new bonuses",
  ];

  const maxTextLength = Math.max(...optionsText.map((text) => text.length));

  const options = optionsText.map((text, textIndex) => {
    return new ListItemSelect({
      text: text,
      itemColor: "greenyellow",
      valueColor: "red",

      options: ["no", "yes"],

      valueOffsetX: maxTextLength * 8 + 8,
    });
  });

  options.push({
    textSprite: new TextSprite({ text: "main menu" }),
    value: null,
    draw(ctx) {
      this.textSprite.draw(
        ctx,
        menuPos[0],
        menuPos[1] + (options.length - 1) * (8 + 8)
      );
    },
    select() {
      onExit();
    },
  });

  const cursor = tankCursor;
  let currentOptionIndex = 0;

  document.addEventListener("keydown", function (event) {
    switch (event.code) {
      case "ArrowUp": {
        if (currentOptionIndex > 0) {
          currentOptionIndex--;
        }
        break;
      }
      case "ArrowDown": {
        if (currentOptionIndex < options.length - 1) {
          currentOptionIndex++;
        }
        break;
      }
      case "KeyZ": {
        if (event.repeat) break;
        options[currentOptionIndex].select();
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

  return function drawSettings(ctx) {
    //bg
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // title
    optionsTitle.draw(ctx, 16, 16);

    // draw list
    options.forEach((option, index) =>
      option.draw(ctx, menuPos[0], menuPos[1] + index * (8 + 8))
    );

    cursor.draw(ctx, menuPos[0] - 24, menuPos[1] - 4 + currentOptionIndex * 16);
  };
}
