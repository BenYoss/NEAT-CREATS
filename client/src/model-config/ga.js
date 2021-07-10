/* eslint-disable no-restricted-syntax */
import faker from 'faker';
import Creature from './creature';

export function calculateFitness(creatures) {
  let sum = 0;
  for (const creat of creatures) {
    sum += creat.score;
  }
  for (const creat of creatures) {
    creat.fitness = creat.score / sum;
  }
}

export function pickOne(savedCreatures) {
  // const creat = savedCreatures[Math.floor(Math.random() * (savedCreatures.length - 1))];
  // const child = new Creature(creat.brain);
  // child.mutate();
  // return child;

  let index = 0;
  let r = Math.random();
  while (r > 0) {
    r -= savedCreatures[index].fitness;
    index += 1;
  }
  index -= 1;

  const creature = savedCreatures[index];
  const child = new Creature(creature.brain, savedCreatures[0].index);
  child.isCarn = savedCreatures[0].isCarn;
  child.generation = savedCreatures[0].generation;
  child.parent = savedCreatures[0].name;
  child.name = faker.name.findName();
  child.mutate();
  return child;
}
