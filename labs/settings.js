import { tankCursor } from "./sprite-lib.js";
import { TextSprite } from "./text.js";

const menuPos = [80, 32];

const options = [
  "friendly fire",
  "ai use bonus",
  "5 bonus tanks",
  "bonus shots",
  "8 ai tanks",
  "40 ai total",
  "ai tank armor",
  "swap palettes",
  "new bonuses",
  "main menu",
].map((text, textIndex) => {
  return {
    text: new TextSprite({
      x: menuPos[0],
      y: menuPos[1] + textIndex * (8 + 8),
      text: text,
      //color: "grey",
    }),
    value: true,
  };
});
const cursor = tankCursor;
let optionIndex = 0;
document.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "ArrowUp": {
if(optionIndex>0){
      optionIndex--;

}

      break;
    }
    case "ArrowDown": {
        if (optionIndex < options.length - 1) {
                  optionIndex++;

        }
      break;
    }

    case "KeyZ": {
      if (event.repeat) break;

      break;
    }

    case "Escape": {
      break;
    }
  }
});

export function drawSettings(ctx) {

ctx.fillStyle="black";
ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height)

  options.forEach(({ text }) => text.draw(ctx));

  cursor.draw(ctx, menuPos[0] - 24, menuPos[1] - 4 + optionIndex * 16);
}
