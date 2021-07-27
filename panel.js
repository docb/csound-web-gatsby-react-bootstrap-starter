import React from "react"
import { Button, Row, Col } from "react-bootstrap"
import Fader from "./fader"
import Knob from "./knob"
import Switch from "./switch"
import TabPanel from "./tabpanel"
import NumberInput from "./numberinput"
import Toggle from "./toggle"
import Adsr from "./adsr"
import XY from "./xy"

class Panel extends React.Component {

  constructor(props) {
    super(props)
    this.state = { on: false }
    this.props.def.changeValue = this.setValue.bind(this)
  }

  handleClick() {
    this.props.onChange(this.props.def.id, (!this.state.on) ? 1 : 0)
    this.setState({ on: !this.state.on })
  }

  componentDidMount() {
  }

  onChange(id, val) {
    this.props.onChange(id, val)
  }

  setValue(on) {
    this.setState({ on: on })
    this.props.onChange(this.props.def.id, on)
  }

  render() {
    const components = []
    if (this.props.def.type === "multifader") {
      let item = this.props.def
      var path = item.osc
      var id = item.id
      for (var k = item.start; k < item.start + item.count; k++) {
        var itm = {
          id: id + "-" + k,
          type: "fader",
          osc: path + "/" + k,
          label: "" + k,
          min: item.min,
          max: item.max,
          step: item.step,
          defval: Array.isArray(item.defval) ? item.defval[k - item.start] : item.defval,
        }
        components.push(
          <Fader def={itm} key={itm.id} />,
        )
      }
    } else {
      this.props.def.widgets.forEach((component) => {
        switch (component.type) {
          case "panel" :
          case "multifader":
            components.push(
              <Panel label={component.label} def={component} key={component.id} onChange={this.onChange.bind(this)} />,
            )
            break
          case "tabpanel" :
            components.push(
              <TabPanel label={component.label} def={component} key={component.id}
                        onChange={this.onChange.bind(this)} />,
            )
            break
          case "fader":
            components.push(
              <Fader def={component} key={component.id} onChange={this.onChange.bind(this)} />,
            )
            break
          case "knob":
            components.push(
              <Knob vertical={this.props.def.vertical} def={component} key={component.id}
                    onChange={this.onChange.bind(this)} />,
            )
            break
          case "toggle":
            components.push(
              <Toggle def={component} key={component.id} />,
            )
            break
          case "select":
            components.push(
              <Switch def={component} key={component.id} onChange={this.onChange.bind(this)}
                      vertical={component.vertical} />,
            )
            break
          case "spinner":
            components.push(
              <NumberInput vertical={this.props.def.vertical} def={component} key={component.id}
                           onChange={this.onChange.bind(this)} />,
            )
            break
          case "xy":
            components.push(
              <XY def={component} key={component.id} onChange={this.onChange.bind(this)} />,
            )
            break
          case "adsr":
            components.push(
              <Adsr def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
            break;
          default:
            if (component.func) {
              let comp = component.func(component, this.onChange.bind(this))
              components.push(comp)
            }
            break
        }
      })
    }
    let rcomp = components
    if (this.props.def.vertical) {
      rcomp = (
        <Col className={"test"}>
          {components.map(c => (
              <Row noGutters>{c}</Row>
          )
          )}
        </Col>
      )
    }
    let label = this.props.label
    const st = { width: "100%", padding: 0, marginTop: 0 }
    if (this.props.def.on) {
      label = (
        <Button style={st} size="sm" variant={this.state.on ? "primary" : "secondary"}
                onClick={this.handleClick.bind(this)}>
          {this.props.label}
        </Button>
      )
    }
    if (this.props.label) {
      return (
        <Col className="patcol">
          <Row noGutters="true"><Col className="patlabel">{label}</Col></Row>
          <Row noGutters="true" style={{ flexWrap: this.props.def.wrap ? "wrap" : "nowrap" }}>
            {rcomp}
          </Row>
        </Col>
      )
    } else {
      return (
        <Col className="patcol" md={"auto"}>
          <Row noGutters="true" style={{ flexWrap: this.props.def.wrap ? "wrap" : "nowrap" }}>
            {rcomp}
          </Row>
        </Col>
      )
    }
  }
}

export default Panel
