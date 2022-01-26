import './App.css';
import { useState } from "react";

// region Mocked Dependencies

const getLetters = () => "abcdef";

const getLanguage = () => "fr";

// endregion

// region Layout

function Row(props) {
  return (
    <div className="HeightBasedRow">
      {props.items.map((item, index) => {
        return (
          // can set key to index since we know container divs won't change
          <div className="RowItemContainer" key={index}>
            {item(index)}
          </div>
        )
      })}
    </div>
  )
}

// endregion


function WordEntryArea(props) {
  const letters = props.letters;

  const tileRenderers = letters.map(letter => {
    return (onClick) => (
      <div className="Tile" onClick={onClick}>
        {letter}
      </div>
    );
  })

  const [activeTiles, setActiveTiles] = useState([...letters.keys()]);
  const [inactiveTiles, setInactiveTiles] = useState(new Array(letters.length).fill(null));

  /**
   * handles click event for active tiles.
   * Tile specified by index in the `tileSpaces.active` array.
   */
  const getOnClickActiveTile = (index) => {
    return () => {
      const active = [...activeTiles];
      const inactive = [...inactiveTiles];

      inactive[activeTiles[index]] = active.splice(index, 1)[0];
      active.push(null);

      setActiveTiles(active);
      setInactiveTiles(inactive);
    }
  }

  const getOnClickInactiveTile = (index) => {
    return () => {
      const active = [...activeTiles];
      const inactive = [...inactiveTiles];

      active[active.indexOf(null)] = inactive[index];
      inactive[index] = null;

      setActiveTiles(active);
      setInactiveTiles(inactive);
    }
  }

  const getTileSpaces = (tiles, onClickFactory) => {
    return tiles.map((tileIndex) => {
      return (index) => {
        return (
          <div className="HeightBasedSquare TileSpace">
            {tileIndex == null ? null : tileRenderers[tileIndex](onClickFactory(index))}
          </div>
        )
      }
    })
  }


  return (
    <div>
      <div className="ActiveTilesRow">
        <Row items={getTileSpaces(activeTiles, getOnClickActiveTile)}/>
      </div>
      <div className="InactiveTilesRow">
        <Row items={getTileSpaces(inactiveTiles, getOnClickInactiveTile)}/>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="AppContainer">
      <div className="App">
        <header>
          <p>
            Anagrammes
          </p>
        </header>
        <WordEntryArea letters={getLetters().toUpperCase().split("")}/>
        <footer/>
      </div>
    </div>
  );
}

export default App;
