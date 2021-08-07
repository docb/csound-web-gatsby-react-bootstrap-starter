import React, {useRef, useState} from "react"
import {Row, Col, Button} from 'react-bootstrap'
import {Stage, Layer, Shape} from "react-konva"
import Alert from './alert'
import Toggle from './toggle';
import HFader from './hfader'

const Terpstra = (props) => {
  const size = 30
  const type = props.type;
  let scl;
  let description = "";
  switch (type) {
    case 1:
      scl = [[1, 1], [64, 63], [135, 128], [15, 14], [35, 32], [9, 8], [8, 7], [7, 6],
        [135, 112], [315, 256], [5, 4], [9, 7], [21, 16], [4, 3], [175, 128], [45, 32], [10, 7],
        [35, 24], [3, 2], [32, 21], [14, 9], [45, 28], [105, 64], [5, 3], [12, 7], [7, 4], [16, 9],
        [945, 512], [15, 8], [40, 21], [63, 32]];
      description = "Just Intonation 7-Limit scale by Adriaan Fokker"
      break;
    case 2:
      scl = [[1, 1], [64, 63], [49, 48], [28, 27], [21, 20], [16, 15], [12, 11], [11, 10], [10, 9], [9, 8],
        [8, 7], [7, 6], [81, 70], [32, 27], [6, 5], [11, 9], [49, 40], [5, 4], [14, 11], [9, 7],
        [35, 27], [21, 16], [4, 3], [27, 20], [49, 36], [11, 8], [7, 5], [10, 7], [36, 25], [16, 11],
        [40, 27], [3, 2], [32, 21], [49, 32], [14, 9], [11, 7], [8, 5], [13, 8], [105, 64], [5, 3],
        [27, 16], [12, 7], [125, 72], [7, 4], [16, 9], [9, 5], [20, 11], [11, 6], [15, 8], [40, 21],
        [21, 11], [27, 14], [63, 32]];
      break;
    case 3:
      scl = [[1, 1], [21, 20], [10, 9], [7, 6], [5, 4], [21, 16], [7, 5], [3, 2], [25, 16], [5, 3], [7, 4], [15, 8]];
      description = "blue";
      break;
    default:
      scl = [];
  }

  const [onoff, setOnOff] = useState({});
  const [baseFreq, setBaseFreq] = useState(27.5)
  const [velocity, setVelocity] = useState(80)
  const [mode, setMode] = useState(false)
  const [scale, setScale] = useState(scl);
  const [desc, setDesc] = useState(description)
  const [alert, setAlert] = useState(false);
  const [alertDesc, setAlertDesc] = useState("");
  const onModeChange = (id, on) => {
    setMode(on);
  }
  const setOn = (id, on) => {
    setOnOff(prevState => ({...prevState, [id]: on}));
  }

  const mousedown = (e, id, note, oct) => {
    if (mode) {
      if (!onoff[id]) {
        props.noteOn(note + 48 + oct * 12);
        setOn(id, true);
      } else {
        setOn(id, false);
        props.noteOff(note + 48 + oct * 12);
      }
    } else {
      setOn(id, true);
      props.noteOn(note + 48 + oct * 12);
    }
  }
  const sqrt32 = Math.sqrt(3) / 2;
  const getFreq = (a, b, oct) => baseFreq * (a / b) * (1 << oct);

  const mousedownJT = (e, id, note, oct) => {
    if (mode) {
      if (!onoff[id]) {
        props.freqOn({freq: getFreq(note[0], note[1], oct), vel: velocity});
        setOn(id, true);
      } else {
        setOn(id, false);
        props.freqOff({freq: getFreq(note[0], note[1], oct)});
      }
    } else {
      setOn(id, true);
      props.freqOn({freq: getFreq(note[0], note[1], oct), vel: velocity});
    }
  }
  const createKeys = (jt) => {
    let keys = {};
    const labels = ["C", "Db/C#", "D", "Eb/D#", "E", "F", "Gb/F#", "G", "Ab/G#", "A", "Bb/A#", "B"];
    let currentNr = 0;
    let touchedColor = "blue";
    for (let x = 1; x <= 40; x++) {
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
          posY = sqrt32 * y * size * 2;
        } else {
          posY = sqrt32 * (y * size * 2 - size);
        }
        let oct = Math.floor(ynr / 12);
        let id = "id-" + x + "-" + y;
        keys[id] = {
          id: id,
          x: posX,
          y: posY,
          size: size,
          note: note,
          oct: oct,
          label: jt ? scale[note][0] + '/' + scale[note][1] + "-" + oct : labels[note] + "-" + oct,
          offColor: untouchedColor,
          mousedown: e => jt ? mousedownJT(e, id, scale[note], oct) : mousedown(e, id, note, oct),
          mouseup: () => {
            if (!mode) {
              setOn(id, false);
              jt ? props.freqOff({freq: getFreq(scale[note][0], scale[note][1], oct)}) :
                props.noteOff(note + 48 + oct * 12);
            }
          },
          touchstart: e => {
            e.evt.preventDefault();
            jt ? mousedownJT(e, id, scale[note], oct) : mousedown(e, id, note, oct)
          },
          touchend: e => {
            e.evt.preventDefault();
            if (!mode) {
              setOn(id, false);
              jt ? props.freqOff({freq: getFreq(scale[note][0], scale[note][1], oct)}) :
                props.noteOff(note + 48 + oct * 12);
            }
          },
        }
        ynr += 1;
      }
      if (x % 2 === 0) currentNr += 3; else currentNr += 2;
    }
    return keys;
  }
  const colorNames = ['white', '#00AA44', '#aabb00', '#aaa', '#afa']
  const colorMap = [0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 1, 4, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 2, 4, 1, 3, 0, 1, 4];
  const createKeys31 = () => {
    let keys = {};
    let currentNr = 0;
    let touchedColor = "blue";
    for (let x = 1; x <= 40; x++) {
      let ynr = currentNr;
      for (let y = 15; y > 0; y--) {
        let note = ynr % 31;
        let untouchedColor = colorNames[colorMap[note]];
        let posX = x * (size * 1.5);
        let posY;
        if (x % 2 === 0) {
          posY = sqrt32 * y * size * 2;
        } else {
          posY = sqrt32 * (y * size * 2 - size);
        }
        let oct = Math.floor(ynr / 31);
        let id = "id-" + x + "-" + y;
        keys[id] = {
          id: id, x: posX, y: posY, size: size, note: note, oct:oct,
          label: scale[note][0] + '/' + scale[note][1] + "-" + oct, offColor: untouchedColor,
          mousedown: e => mousedownJT(e, id, scale[note], oct),
          mouseup: () => {
            if (!mode) {
              setOn(id, false);
              props.freqOff({freq: getFreq(scale[note][0], scale[note][1], oct)});
            }
          },
          touchstart: e => {
            e.evt.preventDefault();
            mousedownJT(e, id, scale[note], oct);
          },
          touchend: e => {
            e.evt.preventDefault();
            if (!mode) {
              setOn(id, false);
              props.freqOff({freq: getFreq(scale[note][0], scale[note][1], oct)});
            }
          },
        }
        ynr += 2;
      }
      if (x % 2 === 0) currentNr += 5; else currentNr += 3;
    }
    return keys;
  }

  const HSVtoRGB = (h, s, v) => {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }
  const createKeys53 = () => {
    let keys = {};
    let currentNr = 0;
    let touchedColor = "blue";
    let rgbs = [];
    for (let k = 0; k < 53; k++) {
      rgbs[k] = HSVtoRGB(scale[k][0] / scale[k][1] - 1, 0.5, 1);
    }
    for (let x = 1; x <= 40; x++) {
      let ynr = currentNr;
      for (let y = 15; y > 0; y--) {
        let note = ynr % 53;

        let rgb = rgbs[note];
        let untouchedColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        let posX = x * (size * 1.5);
        let posY;
        if (x % 2 === 0) {
          posY = sqrt32 * y * size * 2;
        } else {
          posY = sqrt32 * (y * size * 2 - size);
        }
        let oct = Math.floor(ynr / 53);
        let id = "id-" + x + "-" + y;
        keys[id] = {
          id: id, x: posX, y: posY, size: size, note: note, oct:oct,
          label: scale[note][0] + '/' + scale[note][1] + "-" + oct, offColor: untouchedColor,
          mousedown: e => mousedownJT(e, id, scale[note], oct),
          mouseup: () => {
            if (!mode) {
              setOn(id, false);
              props.freqOff({freq: getFreq(scale[note][0], scale[note][1], oct)});
            }
          },
          touchstart: e => {
            e.evt.preventDefault();
            mousedownJT(e, id, scale[note], oct);
          },
          touchend: e => {
            e.evt.preventDefault();
            if (!mode) {
              setOn(id, false);
              props.freqOff({freq: getFreq(scale[note][0], scale[note][1], oct)});
            }
          },
        }
        ynr += 5;
      }
      if (x % 2 === 0) currentNr += 9; else currentNr += 4;
    }
    return keys;
  }

  const createShape = (id, size, x, y, label, color, md, mu, ts, te) => {
    return (
      <Shape
        id={id}
        key={id}
        sceneFunc={(context, shape) => {
          const textWidth = context.measureText(label).width;

          context.beginPath()
          context.moveTo(-size, 0)
          context.lineTo(-size / 2, size * sqrt32)
          context.lineTo(size / 2, size * sqrt32)
          context.lineTo(size, 0)
          context.lineTo(size / 2, -size * sqrt32)
          context.lineTo(-size / 2, -size * sqrt32)
          context.closePath()
          context.fillStrokeShape(shape)
          context.fillStyle = "black"
          context.fillText(label, -textWidth / 2, 5)
        }}
        hitFunc={(context, shape) => {
          context.beginPath();
          context.rect(-size / 2 - size / 4, -size * sqrt32, size + size / 2, size * sqrt32 * 2);
          context.closePath();
          context.fillStrokeShape(shape);
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
  let keys;
  switch (type) {
    case 0:
      keys = createKeys(false);
      break;
    case 1:
      keys = createKeys31();
      break;
    case 2:
      keys = createKeys53();
      break;
    case 3:
      keys = createKeys(true);
      break;
  }
  const shapes = Object.values(keys).map(key => {
    return createShape(key.id, size, key.x, key.y,
      key.label, onoff[key.id] ? "blue" : key.offColor,
      key.mousedown, key.mouseup,
      key.touchstart, key.touchend)
  })

  const allOff = () => {
    const tmp = {}
    Object.values(keys).forEach( key =>{
      if(onoff[key.id]) {
        console.log(key);
        if(type>0) {
          props.freqOff({freq: getFreq(scale[key.note][0], scale[key.note][1], key.oct)});
        } else {
          props.noteOff(key.note + 48 + key.oct * 12);
        }
        tmp[key.id] = false;
      }
    })
    setOnOff(prevState => ({...prevState,...tmp}));
  }

  const dofileUpload = useRef();

  const onOpen = (event) => {
    event.preventDefault()
    dofileUpload.current.click()
  }
  const upload = (evt) => {
    const fileObj = evt.target.files[0]
    const reader = new FileReader()

    reader.onload = e => {
      const fileContents = e.target.result
      const lines = fileContents.split("\n").map(line => line.trim())
      console.log(lines);
      let k = 0;
      let dsc = '';
      let count = -1;
      let scl = [[1, 1]];
      lines.forEach(line => {
        if (!line.startsWith('!')) {
          switch (k) {
            case 0:
              dsc = line;
              break;
            case 1:
              count = parseInt(line);
              break;
            default:
              if (line.indexOf('/') >= 1) {
                let arr = line.split('/');
                if (k - 1 < count)
                  scl.push(arr.map(c => parseInt(c)));
              }
          }
          k++;
        }
      });
      console.log(dsc);
      console.log(count);
      console.log(scl);
      if ((type === 1 && count === 31 && scl.length === 31) || (type === 2 && count === 53 && scl.length === 53) || (type === 3 && count === 12 && scl.length === 12)) {
        setScale(scl);
        setDesc(dsc);
      } else {
        setAlertDesc("could not parse scl, ensure that the count matches the keyboard. cents are not supported");
        setAlert(true);
      }
    }
    reader.readAsText(fileObj)
  }
  const onVelChange = (vel) => {
    setVelocity(vel);
  }

  return (
    <>
      <Row style={{backgroundColor: '#253040'}}>
        <Col style={{margin: 'auto'}} xs="auto"><Toggle onChange={onModeChange}
                                                        def={{id: 'hold', label: 'hold'}}/></Col>
        {type > 0 ? (
          <>
            <Col style={{margin: 'auto', textAlign: 'right'}} xs={"auto"}>Velocity:</Col>
            <Col xs={"auto"}>
              <HFader onChange={onVelChange} defval={100} min={0} max={127}
                      vals={[0, 20, 40, 60, 80, 100, 120]} step={1}/>
            </Col>
            <Col style={{margin: 'auto'}} xs="auto">
              <input type="file"
                     style={{display: "none"}}
                     multiple={false}
                     accept=".scl"
                     onChange={evt => upload(evt)}
                     ref={e => dofileUpload.current = e}/>
              <Button size="sm" variant="secondary" onClick={onOpen}>Open SCL</Button>
            </Col>

          </>
        ) : ""}
        <Col style={{margin: 'auto'}} xs="auto">
          <Button size="sm" variant="secondary" onClick={allOff}>All Off</Button>
        </Col>
        <Col style={{margin: 'auto', textAlign: 'left'}} xs="auto">{desc}</Col>
      </Row>
      <Row>
        <Col>
          <Stage x={0} y={0} width={1900} height={1200}>
            <Layer>
              {shapes}
            </Layer>
          </Stage>
        </Col>
      </Row>
      <Alert show={alert} desc={alertDesc} onClose={() => setAlert(false)}/>
    </>
  )
}

export default Terpstra
