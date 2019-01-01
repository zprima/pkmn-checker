import jsonData from '../consts/pokelist.json'

const loadData = () => JSON.parse(JSON.stringify(jsonData));

export const pokemonData = loadData()