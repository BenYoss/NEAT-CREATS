import axios from 'axios';

/**
 * @function getCreatures()
 * when invoked will retrieve all creatures from the database
 * and populate the world.
 */
export async function getCreatures() {
  const { data } = await axios.get('/data/creature');
  console.log(data, 'resulting flag for get');
}

/**
 * @function addCreature()
 * when invoked adds a new creature to the database with specific
 * features based on input.
 * @param {*} creatData object
 */

export async function addCreature(creatData) {
  const { data } = await axios.post('/data/creature', { creatData });
  console.log(data, 'resulting flag for post');
}

export async function updateCreature(creatData, id) {
  const { data } = await axios.put('/data/creature', { creature: creatData, id });
  console.log(data, 'resulting flag for put');
}

/**
 * @function deleteCreature()
 * deletes a creature from the database based on a
 * specified name.
 * @param {*} id
 */
export async function deleteCreature(id) {
  await axios.put('/data/creature', { id }).catch((err) => console.error(err));
}

export async function deletePlant(id) {
  await axios.put('/data/plants', { id }).catch((err) => console.error(err));
}
