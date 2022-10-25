import {
  blackColour,
  gingerColour,
  redColour,
  initialPointOfViewY,
  nesWidth,
} from "../consts.js";
import {
  enemyTank1,
  enemyTank2,
  enemyTank3,
  enemyTank4,
} from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";
import { sleep } from "../helpers.js";

function count(tanks, index) {
  return tanks * tankPrices[index];
}
function sumItems(array) {
  return array.reduce((total, amount) => total + amount, 0);
}
const tankPrices = [100, 200, 300, 400];

export function initCountingScores({
  onExit,
  level,
  p1tanksDestroyed,
  p2tanksDestroyed,
}) {
  const p1TankPts = p1tanksDestroyed.map(count);
  const p2TankPts = p2tanksDestroyed.map(count);

  const enemyTanks = [enemyTank1, enemyTank2, enemyTank3, enemyTank4];
  let p1totalScores = sumItems(p1TankPts);
  let p2totalScores = sumItems(p2TankPts);
  const highScores = new TextSprite({
    text: "hi-score",
    fillStyle: `${gingerColour}`,
  });
  const averageScores = new TextSprite({
    text: "45000",
    fillStyle: `${redColour}`,
  });
  const levelText = new TextSprite({
    text: `stage ${level}`,
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
  const p1totalAmountKilledTanks = sumItems(p1tanksDestroyed);
  const p2totalAmountKilledTanks = sumItems(p2tanksDestroyed);
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
          `${p1TankPts[index]} pts ${tankCount?.toString().padStart(2)}<`
      )
      .join("\n"),
    textAlign: TextAlign.right,
    lineSpacing: 16,
  });

  const p2score = new TextSprite({
    text: "vova",
    lineSpacing: 16,
    textAlign: TextAlign.right,
  });

  function updateScores(p2TanksDestroyed) {
    const p2TankPts = p2TanksDestroyed.map(count);

    p2score.text = p2TanksDestroyed
      .map(
        (tankCount, index) =>
          `>${tankCount?.toString().padStart(2)} ${p2TankPts[index]
            .toString()
            .padStart(4)} pts`
      )
      .join("\n");
  }

  function onKeyDown(event) {
    switch (event.code) {
      case "Escape": {
        if (event.repeat) break;

        onExit();
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
      highScores.draw(ctx, 64, initialPointOfViewY);
      averageScores.draw(ctx, 158, initialPointOfViewY);
      levelText.draw(ctx, 100, initialPointOfViewY * 2);
      onePlayer.draw(ctx, nesWidth / 2 - 4 * 8 - 8, initialPointOfViewY * 3);
      onePlayerScores.draw(
        ctx,
        nesWidth / 2 - 4 * 8 - 8,
        initialPointOfViewY * 4
      );
      twoPlayers.draw(ctx, nesWidth / 2 + 12 * 8 + 8, initialPointOfViewY * 3);
      secondPlayerScores.draw(
        ctx,
        nesWidth / 2 + 12 * 8 + 8,
        initialPointOfViewY * 4
      );

      p1score.draw(ctx, nesWidth / 2 - 8, initialPointOfViewY * 5);
      enemyTanks.forEach((tank, index) =>
        tank.draw(
          ctx,
          nesWidth / 2 - 8 + 1,
          initialPointOfViewY * 5 + index * (tank.sHeight + 8) - 4
        )
      );
      p2score.draw(ctx, nesWidth / 2 + 12 * 8 + 8, initialPointOfViewY * 5);
      totalLine.draw(
        ctx,
        nesWidth / 2 + 8 * 4,
        initialPointOfViewY * 5 + (8 * 4 + 16 * 3)
      );
      p1totalAmountKilledTanks >= 20
        ? (bonus.draw(ctx, nesWidth / 2 - 5 * 8, initialPointOfViewY * 12),
          bonusPoints.draw(ctx, nesWidth / 2 - 5 * 8, initialPointOfViewY * 13))
        : p2totalAmountKilledTanks >= 20
        ? (bonus.draw(ctx, nesWidth / 2 + 8 * 13, initialPointOfViewY * 12),
          bonusPoints.draw(
            ctx,
            nesWidth / 2 + 8 * 13,
            initialPointOfViewY * 13
          ))
        : null;
      // draw list
    },
    async load() {
      document.addEventListener("keydown", onKeyDown);
      let tanksArr = [];
      for (let tankIndex in p2tanksDestroyed) {
        await sleep(500);
        let tank = p2tanksDestroyed[tankIndex];
        tanksArr.push(0);

        for (let numberOfTank = 0; numberOfTank <= tank; numberOfTank++) {
          tanksArr[tankIndex] = numberOfTank;
          updateScores(tanksArr);
          await sleep(180);
        }
      }

      // for (const interimCount of interimCounts(p2tanksDestroyed)) {
      //   updateScores(interimCount);
      //   await sleep(200);
      // }
    },
    unload() {
      document.removeEventListener("keydown", onKeyDown);
    },
  };
}

/**
 * Yield interim counts
 *
 * @example
 * [1, 2]:
 * -> [0]
 * -> [1]
 * -> [1, 0]
 * -> [1, 1]
 * -> [1, 2]
 */
function* interimCounts(total) {
  for (const [i, count] of total.entries()) {
    const prev = total.slice(0, i);

    for (let j = 0; j <= count; j++) {
      yield prev.concat(j);
    }
  }
}
