import { TextAlign, TextSprite } from "./textSprite.js";

const noOp = () => console.log("noOp");

export const yesNo = [
  { value: true, text: "yes" },
  { value: false, text: "no" },
];
export const onOff = [
  { value: true, text: "on" },
  { value: false, text: "off" },
];

globalThis.debug = false; //show debug rects

export class ListItem {
  constructor({ text, itemColor, onSelect = noOp }) {
    this.text = text;
    this.onSelect = onSelect;

    this.textSprite = new TextSprite({
      text: text,
      fillStyle: itemColor,
    });

    this.minWidth = this.text.length * this.textSprite.charSize;
    this.width = this.minWidth;
  }

  select() {
    this.onSelect();
  }

  draw(ctx, x, y) {
    this.textSprite.draw(ctx, x, y);

    if (debug) {
      ctx.strokeStyle = "magenta";
      ctx.strokeRect(x, y, this.width, this.textSprite.charSize);
    }
  }
}

export class ListItemSelect extends ListItem {
  #maxOptionLength;

  get value() {
    return this.options[this.selectedIndex].value;
  }

  constructor({ text, itemColor, valueColor, value, options, onSelect }) {
    super({ text, itemColor, onSelect });
    if (typeof options[0] === "object") {
      this.options = options;
    } else {
      this.options = options.map((value) => ({
        value: value,
        text: `${value}`,
      }));
    }

    const selectedItemIndex = this.options.findIndex(
      (option) => option.value === value
    );

    this.selectedIndex = selectedItemIndex < 0 ? 0 : selectedItemIndex;

    this.#maxOptionLength = Math.max(
      ...this.options.map((option) => option.text.length)
    );

    this.minWidth =
      (this.text.length + 1 + this.#maxOptionLength) * this.textSprite.charSize;

    this.width = this.minWidth;

    this.optionSprites = this.options.map(
      (option) =>
        new TextSprite({
          text: option.text,
          fillStyle: valueColor ?? itemColor,
          textAlign: TextAlign.right,
        })
    );
  }

  select() {
    this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
    this.onSelect(this.value, this.selectedIndex);
  }

  draw(ctx, x, y) {
    super.draw(ctx, x, y);

    const selectedOption = this.optionSprites[this.selectedIndex];

    selectedOption.draw(ctx, x + this.width, y);
  }
}

export class MenuList {
  #textAlignOffsetX;

  constructor({
    listItems,
    cursor,
    lineSpacing = 0,
    cursorOffsetX = 0,
    selectedIndex = 0,
    textAlign = TextAlign.left,
  }) {
    this.listItems = listItems;
    this.cursor = cursor;
    this.lineSpacing = lineSpacing;
    this.cursorOffsetX = cursorOffsetX;
    this.selectedIndex = selectedIndex;
    this.textAlign = textAlign;

    this.width = Math.max(...this.listItems.map((item) => item.width));

    this.listItems.forEach((item) => {
      item.width = this.width;
    });

    this.#textAlignOffsetX =
      -1 *
      this.width *
      {
        [TextAlign.left]: 0,
        [TextAlign.center]: 0.5,
        [TextAlign.right]: 1,
      }[this.textAlign];
  }

  get selectedItem() {
    return this.listItems[this.selectedIndex];
  }

  get height() {
    return (
      (this.selectedItem.textSprite.charSize + this.lineSpacing) *
      this.listItems.length
    );
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
    this.listItems.forEach((listItem, index) => {
      listItem.draw(
        ctx,
        x + this.#textAlignOffsetX,
        y + index * (listItem.textSprite.charSize + this.lineSpacing)
      );
    });

    const cursorHeight = this.cursor.sHeight;
    const itemHeight = this.selectedItem.textSprite.charSize;

    this.cursor.draw(
      ctx,
      x - this.cursorOffsetX + this.#textAlignOffsetX,
      y +
        this.selectedIndex * (itemHeight + this.lineSpacing) +
        (itemHeight - cursorHeight) / 2
    );

    if (debug) {
      ctx.strokeStyle = "greenyellow";
      ctx.strokeRect(x + +this.#textAlignOffsetX, y, this.width, this.height);
    }
  }
}
