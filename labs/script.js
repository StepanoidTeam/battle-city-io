import { initMainMenu } from "./mainMenu.js";
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
  let currentScene = null;

  const sceneSettings = initSettings({
    onExit: () => {
      sceneSettings.unload();
      sceneMainMenu.load();
      currentScene = sceneMainMenu;
    },
  });

  const sceneMainMenu = initMainMenu({
    onStartGame: () => {
      // sceneMainMenu.unload();
    },
    onSettings: () => {
      sceneMainMenu.unload();
      sceneSettings.load();
      currentScene = sceneSettings;
    },
    onEditor: () => {
      sceneMainMenu.unload();
      sceneEditor.load();
      currentScene = sceneEditor;
    },
  });
  currentScene = sceneMainMenu;

  const sceneEditor = getEditorScene({
    onExit: () => {
      //
      sceneEditor.unload();
      sceneMainMenu.load();
      currentScene = sceneMainMenu;
    },
  });
  sceneMainMenu.load();

  (function draw(timestamp) {
    ctxGame.clearRect(0, 0, nesWidth, nesHeight);

    currentScene.draw(ctxGame, timestamp);

    requestAnimationFrame(draw);
  })();
}
init();
