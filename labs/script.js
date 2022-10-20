import { getEditorScene } from "./sceneEditor.js";
import { initSettings } from "./settings.js";
import { wallBrickRedFullSprite } from "./sprite-lib.js";
import { TextSprite } from "./textSprite.js";
export const [nesWidth, nesHeight] = [256, 240];
export const cellSize = 8; //px

function init() {
  const scale = 3;

  canvasContainer.style.setProperty("--width", `${nesWidth * scale}px`);
  canvasContainer.style.setProperty("--height", `${nesHeight * scale}px`);
  canvasContainer.style.setProperty("--spriteSize", cellSize * 2);
  canvasContainer.style.setProperty("--scale", scale);

  const ctxGame = initCanvas(canvasGame, nesWidth, nesHeight);
  const ctxBg = initCanvas(canvasBg, nesWidth, nesHeight);
  const ctxSprites = initCanvas(sprites, nesWidth, nesHeight);

  function initCanvas(canvas, width, height) {
    const ctx = canvas.getContext("2d");
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false; // pixelated

    return ctx;
  }

  let showMenu = false;
  const sceneSettings = initSettings({
    onExit: () => {
      showMenu = false;
      sceneSettings.unload();
      sceneEditor.load();
    },
  });
  const sceneEditor = getEditorScene({
    onExit: () => {
      //
      showMenu = true;
      sceneEditor.unload();
      sceneSettings.load();
    },
  });
  sceneEditor.load();
  const header = new TextSprite({
    text: `BATTLE\n CITY`,
    lineSpacing: 8,
    fillStyle: wallBrickRedFullSprite.getPattern(),
    multiplyText: 4,
    shadowFill: true,
  });

  (function draw(timestamp) {
    ctxGame.clearRect(0, 0, nesWidth, nesHeight);

    // todo(vmyshko): refac to use different scenes? how to manage/switch them?
    if (showMenu) {
      sceneSettings.draw(ctxGame, timestamp);
      // drawMenu(ctxGame, timestamp);
    } else {
      sceneEditor.draw(ctxGame, timestamp);
    }

    requestAnimationFrame(draw);
  })();
}
init();
