import { blockSize, tiles } from "../consts.js";
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
export const spritemap = await loadImage("../sprites/spritemap2.png");
const background = await loadImage("../sprites/reskin/bg_no-shadow.png");
const foreground = await loadImage("../sprites/reskin/fg_shadow.png");

// create sprites

function createSprite({ spritemap, x, y, size = blockSize }) {
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

export const bgSprite = new Sprite({
  spritemap: background,
});

export const fgShadowSprite = new Sprite({
  spritemap: foreground,
});

export const emptySprite = createSprite({ spritemap, x: 21, y: 0 });

export const tankSpriteUp = createSprite({ spritemap, x: 0, y: 0 });
export const tankSpriteLeft = createSprite({ spritemap, x: 2, y: 0 });
export const tankSpriteDown = createSprite({ spritemap, x: 4, y: 0 });
export const tankSpriteRight = createSprite({ spritemap, x: 6, y: 0 });

export const tankCursor = createSprite({ spritemap, x: 6, y: 0 });
export const enemyTank1 = createSprite({ spritemap, x: 8, y: 4 });
export const enemyTank2 = createSprite({ spritemap, x: 8, y: 5 });
export const enemyTank3 = createSprite({ spritemap, x: 8, y: 6 });
export const enemyTank4 = createSprite({ spritemap, x: 8, y: 7 });

export const wallBrickFullSprite = createSprite({ spritemap, x: 16, y: 0 });
export const wallBrickRightSprite = createSprite({ spritemap, x: 17, y: 0 });
export const wallBrickDownSprite = createSprite({ spritemap, x: 18, y: 0 });
export const wallBrickLeftSprite = createSprite({ spritemap, x: 19, y: 0 });
export const wallBrickTopSprite = createSprite({ spritemap, x: 20, y: 0 });

export const wallStoneFullSprite = createSprite({ spritemap, x: 16, y: 1 });
export const wallStoneRightSprite = createSprite({ spritemap, x: 17, y: 1 });
export const wallStoneDownSprite = createSprite({ spritemap, x: 18, y: 1 });
export const wallStoneLeftSprite = createSprite({ spritemap, x: 19, y: 1 });
export const wallStoneTopSprite = createSprite({ spritemap, x: 20, y: 1 });

export const waterSprite = createSprite({ spritemap, x: 16, y: 2 }); //orig
// export const waterSprite = createSprite1{6(spritemap, x:19,y: 3}); //wc2
export const iceSprite = createSprite({ spritemap, x: 18, y: 2 }); //orig
// export const iceSprite = createSprite1{6(spritemap, x:18,y: 3}); //wc2

export const woodSprite = createSprite({ spritemap, x: 17, y: 2 });

export const wallBrickRedFullSprite = createSprite({ spritemap, x: 18, y: 14 });
//
//
export const emptySprite8 = createSprite({ spritemap, x: 42, y: 0, size: 8 });

export const woodSprite8 = createSprite({ spritemap, x: 34, y: 4, size: 8 });
export const waterSprite8 = createSprite({ spritemap, x: 32, y: 4, size: 8 });
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