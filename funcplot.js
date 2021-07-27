import React from "react"
import { Col } from "react-bootstrap"
import { Stage, Layer, Shape } from "react-konva"

class FuncPlot extends React.Component {
  constructor(props) {
    super(props)
  }

  downsample(arr, len) {
    let ret = []
    let pos = 1
    let diff = arr.length / len
    let sum = 0
    let cnt = 0
    arr.forEach((val, index) => {
      if (index > pos * diff) {
        ret.push(sum / cnt)
        sum = 0
        cnt = 0
        pos++
      } else {
        sum += val
        cnt++
      }
    })
    return ret
  }

  drawTable(context, shape, arr, w, h) {
    if (arr.length === 0) return
    let arr2 = this.downsample(arr, w)
    context.beginPath()
    context.moveTo(0, h / 2)
    for (let x = 1; x < arr2.length - 1; x++) {
      context.lineTo(x, h / 2 - (arr2[x] * (h / 2)))
    }
    context.lineTo(w - 1, h / 2)
    context.strokeShape(shape)
  }

  render() {
    return (
      <Col md="auto" style={{ backgroundColor: "#FDF6E3" }}>
        <Stage x={0} y={0} width={this.props.w} height={this.props.h}>
          <Layer>
            <Shape stroke="black" strokeWith={3} sceneFunc={(context, shape) => {
              this.drawTable(context, shape, this.props.data, this.props.w, this.props.h)
            }}>
            </Shape>
          </Layer>
        </Stage>
      </Col>
    )
  }

}

export default FuncPlot
