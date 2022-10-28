import {  nesWidth } from "../consts.js";
import { wallBrickFullSprite } from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";
import { sleep } from "../helpers.js";


export function initGameOverScene({ onExit }) {
  const gameOver = new TextSprite({
    text: `game\nover`,
    lineSpacing: 8,
    fillStyle: wallBrickFullSprite.getPattern(),
    multiplyText: 7,
    textAlign: TextAlign.right,
    shadowFill: true,
  });


  return {
    draw(ctx) {
      gameOver.draw(ctx, nesWidth - 16, 16 * 4);
    },
    async load() {
      await sleep(3000);
      onExit();
    },
    unload() {
//
    },
  };
}
