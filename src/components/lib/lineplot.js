import React from "react"
import { Col } from "react-bootstrap"
import { Stage, Layer, Shape, Rect } from "react-konva"

class LinePlot extends React.Component {
  constructor(props) {
    super(props)
  }

  draw(context, shape, arr) {
    if(!arr) return;
    if (arr.length === 0) return
    context.beginPath();
    let k = 0;
    let fac = 1;
    let len = arr[arr.length-1].x;
    if(len > 1) fac = 1/len;
    let last = 0;
    arr.forEach( point => {
      if(k++===0) {
        if(arr[0].y>0) {
          context.moveTo(0,this.props.height-arr[0].y*this.props.height);
        } else {
          context.moveTo(0,this.props.height);
          context.lineTo(0,this.props.height-arr[0].y*this.props.height);
        }
      } else {
        last = point.x*fac*this.props.width;
        context.lineTo(last,this.props.height-(point.y*this.props.height));
      }
    })
    if(arr[0].y>0) {
      context.lineTo(last,this.props.height);
      context.lineTo(0,this.props.height);
    }
    context.strokeShape(shape);
  }

  render() {
    return (
      <Col xs="auto" style={{ backgroundColor: "#FDF6E3" }}>
        <Stage x={0} y={0} width={this.props.width} height={this.props.height}>
          <Layer>
            <Rect fill="#006600" x={0} y={0} width={this.props.width} height={this.props.height}/>
          </Layer>
          <Layer>
            <Shape stroke="#aaaaaa" strokeWith={3} sceneFunc={(context, shape) => {
              this.draw(context, shape, this.props.data)
            }}>
            </Shape>
          </Layer>
        </Stage>
      </Col>
    )
  }

}

export default LinePlot