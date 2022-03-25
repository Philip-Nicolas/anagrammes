import { useEffect, useMemo, useRef, useState } from "react";
import { Row, Space } from "./letters-squared";

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
  }, [props.submissionResult]);

  return (
    <div className="WordSubmissionFeedbackDisplay" ref={ref}>
      {props.submissionResult ? props.submissionResult.feedback : null}
    </div>
  )
}

function useAnagrammesBoard(letters) {
  return useMemo(() => {
    let lastId = 1;
    const nextId = () => lastId++;

    const activeRow = letters.map(nextId);
    const inactiveRow = letters.map(nextId);

    const tileset = {};
    const startPosition = {};

    letters.forEach((letter, i) => {
      const id = nextId();
      tileset[id] = {
        letter,
        props: {
          children: letter,
        }
      };
      startPosition[id] = inactiveRow[i];
    });

    return {
      tileset,
      startPosition,
      layout: {
        activeRow,
        inactiveRow,
      }
    };
  }, [letters]);
}

function useBoardStateManager(board) {
  //TODO make reset position consistent with usual position format (currently uses tile as key instead of space)
  const createResetTilePositions = (layout, resetPosition) => {
    const positions = {};

    // create empty positions object
    layout.activeRow.forEach(space => positions[space] = null);
    layout.inactiveRow.forEach(space => positions[space] = null);

    // assign tiles to startPositions
    [...Object.keys(resetPosition)].forEach(tile => positions[resetPosition[tile]] = tile);

    return positions;
  };

  const [resetPositions, setResetPositions] = useState(board.startPosition);
  const [tilePositions, setTilePositions] = useState(createResetTilePositions(board.layout, resetPositions));

  const copyPositions = (positions = tilePositions) => {
    return {
      ...positions,
    }
  };
  const swapTilesAt = (spaceA, spaceB, positions = copyPositions()) => {
    [positions[spaceA], positions[spaceB]] = [positions[spaceB], positions[spaceA]];
    return positions;
  };
  const justifyRow = (spaces, positions = copyPositions()) => {
    const tiles = getTilesAt(spaces, positions);

    for (let i = 0; i < tiles.length; i++) {
      let deleteCount;
      if (tiles[i] === null && 0 < (deleteCount = tiles.slice(i).findIndex(tile => tile !== null))) {
        tiles.push(...tiles.splice(i, deleteCount));
      }
    }

    spaces.forEach((space, i) => {
      positions[space] = tiles[i];
    })

    return positions;
  }
  const resetBoard = (positions = resetPositions) => {
    setTilePositions(createResetTilePositions(board.layout, positions));
  }
  const getTileAt = (space, positions = tilePositions) => positions[space];
  const getTilesAt = (spaces, positions = tilePositions) => spaces.map(space => positions[space]);

  return {
    copyPositions,
    setTilePositions,
    setResetPositions,
    resetBoard,
    createResetTilePositions,
    swapTilesAt,
    getResetPosition: tile => resetPositions[tile],
    getTileAt,
    getTilesAt,
    getFirstEmptySpace: spaces => {
      for (let i = 0; i < spaces.length; i++) {
        if (tilePositions[spaces[i]] === null) return spaces[i];
      }
    },
    justifyRow,
  };
}

function WordEntryArea(props) {
  const width = 64;
  const fontSize = Math.round(width * 2 / 3);

  const board = useAnagrammesBoard(props.letters);

  const createActiveTileProps = (tile, space, boardStateManager) => {
    return {
      ...board.tileset[tile].props,
      onClick: () => {
        const newPositions = boardStateManager.copyPositions();

        boardStateManager.swapTilesAt(space, boardStateManager.getResetPosition(tile), newPositions);
        boardStateManager.justifyRow(board.layout.activeRow, newPositions);

        boardStateManager.setTilePositions(newPositions);
      },
    }
  };
  const createActiveSpaceProps = (space, boardStateManager) => {
    return {
      width,
      fontSize,
      tileId: boardStateManager.getTileAt(space),
      tilePropsFactory: (tile) => {
        return createActiveTileProps(tile, space, boardStateManager);
      }
    };
  }
  const createInactiveTileProps = (id) => {
    return {
      ...board.tileset[id].props,
    }
  };
  const createInactiveSpaceProps = (space, boardStateManager) => {
    return {
      width,
      fontSize,
      tileId: boardStateManager.getTileAt(space),
      tilePropsFactory: createInactiveTileProps,
      onClick: () => boardStateManager.setTilePositions(
        boardStateManager.swapTilesAt(space, boardStateManager.getFirstEmptySpace(board.layout.activeRow))
      ),
    };
  }

  const boardStateManager = useBoardStateManager(board);

  const [submissionResult, setSubmissionResult] = useState({});

  return (
    <div>
      <WordSubmissionFeedbackDisplay submissionResult={submissionResult}/>
      <Row>
        {board.layout.activeRow
          .map(id => (
            <Space key={id} {...createActiveSpaceProps(id, boardStateManager)}/>
          ))}
      </Row>
      <WordEntryControls
        onShuffle={() => {
          const tiles = [...Object.keys(board.startPosition)];
          const startSpaces = [...Object.values(board.startPosition)];
          shuffle(startSpaces);

          const newResetPosition = {};
          tiles.forEach((k, i) => newResetPosition[k] = startSpaces[i]);

          boardStateManager.setResetPositions(newResetPosition);
          boardStateManager.resetBoard(newResetPosition);
        }}
        onClear={() => {
          boardStateManager.resetBoard();
        }}
        onSubmit={() => {
          const word = boardStateManager.getTilesAt(board.layout.activeRow)
            .map(tile => tile?board.tileset[tile].letter: null)
            .join("");

          const submissionResult = props.submitWord(word);
          setSubmissionResult(submissionResult);
          if (submissionResult.score > 0) boardStateManager.resetBoard();
        }}/>
      <Row>
        {board.layout.inactiveRow
          .map(id => (
            <Space key={id} {...createInactiveSpaceProps(id, boardStateManager)}/>
          ))}
      </Row>
    </div>
  )
}

export {
  WordEntryArea
}