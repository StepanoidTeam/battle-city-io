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

  constructor({ sprites, durationMs = 1000 }) {
    this.sprites = sprites;
    this.durationMs = durationMs;
    this.start();
    this.frameDurationMs = this.durationMs / this.sprites.length;
  }

  async start() {
    this.#isPlaying = true;
    while (this.#isPlaying) {
      this.#currentSpriteIndex =
        (this.#currentSpriteIndex + 1) % this.sprites.length;

      await sleep(this.frameDurationMs);
    }
  }

  get currentSprite() {
    return this.sprites[this.#currentSpriteIndex];
  }

  stop() {
    this.#isPlaying = false;
  }

  draw(...args) {
    this.currentSprite.draw(...args);
  }
}
