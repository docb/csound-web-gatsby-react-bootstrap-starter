import React from 'react';
import { Row,Col,Button } from "react-bootstrap"
import Panel from "./panel"
class Instrument extends React.Component {

  constructor(props) {
    super(props);
    this.data = props.inst;
    this.components = {};
    this.values = {};
  }

  extractComponents(current) {
     if(current.type === 'panel' || current.type === 'multifader') {
        current.widgets.forEach(item => this.extractComponents(item));
     } else {
        this.components[current.id] = current;
     }
  }

  componentDidMount() {
      this.data.components.forEach( component => this.extractComponents(component) );
      console.log(this.components);
  }
  
  handleChange(id,val) {
    this.props.onChange(id,val);
    this.values[id] = val;
  }

  getValues() {
    return this.values;
  }

  setValues(values) {
    console.log("set values",values);
    Object.keys(values).forEach( key => {
       console.log(key,this.components[key]);
       this.components[key] && this.components[key].changeValue(values[key]);
    });
  } 

  setDefaultValues() {
    Object.keys(this.components).forEach(key => this.components[key].changeValue(this.components[key].defval));
  } 

  async download() {
    const myData = this.getValues();
    const fileName = "file";
    const json = JSON.stringify(myData);
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  upload(evt) {
      const fileObj = evt.target.files[0];
      const reader = new FileReader();
          
      let fileloaded = e => {
        const fileContents = e.target.result;
        this.values = JSON.parse(fileContents);
        this.setValues(this.values);
      }
      
      // Mainline of the method
      reader.onload = fileloaded.bind(this);
      reader.readAsText(fileObj);       
  }

  open (event) {
    event.preventDefault();
    this.dofileUpload.click();
  }

  render() {
      const components = [];
      this.data.components.forEach( (component) => {
        if(component.type === 'panel' || component.type === 'multifader') {
          components.push(
            <Panel key={component.id} label={component.label} def={component} onChange={this.handleChange.bind(this)}/>
          )
        }
      }
      );
      return (
       <>
        <Row noGutters='true' className='inst'>
          {components}
        </Row> 
        <Row>
          <Col>
           <Button onClick={this.download.bind(this)}>Save</Button>
          </Col>
          <Col>
           <input type="file"
            style={{ display: 'none' }}
            multiple={false}
            accept=".json,application/json"
            onChange={evt => this.upload(evt)}
            ref={e=>this.dofileUpload = e} />
           <Button onClick={this.open.bind(this)}>Load</Button>
          </Col>
        </Row>
       </>
      )
    }
}

export default Instrument;
