import NeuralNetwork from '../helpers/nn';

// Mutation function to be passed into creature.brain
function randomG(v) {
  let r = 0;
  for (let i = v; i > 0; i -= 1) {
    r += Math.random();
  }
  return r / v;
}

function mutation(x) {
  if (Math.floor(Math.random() * 1) < 0.1) {
    const offset = randomG(1) * 0.5;
    const newx = x + offset;
    return newx;
  }
  return x;
}

class Creature {
  constructor(brain) {
    this.y = 3;
    this.x = 3;
    this.speed = 1;
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
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(4, 4, 3);
    }
    this.score = 0;
    this.fitness = 0;
  }

  mutate() {
    this.brain.mutate(mutation);
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
