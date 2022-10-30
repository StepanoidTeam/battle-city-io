import { sleep } from "../helpers.js";

export class AnimationSprite {
  #currentSpriteIndex = 0;
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
    while (true) {
      this.#currentSpriteIndex =
        (this.#currentSpriteIndex + 1) % this.sprites.length;

      await sleep(this.frameDurationMs);
    }
  }
  get currentSprite() {
    return this.sprites[this.#currentSpriteIndex];
  }
  stop() {}

  draw(...args) {
    this.currentSprite.draw(...args);
  }
}
