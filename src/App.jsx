import React, { useState, useEffect } from "react";
import "./App.css";
function App() {
  let [pokemonInfo, dataApply] = useState(null);
  let [buttonVar, clickCheck] = useState(false);
  let [banlist, setbanlist] = useState([]);
  //Past pokemonInfo is saved in the state variable pokemonInfo
  //let previousPokemon = pokemonInfo;

  const api = "https://pokeapi.co/api/v2/pokemon/";
  const pokemonCount = 1025;
  
  const fetcher = async () => {
  while (true) {
    let randomEntry = Math.floor(Math.random() * pokemonCount);
    const response = await fetch(api+randomEntry);
    const data = await response.json();
    
    let name = data.name;
    let types = data.types.map(obj => obj.type.name);
    let abilities = data.abilities.map(obj => obj.ability.name);
    let sprite = data.sprites.front_default;
    let spriteShiny = data.sprites.front_shiny;
    let weight = data.weight;
    //let versions = data.versions;
   // versions = Object.values(versions); // Convert the object to an array
    // Filter out any null values from the versions array
    let generation = "";
    //(data.versions.generation-i.red-blue.front_default).toString();
    if (!data.game_indices || data.game_indices.length === 0) {
      //manually assign generation if no game indices are available
        if(data.id > 649){
          if(data.id <= 721){
            generation = "Generation VI";
          }
          else if(data.id <= 809){
            generation = "Generation VII";
          }
          else if(data.id <= 905){
            generation = "Generation VIII";
          }
          else if(data.id <= 1025){
            generation = "Generation IX";
          }
      }
    }
    else{
  switch(data.game_indices[0].version.name)
  {
    case 'red':
    case 'blue':
    case 'yellow':
      generation = "Generation I";
      break;
    case 'gold':
    case 'silver':
    case 'crystal':
      generation = "Generation II";
      break;
    case 'ruby':
    case 'sapphire':
    case 'emerald':
    case 'firered':
    case 'leafgreen':
      generation = "Generation III";
      break;
    case 'diamond':
    case 'pearl':
    case 'platinum':
    case 'heartgold':
    case 'soulsilver':
      generation = "Generation IV";
      break;
    case 'black':
    case 'white':
    case 'black-2':
    case 'white-2':
      generation = "Generation V";
      break;
    default:
      generation = "unknown";
  }
    }
    // Check if the pokemon is in the banlist
    let attributesList = [name, weight, generation];
    let bancheck = bannedattr => banlist.includes(bannedattr);
    if (attributesList.some(bancheck) || types.some(type => banlist.includes(type)) ||
        abilities.some(ability => banlist.includes(ability))
) {
      continue;
    }
    // Check if the pokemon is shiny
    let shinyChance = Math.random() * 20; // Shiny chance is 1 in 20
    if (shinyChance < 1) {
      sprite = spriteShiny;
    }
    const image = new Image();

    image.src = `${sprite}`;
    image.onload = () => {
      const pokemon = {name, types, abilities, sprite, weight, generation};
      dataApply(pokemon);
    };
    break;
    }
  };

  useEffect(() => {fetcher();}, []);
  const addtobanlist = (newAttribute) => {
    setbanlist([...banlist, newAttribute]);
  };
  const removefrombanlist = (at) => {
    let updateban = banlist.filter(currentAttribute => currentAttribute !== at);
    setbanlist(updateban);
  };

  return (
    <div>
      <div className="container">
        <h1>Pokedex Adventure</h1>
        <h3>Explore the diversity of over a thousand pokemon!</h3>
        <br></br>
        <div className="discover-container">
          {buttonVar && (
            <div className="listening-container">
              <h2 className="pokemon-name">{pokemonInfo.name}</h2>
              <div className="buttons">
                <button className="topbuttons" onClick={() => addtobanlist(pokemonInfo.weight)}>
                  {pokemonInfo.weight}
                </button>
                <button className="topbuttons" onClick={() => addtobanlist(pokemonInfo.generation)}>
                  {pokemonInfo.generation}
                </button>
                {pokemonInfo.types.map((type, index) => (
                  <button key={index} className="topbuttons" onClick={() => addtobanlist(pokemonInfo.types[index])}>
                    {type}
                  </button>
                ))}
                {pokemonInfo.abilities.map((ability, index) => (
                  <button key={index} className="topbuttons" onClick={() => addtobanlist(pokemonInfo.abilities[index])}>
                    {ability}
                  </button>
                ))}
              </div>
              <img id="sprite" src={`${pokemonInfo.sprite}`} alt="randomly generated pokemon"/>
            </div>
          )}
          <p></p>
          <button className="fetcher" onClick={() => { 
            fetcher();
            clickCheck(true);}}>
            Find Pokemon
          </button>
        </div>
      </div>
<div className="banList">
        <h2>Ban List</h2>
        <p>Select an attribute in your listing to ban it</p>
        <div className="sidebar">
          {banlist.map((attribute) => (
            <button key={attribute} onClick={() => removefrombanlist(attribute)}>
              {attribute}
            </button>
          ))}
        </div>
      </div>
      </div>
  );
}

export default App;