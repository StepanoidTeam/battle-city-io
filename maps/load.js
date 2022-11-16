import { colorTile } from "./tileColors.js";

/** Loads map from an image source */
export async function loadMap(src) {
  const image = await loadImage(src);
  const context = createContextFromImg(image);

  return {
    width: image.width,
    height: image.height,
    tiles: tiles(image, context),
  };
}

function createContextFromImg(image) {
  const context = document.createElement("canvas").getContext("2d");

  context.drawImage(image, 0, 0);

  return context;
}

function* tiles(image, context) {
  for (let row = 0; row < image.width; row++) {
    for (let col = 0; col < image.height; col++) {
      const { data } = context.getImageData(row, col, 1, 1);
      const code = colorTile(data);

      yield { row, col, code };
    }
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.src = src;

    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", (e) => reject(e), { once: true });
  });
}
