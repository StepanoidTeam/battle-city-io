import { blackColour, gingerColour, redColour } from "./consts.js";
import { nesWidth } from "./consts.js";
import {
  enemyTank1,
  enemyTank2,
  enemyTank3,
  enemyTank4,
} from "./sprite-lib.js";
import { TextAlign, TextSprite } from "./textSprite.js";

const p1tanksDestroyed = [2, 4, 0, 2];
const p2tanksDestroyed = [0, 16, 8, 5];
const levelValue = 3;
const tankPrices = [100, 200, 300, 400];
const enemyTanks = [enemyTank1, enemyTank2, enemyTank3, enemyTank4];
let p1totalScores = 0;
let p2totalScores = 0;
const initialPointOfView = 16;
for (let i = 0; i < p1tanksDestroyed.length; i++) {
  p1totalScores += p1tanksDestroyed[i] * tankPrices[i];
  p2totalScores += p2tanksDestroyed[i] * tankPrices[i];
}

export function initCountingScores({ onStartGame }) {
  const hightScores = new TextSprite({
    text: "hi-score",
    fillStyle: `${gingerColour}`,
  });
  const averageScores = new TextSprite({
    text: "45000",
    fillStyle: `${redColour}`,
  });
  const level = new TextSprite({
    text: `stage ${levelValue}`,
  });
  const onePlayer = new TextSprite({
    text: `I-player`,
    fillStyle: `${redColour}`,
    textAlign: TextAlign.right,
  });
  const twoPlayers = new TextSprite({
    text: `II-player`,
    fillStyle: `${redColour}`,
    textAlign: TextAlign.right,
  });
  const onePlayerScores = new TextSprite({
    text: `${p1totalScores}`,
    fillStyle: `${gingerColour}`,
    textAlign: TextAlign.right,
  });
  const secondPlayerScores = new TextSprite({
    text: `${p2totalScores}`,
    fillStyle: `${gingerColour}`,
    textAlign: TextAlign.right,
  });
  const p1totalAmountKilledTanks = p1tanksDestroyed.reduce(
    (total, amount) => total + amount,
    0
  );
  const p2totalAmountKilledTanks = p2tanksDestroyed.reduce(
    (total, amount) => total + amount,
    0
  );
  const totalLine = new TextSprite({
    text: `${"".padStart(8, "_")}\ntotal ${p1totalAmountKilledTanks
      .toString()
      .padStart(2)}${p2totalAmountKilledTanks.toString().padStart(2 + 4)}`,
    textAlign: TextAlign.right,
  });

  const bonus = new TextSprite({
    text: "bonus!",
    textAlign: TextAlign.right,
    fillStyle: `${redColour}`,
  });
  const bonusPoints = new TextSprite({
    text: "1000 pts",
    textAlign: TextAlign.right,
  });
  const p1score = new TextSprite({
    text: p1tanksDestroyed
      .map(
        (tankCount, index) =>
          `${tankCount * tankPrices[index]} pts ${tankCount
            .toString()
            .padStart(2)}<`
      )
      .join("\n"),
    textAlign: TextAlign.right,
    lineSpacing: 16,
  });

  const p2score = new TextSprite({
    text: p2tanksDestroyed
      .map(
        (tankCount, index) =>
          `>${tankCount.toString().padStart(2)} ${(
            tankCount * tankPrices[index]
          )
            .toString()
            .padStart(4)} pts`
      )
      .join("\n"),
    lineSpacing: 16,
    textAlign: TextAlign.right,
  });

  function onKeyDown(event) {
    switch (event.code) {
      case "Escape": {
        if (event.repeat) break;

        onStartGame();
        break;
      }
    }
  }
  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColour}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      hightScores.draw(ctx, 64, initialPointOfView);
      averageScores.draw(ctx, 158, initialPointOfView);
      level.draw(ctx, 100, initialPointOfView * 2);
      onePlayer.draw(ctx, nesWidth / 2 - 4 * 8 - 8, initialPointOfView * 3);
      onePlayerScores.draw(
        ctx,
        nesWidth / 2 - 4 * 8 - 8,
        initialPointOfView * 4
      );
      twoPlayers.draw(ctx, nesWidth / 2 + 12 * 8 + 8, initialPointOfView * 3);
      secondPlayerScores.draw(
        ctx,
        nesWidth / 2 + 12 * 8 + 8,
        initialPointOfView * 4
      );

      p1score.draw(ctx, nesWidth / 2 - 8, initialPointOfView * 5);
      enemyTanks.forEach((tank, index) =>
        tank.draw(
          ctx,
          nesWidth / 2 - 8 + 1,
          initialPointOfView * 5 + index * (tank.sHeight + 8) - 4
        )
      );
      p2score.draw(ctx, nesWidth / 2 + 12 * 8 + 8, initialPointOfView * 5);
      totalLine.draw(
        ctx,
        nesWidth / 2 + 8 * 4,
        initialPointOfView * 5 + (8 * 4 + 16 * 3)
      );
      p1totalAmountKilledTanks >= 20
        ? (bonus.draw(ctx, nesWidth / 2 - 5 * 8, initialPointOfView * 12),
          bonusPoints.draw(ctx, nesWidth / 2 - 5 * 8, initialPointOfView * 13))
        : p2totalAmountKilledTanks >= 20
        ? (bonus.draw(ctx, nesWidth / 2 + 8 * 13, initialPointOfView * 12),
          bonusPoints.draw(ctx, nesWidth / 2 + 8 * 13, initialPointOfView * 13))
        : null;
      // draw list
    },
    load() {
      document.addEventListener("keydown", onKeyDown);
    },
    unload() {
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}
