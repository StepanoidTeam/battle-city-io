import { Grid } from "../components/grid.js";
import { MapDrawer, pathlessBlocks } from "../components/mapData.js";
import {
  bgSprite,
  bulletDown,
  bulletLeft,
  bulletRight,
  bulletUp,
  p1TankMoveDown,
  p1TankMoveLeft,
  p1TankMoveRight,
  p1TankMoveUp,
  tankAnimationDurationMs,
} from "../components/sprite-lib.js";
import { blockSize, fragmentSize, nesHeight, nesWidth } from "../consts.js";
import { sleep } from "../helpers.js";
import { sharedMapData } from "./_shared.js";

const Direction = {
  Left: "left",
  Right: "right",
  Up: "up",
  Down: "down",
};

const p1directionSprites = {
  [Direction.Left]: p1TankMoveLeft,
  [Direction.Right]: p1TankMoveRight,
  [Direction.Up]: p1TankMoveUp,
  [Direction.Down]: p1TankMoveDown,
};
const bulletDirectionSprites = {
  [Direction.Left]: bulletLeft,
  [Direction.Right]: bulletRight,
  [Direction.Up]: bulletUp,
  [Direction.Down]: bulletDown,
};
// todo(vmyshko): extract?
function posToPx(pos) {
  return pos * fragmentSize + blockSize;
}

class MovingObj {
  width = 2;
  height = 2;
  #isMoving = false;

  set isMoving(value) {
    this.#isMoving = value;
  }
  get isMoving() {
    return this.#isMoving;
  }
  constructor({ posX = 0, posY = 0, directionSprites }) {
    this.posX = posX;
    this.posY = posY;
    this.directionSprites = directionSprites;
    this.direction = Direction.Up;
    this.isMoving = false;
  }

  draw(ctx, timestamp) {
    // todo(vmyshko): play move anim if moving?
    // todo(vmyshko): play move anim/sound?

    const currentSprite = this.directionSprites[this.direction];

    const [x, y] = [this.posX, this.posY].map(posToPx);

    currentSprite.draw(ctx, x, y, blockSize, blockSize);
  }

  // todo(vmyshko): temp for controller/mover
  drawXY(ctx, x, y) {
    const currentSprite = this.directionSprites[this.direction];

    currentSprite.draw(ctx, x, y, currentSprite.sWidth, currentSprite.sHeight);
  }
}

