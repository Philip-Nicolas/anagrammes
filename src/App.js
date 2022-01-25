import './App.css';
import { useState } from "react";

// region Mocked Dependencies

const getLetters = () => "abcdef";

const getLanguage = () => "fr";

// endregion

// region Layout

function Tile(props) {
  const onDragStart = (e) => {
    // Add the target element's id to the data transfer object
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  }

  return (
    <div className="Tile" draggable={true} onDragStart={onDragStart}>
      {props.children}
    </div>
  )
}

function TileSpace(props) {
  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  const onDrop = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/html");
    e.target.appendChild(document.getElementById(data));
  };

  return (
    <div className="RowItemContainer">
      <div className="HeightBasedSquare TileSpace" onDragOver={onDragOver} onDrop={onDrop}>
        {props.children}
      </div>
    </div>
  )
}

function TileSpaceRow(props) {
  return (
    <div className="HeightBasedRow">
      {props.tileSpaces.map(tileIndex => {
        return (
          <TileSpace>
            {tileIndex === null ? null : (<Tile> {props.tiles[tileIndex]} </Tile>)}
          </TileSpace>
        )
      })}
    </div>
  )
}

// endregion

function WordEntryArea(props) {
  const [tiles, setTiles] = useState(props.letters);
  const [tileSpaces, setTileSpaces] = useState({
    active: new Array(tiles.length).fill(null),
    inactive: [...tiles.keys()],
  })

  return (
    <div>
      <div className="ActiveTilesRow">
        <TileSpaceRow tiles={tiles} tileSpaces={tileSpaces.active}/>
      </div>
      <div className="InactiveTilesRow">
        <TileSpaceRow tiles={tiles} tileSpaces={tileSpaces.inactive}/>
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
        <body>
        <WordEntryArea letters={getLetters().toUpperCase().split("")}/>
        </body>
        <footer/>
      </div>
    </div>
  );
}

export default App;
