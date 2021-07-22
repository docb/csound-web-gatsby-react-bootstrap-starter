import React from "react";
import { Row, Col, Button } from 'react-bootstrap'
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.def.defval };
    this.props.def.changeValue = this.setValue.bind(this);
  }

  handleInput = event => {
    this.setState({ value: event.target.value });  
  }

  applyChange = () => {
     this.props.onChange(this.props.def.id,this.state.value);
  }
  
  checkInput = e => {
      let key = e.keyCode || e.which; 
      if ((key > 57) && (!e.ctrlKey)) { 
        if (e.preventDefault) e.preventDefault();
        e.returnValue = false;
      }
  }

  setValue(value) {
    this.props.onChange(this.props.def.id,value);
    this.setState({value:value});
  }

  render() {
    return (
      <Row style={{ flexWrap:'nowrap'}}>
        <Col>
          <Row>
            <Col>{this.props.def.label}</Col>
          </Row>
          <Row>
            <Col><Button size="sm" onClick={this.applyChange}>apply</Button></Col>
          </Row>
        </Col>
        <Col><textarea onKeyPress={this.checkInput} onChange={this.handleInput} value={this.state.value} style={{ width:this.props.def.width }}/></Col>
      </Row>
    );
  }
}

export default Input
