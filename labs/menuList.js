import { TextSprite } from "./textSprite.js";

const noOp = () => console.log("noOp");

export class ListItem {
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

export class ListItemSelect extends ListItem {
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
    onSelect,
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
export class MenuList {
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
