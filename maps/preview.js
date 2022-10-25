import { tileColor } from "./tileColors.js";

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
  const data = new Uint8ClampedArray(map.tiles.flatMap(tileColor));
  const imageData = new ImageData(data, map.width);

  canvas.getContext("2d").putImageData(imageData, 0, 0);
}

function createDownloadLink(canvas, index) {
  const anchor = document.createElement("a");

  anchor.href = canvas.toDataURL();
  anchor.download = (index + 1).toString().padStart(2, "0");

  return anchor;
}
