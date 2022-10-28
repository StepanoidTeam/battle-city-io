export class Grid {
  hidden = false;
  strokeStyle = "rgba(0,0,0,0.2)";

  constructor() {
    this.init();
  }

  // todo(vmyshko): change? from fn or from setters?
  init() {}

  update(timestamp) {}

  draw(ctx, timestamp) {
    if (this.hidden) return;

    ctx.strokeStyle = this.strokeStyle;
    ctx.beginPath();
    //columns
    for (let col = 0; col <= cols / cursorStep; col++) {
      ctx.moveTo(col * fragmentSize * cursorStep + fieldOffsetX, fieldOffsetY);
      ctx.lineTo(
        col * fragmentSize * cursorStep + fieldOffsetX,
        cols * fragmentSize + fieldOffsetY
      );
    }
    //rows
    for (let row = 0; row <= rows / cursorStep; row++) {
      ctx.moveTo(fieldOffsetX, row * fragmentSize * cursorStep + fieldOffsetY);
      ctx.lineTo(
        rows * fragmentSize + fieldOffsetX,
        row * fragmentSize * cursorStep + fieldOffsetY
      );
    }

    ctx.stroke();
  }
}