// todo(vmyshko): extract, bind to main game loop (draw)
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
  #mapData = null;

  constructor({ movableItem, mapData, isAnimated, moveDurationMs }) {
    this.#movableItem = movableItem;
    this.#mapData = mapData;
    this.x = posToPx(this.#movableItem.posX);
    this.y = posToPx(this.#movableItem.posY);
    this.isAnimated = isAnimated;
    this.moveDurationMs = moveDurationMs;
  }

  // todo(vmyshko): rename args
  checkCollision({ destX, destY, sizeX = 1, sizeY = 1 }) {
    // todo(vmyshko): optimize checks // excl. out-of-bounds (and remove .getTileId then)
    for (let col = destX; col < destX + sizeX; col++) {
      for (let row = destY; row < destY + sizeY; row++) {
        const tileId = this.#mapData.getTileId(col, row);

        // todo(vmyshko): return collided col,row?
        if (pathlessBlocks.includes(tileId)) return true;
      }
    }

    return false;
  }

  async startMove(direction) {
    if (this.#movableItem.isMoving) return;
    const toggledAnimation = (value) => {
      if (this.isAnimated) {
        Object.values(this.#movableItem.directionSprites).forEach(
          (animSprite) => {
            value ? animSprite.start() : animSprite.stop();
          }
        );
      }
    };
    this.#movableItem.isMoving = true;
    toggledAnimation(this.#movableItem.isMoving);
    this.#movableItem.direction = direction;
    // prevent if already moving, wait till end?

    const destShifts = {
      [Direction.Up]: [0, -1],
      [Direction.Down]: [0, 1],
      [Direction.Left]: [-1, 0],
      [Direction.Right]: [1, 0],
    };
    // get DEST coords
    const [dx, dy] = destShifts[direction];

    const [nextPosX, nextPosY] = [
      this.#movableItem.posX + dx,
      this.#movableItem.posY + dy,
    ];

    // get FROM coords
    this.x = posToPx(this.#movableItem.posX);
    this.y = posToPx(this.#movableItem.posY);

    // todo(vmyshko): check collision?

    const isCollided = this.checkCollision({
      destX: nextPosX,
      destY: nextPosY,
      sizeX: this.#movableItem.width,
      sizeY: this.#movableItem.height,
    });

    if (isCollided) {
      // todo(vmyshko): do not move
      //release next move
      this.#movableItem.isMoving = false;
      toggledAnimation(this.#movableItem.isMoving);

      return;
    }

    // real move
    this.#movableItem.posX = nextPosX;
    this.#movableItem.posY = nextPosY;

    // animate move
    const stepPx = 1;
    for (
      let animFrameIndex = 0;
      animFrameIndex < fragmentSize;
      animFrameIndex++
    ) {
      // anim move
      const [dx, dy] = destShifts[direction];

      const [destX, destY] = [this.x + dx * stepPx, this.y + dy * stepPx];

      this.x = destX;
      this.y = destY;

      if (animFrameIndex === fragmentSize - 1) break;
      await sleep(this.moveDurationMs);
    }

    //release next move
    this.#movableItem.isMoving = false;
    toggledAnimation(this.#movableItem.isMoving);
  }

  update(timestamp) {
    //
  }

  draw(ctx, timestamp) {
    this.#movableItem.drawXY(ctx, this.x, this.y);
  }
}

export function GameScene({ onExit }) {
  let paused = false;

  let gameParts = [];

  const fieldSize = 26; // todo(vmyshko): get  from actual map

  const p1tank = new MovingObj({
    posX: 12,
    posY: 12,
    directionSprites: p1directionSprites,
  });

  const tankCtrl = new Controller({
    movableItem: p1tank,
    mapData: sharedMapData,
    isAnimated: true,
    moveDurationMs: tankAnimationDurationMs / 2,
  });

  const bullet1 = new MovingObj({
    posX: 12,
    posY: 12,
    directionSprites: bulletDirectionSprites,
    moveDurationMs: 80,
  });

  const bulletCtrl = new Controller({
    movableItem: bullet1,
    mapData: sharedMapData,
    isAnimated: false,
    moveDurationMs: 1000,
  });

  const keysPressed = new Set();
  function onKeyDown(event) {
    keysPressed.add(event.code);

    switch (event.code) {
      case "KeyZ": {
        if (event.repeat) break;
        bulletCtrl.startMove(p1tank.direction);

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
          tankCtrl.startMove(Direction.Up);

          break;
        }
        case "ArrowDown": {
          tankCtrl.startMove(Direction.Down);

          break;
        }
        case "ArrowLeft": {
          tankCtrl.startMove(Direction.Left);

          break;
        }
        case "ArrowRight": {
          tankCtrl.startMove(Direction.Right);

          break;
        }
        case "KeyZ": {
        }
      } //switch
    } //for
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
  });
  const mapDrawer = new MapDrawer({ mapData: sharedMapData });

  gameParts.push(
    drawBg,
    (ctx) => mapDrawer.draw(ctx),
    (ctx) => grid.draw(ctx),

    // (...args) => p1tank.draw(...args),
    (...args) => tankCtrl.draw(...args),
    // (...args) => p2tank.draw(...args)
    (...args) => bulletCtrl.draw(...args)
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
      ctx.fillStyle = "black";
      ctx.fillText("keys: " + [...keysPressed.values()], 50, 235);
      ctx.fillText("tank: " + `${p1tank.posX},${p1tank.posY}`, 150, 235);
    },
  };
}
