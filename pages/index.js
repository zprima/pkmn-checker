import React, { Component } from 'react';
import { pokemonData } from '../utils/pokemon_data.js';

class Index extends Component {
  constructor(props) {
    super(props);

    const myPokemons = pokemonData.map((item, i) => {
      return { id: item.id, name: item.name, img: item.img, have: false }
    })

    this.state = {
      myPokemons: myPokemons,
      filteredPokemon: myPokemons
    }
  }

  onShowAll = (e) => {
    e.preventDefault();
    console.log("show all")

    this.setState({
      filteredPokemon: this.state.myPokemons
    })
  }

  onShowMissing = (e) => {
    e.preventDefault();
    var x = this.state.myPokemons.filter((ele) => {
      return ele.have == false
    })
    console.log("show missing", x.length)

    this.setState({
      filteredPokemon: x
    })
  }

  onShowHave = (e) => {
    e.preventDefault();
    var x = this.state.myPokemons.filter((ele) => {
      return ele.have == true
    })
    console.log("show have", x.length)

    this.setState({
      filteredPokemon: x
    })
  }

  onClickHave = (id, event) => {
    var myPokemonsUpdated = this.state.myPokemons
    var found = myPokemonsUpdated.findIndex((ele) => {
      return ele.id == id
    })
    myPokemonsUpdated[found].have = !myPokemonsUpdated[found].have

    this.setState({
      myPokemons: myPokemonsUpdated
    })
  }

  onExportHave = (e) => {
    e.preventDefault();
    this.onExport(true)
  }

  onExportMissing = (e) => {
    e.preventDefault();
    this.onExport(false)
  }

  onExport = async (flag = true) => {
    const payload = this.state.myPokemons
      .filter((item) => { return item.have == flag })
      .map((item) => { return item.id })

    // console.log("to post", payload)

    const resp = await fetch('/pkmn/export', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      body: JSON.stringify(payload)
    })
    const data = await resp.json()
    const json = JSON.stringify(data)


    const filename = flag ? 'export_have.json' : 'export_missing.json'

    // The actual download
    var blob = new Blob([json], { type: 'application/json' });
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    return (
      <div>
        <a href="" onClick={(e) => this.onShowAll(e)}>All</a>
        &nbsp;|&nbsp;
        <a href="" onClick={(e) => this.onShowMissing(e)}>Missing</a>
        &nbsp;|&nbsp;
        <a href="" onClick={(e) => this.onShowHave(e)}>Have</a>
        &nbsp;|&nbsp;
        <a href="" onClick={(e) => this.onExportHave(e)}>Export Have</a>
        &nbsp;|&nbsp;
        <a href="" onClick={(e) => this.onExportMissing(e)}>Export Missing</a>
        <br></br>
        <ul>
          {this.state.filteredPokemon.map((item, i) => {
            return (
              <li key={i}>
                <input type="checkbox" value={i + "_" + item.id} checked={item.have} onChange={(e) => this.onClickHave(item.id, e)}></input>
                <img src={item.img}></img>
                <span>{item.id}</span>&nbsp;
                <span>{item.name}</span>

              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default Index;