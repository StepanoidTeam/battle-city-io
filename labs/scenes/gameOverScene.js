import { initialPointOfViewY, nesWidth } from "../consts.js";
import { wallBrickFullSprite } from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";

export function initGameOverScene({ onExit }) {
  const gameOver = new TextSprite({
    text: `game\nover`,
    lineSpacing: 8,
    fillStyle: wallBrickFullSprite.getPattern(),
    multiplyText: 7,
    textAlign: TextAlign.right,
    shadowFill: true,
  });

  let timeOutId;
  return {
    draw(ctx) {
      gameOver.draw(ctx, nesWidth - 16, initialPointOfViewY * 4);
    },
    load() {
      timeOutId = setTimeout(onExit, 3000);
    },
    unload() {
      clearTimeout(timeOutId);
    },
  };
}
