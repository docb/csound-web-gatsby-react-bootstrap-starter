import React from "react";
import { Row, Col } from 'react-bootstrap'
class Text extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.def.text };
  }

  setText(text) {
    this.setState({text:text});
  }

  render() {
    return (
      <Col dangerouslySetInnerHTML={{ __html: this.state.text }}/>
    );
  }
}

export default Text
