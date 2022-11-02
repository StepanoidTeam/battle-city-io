const tiles = {
  Void: 0x00,
  Forest: 0x0f,
  Concrete: 0x10,
  Water: 0x12,
  Ice: 0x21,
  Brick: 0x22,
};

const colors = {
  Black: [0, 0, 0, 255],
  Green: [138, 76, 10, 255],
  DarkGray: [127, 127, 127, 255],
  Blue: [67, 67, 247, 255],
  LightGray: [172, 172, 172, 255],
  Brown: [215, 255, 72, 255],
  Magenta: [255, 0, 255, 255],
};

const tileColors = new Map([
  [tiles.Void, colors.Black],
  [tiles.Forest, colors.Green],
  [tiles.Concrete, colors.DarkGray],
  [tiles.Water, colors.Blue],
  [tiles.Ice, colors.LightGray],
  [tiles.Brick, colors.Brown],
]);

const FallbackColor = colors.Magenta;

export function tileColor(tile) {
  return tileColors.get(tile) ?? FallbackColor;
}

const colorTiles = new Map([
  [colors.Black.join(), tiles.Void],
  [colors.Green.join(), tiles.Forest],
  [colors.DarkGray.join(), tiles.Concrete],
  [colors.Blue.join(), tiles.Water],
  [colors.LightGray.join(), tiles.Ice],
  [colors.Brown.join(), tiles.Brick],
]);

const FallbackTile = tiles.Void;

export function colorTile(color) {
  return colorTiles.get(color.join()) ?? FallbackTile;
}
