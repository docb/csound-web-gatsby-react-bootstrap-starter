import React from "react"
import { Row, Col } from "react-bootstrap"
import { Stage, Layer, Rect } from "react-konva"

class Meter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { r: 0, l: 0 }
    this.height = props.def.height
    this.width = props.def.width
    this.props.def.change = this.setValue.bind(this)
    this.log10db = 0.11512925
  }

  componentDidMount() {
  }

  setValue(l, r) {
    let dbr = r === 0 ? -60 : (Math.log(2.4 * r) / this.log10db)
    if (dbr < -60) dbr = -60
    let dbl = l === 0 ? -60 : (Math.log(2.4 * l) / this.log10db)
    if (dbl < -60) dbl = -60
    const lh = this.height + dbl * (this.height / 60)
    const rh = this.height + dbr * (this.height / 60)
    this.setState({ l: lh, r: rh })
  }

  render() {
    return (
      <Col style={{ marginLeft: 5 }}>
        <Row style={{ flexWrap: "nowrap" }}>
          <Col>
            <div className="dbyellow">LR</div>
            <Stage width={this.width} height={this.height}>
              <Layer>
                <Rect x={0} y={this.height - this.state.l} width={this.width / 2 - 1} height={this.state.l}
                      fillLinearGradientStartPoint={{ x: this.width / 4, y: this.state.l - this.height }}
                      fillLinearGradientEndPoint={{ x: this.width / 4, y: this.height }}
                      fillLinearGradientColorStops={[0, "red", 0.2, "yellow", 1, "green"]}
                >
                </Rect>
                <Rect x={this.width / 2 + 2} y={this.height - this.state.r} width={this.width / 2 - 1}
                      height={this.state.r}
                      fillLinearGradientStartPoint={{ x: this.width / 4, y: this.state.r - this.height }}
                      fillLinearGradientEndPoint={{ x: this.width / 4, y: this.height }}
                      fillLinearGradientColorStops={[0, "red", 0.2, "yellow", 1, "green"]}
                >
                </Rect>
              </Layer>
            </Stage>
          </Col>
        </Row>
      </Col>
    )
  }

}

export default Meter
