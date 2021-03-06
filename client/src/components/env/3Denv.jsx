/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Canvas } from '@react-three/fiber';
// Drei helps with adding additional abstractions to the THREE.js environment.
import { OrbitControls } from '@react-three/drei';
// import the creature Neural Network into the 3D environment.
import Creature from '../../model-config/creature';
import NeuralNetwork from '../../helpers/nn';
import { deleteCreature } from '../../helpers/general_helpers';
import { pickOne, calculateFitness } from '../../model-config/ga';
import Gui from '../gui/Gui';
import { CreatureModel, Plant, Land } from './3DHelpers';
import '../../styles/style.scss';

// How many creatures would start in this enviornment?
const creaturePopulation = 10;
// maximum population cap of creatures.
const maxPop = 5;
// max number of plants
const plantAmount = 100;
// creature sight length
const creatSight = 10;
// How big is the map?
const mapSize = 5;
// incrementor for subtractor when creatures are at border.
let inc = 0;
// number of saved creatures.
let savedCreatures = [];
let isFirst = false;

// container for plants.
let plants = [];
let timer;
let repopulator;
let counter;
const socket = io();

/**
 * @func Env is a react component that handles the WebGL environment using THREE.js
 * has directional lighting, orbit controls to control movement, and meshes
 * contained within the environment scope.
 */
let deathCount = 0;
let creatures = [];

