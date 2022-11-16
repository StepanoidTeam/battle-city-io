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
    const ctxBuffer = createCanvas({ map });
    const ctxScaled = createCanvas({ map, scale: 5 });

    drawMap(ctxBuffer, map);
    ctxScaled.drawImage(ctxBuffer.canvas, 0, 0);

    const downloadLink = createDownloadLink(ctxBuffer, index);

    downloadLink.appendChild(ctxScaled.canvas);
    document.body.appendChild(downloadLink);
  }
}

function createCanvas({ map, scale = 1 }) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.canvas.width = map.width * scale;
  ctx.canvas.height = map.height * scale;
  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false; // pixelated

  return ctx;
}

function drawMap(ctx, map) {
  const data = new Uint8ClampedArray(
    map.tiles.flatMap((tile) => tileColors.get(tile) ?? FallbackColor)
  );

  ctx.putImageData(new ImageData(data, map.width), 0, 0);
}

function createDownloadLink(ctx, index) {
  const anchor = document.createElement("a");
  anchor.classList.add("canvas-link");

  anchor.href = ctx.canvas.toDataURL();
  anchor.download = (index + 1).toString().padStart(2, "0");

  return anchor;
}
