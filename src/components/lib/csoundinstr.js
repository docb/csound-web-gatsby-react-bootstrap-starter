import React from "react"
import {Button, Row, Col} from "react-bootstrap"
import Instrument from "./instrument.js"
import HFader from "./hfader"
import Select from "react-select"
import OSC from 'osc-js'
import {withPrefix} from "gatsby";

const noteMap = {
  KeyZ: 60,
  KeyS: 61,
  KeyX: 62,
  KeyD: 63,
  KeyC: 64,
  KeyV: 65,
  KeyG: 66,
  KeyB: 67,
  KeyH: 68,
  KeyN: 69,
  KeyJ: 70,
  KeyM: 71,
  Comma: 72,
  KeyL: 73,
  Period: 74,
  KeyQ: 72,
  Digit2: 73,
  KeyW: 74,
  Digit3: 75,
  KeyE: 76,
  KeyR: 77,
  Digit5: 78,
  KeyT: 79,
  Digit6: 80,
  KeyY: 81,
  Digit7: 82,
  KeyU: 83,
  KeyI: 84,
  Digit9: 85,
  KeyO: 86,
  Digit0: 87,
  KeyP: 88,
  BracketLeft: 89,
  Equal: 90,
  BracketRight: 91,
}

class CsoundInstr extends React.Component {
  constructor(props) {
    super(props)
    let t = {value: {name: "12edo"}, label: "12edo"}
    this.state = {
      csoundLoaded: "loading",
      csndstatus: "dbyellow",
      started: true,
      midi: false,
      velocity: 100,
      octave: 5,
      currentTuning: t,
      oscmsg: 'No OSC'
    }
    this.inst = props.inst
    this.instrument = React.createRef()
    this.options = props.tunings.map(tuning => {
      return {value: tuning, label: tuning.name}
    })
    this.options.unshift(t)
    this.root = React.createRef()
    this.midichannels = [{label: "All Channels", value: 0}];
    this.state.midichannel = this.midichannels[0];
    for (let k = 1; k <= 16; k++) {
      this.midichannels.push({label: 'Chn ' + k, value: k});
    }
    if (this.props.keyboard) {
      this.bc = new BroadcastChannel(this.props.keyboard);
      this.bc.onmessage = msg => {
        console.log(msg);
        if (msg.data.noteon) {
          this.noteOn(msg.data.noteon);
        }
        if (msg.data.noteoff) {
          this.noteOff(msg.data.noteoff);
        }
        if (msg.data.freqon) {
          this.freqOn(msg.data.freqon.freq,msg.data.freqon.vel);
        }
        if (msg.data.freqoff) {
          this.freqOff(msg.data.freqoff.freq);
        }
      }
    }
  }


  async componentDidMount() {
    const url = this.props.csoundwasm
    const {Csound} = await import(/* webpackIgnore: true */ url)
    this.csound = await Csound({
      withPlugins: this.props.plugins,
    })
    const csdresp = await fetch(this.props.csd)
    let buf = await csdresp.text()
    let csd = this.props.csd.substring(this.props.csd.lastIndexOf("/") + 1)
    this.csound.fs.writeFileSync(csd, buf)
    let result = await this.csound.compileCsd(csd)
    if (result) {
      this.setState({csoundLoaded: "compiling csd failed"})
    } else {
      await this.csound.start()
      this.setState({csoundLoaded: "running"})
      this.setState({csndstatus: "dbgreen"})
      this.props.onStart && this.props.onStart()
      this.audioContext = await this.csound.getAudioContext()
      let isStarted = this.audioContext.state === "running"
      this.setState({started: isStarted})
      if (navigator.requestMIDIAccess) {
        console.log("WebMIDI support - yes")
        navigator.requestMIDIAccess().then(this.webMidiInit.bind(this),
          this.webMidiErr.bind(this))
      } else {
        console.log("No WebMIDI support")
        this.setState({midierr: "No WebMIDI Support"})
      }
    }
    if (this.props.osc) {
      this.osc = new OSC();
      this.osc.open({
        host: "localhost",
        port: 47100
      });
      this.osc.on('error', () => this.setState({oscmsg: 'No OSC'}));
      this.osc.on('open', () => {
        this.setState({oscmsg: 'OSC Connected'});
      });

      this.osc.on('close', () => {
        this.setState({oscmsg: 'No OSC'})
      });
      this.osc.on('*', this.onOSC.bind(this));
    }
    this.instrument.current.setDefaultValues();
    this.root.current.focus();

  }

