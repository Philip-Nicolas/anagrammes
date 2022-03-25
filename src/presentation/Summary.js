import { Row, Square } from "./letters-squared";


function makeRowFromWord(word) {
  return (
    <Row items={word.split("").map(c => {
        return () => (
          <Square className="TileSpace" width={`32px`}>
            <div className="TileSpace" style={{
              "font-size": `16px`,
            }}>
              <div className="Tile">{c}</div>
            </div>
          </Square>
        )
      })}/>
  )
}

function SummaryArea(props) {
  const words = props.allowedWords
    .sort((a, b) => a.length === b.length ? a.localeCompare(b) : b.length - a.length)

  return (
    <div>
      {words.map(makeRowFromWord)}
    </div>
  )
}

export {
  SummaryArea
}