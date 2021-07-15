/* eslint-disable no-empty */
import faker from 'faker';
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
  if (Math.random() < 0.3) {
    const offset = randomG(1) * 0.5;
    const newx = x + offset;
    return newx;
  }
  return x;
}
// probabilty function that tells if next creature will be carnivorous.
function carnProb(x, self) {
  const creature = self;
  if (Math.random() < 0.1) {
    const offset = randomG(1) * 0.5;
    const newx = x + offset;
    return newx;
  }
  if (x < 0.1 && self) {
    creature.isCarn = true;
  }
  return x;
}

class Creature {
  constructor(brain, index = 0) {
    this.y = ((Math.random() * (40 * 2)) - 40) / 2;
    this.x = ((Math.random() * (40 * 2)) - 40) / 2;
    this.name = faker.name.findName();
    // locked plant/creat variables help the creature lock on a target.
    this.lockedPlant = null;
    this.lockedCreat = null;
    // who the parent creature is if reproduced.
    this.parent = null;
    // id of the creature.
    this.index = index;
    this.speed = 0.1;
    // what generation is the child creature from.
    this.generation = 0;
    // how long the creature will live (based on ticks)
    this.lifeSpan = 1000;
    // starting size of creature.
    this.size = 0.05;
    this.isCarn = false;
    this.repCooldown = 0;
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
    this.objective = 1;
    this.fitness = 0;
  }

  mutate() {
    const self = this;
    carnProb(Math.random(), self);
    this.brain.mutate(mutation);
  }

  up() {
    this.y += this.speed;
    this.lifeSpan -= this.speed;
  }

  down() {
    this.y -= this.speed;
    this.lifeSpan -= this.speed;
  }

  left() {
    this.x -= this.speed;
    this.lifeSpan -= this.speed;
  }

  right() {
    this.x += this.speed;
    this.lifeSpan -= this.speed;
  }

  editSpeed(val) {
    this.speed = val;
  }

  think() {
    /**
     * Think function will simulate how the agent will think on it's next state.
     */
    const inputs = [this.x, this.y, this.size, this.speed];
    const output = this.brain.predict(inputs);
    if (output[0] < 0.2) {
    } else if (output[0] <= 0.5) {
      this.up();
    } else if (output[0] <= 1) {
      this.down();
    }
    if (output[1] < 0.2) {
    } else if (output[1] <= 0.5) {
      this.left();
    } else if (output[1] <= 1) {
      this.right();
    }
    this.editSpeed(output[2] / 5);
  }

  update() {
    // this.score += 1;
    this.lifeSpan -= 1;
  }
}

export default Creature;
