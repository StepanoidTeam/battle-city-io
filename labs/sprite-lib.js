import { Sprite } from "./sprite.js";

// todo(vmyshko): rename
export const blockSize = 16; //px

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    img.addEventListener("load", () => resolve(img));
  });
}

// load images
export const spritemap = await loadImage("../sprites/spritemap2.png");
const background = await loadImage("../sprites/reskin/bgblank.png");

// create sprites

function createSprite16(spritemap, x, y) {
  return new Sprite({
    // spritemap
    spritemap,
    sx: blockSize * x,
    sy: blockSize * y,
    sHeight: blockSize,
    sWidth: blockSize,
    // canvas
    width: blockSize,
    height: blockSize,
  });
}

export const bgSprite = new Sprite({
  spritemap: background,
});

export const emptySprite = createSprite16(spritemap, 21, 0);
export const tankSprite1 = createSprite16(spritemap, 0, 0);
export const tankSprite2 = createSprite16(spritemap, 1, 0);

export const tankSprite3 = createSprite16(spritemap, 0, 0);
export const tankCursor = createSprite16(spritemap, 6, 0);
export const enemyTank1 = createSprite16(spritemap, 8, 4);
export const enemyTank2 = createSprite16(spritemap, 8, 5);
export const enemyTank3 = createSprite16(spritemap, 8, 6);
export const enemyTank4 = createSprite16(spritemap, 8, 7);

export const wallBrickFullSprite = createSprite16(spritemap, 16, 0);
export const wallBrickRightSprite = createSprite16(spritemap, 17, 0);
export const wallBrickDownSprite = createSprite16(spritemap, 18, 0);
export const wallBrickLeftSprite = createSprite16(spritemap, 19, 0);
export const wallBrickTopSprite = createSprite16(spritemap, 20, 0);

export const wallStoneFullSprite = createSprite16(spritemap, 16, 1);
export const wallStoneRightSprite = createSprite16(spritemap, 17, 1);
export const wallStoneDownSprite = createSprite16(spritemap, 18, 1);
export const wallStoneLeftSprite = createSprite16(spritemap, 19, 1);
export const wallStoneTopSprite = createSprite16(spritemap, 20, 1);

export const waterSprite = createSprite16(spritemap, 16, 2); //orig
// export const waterSprite = createSprite16(spritemap, 19, 3); //wc2
export const iceSprite = createSprite16(spritemap, 18, 2); //orig
// export const iceSprite = createSprite16(spritemap, 18, 3); //wc2

export const woodSprite = createSprite16(spritemap, 17, 2);

export const wallBrickRedFullSprite = createSprite16(spritemap, 18, 14);
