import { blackColour } from "../labs/consts.js";
import mapData from "./mapData.js";

const SpriteSizeTiles = 16;
const SpriteTileSizePx = 8;
const MapSizeTiles = 26;
const MapTileCount = MapSizeTiles ** 2;
const Scale = 3;

const maps = {
  *[Symbol.iterator]() {
    for (let i = 0; i < mapData.length; i += MapTileCount) {
      yield mapData.slice(i, i + MapTileCount);
    }
  },
};

function* tiles(map) {
  for (const [index, tile] of map.entries()) {
    const dy = Math.floor(index / MapSizeTiles);
    const dx = index % MapSizeTiles;
    const sy = Math.floor(tile / SpriteSizeTiles);
    const sx = tile % SpriteSizeTiles;

    yield { dx, dy, sx, sy };
  }
}

const image = new Image();

image.src = "../sprites/reskin/Chr_01_0-fix.png";

image.addEventListener("load", () => {
  for (const map of maps) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = MapSizeTiles * Scale * SpriteTileSizePx;
    canvas.height = MapSizeTiles * Scale * SpriteTileSizePx;
    canvas.style.background = `${blackColour}`;

    context.imageSmoothingEnabled = false;
    context.scale(Scale, Scale);

    for (const tile of tiles(map)) {
      context.drawImage(
        image,
        tile.sx * SpriteTileSizePx,
        tile.sy * SpriteTileSizePx,
        SpriteTileSizePx,
        SpriteTileSizePx,
        tile.dx * SpriteTileSizePx,
        tile.dy * SpriteTileSizePx,
        SpriteTileSizePx,
        SpriteTileSizePx
      );
    }

    document.body.appendChild(canvas);
  }
});
