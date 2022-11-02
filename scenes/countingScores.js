import {
  blackColor,
  gingerColor,
  redColor,
  nesWidth,
  cellSize,
} from "../consts.js";
import {
  enemyTank1,
  enemyTank2,
  enemyTank3,
  enemyTank4,
} from "../components/sprite-lib.js";
import { TextAlign, TextSprite } from "../components/textSprite.js";
import { sleep } from "../helpers.js";

function countPts(tanks, index) {
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
  const p1TankPts = p1tanksDestroyed.map(countPts);
  const p2TankPts = p2tanksDestroyed.map(countPts);
  let p1total = 0;
  let p2total = 0;
  let p1price = 0;
  let p2price = 0;

  const enemyTanks = [enemyTank1, enemyTank2, enemyTank3, enemyTank4];
  let p1totalScores = sumItems(p1TankPts);
  let p2totalScores = sumItems(p2TankPts);
  const highScores = new TextSprite({
    text: "hi-score",
    fillStyle: `${gingerColor}`,
    textAlign: TextAlign.right,
  });
  const averageScores = new TextSprite({
    text: "45000",
    fillStyle: `${redColor}`,
  });
  const levelText = new TextSprite({
    text: `stage ${level}`,
  });
  const onePlayer = new TextSprite({
    text: `I-player`,
    fillStyle: `${redColor}`,
    textAlign: TextAlign.right,
  });
  const twoPlayers = new TextSprite({
    text: `II-player`,
    fillStyle: `${redColor}`,
    textAlign: TextAlign.right,
  });
  const onePlayerScores = new TextSprite({
    text: `${0}`,
    fillStyle: `${gingerColor}`,
    textAlign: TextAlign.right,
  });
  const secondPlayerScores = new TextSprite({
    text: `${0}`,
    fillStyle: `${gingerColor}`,
    textAlign: TextAlign.right,
  });
  const p1totalAmountKilledTanks = sumItems(p1tanksDestroyed);
  const p2totalAmountKilledTanks = sumItems(p2tanksDestroyed);

  const totalLine = new TextSprite({
    text: `${"".padStart(8, "_")}\ntotal ${p1total
      .toString()
      .padStart(2)}${p2total.toString().padStart(2 + 4)}`,
    textAlign: TextAlign.right,
  });

  const bonus = new TextSprite({
    text: "bonus!",
    textAlign: TextAlign.right,
    fillStyle: `${redColor}`,
  });
  const bonusPoints = new TextSprite({
    text: "1000 pts",
    textAlign: TextAlign.right,
  });
  const p1score = new TextSprite({
    textAlign: TextAlign.right,
    lineSpacing: 16,
  });

  const p2score = new TextSprite({
    lineSpacing: 16,
    textAlign: TextAlign.right,
  });

  function getP1Scores(tanksDestroyed) {
    const tankPts = tanksDestroyed.map(countPts);
    return tanksDestroyed
      .map(
        (tankCount, index) =>
          `${tankPts[index]} pts ${tankCount?.toString().padStart(2)}<`
      )
      .join("\n");
  }
  function getP2Scores(tanksDestroyed) {
    const tankPts = tanksDestroyed.map(countPts);
    return tanksDestroyed
      .map(
        (tankCount, index) =>
          `>${tankCount?.toString().padStart(2)} ${tankPts[index]
            .toString()
            .padStart(4)} pts`
      )
      .join("\n");
  }
  function getTotal(p1Total, p2Total) {
    return `${"".padStart(8, "_")}\ntotal ${p1Total
      .toString()
      .padStart(2)}${p2Total.toString().padStart(2 + 4)}`;
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
  const initialPointOfViewY = 16;
  return {
    draw(ctx) {
      //bg
      ctx.fillStyle = `${blackColor}`;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      p1score.draw(ctx, nesWidth / 2 - cellSize, initialPointOfViewY * 5);
      levelText.draw(ctx, nesWidth / 2 - cellSize * 2, initialPointOfViewY * 2);
      onePlayerScores.draw(
        ctx,
        nesWidth / 2 - cellSize * 5,
        initialPointOfViewY * 4
      );
      onePlayer.draw(ctx, nesWidth / 2 - cellSize * 5, initialPointOfViewY * 3);
      highScores.draw(ctx, nesWidth / 2 - cellSize * 5, initialPointOfViewY);

      averageScores.draw(ctx, nesWidth / 2 + cellSize * 4, initialPointOfViewY);

      twoPlayers.draw(
        ctx,
        nesWidth / 2 + 12 * cellSize + cellSize,
        initialPointOfViewY * 3
      );
      secondPlayerScores.draw(
        ctx,
        nesWidth / 2 + 12 * cellSize + cellSize,
        initialPointOfViewY * 4
      );

      enemyTanks.forEach((tank, index) =>
        tank.draw(
          ctx,
          nesWidth / 2 - cellSize + 1,
          initialPointOfViewY * 5 + index * (tank.sHeight + cellSize) - 4
        )
      );
      p2score.draw(
        ctx,
        nesWidth / 2 + 12 * cellSize + cellSize,
        initialPointOfViewY * 5
      );
      totalLine.draw(
        ctx,
        nesWidth / 2 + cellSize * 4,
        initialPointOfViewY * 5 + (cellSize * 4 + 16 * 3)
      );
      if (p1price === p1totalScores && p2price === p2totalScores) {
        if (p1totalScores > p2totalScores) {
          bonus.draw(
            ctx,
            nesWidth / 2 - 5 * cellSize,
            initialPointOfViewY * 12
          );
          bonusPoints.draw(
            ctx,
            nesWidth / 2 - 5 * cellSize,
            initialPointOfViewY * 13
          );
        } else {
          bonus.draw(
            ctx,
            nesWidth / 2 + cellSize * 13,
            initialPointOfViewY * 12
          );
          bonusPoints.draw(
            ctx,
            nesWidth / 2 + cellSize * 13,
            initialPointOfViewY * 13
          );
        }
      }

      // draw list
    },
    async load() {
      document.addEventListener("keydown", onKeyDown);
      let p1tanksArr = [];
      let p2tanksArr = [];

      for (
        let tankPriceIndex = 0;
        tankPriceIndex < tankPrices.length;
        tankPriceIndex++
      ) {
        await sleep(500);
        let p2tank = p2tanksDestroyed[tankPriceIndex];
        let p1tank = p1tanksDestroyed[tankPriceIndex];

        p1tanksArr.push(0);
        p2tanksArr.push(0);
        let p2numberOfTank = 0;
        let p1numberOfTank = 0;
        while (p1numberOfTank < p1tank || p2numberOfTank < p2tank) {
          if (p1numberOfTank < p1tank) {
            p1numberOfTank++;
          }
          if (p2numberOfTank < p2tank) {
            p2numberOfTank++;
          }
          p1tanksArr[tankPriceIndex] = p1numberOfTank;
          p2tanksArr[tankPriceIndex] = p2numberOfTank;

          p1score.text = getP1Scores(p1tanksArr);
          p2score.text = getP2Scores(p2tanksArr);
          // audioScores.play();

          await sleep(150);
        }
      }

      while (
        p1price < p1totalScores ||
        p2price < p2totalScores ||
        p1total < p1totalAmountKilledTanks ||
        p2total < p2totalAmountKilledTanks
      ) {
        if (p1price < p1totalScores) {
          p1price += 100;
        }
        if (p2price < p2totalScores) {
          p2price += 100;
        }
        if (p1total < p1totalAmountKilledTanks) {
          p1total++;
        }
        if (p2total < p2totalAmountKilledTanks) {
          p2total++;
        }
        onePlayerScores.text = `${p1price}`;
        secondPlayerScores.text = `${p2price}`;
        totalLine.text = getTotal(p1total, p2total);
        await sleep(70);
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
