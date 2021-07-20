import React from 'react';
import { Col  } from "react-bootstrap"
import { Stage, Layer, Shape } from 'react-konva';

class FuncPlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { arr:[]};
    this.h = this.props.def.w;
    this.w = this.props.def.h;
  }
  
  drawTable(context,arr,w,h) {
    console.log(arr);
    if(arr.length===0) return;
    context.beginPath();
    context.moveTo(0,h/2);
    for(let x=1;x<w;x++) {
      context.lineTo(x,arr[x*(arr.length/w)])
    }
    context.strokeShape(shape);
  }
  set(arr) {
    this.setState({arr:arr});
  }
  render() {
    return (
      <Col style={{ backgroundColor: '#FDF6E3'}}>
         <Stage x={0} y={0} width={this.w} height={this.h}>
           <Layer>
              <Shape stroke="black" strokeWith={3} sceneFunc={(context, shape) => {
                  this.drawTable(context,this.state.arr,this.w,this.h);
              }}>
              </Shape>
           </Layer>
         </Stage>
      </Col>
    )
  }

}

export default FuncPlot;
