import React from "react"
import BasicKnob from "./basicknob"
import { Row, Col } from "react-bootstrap"

class Knob extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.def.defval,
    }
    this.props.def.changeValue = this.setValue.bind(this)
  }

  componentDidMount() {
  }

  handleChange = (newValue) => {
    if (Math.abs(newValue - this.state.value) > this.props.def.max / 5) return
    this.setState({ value: newValue })
    this.props.onChange(this.props.def.id, newValue)
  }

  setValue(value) {
    this.setState({ value: value })
    this.props.onChange(this.props.def.id, value)
  }

  render() {

    let ret = (
      <Col className="colknob">
        <Row noGutters="true" className="justify-content-center">
          <Col className="dbyellow" xs="auto">{this.props.def.label}</Col>
        </Row>
        <Row noGutters="true" className="justify-content-center">
          <Col xs="auto">
            <BasicKnob digits={this.props.def.digits} min={this.props.def.min} max={this.props.def.max}
                       step={this.props.def.step} inputColor="#FFFFFF" fgColor="#0077FF"
                       width={this.props.def.width || 50} height={this.props.def.height || 50} angleOffset={210}
                       angleArc={300} value={this.state.value} onChange={this.handleChange} />
          </Col>
        </Row>
      </Col>
    )
    if (this.props.vertical) {
      ret = (
        <Row>{ret}</Row>
      )
    }
    return ret
  }
}

export default Knob
