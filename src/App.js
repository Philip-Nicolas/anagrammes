import './App.css';
import { useEffect, useState } from "react";
import Countdown from 'react-countdown';

// region Mocked Dependencies

const getLetters = () => "abcdef";

const getLanguage = () => "fr";

// endregion

// region Utils

const getLineHeightForHeight = (height) => {
  return Math.round(height * 2 / 3)
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
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

function BigNumberDisplay(props) {
  return (
    <div className="BigNumberDisplay">
      <div className="Label">{props.label}</div>
      <div className="Value">{props.value}</div>
    </div>
  )
}

/**
 * Countdown timer for time left in the level.
 *
 * @param startDate starting time
 * @param duration timer duration in ms
 * @returns {JSX.Element}
 * @constructor
 */
function Timer({ startDate, duration }) {
  return (
    <Countdown date={ startDate + duration} overtime={false}
               renderer={({minutes, seconds}) => (
        <BigNumberDisplay label="Time Left" value={`${minutes}:${`${seconds}`.padStart(2, '0')}`}/>
      )}/>
  )
}

function GameStateDisplayArea(props) {
  return (
    <div className="GameStateDisplayArea HeightBasedRow">
      <span className="TimeLeftDisplay">
        <Timer startDate={props.startDate} duration={props.duration}/>
      </span>
      <span>
        <BigNumberDisplay label="Score" value={props.score}/>
      </span>
    </div>
  )
}

function WordSubmissionFeedbackDisplay(props) {
  return (
    <div className="WordSubmissionFeedbackDisplay">
      {props.children}
    </div>
  )
}

function WordEntryControls({onShuffle, onSubmit, onClear}) {
  return (
    <div className="Row WordEntryControls">
      <div className="Row">
        <button onClick={onShuffle}>Shuffle</button>
      </div>
      <div className="Row-Reverse">
        <button onClick={onSubmit}>Enter</button>
        <button onClick={onClear}>Clear</button>
      </div>
    </div>
  )
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

  const getInitialActiveTiles = () => new Array(letters.length).fill(null);
  const getInitialInactiveTiles = () => [...letters.keys()];

  const [activeTiles, setActiveTiles] = useState(getInitialActiveTiles());
  const [inactiveTiles, setInactiveTiles] = useState(getInitialInactiveTiles());
  const [clickedTile, setClickedTile] = useState(null);
  const [feedback, setFeedback] = useState("");

  const resetTiles = () => {
    setActiveTiles(getInitialActiveTiles());
    setInactiveTiles(getInitialInactiveTiles());
  }

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

  const shuffleTiles = () => {
    shuffle(letters);
    resetTiles();
  }

  const getEnteredWord = () => {
    return activeTiles.map(i => (i != null ? letters[i] : null)).join("");
  }


  return (
    <div>
      <WordSubmissionFeedbackDisplay>
        {feedback}
      </WordSubmissionFeedbackDisplay>
      <div className="ActiveTilesRow">
        <Row items={getTileSpaces(activeTiles, getOnClickActiveTile)}/>
      </div>
      <WordEntryControls onShuffle={shuffleTiles} onClear={resetTiles} onSubmit={() => {
        setFeedback(props.submitWord(getEnteredWord()));
        console.log(feedback)
      }}/>
      <div className="InactiveTilesRow">
        <Row items={getTileSpaces(inactiveTiles, getOnClickInactiveTile)}/>
      </div>
    </div>
  )
}

function App() {
  const [startDate] = useState(Date.now());
  const [duration] = useState(60000);

  const submitWord = (word) => {
    return "submitted " + word
  }

  return (
    <div className="AppContainer">
      <div className="App">
        <header>
          <p>
            Anagrammes
          </p>
        </header>
        <GameStateDisplayArea startDate={startDate} duration={duration} timeLeft="0:23" score="0000"/>
        <WordEntryArea letters={getLetters().toUpperCase().split("")} submitWord={submitWord}/>
        <footer/>
      </div>
    </div>
  );
}

export default App;
