import React from "react"
import { Row, Col } from "react-bootstrap"
import NumericInput from "react-numeric-input"
import Label from "./label"

class NumberInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.def.defval,
    }
    this.props.def.changeValue = this.setValue.bind(this)
  }

  componentDidMount() {
  }

  onChange = value => {
    if (isNaN(value)) return
    this.setState({ value })
    this.props.onChange(this.props.def.id, value)
  }

  setValue(value) {
    this.onChange(value)
  }

  render() {
    let ret = (
      <Col className="colnumberinput">
        <Row noGutters="true" className="justify-content-center dbyellow">
          <Col md="auto">
            <Label tooltip={this.props.def.tooltip} label={this.props.def.label}/>
          </Col>
        </Row>
        <Row noGutters="true" className="justify-content-center"><Col md="auto">
          <NumericInput strict={true} size={this.props.def.size} style={{ input: { textAlign: "center" } }}
                        value={this.state.value}
                        min={this.props.def.min} max={this.props.def.max} step={this.props.def.step}
                        onChange={this.onChange}
          />
        </Col>
        </Row>
      </Col>
    )
    if (this.props.vertical) {
      ret = (
        <Row noGutters="true">{ret}</Row>
      )
    }
    return ret
  }
}

export default NumberInput