  webMidiInit(midi_handle) {
    let devicesAvailable = false
    let devs = midi_handle.inputs.values()
    this.devices = []
    for (let device = devs.next(); device && !device.done; device = devs.next()) {
      console.log(device)
      this.devices.push({value: device.value, label: device.value.name})
      devicesAvailable = true
    }
    if (!devicesAvailable) {
      console.log("No midi devices available")
      this.setState({midierr: "No devices found"})
    } else {
      console.log("WebMIDI support enabled")
      this.setState({midi: true})
      this.setState({currentDevice: this.devices[0]})
      this.devices[0].value.onmidimessage = this.onMidiEvent.bind(this)
    }
  }

  webMidiErr(err) {
    console.log(err);
    this.setState({midierr: "Error in WebMIDI"});
  }

  componentWillUnmount() {
    if (this.csound) {
      this.csound.stop()
      this.csound.destroy()
    }
  }

  getFreq(key) {
    let currentTuning = this.state.currentTuning.value
    let note = (key + currentTuning.basekey) % 12
    let octave = Math.floor((key + currentTuning.basekey) / 12)
    return currentTuning.basefreq * currentTuning.scale[note] * Math.pow(2, octave)
  }

  sendNoteEvent(key, vel, on) {
    let eventStr

    if (this.state.currentTuning.value.name === "12edo") {
      eventStr = `i "trig" 0 0.1 ${on} ${key} ${vel}`
    } else {
      eventStr = `i "freqtrig" 0 0.1 ${on} ${this.getFreq(key)} ${vel}`
    }
    console.log(eventStr)
    this.csound.readScore(eventStr)
  }

  async getChannel(chn) {
    if (this.csound) {
      return await this.csound.getControlChannel(chn)
    }
  }

  async getTable(fn) {
    if (this.csound) {
      return await this.csound.tableCopyOut(fn)
    }
  }

  async getTableLength(fn) {
    if (this.csound) {
      return await this.csound.tableLength("" + fn)
    }
  }

  onMidiEvent(event) {
    const chn = (event.data[0] & 0x0f) + 1;
    const chfilter = this.state.midichannel.value;
    if (chfilter && chn !== chfilter) return;
    switch (event.data[0] & 0xf0) {
      case 0x90:
        if (event.data[2] !== 0) {
          this.sendNoteEvent(event.data[1], event.data[2], 1)
        }
        break
      case 0x80:
        this.sendNoteEvent(event.data[1], event.data[2], 0)
        break
      case 0xB0:
        this.instrument.current.setCtrlValue(event.data[1], event.data[2])
        break
      default:
        return
    }
  }

  onOSC(message) {
    const pathSplit = message.address.split('/');
    if (pathSplit.length > 2) {
      if (pathSplit[1] === this.props.osc) {
        if (pathSplit[2] === 'note') {
          this.sendNoteEvent(message.args[1], message.args[2], message.args[0]);
        } else if (pathSplit[2] === 'notefreq') {
          const eventStr = `i "freqtrig" 0 0.1 ${message.args[0]} ${message.args[1]} ${message.args[2]}`
          this.csound.readScore(eventStr)
        } else {
          if (pathSplit.length > 3)
            this.instrument.current.setValues({[pathSplit[2]]: {[pathSplit[3]]: message.args[0]}});
          else
            this.instrument.current.setValues({[pathSplit[2]]: message.args[0]});
        }
      }
    }
  }

  handleStart() {
    if (!this.state.started) {
      this.audioContext.resume()
      this.setState({started: true})
    }
  }

  handleUpdate(id, val) {
    if (!this.csound) return
    if (val instanceof Object) {
      Object.keys(val).forEach(key => {
        this.handleUpdate(key, val[key])
      })
    } else if (val instanceof String || typeof val === "string") {
      this.csound.setStringChannel(id, val)
    } else {
      console.log("set ctrl", id, val)
      this.csound.setControlChannel(id, val)
    }
  }

  onKeyDown(event) {
    if (event.repeat) return
    const note = noteMap[event.nativeEvent.code]
    if (note) {
      this.sendNoteEvent(note - 60 + this.state.octave * 12, this.state.velocity, 1)
    }
  }

  onKeyUp(event) {
    if (event.repeat) return
    const note = noteMap[event.nativeEvent.code]
    if (note) {
      this.sendNoteEvent(note - 60 + this.state.octave * 12, this.state.velocity, 0)
    }
  }

