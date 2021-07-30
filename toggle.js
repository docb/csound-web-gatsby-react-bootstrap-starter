import React from "react"
import { Col } from "react-bootstrap"

class Toggle extends React.Component {
  constructor(props) {
    super(props)
    this.state = { on: 0 }
    this.props.def.changeValue = this.setValue.bind(this)
  }

  componentDidMount() {
  }

  setValue(val) {
    this.setState({on:val});
  }

  handleClick() {
    let prevState = this.state.on
    this.setState(
      { on: prevState ? 0 : 1 },
    )
    if (prevState)
      this.props.onChange(this.props.def.id,false)
    else
      this.props.onChange(this.props.def.id,true)
  }

  render() {

    return (
      <Col>
        <button className={this.state.on ? "onbtn btn btn-primary" : "onbtn btn btn-secondary"}
                onClick={this.handleClick.bind(this)}>
          {this.props.def.label}
        </button>
      </Col>
    )
  }
}

export default Toggle
