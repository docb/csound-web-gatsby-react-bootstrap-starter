import React from "react"
import { Row, Col, Button } from "react-bootstrap"
import Knob from "./knob"
import LinePlot from "./lineplot"

class Adsr extends React.Component {
  constructor(props) {
    super(props)
    this.state = { on:false, a: 0.01, d: 0, s: 1, r: 0.1 }
    this.h = 40
    this.w = 120
    this.props.def.changeValue = this.setValue.bind(this)
    this.ida = this.props.def.id + "_a"
    this.idd = this.props.def.id + "_d"
    this.ids = this.props.def.id + "_s"
    this.idr = this.props.def.id + "_r"
    this.components = {
      [this.ida]: {
        id: this.ida,
        type: "knob",
        label: "A",
        min: 0.01,
        max: 3,
        step: 0.01,
        defval: 0.01,
        width: 35,
        height: 35,
        digits: 3,
      },
      [this.idd]: {
        id: this.idd,
        type: "knob",
        label: "D",
        min: 0,
        max: 3,
        step: 0.01,
        defval: 0,
        width: 35,
        height: 35,
        digits: 3,
      },
      [this.ids]: {
        id: this.ids,
        type: "fader",
        label: "S",
        min: 0,
        max: 1,
        step: 0.01,
        defval: 1,
        width: 35,
        height: 35,
        digits: 3,
      },
      [this.idr]: {
        id: this.idr,
        type: "fader",
        label: "R",
        min: 0,
        max: 1,
        step: 0.01,
        defval: 0.1,
        width: 35,
        height: 35,
        digits: 3,
      },
    }
  }

  componentDidMount() {
    this.toData()
  }

  toData() {
    let arr = [{ x: 0, y: 0 }];
    let sdur = 0.2;
    arr.push({ x: this.state[this.ida], y: 1 })
    arr.push({ x: this.state[this.ida] + this.state[this.idd], y: this.state[this.ids] })
    arr.push({ x: this.state[this.ida] + this.state[this.idd] + sdur, y: this.state[this.ids] })
    arr.push({ x: this.state[this.ida] + this.state[this.idd] + sdur + this.state[this.idr], y: 0 })
    console.log(arr)
    this.setState({ data: arr })
  }

  setValue(val) {
    Object.keys(val).forEach(key => {
      this.components[key].changeValue(val[key])
    })
  }

  onChange(id, val) {
    console.log("adsr on change", id, val)
    this.props.onChange(id, val)
    let obj = {}
    obj[id] = val
    this.setState(obj)
    this.toData()
  }

  handleClick() {
    this.props.onChange(this.props.def.id, (!this.state.on) ? 1 : 0)
    this.setState({ on: !this.state.on })
  }

  render() {
    const st = { width: "100%", padding: 0, marginTop: 0 };
    return (
      <Col xs="auto" className="patcol">
        <Row noGutters>
          <Col className="patlabel">
          <Button style={st} size="sm" variant={this.state.on ? "primary" : "secondary"}
                  onClick={this.handleClick.bind(this)}>
            {this.props.def.id}
          </Button>
          </Col>
        </Row>
        <Row noGutters style={{ flexWrap: "nowrap" }}>
          <Knob def={this.components[this.ida]} key={this.components[this.ida].id}
                onChange={this.onChange.bind(this)} />
          <Knob def={this.components[this.idd]} key={this.components[this.idd].id}
                onChange={this.onChange.bind(this)} />
          <Knob def={this.components[this.ids]} key={this.components[this.ids].id}
                onChange={this.onChange.bind(this)} />
          <Knob def={this.components[this.idr]} key={this.components[this.idr].id}
                onChange={this.onChange.bind(this)} />
        </Row>
        <Row noGutters>
          <LinePlot data={this.state.data} width={140} height={32} />
        </Row>
      </Col>
    )
  }

}

export default Adsr
