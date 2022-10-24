import { nesHeight, nesWidth, scale, cellSize } from "./consts.js";
import { initCountingScores } from "./countingScores.js";
import { initGameOverScene } from "./gameOverScene.js";
import { initMainMenu } from "./mainMenu.js";
import { getEditorScene } from "./sceneEditor.js";
import { initSettings } from "./settings.js";

function init() {
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

  const sceneScores = initCountingScores({
    onStartGame: () => {
      setCurrentScene(sceneMainMenu);
    },
  });
  const sceneSettings = initSettings({
    onExit: () => {
      setCurrentScene(sceneMainMenu);
    },
  });
  const gameOverScene = initGameOverScene({
    onExit: () => {
      setCurrentScene(gameOverScene);
    },
  });
  const sceneMainMenu = initMainMenu({
    onStartGame: () => {
      setCurrentScene(gameOverScene);

      //todo remove settimeout
      setTimeout(function () {
        gameOverScene.unload;
        setCurrentScene(sceneScores);
      }, 3000);
      sceneMainMenu.unload();
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
  setCurrentScene(sceneEditor);
  //
  //

  //
  (function draw(timestamp) {
    ctxGame.clearRect(0, 0, nesWidth, nesHeight);

    let test = getCurrentScene();
    test.draw(ctxGame, timestamp);

    requestAnimationFrame(draw);
  })();
}
init();
