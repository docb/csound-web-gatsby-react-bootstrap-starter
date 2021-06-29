import React from 'react'
import { Button, Row, Col } from 'react-bootstrap'
import Instrument from './instrument.js'
import HFader from './hfader'
import Select from 'react-select'

const noteMap = {KeyZ:60,KeyS:61,KeyX:62,KeyD:63,KeyC:64,KeyV:65,KeyG:66,KeyB:67,KeyH:68,KeyN:69,KeyJ:70,KeyM:71,Comma:72,KeyL:73,Period:74,KeyQ:72,Digit2:73,KeyW:74,Digit3:75,KeyE:76,KeyR:77,Digit5:78,KeyT:79,Digit6:80,KeyY:81,Digit7:82,KeyU:83,KeyI:84,Digit9:85,KeyO:86,Digit0:87,KeyP:88,BracketLeft:89,Equal:90,BracketRight:91};

class CsoundInstr extends React.Component {
  constructor(props) {
      super(props);
      let t = { value: { name:'12edo' } , label: '12edo' }; 
      this.state={csoundLoaded:"loading",csndstatus:'dbyellow',started: true, midi: false, velocity:100, octave: 5,currentTuning:t};
      this.inst = props.inst;
      this.csd = props.csd;
      this.options = props.tunings.map(tuning => { return { value: tuning, label: tuning.name}});
      this.options.unshift(t);
  }

  async componentDidMount() {
      const url = this.props.csoundwasm;
      const { Csound } = await import(/* webpackIgnore: true */ url);
      this.csound = await Csound({
        withPlugins: [this.props.plugins]
      });
      const csdresp = await fetch(this.props.csd);
      let buf = await csdresp.text();
      this.csound.fs.writeFileSync(this.props.csd, buf);
      let result = await this.csound.compileCsd(this.csd);
      console.log(result);
      this.csound.start();
      this.setState({csoundLoaded:"running"});
      this.setState({csndstatus:"dbgreen"});
      this.audioContext = await this.csound.getAudioContext();
      let isStarted = this.audioContext.state === "running";
      this.setState({started:isStarted});
      if (navigator.requestMIDIAccess) {
         console.log("WebMIDI support - yes");
         navigator.requestMIDIAccess().then(this.webMidiInit.bind(this),
         this.webMidiErr.bind(this));
      } else {
         console.log("No WebMIDI support");
      }
  }

  webMidiInit(midi_handle) {
    let devicesAvailable = false;
    let devs = midi_handle.inputs.values();
    for ( let device = devs.next(); device && !device.done; device = devs.next()) {
      device.value.onmidimessage = this.onMidiEvent.bind(this);
      devicesAvailable = true;
    }
    if (!devicesAvailable)
      console.log("No midi devices available");
    else {
      console.log("WebMIDI support enabled");
      this.setState({midi:true});
    }
  }
  webMidiErr(err) {
      console.log("Error starting WebMIDI");
  }

  getFreq(key) {
     let currentTuning = this.state.currentTuning.value;
     let note = (key + currentTuning.basekey) % 12;
     let octave = Math.floor((key + currentTuning.basekey) / 12);
     console.log(note,octave,currentTuning.scale[note]);
     return currentTuning.basefreq * currentTuning.scale[note]* Math.pow(2,octave);
  }

  sendNoteEvent(key,vel,on) {
     let eventStr;
     
     if(this.state.currentTuning.value.name==='12edo') {
        eventStr = `i "trig" 0 0.1 ${on} ${key} ${vel}`;
     } else {
        eventStr = `i "freqtrig" 0 0.1 ${on} ${this.getFreq(key)} ${vel}`;
     }
     console.log(eventStr);
     this.csound.readScore(eventStr);
   }

  onMidiEvent(event) {
      switch (event.data[0] & 0xf0) {
        case 0x90:
          if (event.data[2]!==0) {
            this.sendNoteEvent(event.data[1],event.data[2],1);
          }
          break;
        case 0x80:
          this.sendNoteEvent(event.data[1],event.data[2],0);
          break;
        default: return;
      }
  }

  handleStart() {
       if(!this.state.started) {
          this.audioContext.resume();
          this.setState({started:true});
       }
  }

  handleUpdate(id,val) {
    console.log(id,val);
    this.csound && this.csound.setControlChannel(id,val);
  }

  onKeyDown(event) {
     if(event.repeat) return;
     const note = noteMap[event.nativeEvent.code]
     console.log("keydown",event.nativeEvent.code,note);
     if(note) {
        this.sendNoteEvent(note-60 + this.state.octave*12,this.state.velocity,1);
     }
  }
  onKeyUp(event) {
     if(event.repeat) return;
     const note = noteMap[event.nativeEvent.code]
     console.log("keyup",event.nativeEvent.code,note);
     if(note) {
        this.sendNoteEvent(note-60 + this.state.octave*12,this.state.velocity,0);
     }
  }
  onVelChange(vel) {
    this.setState({ velocity: vel });
  }

  onOctaveChange(oct) {
    this.setState({ octave: oct });
  }
  handleSelect = (currentTuning) => {
    this.setState({ currentTuning }, () =>
      console.log(`Option selected:`, this.state.currentTuning)
    );
  };
  render() {
    const {options} = this;
    return (
      <Row tabIndex={0} onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)}>
        <Col>
          <Row>
             <Col className={this.state.csndstatus}>Csound {this.state.csoundLoaded}</Col>
             <Col>
                 { !this.state.started ?
                 <Button onClick={this.handleStart.bind(this)}>audio context paused - click here</Button>:
                 <div>audio enabled</div>
                 }
            </Col>
            <Col> { this.state.midi ?
                <div>midi enabled</div>:
                <div>midi not available</div>
                }
            </Col>
            <Col>
              <Select onChange={this.handleSelect} options={options} value={this.state.currentTuning} isClearable={false} isSearchable={false} className='tunselect'/> 
            </Col>
         </Row> 
         <Row><Col>
         <Instrument inst={this.inst} onChange={this.handleUpdate.bind(this)}/>
         </Col></Row>
         <Row noGutters='true' className='instfooter'>
            <Col>Computer keyboard settings:</Col>
            <Col style={{ margin:'auto', textAlign: 'right' }}>Vel:&nbsp;&nbsp;</Col>
            <Col><HFader onChange={this.onVelChange.bind(this)} defval={100} min={0} max={127} vals={[0,20,40,60,80,100,120]} step={1}/></Col>
            <Col style={{ margin:'auto', textAlign: 'right' }}>Octave:&nbsp;&nbsp;</Col>
            <Col><HFader onChange={this.onOctaveChange.bind(this)} min={0} max={9} defval={5} vals={[0,1,2,3,4,5,6,7,8,9]} step={1}/></Col>
         </Row>

      </Col>
    </Row>
    );

  }
}

export default CsoundInstr
