/* eslint-disable no-restricted-syntax */
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
  const creat = savedCreatures[Math.floor(Math.random() * (savedCreatures.length - 1))];
  const child = new Creature(creat.brain);
  child.mutate();
  return child;
}
