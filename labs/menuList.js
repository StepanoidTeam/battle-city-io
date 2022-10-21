import { TextAlign, TextSprite } from "./textSprite.js";

const noOp = () => console.log("noOp");

const debug = false; //show debug rects

export class ListItem {
  get width() {
    return this.text.length * this.textSprite.charSize;
  }

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

    if (debug) {
      ctx.strokeStyle = "magenta";
      ctx.strokeRect(x, y, this.width, this.textSprite.charSize);
    }
  }
}

export class ListItemSelect extends ListItem {
  #maxOptionLength;

  get value() {
    return this.options[this.selectedIndex];
  }

  get width() {
    return this.#maxOptionLength * this.textSprite.charSize + this.valueOffsetX;
  }

  constructor({
    text,
    itemColor,
    valueColor,
    value,
    options,
    valueOffsetX,
    onSelect,
  }) {
    super({ text, itemColor, onSelect });

    // this.value = value;
    this.selectedIndex = options.includes(value) ? options.indexOf(value) : 0;
    this.options = options;

    this.#maxOptionLength = Math.max(
      ...this.options.map((option) => `${option}`.length)
    );

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
    this.onSelect();
  }

  draw(ctx, x, y) {
    super.draw(ctx, x, y);

    const selectedOption = this.optionSprites[this.selectedIndex];

    selectedOption.draw(ctx, x + this.valueOffsetX, y);
  }
}

export class MenuList {
  #textAlignOffsetX;

  constructor({
    listItems,
    cursor,
    lineSpacing = 0,
    cursorOffsetX,
    selectedIndex = 0,
    textAlign = TextAlign.left,
  }) {
    this.listItems = listItems;
    this.cursor = cursor;
    this.lineSpacing = lineSpacing;
    this.cursorOffsetX = cursorOffsetX;
    this.selectedIndex = selectedIndex;
    this.textAlign = textAlign; // todo(vmyshko): impl

    this.width = Math.max(...this.listItems.map((item) => item.width));

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
      ctx.strokeRect(
        x + +this.#textAlignOffsetX,
        y,
        this.width,
        (this.selectedItem.textSprite.charSize + this.lineSpacing) *
          this.listItems.length
      );
    }
  }
}
