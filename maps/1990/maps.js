import raw from "./raw.js";

const MapWidthTiles = 26;
const MapTileCount = MapWidthTiles ** 2;
const FirstMapIndex = 5;

export default Array.from(
  (function* () {
    for (
      let i = FirstMapIndex * MapTileCount;
      i < raw.length;
      i += MapTileCount
    ) {
      yield {
        width: MapWidthTiles,
        height: MapWidthTiles,
        tiles: raw.slice(i, i + MapTileCount),
      };
    }
  })()
);
