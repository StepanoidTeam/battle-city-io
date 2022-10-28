import { Grid } from "../components/grid.js";
import {
  bgSprite,
  tankSpriteDown,
  tankSpriteLeft,
  tankSpriteRight,
  tankSpriteUp,
} from "../components/sprite-lib.js";
import { blockSize, fragmentSize, nesHeight, nesWidth } from "../consts.js";

const TankDirection = {
  Left: "left",
  Right: "right",
  Up: "up",
  Down: "down",
};

const directionSprites = {
  [TankDirection.Left]: tankSpriteLeft,
  [TankDirection.Right]: tankSpriteRight,
  [TankDirection.Up]: tankSpriteUp,
  [TankDirection.Down]: tankSpriteDown,
};

// todo(vmyshko): extract?
function posToPx(pos) {
  return pos * fragmentSize + blockSize;
}

class Tank {
  constructor({ posX = 0, posY = 0 } = {}) {
    this.posX = posX;
    this.posY = posY;

    this.direction = TankDirection.Up;
  }

  draw(ctx, timestamp) {
    const currentSprite = directionSprites[this.direction];

    const [x, y] = [this.posX, this.posY].map(posToPx);

    currentSprite.draw(ctx, x, y, blockSize, blockSize);
  }

  // todo(vmyshko): temp for controller/mover
  drawXY(ctx, x, y) {
    const currentSprite = directionSprites[this.direction];

    currentSprite.draw(ctx, x, y, blockSize, blockSize);
  }
}

class Sleeper {
  static #queue = new Set();

  #startTimestamp = 0;
  #currentTimestamp = 0;
  #diffMs = 0;
  #resolveFn = null;
  constructor(ms = 0) {
    Sleeper.#queue.add(this);

    this.#diffMs = ms;

    return new Promise((resolve, reject) => {
      this.#resolveFn = resolve;
    });
  }

  update(timestamp) {
    if (!this.#startTimestamp) {
      this.#startTimestamp = timestamp;
    }

    this.#currentTimestamp = timestamp;

    if (this.#currentTimestamp - this.#startTimestamp > this.#diffMs) {
      this.#resolveFn();
      this.#destroy();
    }
  }

  #destroy() {
    Sleeper.#queue.delete(this);
  }

  static update(timestamp) {
    for (let sleeper of Sleeper.#queue) {
      sleeper.update(timestamp);
    }
  }
}

class Controller {
  #movableItem = null;

  isMoving = false;

  constructor(movableItem) {
    this.#movableItem = movableItem;
    this.x = posToPx(this.#movableItem.posX);
    this.y = posToPx(this.#movableItem.posY);
  }

  async startMove(direction) {
    if (this.isMoving) return;
    this.isMoving = true;
    tankMove.volume = 0.05;
    // tankMove.play();
    this.#movableItem.direction = direction;
    // prevent if already moving, wait till end?

    // get FROM coords
    this.x = posToPx(this.#movableItem.posX);
    this.y = posToPx(this.#movableItem.posY);

    // get DEST coords

    // this.destX =

    const stepPx = 1;
    for (
      let animFrameIndex = 0;
      animFrameIndex < fragmentSize;
      animFrameIndex++
    ) {
      // anim move
      switch (direction) {
        case TankDirection.Up: {
          this.y -= stepPx;
          //  tankMove.play();

          break;
        }
        case TankDirection.Down: {
          this.y += stepPx;
          break;
        }
        case TankDirection.Left: {
          this.x -= stepPx;
          break;
        }
        case TankDirection.Right: {
          this.x += stepPx;
          break;
        }
      }

      await new Sleeper(10);
    }

    // real move
    switch (direction) {
      case TankDirection.Up: {
        this.#movableItem.posY--;
        break;
      }
      case TankDirection.Down: {
        this.#movableItem.posY++;
        break;
      }
      case TankDirection.Left: {
        this.#movableItem.posX--;
        break;
      }
      case TankDirection.Right: {
        this.#movableItem.posX++;
        break;
      }
    }

    //release next move
    this.isMoving = false;
    // tankMove.pause();
  }

  update(timestamp) {
    //
  }

  draw(ctx, timestamp) {
    this.#movableItem.drawXY(ctx, this.x, this.y);

    if (this.isMoving) {
      const [x, y] = [this.#movableItem.posX, this.#movableItem.posY].map(
        posToPx
      );
      ctx.strokeStyle = "crimson";
      ctx.strokeRect(x, y, blockSize, blockSize);
    }
  }
}

export function GameScene({ onExit }) {
  let paused = false;

  let gameParts = [];

  const fieldSize = 26; // todo(vmyshko): get  from actual map

  const p1tank = new Tank({ posX: 12, posY: 12 });

  const ctrl1 = new Controller(p1tank);

  const keysPressed = new Set();
  function onKeyDown(event) {
    keysPressed.add(event.code);

    switch (event.code) {
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
  }

  // todo(vmyshko): refac, make a part of class?
  async function update(timestamp) {
    Sleeper.update(timestamp);
    //

    for (let key of keysPressed) {
      switch (key) {
        case "ArrowUp": {
          ctrl1.startMove(TankDirection.Up);

          break;
        }
        case "ArrowDown": {
          ctrl1.startMove(TankDirection.Down);

          break;
        }
        case "ArrowLeft": {
          ctrl1.startMove(TankDirection.Left);

          break;
        }
        case "ArrowRight": {
          ctrl1.startMove(TankDirection.Right);

          break;
        }
      } //switch
    } //for

    // check collisions
    // bounds
    // move to tank? or map class?
    p1tank.posX = Math.max(0, p1tank.posX);
    // todo(vmyshko): -2 depends on obj size in fragments
    p1tank.posX = Math.min(fieldSize - 2, p1tank.posX);

    p1tank.posY = Math.max(0, p1tank.posY);
    p1tank.posY = Math.min(fieldSize - 2, p1tank.posY);
  }

  function onKeyUp(event) {
    //
    keysPressed.delete(event.code);
  }

  function drawBg(ctx) {
    bgSprite.draw(ctx, 0, 0, nesWidth, nesHeight);
  }
  const grid = new Grid({
    cols: fieldSize,
    rows: fieldSize,
    cellSize: 1,
    fieldOffsetX: 16,
    fieldOffsetY: 16,
  });
  gameParts.push(
    drawBg,
    (ctx) => grid.draw(ctx),
    // (...args) => p1tank.draw(...args),
    (...args) => ctrl1.draw(...args)
    // (...args) => p2tank.draw(...args)
  );

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
      update(timestamp);

      gameParts.forEach((component) => component(ctx, timestamp));

      //debug keys
      ctx.font = ctx.font.replace(/\d+px/, "6px");
      ctx.fillText("keys: " + [...keysPressed.values()], 50, 235);
    },
  };
}
