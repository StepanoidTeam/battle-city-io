import { AnimationSprite } from "../components/animationSprite.js";
import { Grid } from "../components/grid.js";
import { MapData, MapDrawer, pathlessBlocks } from "../components/mapData.js";
import {
  bgSprite,
  bulletDown,
  bulletLeft,
  bulletRight,
  bulletUp,
  explosionEnd,
  explosionMiddle,
  explosionStart,
  p1TankMoveDown,
  p1TankMoveLeft,
  p1TankMoveRight,
  p1TankMoveUp,
  tankAnimationDurationMs,
} from "../components/sprite-lib.js";
import {
  blockSize,
  defaultMapSize,
  fragmentSize,
  localMapKey,
  nesHeight,
  nesWidth,
  tiles,
} from "../consts.js";
import { sleep } from "../helpers.js";

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

const bulletDirectionSize = {
  [Direction.Left]: [1, 2],
  [Direction.Right]: [1, 2],
  [Direction.Up]: [2, 1],
  [Direction.Down]: [2, 1],
};

const directionShift = {
  [Direction.Up]: [0, -1],
  [Direction.Down]: [0, 1],
  [Direction.Left]: [-1, 0],
  [Direction.Right]: [1, 0],
};

function vectorSum([x1, y1], [x2, y2]) {
  return [x1 + x2, y1 + y2];
}

// todo(vmyshko): extract?
function posToPx(pos) {
  return pos * fragmentSize + blockSize;
}

class MovingObj {
  #isMoving = false;

