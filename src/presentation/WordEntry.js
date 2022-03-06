import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

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

function WordSubmissionFeedbackDisplay(props) {
  const flashMessage = node => {
    node.style.transition = "opacity ease-in-out 0.1s"
    node.style.opacity = 1;
    setTimeout(() => {
      node.style.transition = "opacity ease-in-out 1s"
      node.style.opacity = 0;
    }, 200)
  }

  const ref = useRef(null);
  useEffect(() => {
    flashMessage(ref.current);
  }, [props.message])

  return (
    <div className="WordSubmissionFeedbackDisplay" ref={ref}>
      {props.message}
    </div>
  )
}

function WordEntryControls({ onShuffle, onSubmit, onClear }) {
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
  const ref = useRef(null);

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

  const [activeTiles, setActiveTiles] = useState([]);
  const [inactiveTiles, setInactiveTiles] = useState([]);
  const [feedback, setFeedback] = useState("");

  const resetTiles = useCallback(() => {
    setActiveTiles(new Array(letters.length).fill(null));
    setInactiveTiles([...letters.keys()]);
  }, [letters])

  useEffect(() => {
    resetTiles();
  }, [resetTiles])

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
    const width = ref.current != null ? Math.round(ref.current.clientWidth / 7) : 64;
    const fontSize = Math.round(width * 2 / 3);
    return tiles.map((tileIndex) => {
      return (index) => {
        return (
          <Square className="TileSpace" width={`${width}px`}>
            <div className="TileSpace" style={{
              "font-size": `${fontSize}px`,
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
    <div ref={ref}>
      <WordSubmissionFeedbackDisplay message={feedback}/>
      <div className="ActiveTilesRow">
        <Row items={getTileSpaces(activeTiles, getOnClickActiveTile)}/>
      </div>
      <WordEntryControls onShuffle={shuffleTiles} onClear={resetTiles} onSubmit={() => {
        setFeedback(props.submitWord(getEnteredWord()));
      }}/>
      <div className="InactiveTilesRow">
        <Row items={getTileSpaces(inactiveTiles, getOnClickInactiveTile)}/>
      </div>
    </div>
  )
}

export {
  WordEntryArea
}
