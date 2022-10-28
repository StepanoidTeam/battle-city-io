import { nesHeight, nesWidth, scale, cellSize } from "./consts.js";
import { initCountingScores } from "./scenes/countingScores.js";
import { GameScene } from "./scenes/game.js";
import { initGameOverScene } from "./scenes/gameOver.js";
import { initMainMenu } from "./scenes/mainMenu.js";
import { getEditor } from "./scenes/editor.js";
import { initOptions } from "./scenes/options.js";

function init() {
  canvasContainer.style.setProperty("--width", `${nesWidth * scale}px`);
  canvasContainer.style.setProperty("--height", `${nesHeight * scale}px`);
  canvasContainer.style.setProperty("--spriteSize", cellSize * 2);
  canvasContainer.style.setProperty("--scale", scale);

  const ctxGame = initCanvas(canvasGame, nesWidth, nesHeight);

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
  //-------------

  const sceneScores = initCountingScores({
    onExit: () => {
      setCurrentScene(gameOverScene);
    },
    level: 3,
    p1tanksDestroyed: [5, 3, 0, 2],
    p2tanksDestroyed: [13, 9, 8, 5],
  });

  const sceneSettings = initOptions({
    onExit: () => {
      setCurrentScene(sceneMainMenu);
    },
  });

  const gameOverScene = initGameOverScene({
    onExit: () => {
      setCurrentScene(sceneMainMenu);
    },
  });

  const sceneMainMenu = initMainMenu({
    onStartGame: ({ players }) => {
      if (players === 1) {
        setCurrentScene(gameScene);
      } else {
        setCurrentScene(sceneScores);
      }
    },
    onOptions: () => {
      setCurrentScene(sceneSettings);
    },
    onEditor: () => setCurrentScene(sceneEditor),
  });

  const sceneEditor = getEditor({
    onExit: () => setCurrentScene(sceneMainMenu),
  });

  const gameScene = new GameScene({
    onExit: () => setCurrentScene(sceneMainMenu),
  });

  // todo(vmyshko): DO NOT COMMIT other scene, than MainMenu
  setCurrentScene(sceneMainMenu);

  (function draw(timestamp) {
    ctxGame.clearRect(0, 0, nesWidth, nesHeight);

    let test = getCurrentScene();
    test.draw(ctxGame, timestamp);

    requestAnimationFrame(draw);
  })();
}
init();
