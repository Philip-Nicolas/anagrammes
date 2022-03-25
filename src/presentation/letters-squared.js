//region Presentation

function Square(props) {
  return (
    <div className="SquareContentContainer" style={{ width: props.width || "auto" }}>
      <svg viewBox="0 0 1 1"/>
      {props.children}
    </div>
  )
}

function Tile(props) {
  return (
    <div className="Tile" onClick={props.onClick} onTouchStart={props.onClick}>
      {props.children}
    </div>
  )
}

function Space(props) {
  return (
    <Square width={`${props.width}px`}>
      <div className="TileSpace" style={{
        "font-size": `${props.fontSize}px`,
      }} onClick={props.onClick} onTouchStart={props.onClick}>
        {props.tileId && new Tile(props.tilePropsFactory(props.tileId))}
      </div>
    </Square>
  )
}

function Row(props) {
  return (
    <div className="HeightBasedRow">
      {props.children.map((child, index) => {
        return (
          // can set key to index since we know container divs won't change
          <div className="RowItemContainer" key={index}>
            {child}
          </div>
        )
      })}
    </div>
  )
}

//endregion

export {
  Tile, Space, Row, Square
}