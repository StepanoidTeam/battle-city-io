import { tankCursor } from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";

export function initSettings({onExit}) {
  const menuPos = [80, 32];
  const valueYes = new TextSprite({ x: 0, y: 0, text: "yes" });
  const valueNo = new TextSprite({ x: 0, y: 0, text: "no" });
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

  let maxTextLength = 0;
  for (let textIndex = 0; textIndex < optionsText.length; textIndex++) {
    if (maxTextLength < optionsText[textIndex].length) {
      maxTextLength = optionsText[textIndex].length;
    }
  }

  const options = optionsText.map((text, textIndex) => {
    return {
      textSprite: new TextSprite({
        text: text,
        //color: "grey",
      }),
      value: false,
      draw(ctx) {
        this.textSprite.draw(ctx, menuPos[0], menuPos[1] + textIndex * (8 + 8));

        (this.value ? valueYes : valueNo).draw(
          ctx,
          menuPos[0] + maxTextLength * 8 + 8,
          menuPos[1] + textIndex * (8 + 8)
        );
      },
      select() {
        this.value = !this.value;
      },
    };
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
        options[currentOptionIndex].select()
        break;
      }

      case "Escape": {
        break;
      }
    }
  });

  return function drawSettings(ctx) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    options.forEach((option) => option.draw(ctx));

    cursor.draw(ctx, menuPos[0] - 24, menuPos[1] - 4 + currentOptionIndex * 16);
  };
}
