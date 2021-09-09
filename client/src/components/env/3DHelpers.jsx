import React from 'react';
import propTypes from 'prop-types';
import { extend } from '@react-three/fiber';
import { Text } from 'troika-three-text';
import fonts from '../../helpers/fonts';

extend({ Text });

// text configuration options: for more information take a look at this github repo:
const opts = {
  font: 'Philosopher',
  fontSize: 0.1,
  color: '#99ccff',
  maxWidth: 50,
  lineHeight: 1,
  letterSpacing: 0,
  textAlign: 'justify',
  materialType: 'MeshPhongMaterial',
};

/**
 * function: Creature
 * @func CreatureModel creates a mesh instance in the environment.
 */

export function CreatureModel(args) {
  const arg = args;
  return (
    <>
      {/* text to display names of creatures. */}
      <text
        position={[arg.positions[0], arg.positions[1], 0.2]}
        fontSize={0.1}
        color="#99ccff"
        maxWidth={50}
        lineHeight={1}
        letterSpacing={0}
        textAlign="justify"
        materialType="MeshPhongMaterial"
        text={arg.creature.name}
        font={fonts.Philosopher}
      >
        {opts.materialType === 'MeshPhongMaterial' ? (
          <meshPhongMaterial attach="material" color={opts.color} />
        ) : null}
      </text>
      {/* creature mesh */}
      <mesh
        rotation={[0, 0, 0]}
        scale={arg.size}
        position={arg.positions}
        onClick={() => { console.log(arg.creature); }}
      >
        <sphereGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color={arg.color}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* mesh for creature sight radius */}
      {arg.showVision && (
      <mesh
        rotation={[0, 0, 0]}
        scale={[arg.size[0]
              * (arg.creature.isCarn ? arg.creatSight
              + 1 : arg.creatSight), arg.size[1]
              * (arg.creature.isCarn ? (arg.creatSight + 1) : arg.creatSight), arg.size[2]]}
        position={arg.positions}
        onClick={() => { console.log(arg.creature); }}
      >
        <sphereGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color="red"
          transparent
          opacity={0.2}
        />
      </mesh>
      )}
    </>
  );
}

/**
   * function: Plant
   * @func Plant creates a mesh instance in the environment.
   */
export function Plant(args) {
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
export function Land({ map }) {
  // sets the size of the land mass based on map size.
  const s = map;
  return (
    <>
      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]} scale={[s, s, s]}>
        <planeGeometry attach="geometry" />
        <meshPhongMaterial
          attach="material"
          color="green"
        />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 0, -2.57]} scale={[s, s, s]}>
        <boxGeometry attach="geometry" />
        <meshPhongMaterial
          attach="material"
          color="gray"
        />
      </mesh>
    </>
  );
}
// proptypes for Land function.
Land.propTypes = {
  map: propTypes.number.isRequired,
};
