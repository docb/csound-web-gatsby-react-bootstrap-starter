import React from 'react';
import { Row, Col } from "react-bootstrap"
import Fader from './fader'
import Knob from './knob'
import Switch from './switch'
import NumberInput from './numberinput'
//import NToggle from './NToggle'
//import BitInput from './BitInput'
import XY from './xy'

class Panel extends React.Component {

  constructor(props) {
    super(props);
    this.state = { on: this.props.def.onVal }
  }

  handleClick() {
    this.props.def.onChange(this.props.def.on, (!this.state.on)?1:0);
    this.setState({ on: !this.state.on  });
  }

  componentDidMount() {
  }

  onChange(id,val) {
    this.props.onChange(id,val);
  }

  setValue(on) {
    this.setState( { on:on });
    this.props.def.onChange(this.props.def.on, on);
  }
  render() {
    const components = [];
    if(this.props.def.type === 'multifader') {
      let item = this.props.def;
      var path = item.osc;
      var id = item.id;
      for(var k=item.start;k<item.start+item.count;k++) {
        var itm = { 
          id : id+'-'+k,
          type : 'fader',
          osc : path+'/'+k,
          label : ''+k,
          min: item.min,
          max: item.max,
          step: item.step,
          defval: Array.isArray(item.defval)?item.defval[k-item.start]:item.defval
        }   
        components.push(
          <Fader def={itm} key={itm.id}/>
        )
      }   
    } else {
      this.props.def.widgets.forEach( (component) => {
        switch(component.type) {
          case 'panel' :
          case 'multifader':
            components.push(
              <Panel label={component.label} def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
          break;
          case 'fader':
            components.push(
              <Fader def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
          break;
          //case 'bitinput':
          //  components.push(
          //    <BitInput def={component} key={component.id}/>
          //  )
          //break;
          case 'knob':
            components.push(
              <MKnob vertical={this.props.def.vertical} def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
          break;
          //case 'ntoggle':
          //  components.push(
          //    <NToggle def={component} key={component.id}/>
          //  )
          //break;
          case 'select':
            components.push(
              <MSelect def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
          break;
          case 'spinner':
            components.push(
              <NumberInput vertical={this.props.def.vertical} def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
          break;
          case 'xy':
            components.push(
              <XY def={component} key={component.id} onChange={this.onChange.bind(this)}/>
            )
          break;
          default: 
            if(component.func) {
               let comp = component.func(this.onChange.bind(this));
               components.push(comp);
            }
          break;
        }
      });
    }
    let rcomp = components;
    if(this.props.def.vertical) {
      rcomp = (
        <Col>
        {components}
        </Col>
      )
    }
    let label = this.props.label;
    if(this.props.def.on) {
      label = (
      <button className={this.state.on?'onbtn btn btn-primary':'onbtn btn btn-secondary'} onClick={this.handleClick.bind(this)}>
        {this.props.label}
      </button>
      )
    }
    return (
      <Col className='patcol'>
        <Row noGutters='true' ><Col className="patlabel">{label}</Col></Row>
        <Row noGutters='true' style={{flexWrap: this.props.def.wrap?'wrap':'nowrap'}}>
          {rcomp}
        </Row>
      </Col>
    );
  }
}

export default Panel;
