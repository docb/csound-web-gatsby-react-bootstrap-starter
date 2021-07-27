import React from "react"
import { Stage, Layer, Shape } from "react-konva"

class Tepstra extends React.Component {
  constructor(props) {
    super(props)
    this.size = props.def.size;
    this.state = { onoff: {}, mode: 0 };
    this.createKeys();

  }

  setMode(mode) {
    console.log("setMode", mode);
    this.setState({ mode: mode });
  }

  createKeys = () => {
    let keys = this.keys = {};
    let onoff = this.state.onoff;
    let self = this;
    const labels = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    let currentNr = 0;
    let size = this.size;
    let touchedColor = "blue";
    for (let x = 1; x <= 20; x++) {
      let ynr = currentNr;
      for (let y = 10; y > 0; y--) {
        let note = ynr % 12;
        let untouchedColor;
        switch (note) {
          case 0:
          case 2:
          case 4:
          case 5:
          case 7:
          case 9:
          case 11:
            untouchedColor = "white";
            break
          default:
            untouchedColor = "gray";
        }
        let posX = x * (size * 1.5);
        let posY;
        if (x % 2 === 0) {
          posY = (Math.sqrt(3) / 2) * y * size * 2;
        } else {
          posY = (Math.sqrt(3) / 2) * (y * size * 2 - size);
        }
        let oct = Math.floor(ynr / 12);
        let id = "id-" + x + "-" + y;
        keys[id] = {
          id:id, x: posX, y: posY, size: size, note: currentNr,
          label: labels[note] + "-" + oct, offColor: untouchedColor,
          mousedown: function(e) {
            if (self.state.mode) {
              if (!self.state.onoff[id]) {
                const onoff = { ...self.state.onoff, [id]: true };
                self.setState(() => ({ onoff }));
                self.props.noteOn(note + 48 + oct * 12);
              } else {
                const onoff = { ...self.state.onoff, [id]: false };
                self.setState(() => ({ onoff }));
                self.props.noteOff(note + 48 + oct * 12);
              }
            } else {
              const onoff = { ...self.state.onoff, [id]: true };
              self.setState(() => ({ onoff }));
              self.props.noteOn(note + 48 + oct * 12);
            }
          },
          mouseup: function(e) {
            if (!self.state.mode) {
              const onoff = { ...self.state.onoff, [id]: false };
              self.setState(() => ({ onoff }));
              self.props.noteOff(note + 48 + oct * 12);
            }
          },
          touchstart: function(e) {
            e.evt.preventDefault();
            console.log(e.evt);
            if (self.state.mode) {
              if (!self.state.onoff[id]) {
                const onoff = { ...self.state.onoff, [id]: true };
                self.setState(() => ({ onoff }));
                self.props.noteOn(note + 48 + oct * 12);
              } else {
                const onoff = { ...self.state.onoff, [id]: false };
                self.setState(() => ({ onoff }));
                self.props.noteOff(note + 48 + oct * 12);
              }
            } else {
              const onoff = { ...self.state.onoff, [id]: true };
              self.setState(() => ({ onoff }));
              self.props.noteOn(note + 48 + oct * 12);
            }
          },
          touchend: function(e) {
            e.evt.preventDefault();
            if (!self.state.mode) {
              const onoff = { ...self.state.onoff, [id]: false };
              self.setState(() => ({ onoff }));
              self.props.noteOff(note + 48 + oct * 12);
            }
          },
        }
        onoff[id] = false;
        ynr += 1;
      }
      if (x % 2 === 0) currentNr += 3; else currentNr += 2;
    }
  }

  createShape = (id, size, x, y, label, color, md, mu, ts, te) => {
    return (
      <Shape
        id={id}
        key={id}
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.moveTo(-size, 0)
          context.lineTo(-size / 2, size * Math.sqrt(3) / 2)
          context.lineTo(size / 2, size * Math.sqrt(3) / 2)
          context.lineTo(size, 0)
          context.lineTo(size / 2, -size * Math.sqrt(3) / 2)
          context.lineTo(-size / 2, -size * Math.sqrt(3) / 2)
          context.closePath()
          context.fillStrokeShape(shape)
          context.fillStyle = "black"
          context.fillText(label, -size / 4, 5)
        }}
        fill={color}
        stroke="black"
        strokeWidth={4}
        onMouseDown={md}
        onMouseUp={mu}
        onTouchStart={ts}
        onTouchEnd={te}
        x={x}
        y={y}
      />
    )
  }

  render() {
    return (
      <Stage x={-20} y={-20} width={900} height={550}>
        <Layer>
          {Object.keys(this.keys).map(key =>
            this.createShape(key, this.size, this.keys[key].x, this.keys[key].y,
              this.keys[key].label, this.state.onoff[key] ? "blue" : this.keys[key].offColor,
              this.keys[key].mousedown, this.keys[key].mouseup,
              this.keys[key].touchstart, this.keys[key].touchend))
          }
        </Layer>
      </Stage>
    )
  }
}

export default Tepstra
