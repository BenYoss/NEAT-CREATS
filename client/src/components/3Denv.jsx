import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// Drei helps with adding additional abstractions to the THREE.js environment.
import { OrbitControls } from '@react-three/drei';
// import the creature Neural Network into the 3D environment.
import Creature from '../model-config/creature';

// How many creatures would be in this enviornment?
const creaturePopulation = 10;
// How big is the map?
const mapSize = 20;
/**
 * function: Creature
 * @func CreatureModel creates a mesh instance in the environment.
 */
function CreatureModel(args) {
  const arg = args;
  return (
    <mesh rotation={[0, 0, 0]} scale={arg.size} position={arg.positions}>
      <sphereGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        color="blue"
      />
    </mesh>
  );
}
/**
 * function: Plant
 * @func Plant creates a mesh instance in the environment.
 */
function Plant(args) {
  const arg = args;
  return (
    <mesh
      rotation={[Math.random() * 2, Math.random() * 2, Math.random() * 2]}
      position={arg.positions}
      scale={arg.size}
    >
      <dodecahedronGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        color="yellow"
      />
    </mesh>
  );
}
// the 3D model that renders the land for the creatures.
function Land() {
  // sets the size of the land mass based on map size.
  const s = mapSize;
  return (
    <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} scale={[s, s, s]}>
      <planeGeometry attach="geometry" />
      <meshPhongMaterial
        attach="material"
        color="green"
      />
    </mesh>
  );
}
// container for plants.
const plants = [];
for (let i = 0; i < 100; i += 1) {
// generates random positions for the plants to spawn.
  plants.push({
    positions: [((Math.random() * (mapSize * 2)) - mapSize) / 2,
      ((Math.random() * (mapSize * 2)) - mapSize) / 2, 0.1],
    size: [(Math.random() * 0.2), (Math.random() * 0.2),
      (Math.random() * 0.2)],
  });
}
/**
 * @func Env is a react component that handles the WebGL environment using THREE.js
 * has directional lighting, orbit controls to control movement, and meshes
 * contained within the environment scope.
 */
let deathCount = 0;
export default function Env() {
  const [creatures, setCreatures] = useState([]);
  const [, setUpdate] = useState([0]);
  /**
   * @func populate
   *    populates the creatures state with new creatures.
   */
  function populate() {
    for (let j = 0; j < creaturePopulation; j += 1) {
      creatures.push(new Creature());
      // think helps creature make a new decision
      creatures[j].think();
      // update updates the creature's state.
      creatures[j].update();
    }
    setCreatures([...creatures]);
  }
  useEffect(() => {
    // const c = creatures.length ? [...creatures] : [];
    populate();
  }, []);
  creatures.forEach((creat, k) => {
    // updates creature and makes new decisions.
    const upCreat = creat;
    if (creat.lifeSpan > 0) {
      const prevX = creat.x;
      const prevY = creat.y;
      creat.think();
      creat.update();
      if (creat.x > mapSize || creat.x < -mapSize) {
        upCreat.x = prevX;
      }
      if (creat.y > mapSize || creat.y < -mapSize) {
        upCreat.y = prevY;
      }
    } else {
      creatures.splice(k, 1);
      deathCount += 1;
    }
  });
  let timer;
  useEffect(() => {
    // to continue with the interval times until all creatures die.
    if (deathCount !== creatures.length && creatures.length > 1 && !timer) {
      timer = setInterval(() => {
        setUpdate([]);
      }, 80);
    }
  }, []);
  // when all creatures die, the environment re-populates.
  if (deathCount === creaturePopulation) {
    populate();
    deathCount = 0;
  }
  return (
    <div style={{ height: window.innerHeight * 0.73 }}>
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
            positions={[creature.x / 2, creature.y / 2, 0.1]}
            size={[creature.size / 2, creature.size / 2,
              creature.size / 2]}
            color="blue"
          />
        ))}
        <Land />
      </Canvas>
    </div>
  );
}
