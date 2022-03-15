import Countdown from "react-countdown";

const { AnagrammesManager } = require('../words/AnagrammesGame');

function BigValueDisplay(props) {
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
    <Countdown date={startDate + duration} overtime={false}
               renderer={({ minutes, seconds }) => (
                 <BigValueDisplay label="Time Left" value={`${minutes}:${`${seconds}`.padStart(2, '0')}`}/>
               )}/>
  )
}

function GameStateDisplayArea({ gameState }) {
  const scoreString = `${AnagrammesManager.getScore(gameState)}`.padStart(4, "0");
  return (
    <div className="GameStateDisplayArea HeightBasedRow">
      <span className="TimeLeftDisplay">
        <Timer startDate={gameState.startTime} duration={gameState.game.setup.duration}/>
      </span>
      <span>
        <BigValueDisplay label="Score" value={scoreString}/>
      </span>
    </div>
  )
}

export {
  GameStateDisplayArea
}