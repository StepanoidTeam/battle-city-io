// draw text based on sprite letters

import { Sprite } from "./sprite.js";
import { spritemap } from "./sprite-lib.js";

// todo(vmyshko): extract to abc?
const charSize = 8;

function loadLetter({ img, offsetX, offsetY, charSize }) {
  return new Sprite({
    spritemap: img,
    sx: offsetX,
    sy: offsetY,
    sHeight: charSize,
    sWidth: charSize,
    // canvas
    width: charSize,
    height: charSize,
  });
}

const unsupportedChar = "❌";
const emptyChar = " ";

const abcSpriteDictionary = Object.fromEntries([
  [
    unsupportedChar,
    loadLetter({ img: spritemap, offsetX: 464, offsetY: 72, charSize }),
  ], // pink
  [
    emptyChar,
    loadLetter({ img: spritemap, offsetX: 416, offsetY: 16, charSize }),
  ], // empty

  ["!", loadLetter({ img: spritemap, offsetX: 456, offsetY: 24, charSize })],
  [".", loadLetter({ img: spritemap, offsetX: 488, offsetY: 64, charSize })],
  ["©", loadLetter({ img: spritemap, offsetX: 416, offsetY: 48, charSize })],

  ..."abcdefghijklmno".split("").map((letter, index) => {
    return [
      letter,
      loadLetter({
        img: spritemap,
        offsetX: charSize * index + 424,
        offsetY: charSize * 6,
        charSize,
      }),
    ];
  }),
  ..."pqrstuvwxyz<_>".split("").map((letter, index) => {
    return [
      letter,
      loadLetter({
        img: spritemap,
        offsetX: index * charSize + 424 - charSize,
        offsetY: charSize * 7,
        charSize,
      }),
    ];
  }),
  ..."0123456789".split("").map((letter, index) => {
    return [
      letter,
      loadLetter({
        img: spritemap,
        offsetX: charSize * index + 424 - charSize,
        offsetY: charSize * 5,
        charSize,
      }),
    ];
  }),
]);
const ctxBuffer = document.createElement("canvas").getContext("2d");
ctxBuffer.imageSmoothingEnabled = false; // pixelated

export class TextSprite {
  #charSize;
  #lines;
  #lineSpacing;

  get charSize() {
    return this.#charSize;
  }
  // todo(vmyshko): reuse charSize const
  constructor({
    text,
    charSize = 8,
    lineSpacing = 0,
    fillStyle = null,
    multiplyText = 1,
    shadowFill = false,
  }) {
    this.#charSize = charSize;
    this.#lineSpacing = lineSpacing;
    this.text = text;
    this.fillStyle = fillStyle;
    this.multiplyText = multiplyText;
    this.shadowFill = shadowFill;
    if (this.multiplyText) {
      this.#charSize = charSize * this.multiplyText;
    }
  }

  set text(value) {
    this.#lines = value
      .toLowerCase()
      .split("\n")
      .map((line) => line.split(""));
  }

  get text() {
    // for debug
    this.#lines.map((line) => line.join()).join("\n");
  }

  draw(ctx, x, y) {
    // todo(vmyshko): bake to one image? for performance

    this.#lines.forEach((line, lineIndex) => {
      line.forEach((char, charIndex) => {
        const charExists = Object.hasOwn(abcSpriteDictionary, char);

        const letterSprite =
          abcSpriteDictionary[charExists ? char : unsupportedChar];

        // todo(vmyshko): use buffer canvas, to fix issue with mixing text with other sprites
        ctxBuffer.clearRect(0, 0, this.#charSize, this.#charSize);
        letterSprite.draw(ctxBuffer, 0, 0, this.#charSize, this.#charSize);

        this.shadowFill
          ? ctx.drawImage(
              ctxBuffer.canvas,
              0,
              -1,
              this.#charSize,
              this.#charSize,
              x + charIndex * this.#charSize,
              y + lineIndex * (this.#charSize + this.#lineSpacing),
              this.#charSize,
              this.#charSize
            )
          : null;

        // todo(vmyshko): impl  text colors and text bg

        // todo(vmyshko): dynamic color change prikol -- remove
        // const blinkingDelayMs = 10;
        // const colorHue = Math.floor(timestamp / blinkingDelayMs) % 360;

        // this.color = `hsl(${colorHue}deg 50% 40%)`;

        if (this.fillStyle) {
          // set composite mode

          ctxBuffer.globalCompositeOperation = "source-atop";
          ctxBuffer.fillStyle = this.fillStyle;
          ctxBuffer.fillRect(0, 0, this.#charSize, this.#charSize);
          // reset comp. mode
          ctxBuffer.fillStyle = "black";

          ctxBuffer.globalCompositeOperation = "source-over";
        }

        ctx.drawImage(
          ctxBuffer.canvas,
          0,
          0,
          this.#charSize,
          this.#charSize,
          x + charIndex * this.#charSize,
          y + lineIndex * (this.#charSize + this.#lineSpacing),
          this.#charSize,
          this.#charSize
        );
      });
    });
  }
}
