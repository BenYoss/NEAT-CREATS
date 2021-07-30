class Feature {
  constructor(name, desc) {
    this.name = name;
    this.description = desc;
  }
}

const popButton = new Feature('pop-button', 'A button that changes the population of a creatures.');

popButton.changeSize = (bool, size) => {
  let population = size;
  if (bool) {
    population += 1;
  } else {
    population -= 1;
  }
  return population;
};

export default {
  popButton,
};
