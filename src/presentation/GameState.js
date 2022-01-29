import Countdown from "react-countdown";

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

export {
  GameStateDisplayArea
}