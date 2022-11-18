import { blockSize, fragmentSize, tiles } from "../consts.js";
import { AnimationSprite } from "./animationSprite.js";
import { Sprite } from "./sprite.js";

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;

    img.addEventListener("load", () => resolve(img), { once: true });
    img.addEventListener("error", (error) => reject(error), { once: true });
  });
}

// load images
export const spritemap = await loadImage("sprites/spritemap2.png");
const background = await loadImage("sprites/reskin/bg01.png");
const foreground = await loadImage("sprites/reskin/fg_shadow.png");
export const bgDirt = await loadImage("sprites/bg-dirt.png");
export const bgWater = await loadImage("sprites/bg-water.png");
const bgFrame = await loadImage("sprites/bg-frame.png");

// create sprites

export function createSprite({ spritemap, x, y, size = blockSize }) {
  return new Sprite({
    // spritemap
    spritemap,
    sx: size * x,
    sy: size * y,
    sHeight: size,
    sWidth: size,
    // canvas
    width: size,
    height: size,
  });
}

export const bgFrameSprite = new Sprite({
  spritemap: bgFrame,
});

export const bgSprite = new Sprite({
  spritemap: background,
});

export const fgShadowSprite = new Sprite({
  spritemap: foreground,
});

export const emptySprite = createSprite({ spritemap, x: 21, y: 0 });

export const p1tankSpriteUp1 = createSprite({ spritemap, x: 0, y: 17 });
export const p1tankSpriteLeft1 = createSprite({ spritemap, x: 2, y: 17 });
export const p1tankSpriteDown1 = createSprite({ spritemap, x: 4, y: 17 });
export const p1tankSpriteRight1 = createSprite({ spritemap, x: 6, y: 17 });

export const p1tankSpriteUp2 = createSprite({ spritemap, x: 1, y: 17 });
export const p1tankSpriteLeft2 = createSprite({ spritemap, x: 3, y: 17 });
export const p1tankSpriteDown2 = createSprite({ spritemap, x: 5, y: 17 });
export const p1tankSpriteRight2 = createSprite({ spritemap, x: 7, y: 17 });

export const tankCursor = createSprite({ spritemap, x: 6, y: 0 });
export const tankCursor2 = createSprite({ spritemap, x: 7, y: 0 });
export const enemyTank1 = createSprite({ spritemap, x: 8, y: 4 });
export const enemyTank2 = createSprite({ spritemap, x: 8, y: 5 });
export const enemyTank3 = createSprite({ spritemap, x: 8, y: 6 });
export const enemyTank4 = createSprite({ spritemap, x: 8, y: 7 });

export const wallBrickFullSprite = createSprite({ spritemap, x: 16, y: 0 });

export const wallBrickRedFullSprite = createSprite({ spritemap, x: 18, y: 14 });
//
//

export const bulletUp = new Sprite({
  spritemap,
  sx: 320,
  sy: 48,
  sWidth: 16,
  sHeight: 8,
});
export const bulletLeft = new Sprite({
  spritemap,
  sx: 336,
  sy: 48,
  sWidth: 8,
  sHeight: 16,
});
export const bulletDown = new Sprite({
  spritemap,
  sx: 320,
  sy: 56,
  sWidth: 16,
  sHeight: 8,
});
export const bulletRight = new Sprite({
  spritemap,
  sx: 344,
  sy: 48,
  sWidth: 8,
  sHeight: 16,
});

//
export const emptySprite8 = createSprite({ spritemap, x: 42, y: 0, size: 8 });

export const woodSprite8 = createSprite({ spritemap, x: 34, y: 4, size: 8 });
export const waterSprite8 = new AnimationSprite({
  sprites: [
    createSprite({ spritemap, x: 33, y: 10, size: 8 }),
    createSprite({ spritemap, x: 34, y: 10, size: 8 }),
  ],
});

export const stoneSprite8 = createSprite({ spritemap, x: 32, y: 2, size: 8 });
export const brickSprite8 = createSprite({ spritemap, x: 32, y: 0, size: 8 });
export const iceSprite8 = createSprite({ spritemap, x: 36, y: 4, size: 8 });

export const tileSprites = new Map([
  [tiles.Void, emptySprite8],
  [tiles.Forest, woodSprite8],
  [tiles.Concrete, stoneSprite8],
  [tiles.Water, waterSprite8],
  [tiles.Ice, iceSprite8],
  [tiles.Brick, brickSprite8],
]);

export const explosionStart = createSprite({ spritemap, x: 18, y: 5 });
export const explosionMiddle = createSprite({ spritemap, x: 19, y: 5 });
export const explosionEnd = createSprite({ spritemap, x: 20, y: 5 });
export const tankAnimationCursor = new AnimationSprite({
  sprites: [tankCursor, tankCursor2],
  durationMs: 150,
});

export const tankAnimationDurationMs = 100;
export const p1TankMoveUp = new AnimationSprite({
  sprites: [p1tankSpriteUp1, p1tankSpriteUp2],
  durationMs: tankAnimationDurationMs,
});
export const p1TankMoveLeft = new AnimationSprite({
  sprites: [p1tankSpriteLeft1, p1tankSpriteLeft2],
  durationMs: tankAnimationDurationMs,
});
export const p1TankMoveDown = new AnimationSprite({
  sprites: [p1tankSpriteDown1, p1tankSpriteDown2],
  durationMs: tankAnimationDurationMs,
});
export const p1TankMoveRight = new AnimationSprite({
  sprites: [p1tankSpriteRight1, p1tankSpriteRight2],
  durationMs: tankAnimationDurationMs,
});
