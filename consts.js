//colours
export const gingerColor = "rgb(263,154,69)";
export const redColor = "rgb(220,23,43)";
export const brightOrange = "rgb(173,48,5)";
export const greyColor = "rgb(116,116,116)";
export const blackColor = "rgb(0,0,0)";
export const whiteColor = "rgb(255,255,255)";
//canvas settings
export const [nesWidth, nesHeight] = [256, 240];
export const scale = 3;
export const cellSize = 8; //px
export const linePxFix = 0.5; // to fix canvas lines blur - http://diveintohtml5.info/canvas.html#pixel-madness
export const blockSize = 16; //px
export const [fieldOffsetX, fieldOffsetY] = [blockSize, blockSize];

export const fragmentSize = blockSize / 2; //px
export const tiles = {
  Void: 0x00,
  Forest: 0x0f,
  Concrete: 0x10,
  Water: 0x12,
  Ice: 0x21,
  Brick: 0x22,
};

export const defaultMapSize = 26;
export const localMapKey = "jsonMap";
