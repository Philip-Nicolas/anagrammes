import './App.css';
import { useEffect, useState } from "react";

// region Mocked Dependencies

const getLetters = () => "abcdef";

const getLanguage = () => "fr";

// endregion

// region Utils

const getLineHeightForHeight = (height) => {
  return Math.round(height * 2 / 3)
}

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

function Square(props) {
  return (
    <div className="SquareContentContainer" style={{ width: props.width || "auto" }}>
      <svg viewBox="0 0 1 1"/>
      {props.children}
    </div>
  )
}

// endregion

function Tile(props) {
  return (
    <div className="Tile" onClick={props.onClick}>
      {props.children}
    </div>
  );
}


function WordEntryArea(props) {
  const letters = props.letters;

  const tileRenderers = letters.map(letter => {
    return function (onClick) {
      // let style = {};
      //
      // if (clickedTile) {
      //   const dx = clickedTile.offsetLeft;
      //   const dy = clickedTile.offsetHeight;
      //   style.transform = `translate(-${dx}px, -${dy}px)`;
      //   setTimeout(() => {
      //     style.transform = 'translate(0, 0)'
      //   }, 500);
      // }

      return (
        <Tile onClick={onClick}>
          {letter}
        </Tile>
      );
    }
  })

  const [activeTiles, setActiveTiles] = useState([...letters.keys()]);
  const [inactiveTiles, setInactiveTiles] = useState(new Array(letters.length).fill(null));
  const [clickedTile, setClickedTile] = useState(null);

  /**
   * handles click event for active tiles.
   * Tile specified by index in the `tileSpaces.active` array.
   */
  const getOnClickActiveTile = (index) => {
    return (e) => {
      const active = [...activeTiles];
      const inactive = [...inactiveTiles];

      inactive[activeTiles[index]] = active.splice(index, 1)[0];
      active.push(null);

      setClickedTile(e.target)
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
          <Square className="TileSpace" width="6rem">
            <div className="TileSpace" style={{
              "font-size": "4em",
            }}>
              {tileIndex == null ? null : tileRenderers[tileIndex](onClickFactory(index))}
            </div>
          </Square>
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