export default function Env() {
  const [, setUpdate] = useState([0]);
  const [visibleVision, setVV] = useState(false);
  const [mp, setMp] = useState(maxPop);

  // SOCKET OPERATIONS
  useEffect(() => {
    // testing join emitter
    socket.emit('join', { }, () => {
    });
    // TODO: when creature information updates, updateCreatures.
    socket.on('updateCreatures', (newCreatures) => {
      creatures = newCreatures.creatures.creatures.map((creat) => {
        const newCreat = new Creature(new NeuralNetwork(
          creat.brain.input_nodes, creat.brain.hidden_nodes, creat.brain.output_nodes,
        ), mapSize,
        undefined, creat);
        newCreat.isChanged = true;
        return newCreat;
      });
    });

    // TODO: plants should update when new plant data is processed from firstUser
    socket.on('updatePlants', (newPlants) => {
      plants = [...newPlants.plants.plants];
    });
    socket.on('chunkEnterResponse', (envData) => {
      if (isFirst) {
        if ((!creatures.length || !plants.length)) {
          creatures = envData.creatures.map((creat) => {
            const newCreat = new Creature(new NeuralNetwork(
              creat.body.brain.input_nodes, creat.body.brain.hidden_nodes,
              creat.body.brain.output_nodes,
            ), mapSize,
            undefined, creat);
            newCreat.isChanged = true;
            return newCreat;
          });
          plants = envData.plants;
        }
      }
      setUpdate([]);
    });
    // response from the isFirstUser emitter.
    socket.on('firstResponse', (bool) => {
      if (bool) {
        isFirst = true;
      }
      socket.emit('chunkEnter');
    });
    socket.emit('isFirstUser');
    setInterval(() => {
      socket.emit('isFirstUser');
      socket.emit('saveCreatures', { creatures });
      // TODO: save creatures to the database.
      if (isFirst) {
        socket.emit('addCreatures', creatures);
        socket.emit('addFood', plants);
      }
    }, 10000);
    return () => {
      // disconnect from page when user leaves site.
      socket.emit('disconnect');
      socket.off();
    };
  }, []);

  if (isFirst) {
    if (!plants.length) {
      for (let i = 0; i < plantAmount; i += 1) {
        // generates random positions for the plants to spawn.
        plants.push({
          positions: [((Math.random() * (mapSize * 2)) - mapSize) / 2,
            ((Math.random() * (mapSize * 2)) - mapSize) / 2, 0.1],
          size: [(Math.random() * 0.03), (Math.random() * 0.03),
            (Math.random() * 0.03)],
        });
      }
    }
  }

  /**
   * @func reproduce
   *   Allows for parent creatures to create a new child creature with evolutionary traits.
   */
  function reproduce(creature) {
    calculateFitness([creature]);

    if (creatures.length < mp) {
      const newCreat = pickOne([creature, creature]);
      newCreat.generation += 1;
      creatures.push(newCreat);
    }
  }

  /**
   * @func repopulate
   *    repopulates the creatures state with an additional creature
   */
  function repopulate() {
    calculateFitness(savedCreatures);

    if (creatures.length < creaturePopulation) {
      // const creature = pickOne(savedCreatures);
      const creature = new Creature(null, mapSize, creatures.length - 1);
      creature.think();
      creature.update();
      creatures.push(creature);
      // think helps creature make a new decision
      // update updates the creature's state.
    }
  }
  /**
   * @func populate
   *    populates the creatures state with new creatures.
   */
  function populate() {
    for (let j = 0; j < creaturePopulation; j += 1) {
      creatures.push(new Creature(null, mapSize, j));
      // think helps creature make a new decision
      creatures[j].think();
      // update updates the creature's state.
      creatures[j].update();
    }
  }
  /**
   * @func isCloser
   *    Adds a reward system to detect if a creature is closer or farther to food/creature.
   */
  function isCloser(creature, prevCreat, plant) {
    // when the creature is a carnivore it should be able to see other creatures.
    const creat = creature;
    if (creat.isCarn) {
      if (!creat.lockedCreat) {
        creat.lockedPlant = plant;
      } else {
        const lp = creat.lockedPlant;
        if (creat.x - lp.x > prevCreat.x - lp.x) {
          creat.score += 0.1;
        } else if (creat.y - lp.y > prevCreat.y - lp.y) {
          creat.score += 0.1;
        } else {
          creat.score -= 0.1;
        }
      }
    } else if (!creat.lockedPlant) {
      creat.lockedPlant = plant;
    } else {
      // if the creature isn't carnivorous then it will see plants instead.
      const lp = creat.lockedPlant;
      if (creat.x - lp.positions[0] > prevCreat.x - lp.positions[0]) {
        creat.score += 0.1;
      } else if (creat.y - lp.positions[1] > prevCreat.y - lp.positions[1]) {
        creat.score += 0.1;
      } else {
        creat.score -= 0.1;
      }
    }
  }

  if (isFirst) {
    if (!creatures.length) {
      populate();
    }
  }

  // If the user is the first user, the code below will fire.
  if (isFirst) {
    creatures.forEach((creature, k) => {
      // updates creature and makes new decisions.
      const creat = creature;
      const upCreat = creat;
      if (creat.lifeSpan > 0) {
        const prevX = creat.x;
        const prevY = creat.y;
        // sets hold only unique properties.
        const plantObs = new Set();
        const creatObs = new Set();
        const prevStep = { x: creat.x, y: creat.y };
        creat.think();
        creat.update();
        // for when the creature goes beyond the border.
        if (creat.x > mapSize || creat.x < -mapSize) {
          upCreat.x = prevX;
          upCreat.lifeSpan -= 1;
        }
        if (creat.y > mapSize || creat.y < -mapSize) {
          upCreat.y = prevY;
          if (upCreat.lifeSpan > 0) {
            upCreat.lifeSpan -= 1;
          }
          upCreat.score = 0;
          inc += 1;
        }
        // when the creature is carnivorous.
        if (creat.isCarn) {
          creatures.forEach((c, i) => {
            if (c.x >= ((creat.x) - (creat.size
              * (creat.isCarn ? creatSight : creatSight / 2)))
            && c.x <= ((creat.x) + (creat.size
                * (creat.isCarn ? creatSight : creatSight / 2)))
            && c.y >= ((creat.y) - (creat.size
                * (creat.isCarn ? creatSight : creatSight / 2)))
            && c.y <= ((creat.y) + (creat.size
                * (creat.isCarn ? creatSight : creatSight / 2)))) {
              creatObs.add(c);
            }
            if (c.x >= ((creat.x / 2) - (creat.size / 2))
            && c.x <= ((creat.x / 2) + (creat.size / 2))
            && c.y >= ((creat.y / 2) - (creat.size / 2))
            && c.y <= ((creat.y / 2) + (creat.size / 2))) {
              console.log(`creature ${k} ate creature ${i}!!`);
              creat.score += c.score;
              creat.lifeSpan += c.lifeSpan;
              creat.size += c.size;
              savedCreatures.push(creatures.splice(i, 1));
            }
          });
        }
        plants.forEach((plant, p) => {
          if (plant.positions[0] >= ((creat.x) - (creat.size
            * (creat.isCarn ? creatSight : creatSight / 2)))
          && plant.positions[0] <= ((creat.x) + (creat.size
              * (creat.isCarn ? creatSight : creatSight / 2)))
          && plant.positions[1] >= ((creat.y) - (creat.size
              * (creat.isCarn ? creatSight : creatSight / 2)))
          && plant.positions[1] <= ((creat.y) + (creat.size
              * (creat.isCarn ? creatSight : creatSight / 2)))) {
            plantObs.add(plant);
          }
          if (plant.positions[0] >= ((creat.x / 2) - (creat.size / 2))
          && plant.positions[0] <= ((creat.x / 2) + (creat.size / 2))
          && plant.positions[1] >= ((creat.y / 2) - (creat.size / 2))
          && plant.positions[1] <= ((creat.y / 2) + (creat.size / 2))) {
            creat.score = 0.3;
            creat.lockedPlant = null;
            creat.lifeSpan += 400;
            creat.size += 0.01;
            reproduce(creat);
            plants.splice(p, 1);
            plants.push({
              positions: [((Math.random() * (mapSize * 2)) - mapSize) / 2,
                ((Math.random() * (mapSize * 2)) - mapSize) / 2, 0.1],
              size: [(Math.random() * 0.05), (Math.random() * 0.05),
                (Math.random() * 0.05)],
            });
          }
        });

        if (!creat.isCarn) {
          isCloser(creat, prevStep, plantObs.values().next().value);
        } else {
          isCloser(creat, prevStep, creatObs.values().next().value);
        }
      } else {
        savedCreatures.push(creatures.splice(k, 1)[0]);
        savedCreatures[savedCreatures.length - 1].lifeSpan = 100;
        deleteCreature(creat.name).then(() => {
          deathCount += 1;
        }).catch((err) => console.error(err));
      }
    });
    socket.emit('showCreatures', { creatures });
    socket.emit('showPlants', { plants });
  }

  if (deathCount !== creatures.length && creatures.length > 1 && !timer) {
    timer = setInterval(() => {
      setUpdate([]);
    }, 50);
  }
  if (!repopulator) {
    repopulator = setInterval(() => {
      repopulate();
    }, 1000);
  }
  if (!counter) {
    counter = setInterval(() => {
      creatures.forEach((cc) => {
        const c = cc;
        if (c.score !== c.objective) {
          c.score -= 1;
          c.lockedPlant = null;
        } else {
          c.objective += 1;
        }
      });
    }, 1000);
  }

  useEffect(() => {
    // to continue with the interval times until all creatures die.
  }, []);
  // when all creatures die, the environment re-populates.
  if (deathCount === creaturePopulation) {
    repopulate();
    deathCount = 0;
    savedCreatures = [];
  }

  return (
    <div style={{ height: window.innerHeight * 0.97, backgroundColor: 'black' }}>
      <Canvas camera={{ zoom: 60, position: [0, 20, 100] }}>
        <OrbitControls />
        <directionalLight intensity={0.5} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 200]} angle={0.9} />
        {plants.length && plants.map((p) => (
          <Plant
            positions={p.positions}
            size={p.size}
          />
        ))}
        {creatures.length && creatures.map((creature) => (
          <CreatureModel
            creature={creature}
            positions={[creature.x / 2, creature.y / 2, 0.1]}
            size={[creature.size / 2, creature.size / 2,
              creature.size / 2]}
            color={creature.isCarn ? 'red' : 'blue'}
            showVision={visibleVision}
            creatSight={creatSight}
          />
        ))}
        <Land map={mapSize} />
      </Canvas>
      <div className="gui-container" style={{ maxHeight: '0px' }}>
        <Gui
          setVV={setVV}
          visibleVision={visibleVision}
          creatures={creatures}
          maxPop={mp}
          setMp={setMp}
          population={creaturePopulation}
          plantAmount={plantAmount}
          creatSight={creatSight}
        />
      </div>
    </div>
  );
}
