import { fragmentSize } from "../consts.js";

export class Grid {
  hidden = false;

  setCellSize(value) {
    this.cellSize = value;
  }
  
  constructor({
    cols,
    rows,
    cellSize,
    fieldOffsetX,
    fieldOffsetY,
    strokeStyle = "rgba(0,0,0,0.2)",
  }) {
    this.init();
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.fieldOffsetX = fieldOffsetX;
    this.fieldOffsetY = fieldOffsetY;
    this.strokeStyle = strokeStyle;
  }

  // todo(vmyshko): change? from fn or from setters?
  init() {}

  update(timestamp) {}

  draw(ctx, timestamp) {
    if (this.hidden) return;

    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();
    //columns
    for (let col = 0; col <= this.cols / this.cellSize; col++) {
      ctx.moveTo(
        col * fragmentSize * this.cellSize + this.fieldOffsetX,
        this.fieldOffsetY
      );
      ctx.lineTo(
        col * fragmentSize * this.cellSize + this.fieldOffsetX,
        this.cols * fragmentSize + this.fieldOffsetY
      );
    }
    //rows
    for (let row = 0; row <= this.rows / this.cellSize; row++) {
      ctx.moveTo(
        this.fieldOffsetX,
        row * fragmentSize * this.cellSize + this.fieldOffsetY
      );
      ctx.lineTo(
        this.rows * fragmentSize + this.fieldOffsetX,
        row * fragmentSize * this.cellSize + this.fieldOffsetY
      );
    }

    ctx.stroke();
  }
}
