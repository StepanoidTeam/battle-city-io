import { tiles } from "../consts.js";

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

export function preview(maps) {
  for (const [index, map] of maps.entries()) {
    const canvas = createCanvas(map);
    const downloadLink = createDownloadLink(canvas, index);

    downloadLink.appendChild(canvas);
    document.body.appendChild(downloadLink);
  }
}

function createCanvas(map) {
  const canvas = document.createElement("canvas");

  canvas.width = map.width;
  canvas.height = map.height;

  putImageData(canvas, map);

  return canvas;
}

function putImageData(canvas, map) {
  const data = new Uint8ClampedArray(
    map.tiles.flatMap((tile) => tileColors.get(tile) ?? FallbackColor)
  );

  canvas.getContext("2d").putImageData(new ImageData(data, map.width), 0, 0);
}

function createDownloadLink(canvas, index) {
  const anchor = document.createElement("a");

  anchor.href = canvas.toDataURL();
  anchor.download = (index + 1).toString().padStart(2, "0");

  return anchor;
}
