export class Scene {
  #components;
  constructor() {
    this.#components = new Set();
  }

  addComponent(component) {
    this.#components.add(component);
  }

  deleteComponent(component) {
    this.#components.delete(component);
  }

  load() {
    //
  }

  unload() {
    //
  }
  update(timestamp) {
    //
    this.#components.forEach((component) => component.update(timestamp));
  }

  draw(ctx, timestamp) {
    //
    this.#components.forEach((component) => component.draw(ctx, timestamp));
  }
}
