import { nesHeight, nesWidth } from "./consts.js";
import { wallBrickFullSprite } from "./sprite-lib.js";
import { TextAlign, TextSprite } from "./textSprite.js";

export function initGameOverScene({ onExit }) {
  const gameOver = new TextSprite({
    text: `game\nover`,
    lineSpacing: 8,
    fillStyle: wallBrickFullSprite.getPattern(),
    multiplyText: 7,
    textAlign: TextAlign.center,
    shadowFill: true,
  });

  let timeOutId;

  // let startTime = null;
  return {
    draw(ctx, timestamp) {
      gameOver.draw(
        ctx,
        nesWidth / 2,
        (nesHeight - (gameOver.charSize * 2 + 8)) / 2
      );
    },
    // update(timestamp) {
    //   if (!startTime) startTime = timestamp; //1 startTime ??= timestamp
    //   if (timestamp - startTime > 3000) onExit();
    //   //impl
    // },
    load() {
      timeOutId = setTimeout(onExit, 3_000);
    },
    unload() {
      clearTimeout(timeOutId);
    },
  };
}