  onVelChange(vel) {
    this.setState({velocity: vel})
  }

  onOctaveChange(oct) {
    this.setState({octave: oct})
  }

  handleSelect = (currentTuning) => {
    this.setState({currentTuning}, () =>
      console.log(`Option selected:`, this.state.currentTuning),
    )
  }

  handleMidiSelect = (device) => {
    console.log("selected: ", device.value.name)
    this.state.currentDevice.value.onmidimessage = undefined
    this.setState({currentDevice: device})
    device.value.onmidimessage = this.onMidiEvent.bind(this)
  }

  noteOn = (note) => {
    if (note) {
      this.sendNoteEvent(note - 60 + this.state.octave * 12, this.state.velocity, 1);
    }
  }
  noteOff = (note) => {
    if (note) {
      this.sendNoteEvent(note - 60 + this.state.octave * 12, this.state.velocity, 0);
    }
  }

  freqOn = (freq,vel) => {
    if(freq) {
      const eventStr = `i "freqtrig" 0 0.1 1 ${freq} ${vel}`;
      console.log(eventStr)
      this.csound.readScore(eventStr);
    }
  }

  freqOff = (freq) => {
    if(freq) {
      const eventStr = `i "freqtrig" 0 0.1 0 ${freq} 0`;
      console.log(eventStr)
      this.csound.readScore(eventStr);
    }
  }

  onChannelChange(chn) {
    this.setState({midichannel: chn});
  }

  onOpenKeyboard() {
    if(this.kw && !this.kw.closed) {
      this.kw.focus();
    } else {
      this.kw = window.open(withPrefix("/keyboard"), 'keyboardwindow',
      'left=800,top=20,width=800,height=800,toolbar=0,resizable=0')
    }
  }

  render() {
    const {options, devices, midichannels} = this
    return (
      <Row tabIndex={0} onKeyDown={this.onKeyDown.bind(this)} onKeyUp={this.onKeyUp.bind(this)}
           ref={ref => this.root.current = ref}>
        <Col>
          <Row style={{marginBottom: 5}}>
            <Col className={this.state.csndstatus}>Csound {this.state.csoundLoaded}</Col>
            <Col>
              {!this.state.started ?
                <Button onClick={this.handleStart.bind(this)}>audio context paused - click here</Button> :
                <div>audio enabled</div>
              }
            </Col>
            {this.state.midi ? (
              <>
                <Col>
                  <Select onChange={this.handleMidiSelect.bind(this)} options={devices} value={this.state.currentDevice}
                          isClearable={false} isSearchable={false} className="tunselect"/>
                </Col>
                <Col>
                  <Select onChange={this.onChannelChange.bind(this)} options={midichannels}
                          value={this.state.midichannel}
                          isClearable={false} isSearchable={false} className="tunselect"/>
                </Col>
              </>
            ) : <Col>{this.state.midierr}</Col>
            }
            {this.props.osc ? <Col>{this.state.oscmsg}</Col> : ""}
            <Col>
              <Select onChange={this.handleSelect} options={options} value={this.state.currentTuning}
                      isClearable={false} isSearchable={false} className="tunselect"/>
            </Col>
          </Row>
          <Row><Col>
            <Instrument osc={this.props.osc} inst={this.inst} onChange={this.handleUpdate.bind(this)}
                        ref={ref => this.instrument.current = ref}/>
          </Col></Row>
          <Row style={{marginBottom: 5}} noGutters="true" className="instfooter">
            <Col style={{margin: 'auto', textAlign: 'left'}} md='auto'>Computer keyboard settings:</Col>
            <Col style={{margin: 'auto', textAlign: 'right'}}>Vel:&nbsp;&nbsp;</Col>
            <Col><HFader onChange={this.onVelChange.bind(this)} defval={100} min={0} max={127}
                         vals={[0, 20, 40, 60, 80, 100, 120]} step={1}/></Col>
            <Col style={{margin: 'auto', textAlign: 'right'}}>Octave:&nbsp;&nbsp;</Col>
            <Col><HFader onChange={this.onOctaveChange.bind(this)} min={0} max={9} defval={5}
                         vals={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]} step={1}/></Col>
            {this.props.keyboard ? (
              <Col style={{margin: 'auto'}}>
                <Button onClick={this.onOpenKeyboard.bind(this)} variant="secondary">Open screen keyboard</Button>
              </Col>
            ) : ""
            }
          </Row>
        </Col>
      </Row>
    )

  }
}

export default CsoundInstr
