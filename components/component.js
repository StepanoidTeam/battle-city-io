export class Component {
  constructor({ draw = () => {}, update = () => {} }) {
    this.draw = draw;
    this.update = update;
  }
}
