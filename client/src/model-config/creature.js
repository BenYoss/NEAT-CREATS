import NeuralNetwork from '../helpers/nn';

class Creature {
  constructor() {
    this.y = 3;
    this.x = 3;
    this.speed = 1;
    this.score = 0;
    this.lifeSpan = 100;
    this.size = 1;
    // inputs:
    /**
     * y location of creature
     * x location of creature
     * creature eat
     * creature size
     * creature speed
     */
    this.brain = new NeuralNetwork(4, 4, 3);
  }

  up() {
    this.y += this.speed;
  }

  down() {
    this.y -= this.speed;
  }

  left() {
    this.x -= this.speed;
  }

  right() {
    this.x += this.speed;
  }

  think() {
    /**
     * Think function will simulate how the agent will think on it's next state.
     */
    const inputs = [this.x, this.y, this.size, this.speed];
    const output = this.brain.predict(inputs);
    if (output[0] <= 0.25) {
      this.up();
    } else if (output[0] <= 0.5) {
      this.down();
    } else if (output[0] <= 0.75) {
      this.left();
    } else if (output[0] <= 1) {
      this.right();
    }
  }

  update() {
    this.score += 1;
    this.lifeSpan -= 1;
  }
}

export default Creature;
