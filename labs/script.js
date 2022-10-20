import { initMainMenu } from "./mainMenu.js";
import { getEditorScene } from "./sceneEditor.js";
import { initSettings } from "./settings.js";
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
  const { getCurrentScene, setCurrentScene } = (function useScene() {
    let currentScene = null;

    function getCurrentScene() {
      //
      return currentScene;
    }
    function setCurrentScene(scene) {
      //
      if (currentScene) currentScene.unload();
      currentScene = scene;
      currentScene.load();
    }
    return { getCurrentScene, setCurrentScene };
  })();

  const sceneSettings = initSettings({
    onExit: () => {
      setCurrentScene(sceneMainMenu);
    },
  });

  const sceneMainMenu = initMainMenu({
    onStartGame: () => {
      // sceneMainMenu.unload();
    },
    onSettings: () => {
      setCurrentScene(sceneSettings);
    },
    onEditor: () => {
      setCurrentScene(sceneEditor);
    },
  });

  const sceneEditor = getEditorScene({
    onExit: () => {
      //
      setCurrentScene(sceneMainMenu);
    },
  });
  setCurrentScene(sceneMainMenu);

  (function draw(timestamp) {
    ctxGame.clearRect(0, 0, nesWidth, nesHeight);

    let test = getCurrentScene();
    test.draw(ctxGame, timestamp);

    requestAnimationFrame(draw);
  })();
}
init();
