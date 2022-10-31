import { sleep } from "../helpers.js";

export class AnimationSprite {
  #currentSpriteIndex = 0;
  #isPlaying = false;
  get sWidth() {
    return this.currentSprite.sWidth;
  }
  get sHeight() {
    return this.currentSprite.sHeight;
  }

  constructor({ sprites, durationMs = 1000, playOnce = false }) {
    this.sprites = sprites;
    this.durationMs = durationMs;
    this.start();
    this.frameDurationMs = this.durationMs / this.sprites.length;
    this.playOnce = playOnce;
  }

  async start() {
    this.#isPlaying = true;
    while (this.#isPlaying) {
      // #1 full-anim approach
      for (let frame = 0; frame < this.sprites.length; frame++) {
        this.#currentSpriteIndex = frame;

        await sleep(this.frameDurationMs);
      }
      this.playOnce = true;
      // #2 stop-as-is approach

      // this.#currentSpriteIndex =
      //   (this.#currentSpriteIndex + 1) % this.sprites.length;

      // await sleep(this.frameDurationMs);
    }
  }

  get currentSprite() {
    return this.sprites[this.#currentSpriteIndex];
  }

  stop() {
    this.#isPlaying = false;
  }

  draw(ctx, x, y, ...args) {
    this.currentSprite.draw(ctx, x, y, ...args);

    if (debug) {
      ctx.fillStyle = "white";
      ctx.fillText("frame:" + this.#currentSpriteIndex, x, y);
    }
  }
}