  set isMoving(value) {
    this.#isMoving = value;
  }
  get isMoving() {
    return this.#isMoving;
  }
  constructor({
    posX = 0,
    posY = 0,
    direction,
    directionSprites,
    width,
    height,
  }) {
    this.posX = posX;
    this.posY = posY;
    this.directionSprites = directionSprites;
    this.direction = direction;
    this.isMoving = false;
    this.width = width;
    this.height = height;
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

  constructor({
    movableItem,
    mapData,
    isAnimated,
    moveDurationMs,
    onCollision = () => {},
  }) {
    this.#movableItem = movableItem;
    this.#mapData = mapData;
    this.x = posToPx(this.#movableItem.posX);
    this.y = posToPx(this.#movableItem.posY);
    this.isAnimated = isAnimated;
    this.moveDurationMs = moveDurationMs;
    this.onCollision = onCollision;
  }

  // todo(vmyshko): rename args
  checkCollision({ destX, destY, sizeX = 1, sizeY = 1 }) {
    // todo(vmyshko): optimize checks // excl. out-of-bounds (and remove .getTileId then)
    const collisions = [];
    for (let col = destX; col < destX + sizeX; col++) {
      for (let row = destY; row < destY + sizeY; row++) {
        const tileId = this.#mapData.getTileId(col, row);

        // todo(vmyshko): return collided col,row?

        if (pathlessBlocks.includes(tileId)) {
          collisions.push({ tileId, col, row });
        }
      }
    }

    return {
      isCollided: collisions.length > 0,
      collisions: collisions,
    };
  }

  async startMove(direction) {
    if (this.#movableItem.isMoving) return false;
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

    // get DEST coords
    const [dx, dy] = directionShift[direction];

    const [nextPosX, nextPosY] = [
      this.#movableItem.posX + dx,
      this.#movableItem.posY + dy,
    ];

    // get FROM coords
    this.x = posToPx(this.#movableItem.posX);
    this.y = posToPx(this.#movableItem.posY);

    // todo(vmyshko): check collision?

    const { isCollided, collisions } = this.checkCollision({
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
      this.onCollision(collisions);
      return false;
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
      const [dx, dy] = directionShift[direction];

      const [destX, destY] = [this.x + dx * stepPx, this.y + dy * stepPx];

      this.x = destX;
      this.y = destY;
      if (animFrameIndex === fragmentSize - 1) break;
      await sleep(this.moveDurationMs);
    }

    //release next move
    this.#movableItem.isMoving = false;
    toggledAnimation(this.#movableItem.isMoving);
    return true;
  }

  update(timestamp) {
    //
  }

  draw(ctx, timestamp) {
    this.#movableItem.drawXY(ctx, this.x, this.y);
  }
}

export function GameScene({ onExit }) {
  const gameParts = new Set();

  const mapData = new MapData({ cols: defaultMapSize, rows: defaultMapSize });

  const fieldSize = 26; // todo(vmyshko): get  from actual map

  const p1tank = new MovingObj({
    posX: 12,
    posY: 12,
    direction: Direction.Up,
    directionSprites: p1directionSprites,
    width: 2,
    height: 2,
  });

  const tankCtrl = new Controller({
    movableItem: p1tank,
    mapData: mapData,
    isAnimated: true,
    moveDurationMs: tankAnimationDurationMs / 2,
    onCollision: (collisions) => {
      console.log(collisions);
    },
  });

  const keysPressed = new Set();
  function onKeyDown(event) {
    keysPressed.add(event.code);

    switch (event.code) {
      case "KeyZ": {
        if (event.repeat) break;

        const [bulletWidth, bulletHeight] =
          bulletDirectionSize[p1tank.direction];

        //create new bullet
        const tankBullet = new MovingObj({
          posX: p1tank.posX,
          posY: p1tank.posY,
          direction: p1tank.direction,
          directionSprites: bulletDirectionSprites,
          width: bulletWidth,
          height: bulletHeight,
        });

        const bulletCtrl = new Controller({
          movableItem: tankBullet,
          mapData: mapData,
          isAnimated: false,
          moveDurationMs: 8,
          onCollision: (collisions) => {
            gameParts.delete(drawExactBullet);

            // destroy blocks
            collisions
              .filter((collision) => collision.tileId)
              .forEach((collision) => {
                // todo(vmyshko): check for is destroyable first
                mapData.fieldMatrix[collision.col][collision.row] = tiles.Void;
              });

            const minCol = Math.min(
              ...collisions.map((collision) => collision.col),
              tankBullet.posX
            );
            const minRow = Math.min(
              ...collisions.map((collision) => collision.row),
              tankBullet.posY
            );

            function drawExplosion(ctx) {
              explosion.draw(ctx, ...[minCol, minRow].map(posToPx));
            }

            const explosion = new AnimationSprite({
              sprites: [
                explosionStart, // todo(vmyshko): fix bug with 1st frame skip
                explosionStart,
                explosionMiddle,
                explosionEnd,
              ],
              durationMs: 500,
              playOnce: true,
              onStop: () => {
                gameParts.delete(drawExplosion);
              },
            });

            gameParts.add(drawExplosion);
          },
        });

        function drawExactBullet(...args) {
          bulletCtrl.draw(...args);
        }

        gameParts.add(drawExactBullet);

        // start moving
        (async () => {
          const bulletDirection = p1tank.direction;
          // todo(vmyshko): until collide or timeout?
          for (let i = 0; i <= 30; i++) {
            const isColided = await bulletCtrl.startMove(bulletDirection);
            if (!isColided) break;
          }
        })();
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
  const mapDrawer = new MapDrawer({ mapData: mapData });

  gameParts.add(drawBg);
  gameParts.add((ctx) => mapDrawer.draw(ctx));
  gameParts.add((ctx) => grid.draw(ctx));
  gameParts.add((...args) => tankCtrl.draw(...args));

  return {
    load() {
      // todo(vmyshko): load map from ls? or start level 1?
      const jsonMap = localStorage.getItem(localMapKey);

      if (jsonMap) {
        mapData.load(jsonMap);
      } else {
        // todo(vmyshko): get 1st level, if no edited level in LS
        // default empty map
        mapData.init(defaultMapSize, defaultMapSize);
      }

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
