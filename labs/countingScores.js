import { ListItem, MenuList } from "./menuList.js";
import { nesWidth } from "./script.js";
import {
  enemyTank1,
  enemyTank2,
  enemyTank3,
  enemyTank4,
} from "./sprite-lib.js";
import { TextAlign, TextSprite } from "./textSprite.js";

const p1tanksDestroyed = [20, 4, 0, 2];
const p2tanksDestroyed = [0, 16, 8, 5];
const levelValue = 3;
const tankPrices = [100, 200, 300, 400];
const enemyTanks = [enemyTank1, enemyTank2, enemyTank3, enemyTank4];

export function initCountingScores({ onStartGame }) {
  const hightScores = new TextSprite({
    text: "hi-score",
    fillStyle: "rgb(263,154,69)",
  });
  const averageScores = new TextSprite({
    text: "45000",
    fillStyle: "red",
  });
  const level = new TextSprite({
    text: `stage ${levelValue}`,
  });
  const onePlayer = new TextSprite({
    text: `I-player II-player\n`,
    fillStyle: "red",
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
      .padStart(2)}${p2totalAmountKilledTanks.toString().padStart(2+4)}`,
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
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // title
      hightScores.draw(ctx, 64, 14);
      averageScores.draw(ctx, 158, 14);
      level.draw(ctx, 100, 40);
      onePlayer.draw(ctx, nesWidth / 2 - 4 * 8 - 8, 55);
      p1score.draw(ctx, nesWidth / 2 - 8, 100);
      enemyTanks.forEach((tank, index) =>
        tank.draw(
          ctx,
          nesWidth / 2 - 8 + 1,
          100 + index * (tank.sHeight + 8) - 4
        )
      );
      p2score.draw(ctx, nesWidth / 2 + 12 * 8 + 8, 100);
      totalLine.draw(ctx, nesWidth / 2 + 8*4, 100 + (8 * 4 + 16 * 3));
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
