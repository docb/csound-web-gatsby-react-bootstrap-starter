import React from 'react'
import { Slider, Rail, Handles, Tracks } from 'react-compound-slider'
import { KeyboardHandle, SliderRail, Track } from './slidercomponents.js'
import { Row, Col } from "react-bootstrap"
import NumberFormat from 'react-number-format';

function preventDefault(e){
    e.preventDefault();
}

function disableScroll(){
    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}
function enableScroll(){
    document.body.removeEventListener('touchmove', preventDefault);
}

class Fader extends React.Component {
  constructor(props) {
    super(props);
    this.sliderStyle = {
          position: 'relative',
          width: 25,
          height: 256,
          left: 4,
          border: 0,
          touchAction: 'none'
    }
    if(this.props.def.step >=1) this.decimalScale = 0;
    else if(this.props.def.setp >= 0.1) this.decimalScale=1;
    else if(this.props.def.setp >= 0.01) this.decimalScale=2;
    else if(this.props.def.setp >= 0.001) this.decimalScale=3;
    if(this.props.def.log === true) {
      this.domain = [0, 1];
      this.factor = Math.log(this.props.def.max/this.props.def.min);
      console.log(this.factor);
      this.props.def.step=0.001;
    }
    else {
       this.domain = [this.props.def.min, this.props.def.max];
    }
    this.state = {
      values: [this.fromVal(this.props.def.defval)],
      updates: [this.fromVal(this.props.def.defval)]
    }
    if(this.props.def.height) this.sliderStyle.height = this.props.def.height;
    this.props.def.changeValue = this.setValue.bind(this);
  }

  fromVal(value) {
    if(this.props.def.log === true) {
      let ret = Math.log(value/this.props.def.min)/this.factor;
      return Math.round(ret*1000)/1000;
    }
    return value;
  }
  
  

  toVal(value) {
    if(this.props.def.log === true) {
      let ret = this.props.def.min * Math.exp(this.factor*value);
      return ret;
    }
    return value;
  }

  componentDidMount() {
  }

  onUpdate = updates => {
    this.setState({ updates })
    this.props.onChange(this.props.def.id, this.toVal(updates[0]));
  }

  onChange = values => {
    this.setState({ values })
  }
  onTextValueChange = vals => {
    this.setValue(vals.floatValue);
  }
  setValue = (value) => {
    let val = this.fromVal(value);
    console.log(val,this.state.values[0],this.state.updates[0]);
    this.props.onChange(this.props.def.id, val);
    if(val === Math.floor(this.state.values[0]*1000)/1000) return;
    let values = this.state.values.slice(0);
    values[0] = this.fromVal(value);
    this.setState({ values })
    let updates = this.state.updates.slice(0);
    updates[0] = this.fromVal(value);
    this.setState({ updates })
  }

  formatVal(val) {
    if(this.props.def.log === true) {
      if(val>6) return Math.floor(val);
      return Math.floor(val*1000)/1000;
    }
    return Math.floor(val*1000)/1000;
  }

  render() {
    const {
      state: { values, updates },
    } = this
    return (
      <Col className='colfader'>
      <Row noGutters='true' className="justify-content-center" ><Col className="dbyellow" md="auto">{this.props.def.label}</Col></Row>
      <Row noGutters='true' className="justify-content-center"><Col md="auto">
      <Slider
          rootStyle={this.sliderStyle}
          domain={this.domain} // [min, max]
          step={this.props.def.step}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          onSlideStart={disableScroll}
          onSlideEnd={enableScroll}
          values={values}
          vertical
          reversed
      >
        <Rail>
            {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
                {handles.map(handle => (
                  <KeyboardHandle
                    domain={this.domain}
                    key={handle.id}
                    handle={handle}
                    getHandleProps={getHandleProps}
                  />
                ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
            {tracks.map(({ id, source, target }) => (
              <Track
                key={id}
                source={source}
                target={target}
                getTrackProps={getTrackProps}
              />
            ))}
            </div>
          )}
        </Tracks>
      </Slider>
      </Col>
      </Row>
      <Row noGutters='true' className="justify-content-center"><Col md="auto"><NumberFormat onValueChange={this.onTextValueChange} value={this.formatVal(this.toVal(updates[0]))} style={{color:'white',backgroundColor:'black',textAlign:'center', margin:2, paddingTop: 0, paddingBottom:0, border:0 }} size={2} decimalScale={this.decimaelScale} fixedDecimalScale={true}/></Col></Row>
      </Col>
    )
  }
}

export default Fader;
