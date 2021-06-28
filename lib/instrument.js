import React from 'react';
import { Row } from "react-bootstrap"
import Panel from "./panel"
class Instrument extends React.Component {

  constructor(props) {
    super(props);
    this.data = props.inst;
  }

  componentDidMount() {
  }
  handleChange(id,val) {
    this.props.onChange(id,val);
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
        <Row noGutters='true' className='inst'>
          {components}
        </Row> 
      )
    }
}

export default Instrument;
