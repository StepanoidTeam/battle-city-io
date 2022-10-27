import { bgSprite, tankCursor } from "../components/sprite-lib.js";
import { nesHeight, nesWidth } from "../consts.js";

export function GameScene({ onExit }) {
  let paused = false;

  let gameParts = [];

  const fieldSize = 13;
  let [p1posX, p1posY] = [0, 0];

  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp": {
        p1posY--;
        break;
      }
      case "ArrowDown": {
        p1posY++;
        break;
      }
      case "ArrowLeft": {
        p1posX--;
        break;
      }
      case "ArrowRight": {
        p1posX++;
        break;
      }
      case "KeyZ": {
        if (event.repeat) break;
        //fire

        break;
      }

      case "Escape": {
        onExit();
        break;
      }
    }

    // check collisions
    // bounds
    p1posX = Math.max(0, p1posX);
    p1posX = Math.min(fieldSize - 1, p1posX);

    p1posY = Math.max(0, p1posY);
    p1posY = Math.min(fieldSize - 1, p1posY);
  }

  function onKeyUp() {
    //
  }

  function drawBg(ctx) {
    bgSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }

  function drawPlayer(ctx, timestamp) {
    tankCursor.draw(ctx, ...[p1posX, p1posY].map((x) => x * 16 + 16), 16, 16);
  }

  gameParts.push(drawBg, drawPlayer);

  return {
    load() {
      paused = false;
      document.addEventListener("keyup", onKeyUp);
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("keydown", onKeyDown);
    },

    draw(ctx, timestamp) {
      //
      gameParts.forEach((component) => component(ctx, timestamp));
    },
  };
}
