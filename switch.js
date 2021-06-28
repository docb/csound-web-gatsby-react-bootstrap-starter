import React from 'react'
import { Row, Col, ToggleButton, ToggleButtonGroup } from "react-bootstrap"

class Switch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.def.defval,
    }
    this.props.def.changeValue = this.setValue.bind(this);
  }

  componentDidMount() {
  }

  handleChange = (newValue) => {
    this.setState({value: newValue});
    this.props.onChange(this.props.def.id, newValue);
  };

  setValue(value) {
    this.handleChange(value);
  }

  render() {
    let items = this.props.def.items.map( item =>
      //<Row key={item.name}>
      <ToggleButton className='fselect' value={item.value} key={item.name}>{item.name}</ToggleButton>
      //</Row>
    );
    let ret = (
      <Col className='colselect'>
      <Row noGutters='true' className="justify-content-center"><Col className="dbyellow" md="auto">{this.props.def.label}</Col> </Row>
      <Row noGutters='true' className="justify-content-center"><Col md="auto">
      <ToggleButtonGroup vertical={this.props.vertical} size="sm" className='selectbtngroup'  name={'select-'+this.props.def.label} type="radio" value={this.state.value} onChange={this.handleChange.bind(this)}>
      {items}
      </ToggleButtonGroup>
      </Col>
      </Row>
      </Col>
    )
    if(this.props.vertical) {
      ret = (
        <Row>{ret}</Row>
      )
    }
    return ret;
  }
}

export default Switch;
